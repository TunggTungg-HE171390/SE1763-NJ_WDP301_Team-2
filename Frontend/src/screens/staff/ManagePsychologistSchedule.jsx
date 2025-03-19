import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  IconButton,
  Avatar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ToggleButton,
  ToggleButtonGroup,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CalendarMonth as CalendarMonthIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { getPsychologist } from '../../api/psychologist.api';
import { 
  saveAvailability, 
  getAvailabilityByPsychologistId, 
  generateAvailabilitySlots 
} from '../../api/availability.api';

const daysOfWeek = [
  { value: 1, label: "Thứ 2" },
  { value: 2, label: "Thứ 3" },
  { value: 3, label: "Thứ 4" },
  { value: 4, label: "Thứ 5" },
  { value: 5, label: "Thứ 6" },
  { value: 6, label: "Thứ 7" },
  { value: 0, label: "Chủ nhật" }
];

const ManagePsychologistSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [psychologist, setPsychologist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Availability state
  const [availabilityType, setAvailabilityType] = useState('weekly'); // 'weekly' or 'specific'
  const [workingDays, setWorkingDays] = useState([1, 2, 3, 4, 5]); // Default Mon-Fri
  const [workingHours, setWorkingHours] = useState({
    start: dayjs('2023-01-01T08:00'),
    end: dayjs('2023-01-01T17:00'),
  });
  
  const [specificDates, setSpecificDates] = useState([
    { date: dayjs(), startTime: dayjs('2023-01-01T08:00'), endTime: dayjs('2023-01-01T17:00'), active: true }
  ]);
  
  const [breakPeriod, setBreakPeriod] = useState({
    enabled: true,
    start: dayjs('2023-01-01T12:00'),
    end: dayjs('2023-01-01T13:00'),
  });
  
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [appointmentDurationMinutes, setAppointmentDurationMinutes] = useState(60); // Default 1 hour per appointment
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch psychologist data
        const psychologistResponse = await getPsychologist(id);
        setPsychologist(psychologistResponse.data);
        
        // Fetch availability data
        try {
          const availabilityResponse = await getAvailabilityByPsychologistId(id);
          if (availabilityResponse && availabilityResponse.data) {
            loadExistingAvailability(availabilityResponse.data);
          }
          setError(null);
        } catch (availabilityError) {
          console.warn('No availability configuration found. Creating new one.', availabilityError);
          // No existing availability - we'll create a new one with defaults
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải thông tin của chuyên gia tâm lý.');
        
        // Mock data for development
        if (process.env.NODE_ENV !== 'production') {
          const mockPsychologist = {
            _id: id,
            fullname: 'Dr. Nguyễn Văn A',
            specialization: 'Tâm lý lâm sàng',
            email: 'doctor.a@example.com',
            phone: '0901234567',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          };
          setPsychologist(mockPsychologist);
          
          const mockAvailability = {
            psychologistId: id,
            type: 'weekly',
            daysOfWeek: [1, 2, 3, 4, 5],
            hours: { start: '08:00', end: '17:00' },
            breakTime: { start: '12:00', end: '13:00' },
            appointmentDuration: 60
          };
          loadExistingAvailability(mockAvailability);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const loadExistingAvailability = (availability) => {
    if (!availability) return;
    
    if (availability.type === 'weekly') {
      setAvailabilityType('weekly');
      setWorkingDays(availability.daysOfWeek || [1, 2, 3, 4, 5]);
      
      if (availability.hours) {
        setWorkingHours({
          start: dayjs(`2023-01-01T${availability.hours.start}`),
          end: dayjs(`2023-01-01T${availability.hours.end}`),
        });
      }
      
      if (availability.breakTime) {
        setBreakPeriod({
          enabled: true,
          start: dayjs(`2023-01-01T${availability.breakTime.start}`),
          end: dayjs(`2023-01-01T${availability.breakTime.end}`),
        });
      } else {
        setBreakPeriod({...breakPeriod, enabled: false});
      }
      
      if (availability.appointmentDuration) {
        setAppointmentDurationMinutes(availability.appointmentDuration);
      }
    } else if (availability.type === 'specific') {
      setAvailabilityType('specific');
      
      if (Array.isArray(availability.dates) && availability.dates.length > 0) {
        const formattedDates = availability.dates.map(date => ({
          date: dayjs(date.date),
          startTime: dayjs(`2023-01-01T${date.startTime}`),
          endTime: dayjs(`2023-01-01T${date.endTime}`),
          active: date.active !== false
        }));
        setSpecificDates(formattedDates);
      }
      
      if (availability.appointmentDuration) {
        setAppointmentDurationMinutes(availability.appointmentDuration);
      }
    }
  };
  
  const handleDayToggle = (event, newDays) => {
    if (newDays.length) setWorkingDays(newDays);
  };
  
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setAvailabilityType(newView);
    }
  };
  
  const handleAddSpecificDate = () => {
    setSpecificDates([
      ...specificDates,
      {
        date: dayjs(), 
        startTime: dayjs('2023-01-01T08:00'),
        endTime: dayjs('2023-01-01T17:00'),
        active: true
      }
    ]);
  };
  
  const handleRemoveSpecificDate = (index) => {
    const newDates = [...specificDates];
    newDates.splice(index, 1);
    setSpecificDates(newDates);
  };
  
  const handleSpecificDateChange = (index, field, value) => {
    const newDates = [...specificDates];
    newDates[index] = {...newDates[index], [field]: value};
    setSpecificDates(newDates);
  };
  
  const handleBreakToggle = (event) => {
    setBreakPeriod({...breakPeriod, enabled: event.target.checked});
  };
  
  const handleSaveAvailability = () => {
    setOpenConfirmDialog(true);
  };
  
  const confirmSaveAvailability = async () => {
    setSaving(true);
    setOpenConfirmDialog(false);
    
    try {
      let availabilityData = {
        psychologistId: id,
        appointmentDuration: appointmentDurationMinutes,
      };
      
      if (availabilityType === 'weekly') {
        availabilityData = {
          ...availabilityData,
          type: 'weekly',
          daysOfWeek: workingDays,
          hours: {
            start: workingHours.start.format('HH:mm'),
            end: workingHours.end.format('HH:mm')
          }
        };
        
        if (breakPeriod.enabled) {
          availabilityData.breakTime = {
            start: breakPeriod.start.format('HH:mm'),
            end: breakPeriod.end.format('HH:mm')
          };
        }
      } else {
        availabilityData = {
          ...availabilityData,
          type: 'specific',
          dates: specificDates.map(date => ({
            date: date.date.format('YYYY-MM-DD'),
            startTime: date.startTime.format('HH:mm'),
            endTime: date.endTime.format('HH:mm'),
            active: date.active
          }))
        };
      }
      
      // Call the API to save the availability
      const response = await saveAvailability(availabilityData);
      
      if (response && response.data) {
        setSuccess('Lịch trống đã được cập nhật thành công.');
        
        // After saving availability configuration, generate actual time slots
        try {
          // Generate slots for the next 3 months
          const startDate = dayjs().format('YYYY-MM-DD');
          const endDate = dayjs().add(3, 'month').format('YYYY-MM-DD');
          
          await generateAvailabilitySlots(id, startDate, endDate);
          console.log('Time slots generated successfully');
        } catch (generateError) {
          console.error('Error generating time slots:', generateError);
          // Don't show error to user since the main action succeeded
        }
      } else {
        throw new Error('Unexpected response format');
      }
      
      setTimeout(() => setSuccess(null), 5000); // Clear success message after 5 seconds
    } catch (err) {
      console.error('Error saving availability:', err);
      setError('Không thể lưu lịch trống. Vui lòng thử lại sau.');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  if (!psychologist && error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/staff/manage-psychologists"
        >
          Quay lại danh sách
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
      {/* Breadcrumbs Navigation */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/staff/manage-psychologists')}
          sx={{ mr: 2 }}
        >
          Quay lại
        </Button>
        
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="breadcrumb"
        >
          <MuiLink 
            component={Link} 
            to="/" 
            underline="hover" 
            color="inherit"
          >
            Trang chủ
          </MuiLink>
          <MuiLink 
            component={Link} 
            to="/staff/manage-psychologists" 
            underline="hover" 
            color="inherit"
          >
            Quản lý chuyên gia tâm lý
          </MuiLink>
          <Typography color="text.primary">
            Quản lý lịch trống
          </Typography>
        </Breadcrumbs>
      </Paper>

      <Typography variant="h4" gutterBottom fontWeight={600}>
        Quản lý lịch trống
      </Typography>
      
      {/* Psychologist Info Card */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={psychologist?.avatar}
            alt={psychologist?.fullname}
            sx={{ width: 60, height: 60, mr: 2 }}
          />
          <Box>
            <Typography variant="h5" fontWeight={500}>
              {psychologist?.fullname}
            </Typography>
            <Chip
              label={psychologist?.specialization || 'Chuyên gia tâm lý'}
              color="primary"
              size="small"
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {psychologist?.email} | {psychologist?.phone}
            </Typography>
          </Box>
        </Box>
      </Paper>
      
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
      
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <CalendarMonthIcon sx={{ mr: 1 }} color="primary" />
            <Typography variant="h6" fontWeight={500}>
              Thiết lập lịch trống
            </Typography>
          </Box>
          
          {/* Availability Type Selection */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Kiểu lịch trống
            </Typography>
            <ToggleButtonGroup
              value={availabilityType}
              exclusive
              onChange={handleViewChange}
              color="primary"
              sx={{ mb: 2 }}
            >
              <ToggleButton value="weekly">
                Lịch hàng tuần
              </ToggleButton>
              <ToggleButton value="specific">
                Lịch từng ngày
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          {/* Weekly Availability Config */}
          {availabilityType === 'weekly' && (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Các ngày làm việc
                  </Typography>
                  <ToggleButtonGroup
                    value={workingDays}
                    onChange={handleDayToggle}
                    color="primary"
                    sx={{ flexWrap: 'wrap' }}
                    multiple
                  >
                    {daysOfWeek.map((day) => (
                      <ToggleButton key={day.value} value={day.value} sx={{ minWidth: 80 }}>
                        {day.label}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Giờ làm việc
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TimePicker
                        label="Bắt đầu"
                        value={workingHours.start}
                        onChange={(newValue) => setWorkingHours({...workingHours, start: newValue})}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TimePicker
                        label="Kết thúc"
                        value={workingHours.end}
                        onChange={(newValue) => setWorkingHours({...workingHours, end: newValue})}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={breakPeriod.enabled}
                        onChange={handleBreakToggle}
                      />
                    }
                    label="Thời gian nghỉ trưa"
                  />
                  
                  {breakPeriod.enabled && (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <TimePicker
                          label="Bắt đầu nghỉ"
                          value={breakPeriod.start}
                          onChange={(newValue) => setBreakPeriod({...breakPeriod, start: newValue})}
                          slotProps={{ textField: { fullWidth: true } }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TimePicker
                          label="Kết thúc nghỉ"
                          value={breakPeriod.end}
                          onChange={(newValue) => setBreakPeriod({...breakPeriod, end: newValue})}
                          slotProps={{ textField: { fullWidth: true } }}
                        />
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </>
          )}
          
          {/* Specific Days Config */}
          {availabilityType === 'specific' && (
            <>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddSpecificDate}
                >
                  Thêm ngày làm việc
                </Button>
              </Box>
              
              {specificDates.map((dateItem, index) => (
                <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <DatePicker
                          label="Ngày"
                          value={dateItem.date}
                          onChange={(newDate) => handleSpecificDateChange(index, 'date', newDate)}
                          slotProps={{ textField: { fullWidth: true } }}
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <TimePicker
                          label="Bắt đầu"
                          value={dateItem.startTime}
                          onChange={(newTime) => handleSpecificDateChange(index, 'startTime', newTime)}
                          slotProps={{ textField: { fullWidth: true } }}
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <TimePicker
                          label="Kết thúc"
                          value={dateItem.endTime}
                          onChange={(newTime) => handleSpecificDateChange(index, 'endTime', newTime)}
                          slotProps={{ textField: { fullWidth: true } }}
                        />
                      </Grid>
                      <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton 
                          color="error"
                          onClick={() => handleRemoveSpecificDate(index)}
                          disabled={specificDates.length === 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={dateItem.active}
                              onChange={(e) => handleSpecificDateChange(index, 'active', e.target.checked)}
                            />
                          }
                          label="Kích hoạt ngày này"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
          
          <Divider sx={{ my: 3 }} />
          
          {/* Common Settings */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Thời gian cho mỗi lịch hẹn
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="duration-label">Thời lượng</InputLabel>
                <Select
                  labelId="duration-label"
                  value={appointmentDurationMinutes}
                  onChange={(e) => setAppointmentDurationMinutes(e.target.value)}
                  label="Thời lượng"
                >
                  <MenuItem value={30}>30 phút</MenuItem>
                  <MenuItem value={45}>45 phút</MenuItem>
                  <MenuItem value={60}>1 tiếng</MenuItem>
                  <MenuItem value={90}>1 tiếng 30 phút</MenuItem>
                  <MenuItem value={120}>2 tiếng</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveAvailability}
              disabled={saving}
              size="large"
            >
              {saving ? 'Đang lưu...' : 'Lưu lịch trống'}
            </Button>
          </Box>
        </Paper>
      </LocalizationProvider>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>
          Xác nhận lưu lịch trống
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn lưu thay đổi lịch trống của chuyên gia {psychologist?.fullname}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Hủy</Button>
          <Button onClick={confirmSaveAvailability} variant="contained" autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManagePsychologistSchedule;
