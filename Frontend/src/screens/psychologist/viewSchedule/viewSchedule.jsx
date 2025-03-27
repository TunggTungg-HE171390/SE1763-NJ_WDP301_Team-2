import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isToday, addWeeks, subWeeks } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useAuth } from '../../../components/auth/authContext';
import { getSchedulesByPsychologistId, getSchedulesByTimePeriod } from '../../../api/schedule.api';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekday from 'dayjs/plugin/weekday';

// Extend dayjs with plugins
dayjs.extend(isBetween);
dayjs.extend(weekOfYear);
dayjs.extend(weekday);

const ViewSchedule = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [timePeriod, setTimePeriod] = useState('week');
  const [tab, setTab] = useState(0);
  
  // Make sure we have user ID
  const psychologistId = user?._id;
  
  // Calculate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => 
    addDays(currentWeekStart, i)
  );
  
  // Fetch schedules on component mount and when time period changes
  useEffect(() => {
    fetchSchedules();
  }, [psychologistId, currentWeekStart, timePeriod]);
  
  const fetchSchedules = async () => {
    if (!psychologistId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching schedules for psychologist ID: ${psychologistId}`);
      
      let schedulesData = [];
      
      // Get schedules based on selected time period
      if (timePeriod === 'week') {
        const startDate = currentWeekStart;
        const endDate = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
        
        console.log(`Fetching for week from ${format(startDate, 'yyyy-MM-dd')} to ${format(endDate, 'yyyy-MM-dd')}`);
        
        // First try with the date range API
        try {
          schedulesData = await getSchedulesByTimePeriod(startDate, endDate, psychologistId);
        } catch (dateRangeError) {
          console.error('Error with date range API, falling back to all schedules:', dateRangeError);
          // Fallback to getting all schedules and filtering client-side
          const allSchedules = await getSchedulesByPsychologistId(psychologistId);
          
          schedulesData = allSchedules.filter(schedule => {
            const scheduleDate = new Date(schedule.date || schedule.startTime);
            return scheduleDate >= startDate && scheduleDate <= endDate;
          });
        }
      } else {
        // For now, get all schedules (can implement month view later)
        schedulesData = await getSchedulesByPsychologistId(psychologistId);
      }
      
      console.log(`Fetched ${schedulesData.length} schedules`);
      setSchedules(schedulesData);
      setFilteredSchedules(schedulesData);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError('Không thể tải dữ liệu lịch làm việc. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };
  
  // Navigate to previous week
  const handlePrevWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };
  
  // Navigate to next week
  const handleNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };
  
  // Handle time period change
  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    
    // Filter schedules based on tab
    if (newValue === 0) {
      // All schedules
      setFilteredSchedules(schedules);
    } else if (newValue === 1) {
      // Available slots
      setFilteredSchedules(schedules.filter(schedule => !schedule.isBooked));
    } else if (newValue === 2) {
      // Booked slots
      setFilteredSchedules(schedules.filter(schedule => schedule.isBooked));
    }
  };
  
  // Format date for display
  const formatDate = (date) => {
    return format(date, 'EEEE, dd/MM', { locale: vi });
  };
  
  // Format time for display
  const formatTime = (timeStr) => {
    try {
      const time = new Date(timeStr);
      return format(time, 'HH:mm');
    } catch (err) {
      return 'Invalid time';
    }
  };
  
  // Get schedules for a specific day
  const getSchedulesForDay = (day) => {
    return filteredSchedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date || schedule.startTime);
      return isSameDay(scheduleDate, day);
    }).sort((a, b) => {
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      return timeA - timeB;
    });
  };
  
  if (loading && schedules.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton 
          onClick={() => navigate(-1)} 
          aria-label="back"
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1">Lịch làm việc của tôi</Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Controls */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: '#f8f9fa' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handlePrevWeek} sx={{ mr: 1 }}>
              <PrevIcon />
            </IconButton>
            
            <Typography variant="h6">
              {format(currentWeekStart, 'dd/MM/yyyy')} - {format(weekDays[6], 'dd/MM/yyyy')}
            </Typography>
            
            <IconButton onClick={handleNextWeek} sx={{ ml: 1 }}>
              <NextIcon />
            </IconButton>
          </Box>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="time-period-label">Khoảng thời gian</InputLabel>
            <Select
              labelId="time-period-label"
              value={timePeriod}
              label="Khoảng thời gian"
              onChange={handleTimePeriodChange}
            >
              <MenuItem value="week">Theo tuần</MenuItem>
              <MenuItem value="month">Theo tháng</MenuItem>
              <MenuItem value="all">Tất cả</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Tabs
          value={tab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Tất cả lịch" />
          <Tab label="Lịch trống" />
          <Tab label="Lịch đã đặt" />
        </Tabs>
      </Paper>
      
      {/* Schedule grid */}
      <Grid container spacing={2}>
        {weekDays.map((day) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={day.toString()}>
            <Paper 
              sx={{ 
                p: 2, 
                height: '100%', 
                backgroundColor: isToday(day) ? '#e3f2fd' : 'white',
                border: isToday(day) ? '1px solid #2196f3' : undefined
              }}
            >
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: 1.5,
                  color: isToday(day) ? '#0d47a1' : 'inherit'
                }}
              >
                {formatDate(day)}
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                {getSchedulesForDay(day).length > 0 ? (
                  getSchedulesForDay(day).map((schedule, index) => (
                    <Box 
                      key={schedule._id || index}
                      sx={{
                        p: 1.5,
                        mb: 1.5,
                        borderRadius: 1,
                        backgroundColor: schedule.isBooked ? '#ffebee' : '#e8f5e9',
                        border: '1px solid',
                        borderColor: schedule.isBooked ? '#ffcdd2' : '#c8e6c9',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Box>
                        <Typography variant="body2">
                          {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {schedule.isBooked ? 'Đã đặt lịch' : 'Còn trống'}
                        </Typography>
                      </Box>
                      
                      {schedule.isBooked && schedule.appointmentId && (
                        <IconButton 
                          size="small" 
                          color="primary"
                          component={Link}
                          to={`/psychologist/view-appointment-detail/${schedule.appointmentId}`}
                        >
                          <EventIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ my: 2 }}>
                    Không có lịch
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ViewSchedule;