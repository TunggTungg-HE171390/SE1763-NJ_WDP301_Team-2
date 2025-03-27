import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Button,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Card,
  CardContent,
  Chip,
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ButtonGroup,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import {
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  Info as InfoIcon,
  FilterAlt as FilterIcon,
  Save as SaveIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { 
  format, 
  addDays, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isToday, 
  addWeeks, 
  subWeeks,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  parseISO,
  setHours,
  setMinutes,
  isAfter,
  isBefore,
  isSameDay,
  isWithinInterval
} from 'date-fns';
import { vi } from 'date-fns/locale';
import { getPsychologist, getScheduleListByDoctorId, createAvailabilitySlots } from '../../api/psychologist.api';
import { useAuth } from '../../components/auth/authContext';

// Create time slots for a day (8:30 AM to 5:30 PM)
const generateTimeSlots = () => {
  const slots = [];
  const startHour = 8;
  const startMinute = 30;
  const endHour = 17;
  const endMinute = 30;
  
  let currentHour = startHour;
  let currentMinute = startMinute;
  
  while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
    // Format time as "HH:MM"
    const formattedHour = currentHour.toString().padStart(2, '0');
    const formattedMinute = currentMinute.toString().padStart(2, '0');
    const time = `${formattedHour}:${formattedMinute}`;
    
    // Calculate end time (1 hour later)
    let endTimeHour = currentHour;
    let endTimeMinute = currentMinute;
    
    endTimeMinute += 60;
    if (endTimeMinute >= 60) {
      endTimeHour += Math.floor(endTimeMinute / 60);
      endTimeMinute %= 60;
    }
    
    const endFormattedHour = endTimeHour.toString().padStart(2, '0');
    const endFormattedMinute = endTimeMinute.toString().padStart(2, '0');
    const endTime = `${endFormattedHour}:${endFormattedMinute}`;
    
    slots.push({
      start: time,
      end: endTime,
      label: `${time} - ${endTime}`
    });
    
    // Move to next slot
    currentMinute += 60;
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute %= 60;
    }
  }
  
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

const ManagePsychologistSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State variables
  const [psychologist, setPsychologist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'
  const [existingSlots, setExistingSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogDate, setDialogDate] = useState(null);
  
  // Check if user is staff
  const isStaff = user?.role === 'staff';
  
  // Calculate week dates
  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 1 })
  });
  
  // Initialize selected slots for newly added dates
  useEffect(() => {
    const newSelectedSlots = { ...selectedSlots };
    
    weekDays.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      if (!newSelectedSlots[dateKey]) {
        newSelectedSlots[dateKey] = {};
        TIME_SLOTS.forEach(slot => {
          newSelectedSlots[dateKey][slot.start] = false;
        });
      }
    });
    
    setSelectedSlots(newSelectedSlots);
  }, [currentWeekStart]);
  
  // Fetch psychologist and existing schedule data
  useEffect(() => {
    // Redirect non-staff users
    if (user && !isStaff) {
      navigate('/');
      return;
    }
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch psychologist info
        const psychoResponse = await getPsychologist(id);
        if (psychoResponse?.data) {
          setPsychologist(psychoResponse.data);
        } else {
          throw new Error("Không thể tải thông tin chuyên gia tâm lý");
        }
        
        // Fetch existing schedule
        const scheduleResponse = await getScheduleListByDoctorId(id);
        if (scheduleResponse && Array.isArray(scheduleResponse)) {
          console.log("Existing schedules:", scheduleResponse);
          setExistingSlots(scheduleResponse);
          
          // Update selected slots based on existing data
          const newSelectedSlots = { ...selectedSlots };
          
          scheduleResponse.forEach(slot => {
            if (!slot.startTime) return;
            
            const slotDate = new Date(slot.date || slot.startTime);
            const dateKey = format(slotDate, 'yyyy-MM-dd');
            const timeKey = format(new Date(slot.startTime), 'HH:mm');
            
            if (!newSelectedSlots[dateKey]) {
              newSelectedSlots[dateKey] = {};
              TIME_SLOTS.forEach(timeSlot => {
                newSelectedSlots[dateKey][timeSlot.start] = false;
              });
            }
            
            // Mark slots as selected if they already exist and are not booked
            if (!slot.isBooked) {
              newSelectedSlots[dateKey][timeKey] = true;
            }
          });
          
          setSelectedSlots(newSelectedSlots);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id, user, isStaff, navigate]);
  
  // Toggle a time slot for a specific date
  const toggleSlot = (date, time) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    
    setSelectedSlots(prev => {
      const updatedSlots = { ...prev };
      
      if (!updatedSlots[dateKey]) {
        updatedSlots[dateKey] = {};
        TIME_SLOTS.forEach(slot => {
          updatedSlots[dateKey][slot.start] = false;
        });
      }
      
      updatedSlots[dateKey][time] = !updatedSlots[dateKey][time];
      return updatedSlots;
    });
  };
  
  // Check if a slot is already saved in the database
  const isSlotExisting = (date, time) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const targetStart = new Date(dateString + 'T' + time);
    
    return existingSlots.some(slot => {
      if (!slot.startTime) return false;
      
      const slotStart = new Date(slot.startTime);
      return isSameDay(slotStart, date) && 
             format(slotStart, 'HH:mm') === time &&
             !slot.isBooked; // Only check isBooked
    });
  };
  
  // Check if a slot is in the past
  const isSlotInPast = (date, time) => {
    const slotDateTime = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    slotDateTime.setHours(hours, minutes, 0, 0);
    
    return isBefore(slotDateTime, new Date());
  };
  
  // Navigate to previous week/month
  const handlePrevPeriod = () => {
    if (viewMode === 'week') {
      setCurrentWeekStart(subWeeks(currentWeekStart, 1));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };
  
  // Navigate to next week/month
  const handleNextPeriod = () => {
    if (viewMode === 'week') {
      setCurrentWeekStart(addWeeks(currentWeekStart, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };
  
  // Save selected slots to the database
  const handleSaveSlots = async () => {
    setSaving(true);
    try {
      // Collect all time slots that have been selected
      const slotsToCreate = [];
      
      // Process each date that has selections
      Object.entries(selectedSlots).forEach(([dateKey, timeSlots]) => {
        // For each date, go through all time slots
        Object.entries(timeSlots).forEach(([timeKey, isSelected]) => {
          // Only process selected slots that aren't already in the database
          if (isSelected && !isSlotExisting(new Date(dateKey), timeKey)) {
            // Parse the time to create start and end times
            const [hours, minutes] = timeKey.split(':').map(Number);
            
            // Create slot start time
            const startTime = new Date(dateKey);
            startTime.setHours(hours, minutes, 0, 0);
            
            // Create slot end time (1 hour later)
            const endTime = new Date(startTime);
            endTime.setHours(startTime.getHours() + 1);
            
            // Add to the array of slots to create
            slotsToCreate.push({
              psychologistId: id,
              date: dateKey,
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString()
            });
          }
        });
      });
      
      if (slotsToCreate.length === 0) {
        setSuccess("Không có lịch trống mới nào được chọn để thêm.");
        setTimeout(() => setSuccess(null), 3000);
        setSaving(false);
        return;
      }
      
      console.log(`Creating ${slotsToCreate.length} new availability slots`);
      
      // Call API to create the selected slots - use the unified function
      const response = await createAvailabilitySlots(id, slotsToCreate);
      console.log("API response:", response);
      
      setSuccess(`Đã tạo ${slotsToCreate.length} lịch trống thành công!`);
      
      // Refetch the schedule to get updated data
      const scheduleResponse = await getScheduleListByDoctorId(id);
      if (scheduleResponse && Array.isArray(scheduleResponse)) {
        setExistingSlots(scheduleResponse);
      }
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error saving slots:", err);
      setError("Đã xảy ra lỗi khi lưu lịch trống. Vui lòng thử lại sau.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };
  
  // Open dialog to edit slots for a specific date
  const handleOpenDialog = (date) => {
    setDialogDate(date);
    setOpenDialog(true);
  };
  
  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogDate(null);
  };
  
  // Select all slots for a day
  const selectAllSlotsForDay = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    
    setSelectedSlots(prev => {
      const updatedSlots = { ...prev };
      
      if (!updatedSlots[dateKey]) {
        updatedSlots[dateKey] = {};
      }
      
      TIME_SLOTS.forEach(slot => {
        if (!isSlotInPast(date, slot.start)) {
          updatedSlots[dateKey][slot.start] = true;
        }
      });
      
      return updatedSlots;
    });
  };
  
  // Clear all slots for a day
  const clearAllSlotsForDay = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    
    setSelectedSlots(prev => {
      const updatedSlots = { ...prev };
      
      if (!updatedSlots[dateKey]) {
        updatedSlots[dateKey] = {};
      }
      
      TIME_SLOTS.forEach(slot => {
        updatedSlots[dateKey][slot.start] = false;
      });
      
      return updatedSlots;
    });
  };
  
  // Format date for display
  const formatDateHeader = (date) => {
    return format(date, 'EEE, dd/MM', { locale: vi });
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  // Prevent non-staff from accessing this page
  if (!isStaff) {
    return (
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
        <Alert severity="error">
          Chỉ nhân viên (staff) mới có quyền truy cập trang này.
        </Alert>
        <Button 
          variant="contained" 
          component={Link} 
          to="/" 
          sx={{ mt: 2 }}
        >
          Quay về trang chủ
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        component={Link}
        to={`/staff/manage-psychologists`}
        sx={{ mb: 3 }}
      >
        Quay lại 
      </Button>
      
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
              <Box>
                <Typography variant="h5" component="h1" fontWeight={500}>
                  Quản lý lịch trống
                </Typography>
                {psychologist && (
                  <Typography variant="subtitle1" color="text.secondary">
                    {psychologist.fullName} - {psychologist.psychologist?.psychologistProfile?.specialization || "Chuyên gia tâm lý"}
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Add the View Appointments button */}
              <Button
                variant="outlined"
                color="info"
                component={Link}
                to={`/staff/view-schedule?doctor=${id}`}
                startIcon={<EventIcon />}
              >
                Xem lịch hẹn
              </Button>
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="view-mode-label">Chế độ xem</InputLabel>
                <Select
                  labelId="view-mode-label"
                  value={viewMode}
                  label="Chế độ xem"
                  onChange={(e) => setViewMode(e.target.value)}
                >
                  <MenuItem value="week">Tuần</MenuItem>
                  <MenuItem value="month">Tháng</MenuItem>
                </Select>
              </FormControl>
              
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveSlots}
                disabled={saving}
                startIcon={<CheckIcon />}
              >
                {saving ? 'Đang lưu...' : 'Lưu lịch trống'}
              </Button>
            </Box>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}
          
          <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
            Nhấn vào các ô để thêm/xóa lịch trống. Các lịch được chọn (màu xanh) sẽ được đặt ở trạng thái "Available".
          </Alert>
          
          {/* Calendar navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={handlePrevPeriod}>
              <PrevIcon />
            </IconButton>
            
            <Typography variant="h6">
              {viewMode === 'week' 
                ? `${format(currentWeekStart, 'dd/MM/yyyy')} - ${format(weekDays[weekDays.length - 1], 'dd/MM/yyyy')}`
                : format(currentDate, 'MMMM yyyy', { locale: vi })}
            </Typography>
            
            <IconButton onClick={handleNextPeriod}>
              <NextIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          {/* Week view */}
          {viewMode === 'week' && (
            <Grid container spacing={2}>
              {weekDays.map((day) => (
                <Grid item xs={12} sm={6} md={isMobile ? 12 : weekDays.length <= 5 ? 2.4 : 2} key={day.toString()}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%',
                      bgcolor: isToday(day) ? 'rgba(25, 118, 210, 0.05)' : 'transparent',
                      border: isToday(day) ? '1px solid #1976d2' : undefined
                    }}
                  >
                    <Box sx={{ 
                      p: 1, 
                      bgcolor: isToday(day) ? 'primary.main' : 'grey.200', 
                      color: isToday(day) ? 'white' : 'text.primary',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {formatDateHeader(day)}
                      </Typography>
                      
                      <Box>
                        <Tooltip title="Chọn tất cả">
                          <IconButton 
                            size="small" 
                            onClick={() => selectAllSlotsForDay(day)}
                            sx={{ color: isToday(day) ? 'white' : 'inherit' }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Xóa tất cả">
                          <IconButton 
                            size="small" 
                            onClick={() => clearAllSlotsForDay(day)}
                            sx={{ color: isToday(day) ? 'white' : 'inherit' }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    
                    <Box sx={{ p: 1, maxHeight: 400, overflowY: 'auto' }}>
                      {TIME_SLOTS.map((slot, index) => {
                        const dateKey = format(day, 'yyyy-MM-dd');
                        const isPast = isSlotInPast(day, slot.start);
                        const isExisting = isSlotExisting(day, slot.start);
                        const isSelected = selectedSlots[dateKey]?.[slot.start] || false;
                        
                        return (
                          <Box 
                            key={`${dateKey}-${slot.start}`}
                            onClick={() => !isPast && toggleSlot(day, slot.start)}
                            sx={{
                              py: 1.5,
                              px: 2,
                              mb: 1,
                              borderRadius: 1,
                              cursor: isPast ? 'not-allowed' : 'pointer',
                              bgcolor: isSelected ? 'primary.main' : isPast ? 'grey.100' : 'background.paper',
                              color: isSelected ? 'white' : isPast ? 'text.disabled' : 'text.primary',
                              border: '1px solid',
                              borderColor: isSelected ? 'primary.main' : isPast ? 'grey.300' : 'grey.300',
                              '&:hover': {
                                bgcolor: isPast ? 'grey.100' : isSelected ? 'primary.dark' : 'action.hover',
                              },
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              opacity: isPast ? 0.7 : 1
                            }}
                          >
                            <Typography variant="body2">
                              {slot.label}
                            </Typography>
                            
                            {isExisting && (
                              <Chip 
                                label="Đã tạo" 
                                size="small" 
                                color={isSelected ? "default" : "success"}
                                sx={{ fontSize: '0.7rem', height: 20 }}
                              />
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          
          {/* Month view */}
          {viewMode === 'month' && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Chức năng xem theo tháng đang được phát triển.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Vui lòng sử dụng chế độ xem theo tuần để quản lý lịch trống.
              </Typography>
            </Box>
          )}
        </Paper>
        
        {/* Dialog for editing a specific day */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
          <DialogTitle>
            {dialogDate && `Chỉnh sửa lịch ngày ${format(dialogDate, 'dd/MM/yyyy', { locale: vi })}`}
          </DialogTitle>
          <DialogContent>
            {dialogDate && (
              <Box sx={{ mt: 1 }}>
                {TIME_SLOTS.map((slot) => {
                  const dateKey = format(dialogDate, 'yyyy-MM-dd');
                  const isPast = isSlotInPast(dialogDate, slot.start);
                  const isExisting = isSlotExisting(dialogDate, slot.start);
                  const isSelected = selectedSlots[dateKey]?.[slot.start] || false;
                  
                  return (
                    <Box 
                      key={`dialog-${dateKey}-${slot.start}`}
                      onClick={() => !isPast && toggleSlot(dialogDate, slot.start)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        mb: 1,
                        borderRadius: 1,
                        cursor: isPast ? 'not-allowed' : 'pointer',
                        bgcolor: isSelected ? 'primary.main' : isPast ? 'grey.100' : 'background.paper',
                        color: isSelected ? 'white' : isPast ? 'text.disabled' : 'text.primary',
                        border: '1px solid',
                        borderColor: isSelected ? 'primary.main' : isPast ? 'grey.300' : 'grey.300',
                        '&:hover': {
                          bgcolor: isPast ? 'grey.100' : isSelected ? 'primary.dark' : 'action.hover',
                        },
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        opacity: isPast ? 0.7 : 1
                      }}
                    >
                      <Typography variant="body2">
                        {slot.label}
                      </Typography>
                      
                      {isExisting && (
                        <Chip 
                          label="Đã tạo" 
                          size="small" 
                          color={isSelected ? "default" : "success"}
                          sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                      )}
                    </Box>
                  );
                })}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Đóng</Button>
            {saving ? (
              <Tooltip title="Đang lưu...">
                <span>
                  <Button 
                    variant="contained" 
                    color="primary"
                    disabled
                  >
                    Đang lưu...
                  </Button>
                </span>
              </Tooltip>
            ) : (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => {
                  handleCloseDialog();
                  handleSaveSlots();
                }}
              >
                Lưu thay đổi
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
    </Container>
  );
};

export default ManagePsychologistSchedule;
