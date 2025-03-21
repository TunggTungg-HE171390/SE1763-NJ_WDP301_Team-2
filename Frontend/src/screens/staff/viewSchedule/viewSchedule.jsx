import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Badge,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as ClockIcon,
  Person as PersonIcon,
  EventAvailable as AvailableIcon,
  Event as BookedIcon,
  Add as AddIcon,
  Edit as EditIcon,
  FilterList as FilterIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import { format, differenceInDays, addMonths, startOfMonth, isSameMonth, addDays, parseISO, isToday, isAfter, isBefore } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getScheduleListByDoctorId, getPsychologist } from '../../../api/psychologist.api';

const ViewSchedule = ({ userRole = 'staff' }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const doctorId = searchParams.get('doctor');
  
  const [schedules, setSchedules] = useState([]);
  const [psychologist, setPsychologist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [timeFilter, setTimeFilter] = useState('all');
  const [filterStartDate, setFilterStartDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      if (!doctorId) {
        setError('Không tìm thấy ID của chuyên gia tâm lý.');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Fetch psychologist info first
        console.log(`Fetching psychologist data for ID: ${doctorId}`);
        const psychologistResponse = await getPsychologist(doctorId);
        
        let psychologistData = null;
        if (psychologistResponse?.data?.success && psychologistResponse.data.data) {
          psychologistData = psychologistResponse.data.data;
        } else if (psychologistResponse?.data) {
          psychologistData = psychologistResponse.data;
        }
        
        if (psychologistData) {
          setPsychologist(psychologistData);
        } else {
          throw new Error('Không thể tải thông tin chuyên gia tâm lý');
        }
        
        // Fetch schedule list
        console.log(`Fetching schedule for doctor ID: ${doctorId}`);
        const scheduleResponse = await getScheduleListByDoctorId(doctorId);
        
        // Use the API response
        let scheduleData = scheduleResponse;
        
        if (scheduleData && scheduleData.length > 0) {
          console.log(`Processing ${scheduleData.length} schedule entries`);
          
          // Handle edge case: first item might be missing date field
          scheduleData = scheduleData.map(schedule => {
            if (!schedule.date && schedule.startTime) {
              return { ...schedule, date: new Date(schedule.startTime) };
            }
            return schedule;
          });
          
          const sortedSchedules = scheduleData.sort((a, b) => {
            // Sort by date
            const dateA = new Date(a.date || a.startTime);
            const dateB = new Date(b.date || b.startTime);
            if (dateA.getTime() !== dateB.getTime()) {
              return dateA - dateB;
            }
            
            // If dates are same, sort by start time
            const startTimeA = new Date(a.startTime);
            const startTimeB = new Date(b.startTime);
            return startTimeA - startTimeB;
          });
          
          setSchedules(sortedSchedules);
        } else {
          console.log("No schedules found");
          setSchedules([]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId]);

  // Filter schedules based on timeFilter
  const filteredSchedules = schedules.filter(schedule => {
    if (!schedule) return false;
    
    const scheduleDate = new Date(schedule.date || schedule.startTime);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch(timeFilter) {
      case 'today':
        return isToday(scheduleDate);
      case 'upcoming':
        return isAfter(scheduleDate, today);
      case 'past':
        return isBefore(scheduleDate, today);
      case 'month':
        return isSameMonth(scheduleDate, filterStartDate);
      default:
        return true; // 'all'
    }
  });

  // Group schedules by date for list view
  const schedulesByDate = filteredSchedules.reduce((groups, schedule) => {
    if (!schedule) return groups;
    
    let dateString;
    try {
      // Use date field if available, otherwise use startTime
      const dateObj = new Date(schedule.date || schedule.startTime);
      dateString = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
    } catch (err) {
      console.error('Error processing date:', schedule, err);
      return groups; // Skip this schedule if date is invalid
    }
    
    if (!groups[dateString]) {
      groups[dateString] = [];
    }
    groups[dateString].push(schedule);
    return groups;
  }, {});

  // Group schedules by booked status for summary view
  const bookedSlots = filteredSchedules.filter(s => s.isBooked).length;
  const availableSlots = filteredSchedules.filter(s => !s.isBooked).length;
  const totalSlots = filteredSchedules.length;
  
  const handleBack = () => {
    const fromManagePsychologists = location.state?.from === 'managePsychologists';
    if (fromManagePsychologists) {
      navigate('/staff/manage-psychologists');
    } else {
      navigate(-1);
    }
  };

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFilterChange = (event) => {
    setTimeFilter(event.target.value);
    
    // If switching to month view, set the filter to current month
    if (event.target.value === 'month') {
      setFilterStartDate(startOfMonth(new Date()));
    }
  };

  const handlePreviousMonth = () => {
    setFilterStartDate(addMonths(filterStartDate, -1));
  };

  const handleNextMonth = () => {
    setFilterStartDate(addMonths(filterStartDate, 1));
  };

  // Format dates
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'EEEE, dd/MM/yyyy', { locale: vi });
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return String(dateString);
    }
  };
  
  const formatTime = (timeString) => {
    try {
      const time = new Date(timeString);
      return format(time, 'HH:mm');
    } catch (error) {
      console.error('Error formatting time:', error, timeString);
      return String(timeString);
    }
  };

  // Add a function to handle viewing appointment details
  const handleViewAppointment = (schedule) => {
    // Check if appointmentId exists
    if (schedule.appointmentId) {
      // Navigate to appointment details with the appointment ID 
      if (userRole === 'staff') {
        navigate(`/staff/view-appointment-detail/${schedule.appointmentId}`);
      } else if (userRole === 'psychologist') {
        navigate(`/psychologist/view-appointment-detail/${schedule.appointmentId}`);
      }
    } else {
      // If no appointmentId but the slot is booked, show a message
      alert('Không tìm thấy thông tin chi tiết buổi hẹn này.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            onClick={handleBack} 
            color="primary" 
            sx={{ mr: 1 }}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1">
            Lịch làm việc của chuyên gia
          </Typography>
        </Box>
        
        {userRole === 'staff' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/staff/manage-psychologist-schedule/${doctorId}`)}
          >
            Thêm lịch làm việc
          </Button>
        )}
      </Box>
      
      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <>
          {/* Psychologist Info Card */}
          {psychologist && (
            <Paper elevation={2} sx={{ p: 0, mb: 4, borderRadius: 2, overflow: 'hidden' }}>
              <Grid container>
                <Grid item xs={12} sm={4} sx={{ bgcolor: 'primary.main', color: 'white', p: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar 
                      src={psychologist.profileImg} 
                      alt={psychologist.fullName}
                      sx={{ width: 100, height: 100, mb: 2, border: '3px solid white' }}
                    />
                    <Typography variant="h6" align="center" sx={{ fontWeight: 'bold' }}>
                      {psychologist.fullName}
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 1 }}>
                      {psychologist.psychologist?.psychologistProfile?.specialization || "Chuyên gia tâm lý"}
                    </Typography>
                    <Chip 
                      label={psychologist.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'} 
                      color={psychologist.status === 'active' ? 'success' : 'default'}
                      size="small"
                      sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.9)', fontWeight: 'medium' }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={8} sx={{ p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Tổng quan lịch làm việc
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      ID chuyên gia: {doctorId}
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={3} sx={{ mb: 2 }}>
                    <Grid item xs={4}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="h5" color="primary" fontWeight="bold">
                          {totalSlots}
                        </Typography>
                        <Typography variant="body2">Tổng số lịch</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="h5" color="success.main" fontWeight="bold">
                          {availableSlots}
                        </Typography>
                        <Typography variant="body2">Lịch còn trống</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: '#ffebee', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="h5" color="error.main" fontWeight="bold">
                          {bookedSlots}
                        </Typography>
                        <Typography variant="body2">Lịch đã đặt</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                  
                  <FormControl fullWidth size="small">
                    <InputLabel id="time-filter-label">Lọc theo thời gian</InputLabel>
                    <Select
                      labelId="time-filter-label"
                      value={timeFilter}
                      label="Lọc theo thời gian"
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="all">Tất cả lịch</MenuItem>
                      <MenuItem value="today">Hôm nay</MenuItem>
                      <MenuItem value="upcoming">Lịch sắp tới</MenuItem>
                      <MenuItem value="past">Lịch đã qua</MenuItem>
                      <MenuItem value="month">Theo tháng</MenuItem>
                    </Select>
                  </FormControl>
                  
                  {timeFilter === 'month' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                      <IconButton onClick={handlePreviousMonth}>
                        <ArrowBackIcon />
                      </IconButton>
                      <Typography sx={{ mx: 2 }}>
                        {format(filterStartDate, 'MMMM yyyy', { locale: vi })}
                      </Typography>
                      <IconButton onClick={handleNextMonth}>
                        <ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />
                      </IconButton>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Paper>
          )}
          
          {/* Tabs for different views */}
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleChangeTab} 
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<DateRangeIcon />} label="Theo ngày" id="tab-0" />
              <Tab icon={<AvailableIcon />} label="Lịch còn trống" id="tab-1" />
              <Tab icon={<BookedIcon />} label="Lịch đã đặt" id="tab-2" />
            </Tabs>
            
            {/* Day View Tab */}
            <Box role="tabpanel" hidden={activeTab !== 0} sx={{ p: 0 }}>
              {Object.keys(schedulesByDate).length > 0 ? (
                Object.entries(schedulesByDate).map(([dateStr, daySchedules]) => (
                  <Box key={dateStr} sx={{ mb: 3 }}>
                    <Box sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
                      <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarIcon sx={{ mr: 1 }} />
                        {formatDate(dateStr)}
                      </Typography>
                    </Box>
                    
                    <List disablePadding>
                      {daySchedules.map((schedule, index) => (
                        <React.Fragment key={schedule._id || index}>
                          <ListItem sx={{ py: 1.5 }}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} sm={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <ClockIcon color="primary" sx={{ mr: 1 }} />
                                  <Typography>
                                    {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6} sm={3}>
                                <Chip 
                                  label={schedule.isBooked ? "Đã đặt" : "Còn trống"} 
                                  color={schedule.isBooked ? "error" : "success"} 
                                  size="small"
                                  variant={schedule.isBooked ? "default" : "outlined"}
                                />
                              </Grid>
                              <Grid item xs={6} sm={6} sx={{ textAlign: { sm: 'right' } }}>
                                {userRole === 'staff' && (
                                  <Box>
                                    {!schedule.isBooked ? (
                                      <Tooltip title="Quản lý lịch này">
                                        <Button 
                                          variant="outlined" 
                                          size="small"
                                          color="primary"
                                          startIcon={<EditIcon />}
                                          onClick={() => navigate(`/staff/manage-psychologist-schedule/${doctorId}`)}
                                        >
                                          Quản lý
                                        </Button>
                                      </Tooltip>
                                    ) : (
                                      <Tooltip title="Xem chi tiết buổi hẹn">
                                        <Button
                                          variant="outlined"
                                          size="small"
                                          color="info"
                                          onClick={() => handleViewAppointment(schedule)}
                                          disabled={!schedule.appointmentId && schedule.isBooked}
                                        >
                                          {!schedule.appointmentId && schedule.isBooked 
                                            ? "Không có chi tiết" 
                                            : "Xem chi tiết"}
                                        </Button>
                                      </Tooltip>
                                    )}
                                  </Box>
                                )}
                              </Grid>
                            </Grid>
                          </ListItem>
                          {index < daySchedules.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </Box>
                ))
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Không có lịch làm việc
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Không tìm thấy lịch làm việc nào cho tiêu chí đã chọn.
                  </Typography>
                </Box>
              )}
            </Box>
            
            {/* Available Slots Tab */}
            <Box role="tabpanel" hidden={activeTab !== 1} sx={{ p: 0 }}>
              {filteredSchedules.filter(s => !s.isBooked).length > 0 ? (
                <List disablePadding>
                  {filteredSchedules.filter(s => !s.isBooked).map((schedule, index, array) => (
                    <React.Fragment key={schedule._id || index}>
                      <ListItem sx={{ py: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography variant="subtitle2" color="primary">
                                {formatDate(schedule.date || schedule.startTime)}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <ClockIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={8} sx={{ textAlign: { sm: 'right' } }}>
                            {userRole === 'staff' && (
                              <Button
                                variant="outlined"
                                size="small"
                                color="primary"
                                startIcon={<EditIcon />}
                                onClick={() => navigate(`/staff/manage-psychologist-schedule/${doctorId}`)}
                              >
                                Quản lý lịch
                              </Button>
                            )}
                          </Grid>
                        </Grid>
                      </ListItem>
                      {index < array.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Không có lịch trống
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Không tìm thấy lịch trống nào cho tiêu chí đã chọn.
                  </Typography>
                </Box>
              )}
            </Box>
            
            {/* Booked Slots Tab */}
            <Box role="tabpanel" hidden={activeTab !== 2} sx={{ p: 0 }}>
              {filteredSchedules.filter(s => s.isBooked).length > 0 ? (
                <List disablePadding>
                  {filteredSchedules.filter(s => s.isBooked).map((schedule, index, array) => (
                    <React.Fragment key={schedule._id || index}>
                      <ListItem sx={{ py: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography variant="subtitle2" color="error">
                                {formatDate(schedule.date || schedule.startTime)}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <ClockIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={8} sx={{ textAlign: { sm: 'right' } }}>
                            {userRole === 'staff' && (
                              <Button
                                variant="outlined"
                                size="small"
                                color="info"
                                onClick={() => handleViewAppointment(schedule)}
                                disabled={!schedule.appointmentId}
                              >
                                {!schedule.appointmentId 
                                  ? "Không có chi tiết" 
                                  : "Xem chi tiết buổi hẹn"}
                              </Button>
                            )}
                          </Grid>
                        </Grid>
                      </ListItem>
                      {index < array.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Không có lịch đã đặt
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Không tìm thấy lịch đã đặt nào cho tiêu chí đã chọn.
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
          
          {schedules.length === 0 && (
            <Paper elevation={2} sx={{ p: 4, borderRadius: 2, textAlign: 'center', mb: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Chưa có lịch làm việc
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Chuyên gia tâm lý này chưa có lịch làm việc nào trong hệ thống.
              </Typography>
              {userRole === 'staff' && (
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  startIcon={<AddIcon />}
                  onClick={() => navigate(`/staff/manage-psychologist-schedule/${doctorId}`)}
                >
                  Tạo lịch làm việc mới
                </Button>
              )}
            </Paper>
          )}
        </>
      )}
    </Container>
  );
};

export default ViewSchedule;