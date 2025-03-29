import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Box, Grid, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, TablePagination, Chip, TextField, MenuItem,
  IconButton, CircularProgress, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions, Tabs, Tab, FormControl,
  InputLabel, Select, useTheme, useMediaQuery, InputAdornment,
  DialogContentText, Tooltip, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  CalendarMonth as CalendarIcon,
  ArrowBack as ArrowBackIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Today as TodayIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon
} from '@mui/icons-material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/components/auth/authContext';
import * as appointmentApi from '@/api/appointment.api';
import * as psychologistApi from '@/api/psychologist.api';
import { 
  format, 
  addDays, 
  subDays, 
  addWeeks, 
  subWeeks, 
  startOfWeek, 
  endOfWeek, 
  isToday,
  isSameDay,
  eachDayOfInterval,
  parseISO,
  isSameMonth
} from 'date-fns';
import { vi } from 'date-fns/locale';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

/**
 * ManageAppointments - For staff to manage appointments for a specific psychologist
 * This component allows staff to view, filter, and manage appointments for a selected psychologist
 */
const ManageAppointments = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { psychologistId } = useParams(); // Get psychologistId from URL
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [psychologistInfo, setPsychologistInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'calendar', or 'week'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Tab status groupings
  const statusGroups = [
    { label: 'Tất cả', statuses: [], count: 0 },
    { label: 'Đang chờ', statuses: ['Pending'], count: 0, color: 'warning' },
    { label: 'Đã xác nhận', statuses: ['Confirmed'], count: 0, color: 'info' },
    { label: 'Đã hoàn thành', statuses: ['Completed'], count: 0, color: 'success' },
    { label: 'Đổi lịch', statuses: ['Rescheduled'], count: 0, color: 'secondary' },
    { label: 'Đã hủy', statuses: ['Cancelled', 'No-show'], count: 0, color: 'error' }
  ];

  // Calculate week dates for the week view
  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 1 })
  });

  // Redirect to psychologist list if no psychologistId is provided
  useEffect(() => {
    if (!psychologistId) {
      navigate('/staff/manage-psychologists');
    }
  }, [psychologistId, navigate]);

  // Fetch psychologist information
  useEffect(() => {
    const fetchPsychologistInfo = async () => {
      if (!psychologistId) return;
      
      try {
        setLoading(true);
        const response = await psychologistApi.getPsychologist(psychologistId);
        if (response && response.data) {
          setPsychologistInfo(response.data);
        } else {
          setError('Không thể tải thông tin chuyên gia tâm lý');
          navigate('/staff/manage-psychologists');
        }
      } catch (err) {
        console.error('Error fetching psychologist info:', err);
        setError('Không thể tải thông tin chuyên gia tâm lý.');
        navigate('/staff/manage-psychologists');
      } finally {
        setLoading(false);
      }
    };

    fetchPsychologistInfo();
  }, [psychologistId, navigate]);

  // Fetch appointments for the selected psychologist
  useEffect(() => {
    if (psychologistId) {
      fetchAppointments();
    }
  }, [psychologistId]);

  const fetchAppointments = async () => {
    if (!psychologistId) return;
    
    setLoading(true);
    setIsRefreshing(true);
    try {
      // Fetch appointments for this specific psychologist
      const response = await appointmentApi.getAllAppointments({ psychologistId });
      
      if (response && response.data) {
        let appointmentsData = [];
        
        // Handle different API response formats
        if (Array.isArray(response.data)) {
          appointmentsData = response.data;
        } else if (response.data.appointments) {
          appointmentsData = response.data.appointments;
        } else if (response.data.data) {
          appointmentsData = response.data.data;
        }
        
        setAppointments(appointmentsData);
        setFilteredAppointments(appointmentsData);
        
        // Update counts for tabs
        statusGroups.forEach((group, index) => {
          if (index === 0) {
            // Total count for "All" tab
            group.count = appointmentsData.length;
          } else {
            // Count for specific status groups
            group.count = appointmentsData.filter(app => 
              group.statuses.includes(app.status)
            ).length;
          }
        });
      } else {
        setAppointments([]);
        setFilteredAppointments([]);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Không thể tải danh sách cuộc hẹn. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    filterAppointments();
  }, [activeTab, statusFilter, search, appointments]);

  const filterAppointments = () => {
    let filtered = [...appointments];
    
    // Apply tab filter
    if (activeTab > 0 && statusGroups[activeTab]) {
      const allowedStatuses = statusGroups[activeTab].statuses;
      filtered = filtered.filter(appointment => allowedStatuses.includes(appointment.status));
    }
    
    // Apply status filter if it's not 'all'
    if (statusFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === statusFilter);
    }
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(appointment => 
        (appointment.patient?.fullName || '').toLowerCase().includes(searchLower) ||
        (appointment.psychologist?.fullName || '').toLowerCase().includes(searchLower) ||
        appointment._id.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredAppointments(filtered);
  };

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0);
    // Reset additional filters when changing tabs
    setStatusFilter('all');
  };

  const handleChangeStatusFilter = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenStatusDialog = (appointment, status) => {
    setCurrentAppointment(appointment);
    setNewStatus(status);
    setStatusNote('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentAppointment(null);
    setNewStatus('');
    setStatusNote('');
  };

  const handleUpdateStatus = async () => {
    if (!currentAppointment || !newStatus) return;
    
    setLoading(true);
    try {
      const response = await appointmentApi.updateAppointmentStatus(
        currentAppointment._id, 
        { 
          status: newStatus, 
          note: statusNote,
          staffId: user?._id || "staff-id-here"
        }
      );
      
      if (response && response.data) {
        // Update the local state with the updated appointment
        const updatedAppointments = appointments.map(app => 
          app._id === currentAppointment._id ? response.data : app
        );
        setAppointments(updatedAppointments);
        
        setSuccess(`Cập nhật trạng thái thành công thành ${getStatusLabel(newStatus)}`);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error updating appointment status:', err);
      setError('Không thể cập nhật trạng thái. Vui lòng thử lại sau.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
      handleCloseDialog();
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'Pending': 'Đang chờ',
      'Confirmed': 'Đã xác nhận',
      'Completed': 'Đã hoàn thành',
      'Cancelled': 'Đã hủy',
      'Rescheduled': 'Đổi lịch',
      'No-show': 'Không đến'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'Pending': 'warning',
      'Confirmed': 'info',
      'Completed': 'success',
      'Cancelled': 'error',
      'Rescheduled': 'secondary',
      'No-show': 'default'
    };
    return colorMap[status] || 'default';
  };

  const formatDateTime = (dateTimeStr) => {
    try {
      const date = new Date(dateTimeStr);
      return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch (err) {
      return 'Invalid date';
    }
  };

  // Handle view mode change
  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  // Handle calendar navigation
  const goToPreviousPeriod = () => {
    if (viewMode === 'week') {
      setCurrentWeekStart(subWeeks(currentWeekStart, 1));
    } else {
      setCurrentDate(subDays(currentDate, 7));
    }
  };

  const goToNextPeriod = () => {
    if (viewMode === 'week') {
      setCurrentWeekStart(addWeeks(currentWeekStart, 1));
    } else {
      setCurrentDate(addDays(currentDate, 7));
    }
  };

  const goToToday = () => {
    if (viewMode === 'week') {
      setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
    } else {
      setCurrentDate(new Date());
    }
  };

  // Get appointments for a specific day (for week view)
  const getAppointmentsForDay = (day) => {
    return filteredAppointments.filter(appointment => {
      if (!appointment.scheduledTime || !appointment.scheduledTime.startTime) return false;
      
      const appointmentDate = new Date(appointment.scheduledTime.startTime);
      return isSameDay(appointmentDate, day);
    }).sort((a, b) => {
      const timeA = new Date(a.scheduledTime.startTime).getTime();
      const timeB = new Date(b.scheduledTime.startTime).getTime();
      return timeA - timeB;
    });
  };

  // Format events for full calendar
  const formatCalendarEvents = () => {
    return filteredAppointments.map(appointment => {
      let color;
      switch(appointment.status) {
        case 'Confirmed': color = '#3788d8'; break; // Primary blue
        case 'Pending': color = '#ff9800'; break; // Warning orange
        case 'Completed': color = '#4caf50'; break; // Success green
        case 'Cancelled': color = '#f44336'; break; // Error red
        case 'Rescheduled': color = '#9c27b0'; break; // Purple
        default: color = '#757575'; // Gray
      }
      
      return {
        id: appointment._id,
        title: `${appointment.patient?.fullName || 'Unknown'} - ${getStatusLabel(appointment.status)}`,
        start: appointment.scheduledTime?.startTime,
        end: appointment.scheduledTime?.endTime,
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
          patientName: appointment.patient?.fullName,
          status: appointment.status
        }
      };
    });
  };

  // Handle calendar event click
  const handleEventClick = (info) => {
    const appointmentId = info.event.id;
    const appointment = appointments.find(app => app._id === appointmentId);
    
    if (appointment) {
      navigate(`/staff/appointment-details/${appointmentId}`);
    }
  };

  // Get displayed appointments based on pagination (only for list view)
  const displayedAppointments = filteredAppointments
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
      {/* Back button */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        component={Link}
        to="/staff/manage-psychologists"
        sx={{ mb: 3 }}
      >
        Quay lại danh sách chuyên gia
      </Button>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
          {psychologistInfo 
            ? `Lịch hẹn của chuyên gia ${psychologistInfo.fullName}`
            : 'Quản lý lịch hẹn'}
        </Typography>
        
        {psychologistInfo && (
          <Typography variant="body1" color="text.secondary">
            {psychologistInfo.psychologist?.psychologistProfile?.specialization || 'Chuyên gia tâm lý'}
          </Typography>
        )}
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Tabs
                value={activeTab}
                onChange={handleChangeTab}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
              >
                {statusGroups.map((group, index) => (
                  <Tab key={index} label={`${group.label} (${group.count})`} />
                ))}
              </Tabs>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={handleViewModeChange}
                  aria-label="view mode"
                  size="small"
                >
                  <ToggleButton value="list" aria-label="list view">
                    <ViewListIcon fontSize="small" />
                  </ToggleButton>
                  <ToggleButton value="week" aria-label="week view">
                    <ViewModuleIcon fontSize="small" />
                  </ToggleButton>
                  <ToggleButton value="calendar" aria-label="calendar view">
                    <CalendarIcon fontSize="small" />
                  </ToggleButton>
                </ToggleButtonGroup>
                
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchAppointments}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? 'Đang tải...' : 'Làm mới'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                label="Tìm kiếm"
                variant="outlined"
                size="small"
                fullWidth
                value={search}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl size="small" variant="outlined" sx={{ minWidth: 200 }} fullWidth>
                <InputLabel id="status-filter-label">Trạng thái</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  onChange={handleChangeStatusFilter}
                  label="Trạng thái"
                >
                  <MenuItem value="all">Tất cả trạng thái</MenuItem>
                  <MenuItem value="Pending">Đang chờ</MenuItem>
                  <MenuItem value="Confirmed">Đã xác nhận</MenuItem>
                  <MenuItem value="Completed">Đã hoàn thành</MenuItem>
                  <MenuItem value="Cancelled">Đã hủy</MenuItem>
                  <MenuItem value="Rescheduled">Đổi lịch</MenuItem>
                  <MenuItem value="No-show">Không đến</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        
        {/* Calendar navigation for calendar and week views */}
        {(viewMode === 'calendar' || viewMode === 'week') && (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
            <Button startIcon={<PrevIcon />} onClick={goToPreviousPeriod}>
              {viewMode === 'week' ? 'Tuần trước' : 'Trước'}
            </Button>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<TodayIcon />}
                onClick={goToToday}
                sx={{ mr: 2 }}
              >
                Hôm nay
              </Button>
              
              <Typography variant="subtitle1" fontWeight="medium">
                {viewMode === 'week' 
                  ? `${format(currentWeekStart, 'dd/MM/yyyy')} - ${format(addDays(currentWeekStart, 6), 'dd/MM/yyyy')}`
                  : format(currentDate, 'MMMM yyyy', { locale: vi })}
              </Typography>
            </Box>
            
            <Button endIcon={<NextIcon />} onClick={goToNextPeriod}>
              {viewMode === 'week' ? 'Tuần sau' : 'Sau'}
            </Button>
          </Box>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* List View */}
            {viewMode === 'list' && (
              <Box>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Mã cuộc hẹn</TableCell>
                        <TableCell>Bệnh nhân</TableCell>
                        {!psychologistId && <TableCell>Chuyên gia</TableCell>}
                        <TableCell>Ngày & giờ</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Thanh toán</TableCell>
                        <TableCell align="center">Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {displayedAppointments.length > 0 ? (
                        displayedAppointments.map((appointment) => (
                          <TableRow key={appointment._id} hover>
                            <TableCell>
                              <Typography variant="body2" fontFamily="monospace">
                                {appointment._id.substring(0, 8)}...
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {appointment.patient?.fullName || 'Unknown'}
                            </TableCell>
                            {!psychologistId && (
                              <TableCell>
                                {appointment.psychologist?.fullName || 'Unknown'}
                              </TableCell>
                            )}
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="body2">
                                  {formatDateTime(appointment.scheduledTime?.startTime)}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={getStatusLabel(appointment.status)} 
                                color={getStatusColor(appointment.status)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={appointment.paymentInformation?.status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'} 
                                color={appointment.paymentInformation?.status === 'PAID' ? 'success' : 'warning'}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <IconButton 
                                  component={Link}
                                  to={`/staff/appointment-details/${appointment._id}`}
                                  color="info"
                                  size="small"
                                  title="Xem chi tiết"
                                >
                                  <VisibilityIcon />
                                </IconButton>
                                
                                {appointment.status === 'Pending' && (
                                  <>
                                    <IconButton 
                                      color="success"
                                      size="small"
                                      title="Xác nhận"
                                      onClick={() => handleOpenStatusDialog(appointment, 'Confirmed')}
                                    >
                                      <CheckCircleIcon />
                                    </IconButton>
                                    
                                    <IconButton 
                                      color="error"
                                      size="small"
                                      title="Hủy"
                                      onClick={() => handleOpenStatusDialog(appointment, 'Cancelled')}
                                    >
                                      <CancelIcon />
                                    </IconButton>
                                  </>
                                )}
                                
                                {appointment.status === 'Confirmed' && (
                                  <>
                                    <IconButton 
                                      color="success"
                                      size="small"
                                      title="Hoàn thành"
                                      onClick={() => handleOpenStatusDialog(appointment, 'Completed')}
                                    >
                                      <CheckCircleIcon />
                                    </IconButton>
                                    
                                    <IconButton 
                                      color="secondary"
                                      size="small"
                                      title="Đổi lịch"
                                      onClick={() => handleOpenStatusDialog(appointment, 'Rescheduled')}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </>
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={psychologistId ? 6 : 7} align="center" sx={{ py: 3 }}>
                            <Typography color="text.secondary">
                              Không tìm thấy cuộc hẹn nào
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredAppointments.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Hiển thị:"
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
                />
              </Box>
            )}
            
            {/* Week View */}
            {viewMode === 'week' && (
              <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  {weekDays.map((day) => {
                    const dayAppointments = getAppointmentsForDay(day);
                    const isCurrentDay = isToday(day);
                    
                    return (
                      <Grid item xs={12} md={isMobile ? 12 : 6} lg={isMobile ? 12 : 4} key={day.toString()}>
                        <Paper 
                          elevation={isCurrentDay ? 3 : 1}
                          sx={{ 
                            p: 2, 
                            height: '100%',
                            border: isCurrentDay ? `1px solid ${theme.palette.primary.main}` : 'none',
                            backgroundColor: isCurrentDay ? 'rgba(33, 150, 243, 0.05)' : 'background.paper'
                          }}
                        >
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              mb: 2, 
                              p: 1, 
                              backgroundColor: isCurrentDay ? 'primary.main' : 'grey.200',
                              color: isCurrentDay ? 'white' : 'text.primary',
                              borderRadius: 1
                            }}
                          >
                            {format(day, 'EEEE, dd/MM', { locale: vi })}
                          </Typography>
                          
                          {dayAppointments.length > 0 ? (
                            dayAppointments.map((appointment) => (
                              <Box 
                                key={appointment._id}
                                component={Link}
                                to={`/staff/appointment-details/${appointment._id}`}
                                sx={{ 
                                  p: 2, 
                                  mb: 2, 
                                  display: 'block',
                                  textDecoration: 'none',
                                  color: 'text.primary',
                                  borderLeft: '4px solid',
                                  borderColor: appointment.status === 'Confirmed' ? 'info.main' :
                                              appointment.status === 'Completed' ? 'success.main' :
                                              appointment.status === 'Pending' ? 'warning.main' :
                                              appointment.status === 'Cancelled' ? 'error.main' :
                                              'grey.500',
                                  backgroundColor: 'background.paper',
                                  borderRadius: 1,
                                  boxShadow: 1,
                                  transition: 'transform 0.2s, box-shadow 0.2s',
                                  '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: 2,
                                  }
                                }}
                              >
                                <Grid container spacing={1}>
                                  <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <Typography variant="subtitle1" fontWeight="medium">
                                        {format(new Date(appointment.scheduledTime.startTime), 'HH:mm')} - 
                                        {format(new Date(appointment.scheduledTime.endTime), 'HH:mm')}
                                      </Typography>
                                      <Chip 
                                        label={getStatusLabel(appointment.status)} 
                                        color={getStatusColor(appointment.status)}
                                        size="small"
                                      />
                                    </Box>
                                  </Grid>
                                  
                                  <Grid item xs={12}>
                                    <Typography variant="body2">
                                      <strong>Bệnh nhân:</strong> {appointment.patient?.fullName || 'Unknown'}
                                    </Typography>
                                    
                                    {appointment.notes?.patient && (
                                      <Typography variant="body2" color="text.secondary" sx={{ 
                                        mt: 1, 
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                      }}>
                                        {appointment.notes.patient}
                                      </Typography>
                                    )}
                                  </Grid>
                                </Grid>
                              </Box>
                            ))
                          ) : (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                              <Typography color="text.secondary">
                                Không có cuộc hẹn
                              </Typography>
                            </Box>
                          )}
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            )}
            
            {/* Calendar View */}
            {viewMode === 'calendar' && (
              <Box sx={{ height: 650, p: 2 }}>
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="timeGridWeek"
                  headerToolbar={false}
                  events={formatCalendarEvents()}
                  height="100%"
                  slotMinTime="08:00:00"
                  slotMaxTime="20:00:00"
                  allDaySlot={false}
                  eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  }}
                  eventClick={handleEventClick}
                  dayHeaderFormat={{
                    weekday: 'short',
                    day: 'numeric',
                    month: 'numeric'
                  }}
                  locale="vi"
                  firstDay={1} // Monday
                />
              </Box>
            )}
          </>
        )}
      </Paper>
      
      {/* Status Update Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          Cập nhật trạng thái cuộc hẹn
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Bạn đang thay đổi trạng thái cuộc hẹn thành <strong>{getStatusLabel(newStatus)}</strong>.
            {newStatus === 'Cancelled' && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                Lưu ý: Hủy cuộc hẹn sẽ giải phóng khung giờ này cho các lịch đặt khác.
              </Typography>
            )}
          </DialogContentText>
          
          <TextField
            autoFocus
            margin="dense"
            label="Ghi chú"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Hủy
          </Button>
          <Button 
            onClick={handleUpdateStatus} 
            variant="contained" 
            color={newStatus === 'Cancelled' ? 'error' : 'primary'}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageAppointments;
