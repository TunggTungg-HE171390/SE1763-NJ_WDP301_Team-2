import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Stack
} from '@mui/material';
// Remove Timeline imports from @mui/lab
import {
  ArrowBack as ArrowBackIcon,
  AccessTime as TimeIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Psychology as PsychologyIcon,
  Payments as PaymentIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  CalendarToday as CalendarIcon,
  Note as NoteIcon,
  History as HistoryIcon,
  Circle as CircleIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
// Fix the imports - use default import instead of named imports
import appointmentAPI from '../../api/appointment.api';
const { getAppointmentById, updateAppointmentStatus } = appointmentAPI;
import { useAuth } from '../../components/auth/authContext';

// Custom Timeline Component using standard MUI components
const CustomTimeline = ({ items }) => (
  <Box sx={{ position: 'relative', my: 4, ml: 2 }}>
    {items.map((item, index) => (
      <Box key={index} sx={{ 
        display: 'flex', 
        mb: index === items.length - 1 ? 0 : 3,
        position: 'relative'
      }}>
        {/* Vertical line */}
        {index < items.length - 1 && (
          <Box sx={{ 
            position: 'absolute',
            left: 12,
            top: 24,
            bottom: -16,
            width: 2,
            bgcolor: 'divider'
          }} />
        )}

        {/* Timeline dot */}
        <Box 
          sx={{ 
            mr: 2, 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Avatar 
            sx={{ 
              width: 24, 
              height: 24,
              bgcolor: item.color || 'primary.main'
            }}
          >
            {item.icon || <CircleIcon sx={{ fontSize: 14 }} />}
          </Avatar>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="subtitle1" fontWeight="medium">
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.time}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {item.subtitle}
          </Typography>
        </Box>
      </Box>
    ))}
  </Box>
);

const AppointmentDetail = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [staffNote, setStaffNote] = useState('');
  const { user } = useAuth(); // Get current user
  
  // Determine user role for conditional rendering
  const userRole = user?.role || 'staff';

  // Fetch appointment on component mount
  useEffect(() => {
    fetchAppointmentDetails();
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    setLoading(true);
    try {
      const response = await getAppointmentById(appointmentId);
      if (response && response.data) {
        setAppointment(response.data);
        setStaffNote(response.data.notes?.staff || '');
      } else {
        setError('Không tìm thấy thông tin cuộc hẹn');
      }
    } catch (err) {
      console.error('Error fetching appointment details:', err);
      setError('Không thể tải thông tin cuộc hẹn. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Open dialog for different actions
  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Update appointment status
  const handleUpdateStatus = async (newStatus) => {
    setLoading(true);
    try {
      const response = await updateAppointmentStatus(
        appointmentId, 
        { 
          status: newStatus, 
          note: staffNote,
          staffId: user?._id || "staff-id-here" // Use actual user ID if available
        }
      );
      
      if (response && response.data) {
        setAppointment(response.data);
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

  // Save staff note
  const handleSaveNote = async () => {
    setLoading(true);
    try {
      const response = await updateAppointmentStatus(
        appointmentId, 
        { 
          note: staffNote,
          staffId: user?._id || "staff-id-here" // Use actual user ID if available
        }
      );
      
      if (response && response.data) {
        setAppointment(response.data);
        setSuccess('Ghi chú đã được cập nhật');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error saving note:', err);
      setError('Không thể lưu ghi chú. Vui lòng thử lại sau.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
      handleCloseDialog();
    }
  };

  // Helper functions
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

  const getPaymentStatusLabel = (status) => {
    const statusMap = {
      'Pending': 'Chờ thanh toán',
      'Paid': 'Đã thanh toán',
      'Refunded': 'Đã hoàn tiền',
      'Failed': 'Thanh toán thất bại'
    };
    return statusMap[status] || status;
  };

  const getPaymentStatusColor = (status) => {
    const colorMap = {
      'Pending': 'warning',
      'Paid': 'success',
      'Refunded': 'info',
      'Failed': 'error'
    };
    return colorMap[status] || 'default';
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    
    try {
      const date = new Date(dateTimeStr);
      return format(date, 'EEEE, dd/MM/yyyy - HH:mm', { locale: vi });
    } catch (err) {
      return 'Invalid date';
    }
  };

  const formatDate = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    
    try {
      const date = new Date(dateTimeStr);
      return format(date, 'dd/MM/yyyy', { locale: vi });
    } catch (err) {
      return 'Invalid date';
    }
  };

  const formatTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    
    try {
      const date = new Date(dateTimeStr);
      return format(date, 'HH:mm', { locale: vi });
    } catch (err) {
      return 'Invalid date';
    }
  };
  
  // Get appropriate back link based on user role
  const getBackUrl = () => {
    if (userRole === 'staff') {
      return '/staff/manage-appointments';
    } else if (userRole === 'psychologist') {
      return '/psychologist/view-schedule';
    } else if (userRole === 'patient') {
      return '/patient/appointments';
    }
    return '/'; // Default fallback
  };

  // Loading state
  if (loading && !appointment) {
    return (
      <Container maxWidth="md" sx={{ mt: 12, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  // Error state
  if (error && !appointment) {
    return (
      <Container maxWidth="md" sx={{ mt: 12, mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={Link}
          to={getBackUrl()}
          sx={{ mb: 3 }}
        >
          Quay lại danh sách
        </Button>
        
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // Update the timeline items creation
  const getTimelineItems = () => {
    if (!appointment) return [];
    
    let items = [
      {
        title: "Cuộc hẹn được tạo",
        time: formatDateTime(appointment.createdAt),
        subtitle: `Bởi: ${appointment.patient?.fullName || 'Hệ thống'}`,
        color: 'primary.main',
        icon: <EventIcon sx={{ fontSize: 14 }} />
      },
      {
        title: `Trạng thái thay đổi: ${getStatusLabel(appointment.status)}`,
        time: formatDateTime(appointment.updatedAt),
        subtitle: `Bởi: ${appointment.lastModifiedBy?.role === 'staff' ? 'Nhân viên' : 
          appointment.lastModifiedBy?.role === 'patient' ? 'Bệnh nhân' : 
          appointment.lastModifiedBy?.role === 'psychologist' ? 'Chuyên gia' : 'Hệ thống'}`,
        color: getStatusChipColor(appointment.status),
        icon: <CheckCircleIcon sx={{ fontSize: 14 }} />
      }
    ];
    
    // Add payment info if available
    if (appointment.payment?.paidAt) {
      items.push({
        title: "Đã thanh toán",
        time: formatDateTime(appointment.payment.paidAt),
        subtitle: `Phương thức: ${appointment.payment.method || 'N/A'}`,
        color: 'success.main',
        icon: <PaymentIcon sx={{ fontSize: 14 }} />
      });
    }
    
    return items;
  };
  
  // Helper function to get color for timeline dot based on status
  const getStatusChipColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'warning.main';
      case 'confirmed': return 'info.main';
      case 'completed': return 'success.main';
      case 'cancelled': return 'error.main';
      case 'rescheduled': return 'secondary.main';
      default: return 'grey.500';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        component={Link}
        to={getBackUrl()}
        sx={{ mb: 3 }}
      >
        Quay lại danh sách
      </Button>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      {appointment && (
        <>
          <Grid container spacing={3}>
            {/* Left column */}
            <Grid item xs={12} md={8}>
              {/* Appointment header */}
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" component="h1" fontWeight={600}>
                    Chi tiết cuộc hẹn
                  </Typography>
                  <Chip 
                    label={getStatusLabel(appointment.status)} 
                    color={getStatusColor(appointment.status)} 
                    size="medium"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Mã cuộc hẹn: <Box component="span" fontFamily="monospace">{appointment._id}</Box>
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <EventIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Ngày hẹn</Typography>
                        <Typography variant="body1">
                          {formatDate(appointment.scheduledTime?.date)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <TimeIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Thời gian</Typography>
                        <Typography variant="body1">
                          {formatTime(appointment.scheduledTime?.startTime)} - {formatTime(appointment.scheduledTime?.endTime)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 2 }} />
                
                {/* Patient & Psychologist info */}
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
                      <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Thông tin bệnh nhân
                    </Typography>
                    <Box sx={{ pl: 4 }}>
                      <Typography variant="body1">
                        {appointment.patient?.fullName || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Email: {appointment.patient?.email || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        SĐT: {appointment.patient?.phone || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
                      <PsychologyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Thông tin chuyên gia
                    </Typography>
                    <Box sx={{ pl: 4 }}>
                      <Typography variant="body1">
                        {appointment.psychologist?.fullName || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Chuyên môn: {appointment.psychologist?.psychologistProfile?.specialization || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        SĐT: {appointment.psychologist?.phone || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                {/* Symptoms/Notes */}
                {appointment.notes && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
                      <NoteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Triệu chứng / Ghi chú của bệnh nhân
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                      <Typography variant="body2">
                        {appointment.notes.patient || 'Không có ghi chú'}
                      </Typography>
                    </Paper>
                  </>
                )}
                
                {/* Actions - Only show for staff and certain statuses */}
                {userRole === 'staff' && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      {appointment.status === 'Pending' && (
                        <>
                          <Button 
                            variant="contained" 
                            color="success" 
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleOpenDialog('confirm')}
                          >
                            Xác nhận
                          </Button>
                          <Button 
                            variant="contained" 
                            color="error" 
                            startIcon={<CancelIcon />}
                            onClick={() => handleOpenDialog('cancel')}
                          >
                            Hủy
                          </Button>
                        </>
                      )}
                      
                      {appointment.status === 'Confirmed' && (
                        <>
                          <Button 
                            variant="contained" 
                            color="success" 
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleOpenDialog('complete')}
                          >
                            Hoàn thành
                          </Button>
                          <Button 
                            variant="outlined" 
                            color="primary" 
                            startIcon={<CalendarIcon />}
                            onClick={() => navigate(`/staff/reschedule-appointment/${appointment._id}`)}
                          >
                            Đổi lịch
                          </Button>
                        </>
                      )}
                      
                      {appointment.status === 'Rescheduled' && appointment.rescheduleRequest?.status === 'Pending' && (
                        <>
                          <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => navigate(`/staff/reschedule-request/${appointment._id}`)}
                          >
                            Xem yêu cầu đổi lịch
                          </Button>
                        </>
                      )}
                    </Box>
                  </>
                )}
              </Paper>
              
              {/* Staff Notes - Only show for staff or psychologist */}
              {(userRole === 'staff' || userRole === 'psychologist') && (
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={500}>
                      <NoteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Ghi chú {userRole === 'staff' ? 'của nhân viên' : 'nội bộ'}
                    </Typography>
                    <Button 
                      variant="text" 
                      color="primary" 
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenDialog('note')}
                    >
                      Chỉnh sửa
                    </Button>
                  </Box>
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Nhập ghi chú nội bộ về cuộc hẹn này"
                    value={appointment.notes?.staff || ''}
                    disabled
                  />
                </Paper>
              )}
              
              {/* Replace Timeline with custom component */}
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={500} sx={{ mb: 2 }}>
                  <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Lịch sử cuộc hẹn
                </Typography>
                
                <CustomTimeline items={getTimelineItems()} />
              </Paper>
            </Grid>
            
            {/* Right column */}
            <Grid item xs={12} md={4}>
              {/* Payment Information */}
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Typography variant="h6" fontWeight={500} sx={{ mb: 2 }}>
                  <PaymentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Thông tin thanh toán
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Trạng thái</Typography>
                  <Chip 
                    label={getPaymentStatusLabel(appointment.payment?.status || 'Pending')} 
                    color={getPaymentStatusColor(appointment.payment?.status || 'Pending')} 
                    size="small"
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Số tiền</Typography>
                  <Typography variant="h5" fontWeight={500}>
                    {appointment.payment?.amount ? `${appointment.payment.amount.toLocaleString('vi-VN')} đ` : 'N/A'}
                  </Typography>
                </Box>
                
                {appointment.payment?.method && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Phương thức thanh toán</Typography>
                    <Typography variant="body1">
                      {appointment.payment.method}
                    </Typography>
                  </Box>
                )}
                
                {appointment.payment?.transactionId && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Mã giao dịch</Typography>
                    <Typography variant="body1" fontFamily="monospace">
                      {appointment.payment.transactionId}
                    </Typography>
                  </Box>
                )}
                
                {appointment.payment?.paidAt && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Thời gian thanh toán</Typography>
                    <Typography variant="body1">
                      {formatDateTime(appointment.payment.paidAt)}
                    </Typography>
                  </Box>
                )}
              </Paper>
              
              {/* Reschedule Information (if applicable) */}
              {appointment.status === 'Rescheduled' && appointment.rescheduleRequest && (
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                  <Typography variant="h6" fontWeight={500} sx={{ mb: 2 }}>
                    <CalendarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Thông tin đổi lịch
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Người yêu cầu</Typography>
                    <Typography variant="body1">
                      {appointment.rescheduleRequest.requestedBy === 'patient' ? 'Bệnh nhân' : 
                       appointment.rescheduleRequest.requestedBy === 'psychologist' ? 'Chuyên gia' : 'Nhân viên'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Thời gian yêu cầu</Typography>
                    <Typography variant="body1">
                      {formatDateTime(appointment.rescheduleRequest.requestedTime)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Lý do</Typography>
                    <Typography variant="body1">
                      {appointment.rescheduleRequest.reason || 'Không có lý do'}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Lịch cũ</Typography>
                  <Box sx={{ mb: 2, pl: 2 }}>
                    <Typography variant="body2">
                      Ngày: {formatDate(appointment.originalSchedule?.date)}
                    </Typography>
                    <Typography variant="body2">
                      Thời gian: {formatTime(appointment.originalSchedule?.startTime)} - {formatTime(appointment.originalSchedule?.endTime)}
                    </Typography>
                  </Box>
                  
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Lịch mới</Typography>
                  <Box sx={{ mb: 2, pl: 2 }}>
                    <Typography variant="body2">
                      Ngày: {formatDate(appointment.scheduledTime?.date)}
                    </Typography>
                    <Typography variant="body2">
                      Thời gian: {formatTime(appointment.scheduledTime?.startTime)} - {formatTime(appointment.scheduledTime?.endTime)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
                    <Chip 
                      label={
                        appointment.rescheduleRequest.status === 'Pending' ? 'Đang chờ phê duyệt' : 
                        appointment.rescheduleRequest.status === 'Approved' ? 'Đã chấp nhận' : 'Đã từ chối'
                      } 
                      color={
                        appointment.rescheduleRequest.status === 'Pending' ? 'warning' : 
                        appointment.rescheduleRequest.status === 'Approved' ? 'success' : 'error'
                      } 
                    />
                  </Box>
                  
                  {appointment.rescheduleRequest.status === 'Pending' && userRole === 'staff' && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button 
                        variant="contained" 
                        color="success" 
                        fullWidth
                        onClick={() => navigate(`/staff/reschedule-request/${appointment._id}?action=approve`)}
                      >
                        Chấp nhận
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="error" 
                        fullWidth
                        onClick={() => navigate(`/staff/reschedule-request/${appointment._id}?action=reject`)}
                      >
                        Từ chối
                      </Button>
                    </Box>
                  )}
                </Paper>
              )}
            </Grid>
          </Grid>
          
          {/* Dialogs */}
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>
              {dialogType === 'confirm' && 'Xác nhận cuộc hẹn'}
              {dialogType === 'cancel' && 'Hủy cuộc hẹn'}
              {dialogType === 'complete' && 'Hoàn thành cuộc hẹn'}
              {dialogType === 'note' && 'Cập nhật ghi chú'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ mb: 2 }}>
                {dialogType === 'confirm' && 'Bạn có chắc chắn muốn xác nhận cuộc hẹn này?'}
                {dialogType === 'cancel' && 'Bạn có chắc chắn muốn hủy cuộc hẹn này? Hành động này không thể hoàn tác.'}
                {dialogType === 'complete' && 'Bạn có chắc chắn muốn đánh dấu cuộc hẹn này là đã hoàn thành?'}
                {dialogType === 'note' && 'Cập nhật ghi chú nội bộ cho cuộc hẹn này.'}
              </DialogContentText>
              
              <TextField
                autoFocus
                margin="dense"
                label="Ghi chú"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={staffNote}
                onChange={(e) => setStaffNote(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="inherit">
                Hủy
              </Button>
              {dialogType === 'note' ? (
                <Button 
                  onClick={handleSaveNote} 
                  variant="contained" 
                  color="primary"
                >
                  Lưu ghi chú
                </Button>
              ) : (
                <Button 
                  onClick={() => handleUpdateStatus(
                    dialogType === 'confirm' ? 'Confirmed' : 
                    dialogType === 'cancel' ? 'Cancelled' : 
                    dialogType === 'complete' ? 'Completed' : ''
                  )} 
                  variant="contained" 
                  color={dialogType === 'cancel' ? 'error' : 'primary'}
                >
                  Xác nhận
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default AppointmentDetail;
