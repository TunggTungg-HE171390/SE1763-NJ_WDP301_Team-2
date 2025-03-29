import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container, Paper, Typography, Box, Grid, Button, Alert,
  CircularProgress, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, Card, CardContent, Chip, Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Note as NoteIcon,
  Edit as EditIcon,
  Done as DoneIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Cancel as CancelIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useAuth } from '@/components/auth/authContext';
import * as appointmentApi from '@/api/appointment.api';

const AppointmentDetail = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [staffNote, setStaffNote] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [statusDialog, setStatusDialog] = useState({
    open: false,
    newStatus: '',
    note: ''
  });

  // Fetch appointment details on component mount
  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log(`Fetching details for appointment ID: ${appointmentId}`);
        // Fix: Use the correct API function to get appointment details
        const response = await appointmentApi.getAppointmentById(appointmentId);
        
        if (response && response._id) {
          console.log("Appointment data received:", response);
          setAppointment(response);
          
          // Initialize staff notes if they exist
          if (response.notes && response.notes.staff) {
            setStaffNote(response.notes.staff);
          }
        } else {
          setError("Không thể tải thông tin cuộc hẹn. Dữ liệu không hợp lệ.");
          console.error("Invalid appointment data received:", response);
        }
      } catch (err) {
        console.error("Error fetching appointment details:", err);
        setError(`Đã xảy ra lỗi khi tải thông tin cuộc hẹn. ${err.message || ''}`);
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchAppointmentDetails();
    }
  }, [appointmentId]);

  // Handle opening note dialog
  const handleOpenNoteDialog = () => {
    setStaffNote(appointment?.notes?.staff || '');
    setOpenDialog(true);
  };

  // Handle closing note dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle saving note
  const handleSaveNote = async () => {
    try {
      setSavingNotes(true);
      
      // Use updateAppointmentStatus to update notes as 'staff'
      const response = await appointmentApi.updateAppointmentStatus(
        appointmentId, 
        { 
          note: staffNote,
          staffId: user?._id
        }
      );
      
      if (response && response.data) {
        // Update the appointment in state with the new note
        setAppointment(prevAppointment => ({
          ...prevAppointment,
          notes: {
            ...prevAppointment.notes,
            staff: staffNote
          }
        }));
        
        setSuccess("Lưu ghi chú thành công!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Error saving notes:", err);
      setError("Lỗi khi lưu ghi chú. Vui lòng thử lại.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSavingNotes(false);
      setOpenDialog(false);
    }
  };

  // Open status update dialog
  const handleOpenStatusDialog = (newStatus) => {
    setStatusDialog({
      open: true,
      newStatus,
      note: ''
    });
  };

  // Close status update dialog
  const handleCloseStatusDialog = () => {
    setStatusDialog({
      ...statusDialog,
      open: false
    });
  };

  // Handle status update
  const handleUpdateStatus = async () => {
    try {
      setLoading(true);
      
      const response = await appointmentApi.updateAppointmentStatus(
        appointmentId,
        {
          status: statusDialog.newStatus,
          note: statusDialog.note,
          staffId: user?._id
        }
      );
      
      if (response && response.data) {
        setAppointment(response.data);
        setSuccess(`Cập nhật trạng thái thành công thành ${getStatusLabel(statusDialog.newStatus)}!`);
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Lỗi khi cập nhật trạng thái. Vui lòng thử lại.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
      handleCloseStatusDialog();
    }
  };

  // Format functions
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return 'N/A';
    return new Date(time).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status label and color
  const getStatusLabel = (status) => {
    if (!status) return 'Không xác định';
    
    switch (status.toLowerCase()) {
      case 'confirmed': return 'Đã xác nhận';
      case 'pending': return 'Đang chờ';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      case 'rescheduled': return 'Đã đổi lịch';
      case 'no-show': return 'Không đến';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'default';
    
    switch (status.toLowerCase()) {
      case 'confirmed': return 'primary';
      case 'pending': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'rescheduled': return 'info';
      case 'no-show': return 'error';
      default: return 'default';
    }
  };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Error state
  if (error && !appointment) {
    return (
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            component={Link}
            to="/staff/manage-appointments"
          >
            Quay lại danh sách cuộc hẹn
          </Button>
        </Paper>
      </Container>
    );
  }

  // Handle the case where appointment is null despite loading being complete
  if (!appointment) {
    return (
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            Không tìm thấy thông tin cuộc hẹn
          </Alert>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            component={Link}
            to="/staff/manage-appointments"
          >
            Quay lại danh sách cuộc hẹn
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        component={Link}
        to={`/staff/manage-appointments/${appointment.psychologist?._id || ''}`}
        sx={{ mb: 3 }}
      >
        Quay lại danh sách cuộc hẹn
      </Button>
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Main appointment details */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Typography variant="h5" component="h1" fontWeight="bold">
                Chi tiết cuộc hẹn
              </Typography>
              
              <Chip 
                label={getStatusLabel(appointment.status)} 
                color={getStatusColor(appointment.status)}
                size="medium"
              />
            </Box>

            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              {/* Patient information */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" component="h2">
                        Thông tin bệnh nhân
                      </Typography>
                    </Box>
                    
                    <Box sx={{ pl: 1 }}>
                      <Typography variant="body1" gutterBottom>
                        <strong>Họ và tên:</strong> {appointment.patient?.fullName || 'Không có thông tin'}
                      </Typography>
                      
                      <Typography variant="body1" gutterBottom>
                        <strong>Email:</strong> {appointment.patient?.email || 'Không có thông tin'}
                      </Typography>
                      
                      <Typography variant="body1" gutterBottom>
                        <strong>Số điện thoại:</strong> {appointment.patient?.phone || 'Không có thông tin'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Psychologist information */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon color="info" sx={{ mr: 1 }} />
                      <Typography variant="h6" component="h2">
                        Thông tin chuyên gia
                      </Typography>
                    </Box>
                    
                    <Box sx={{ pl: 1 }}>
                      <Typography variant="body1" gutterBottom>
                        <strong>Họ và tên:</strong> {appointment.psychologist?.fullName || 'Không có thông tin'}
                      </Typography>
                      
                      <Typography variant="body1" gutterBottom>
                        <strong>Email:</strong> {appointment.psychologist?.email || 'Không có thông tin'}
                      </Typography>
                      
                      <Typography variant="body1" gutterBottom>
                        <strong>Chuyên môn:</strong> {appointment.psychologist?.psychologist?.psychologistProfile?.specialization || 'Không có thông tin'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Appointment time information */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" component="h2">
                        Thời gian cuộc hẹn
                      </Typography>
                    </Box>
                    
                    <Box sx={{ pl: 1 }}>
                      <Typography variant="body1" gutterBottom>
                        <strong>Ngày:</strong> {formatDate(appointment.scheduledTime?.date)}
                      </Typography>
                      
                      <Typography variant="body1" gutterBottom>
                        <strong>Giờ bắt đầu:</strong> {formatTime(appointment.scheduledTime?.startTime)}
                      </Typography>
                      
                      <Typography variant="body1" gutterBottom>
                        <strong>Giờ kết thúc:</strong> {formatTime(appointment.scheduledTime?.endTime)}
                      </Typography>
                      
                      {appointment.isRescheduled && (
                        <Chip 
                          label="Cuộc hẹn đã được đổi lịch" 
                          color="info" 
                          size="small" 
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Meeting link */}
              {appointment.meetingURL && (
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <ScheduleIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6" component="h2">
                          Liên kết cuộc hẹn
                        </Typography>
                      </Box>
                      
                      <Box sx={{ pl: 1 }}>
                        <Typography variant="body1" gutterBottom>
                          <strong>URL:</strong> <a href={appointment.meetingURL} target="_blank" rel="noopener noreferrer">{appointment.meetingURL}</a>
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
            
            {/* Patient notes */}
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <NoteIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    Ghi chú từ bệnh nhân
                  </Typography>
                </Box>
                
                <Typography variant="body1" sx={{ pl: 1, whiteSpace: 'pre-wrap' }}>
                  {appointment.notes?.patient || appointment.note || 'Không có ghi chú từ bệnh nhân'}
                </Typography>
              </CardContent>
            </Card>
            
            {/* Psychologist notes */}
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssignmentIcon color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    Ghi chú từ chuyên gia
                  </Typography>
                </Box>
                
                <Typography variant="body1" sx={{ pl: 1, whiteSpace: 'pre-wrap', minHeight: 60 }}>
                  {appointment.notes?.psychologist || 'Chưa có ghi chú từ chuyên gia.'}
                </Typography>
              </CardContent>
            </Card>
            
            {/* Staff notes */}
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AssignmentIcon color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="h2">
                      Ghi chú của nhân viên
                    </Typography>
                  </Box>
                  
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleOpenNoteDialog}
                  >
                    Chỉnh sửa
                  </Button>
                </Box>
                
                <Typography variant="body1" sx={{ pl: 1, whiteSpace: 'pre-wrap', minHeight: 60 }}>
                  {appointment.notes?.staff || 'Chưa có ghi chú. Nhấn "Chỉnh sửa" để thêm ghi chú.'}
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
        
        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            {/* Action buttons */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Thao tác
              </Typography>
              
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={handleOpenNoteDialog}
                sx={{ mb: 2 }}
              >
                Cập nhật ghi chú
              </Button>
              
              {appointment.status === 'Pending' && (
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<DoneIcon />}
                  sx={{ mb: 2 }}
                  onClick={() => handleOpenStatusDialog('Confirmed')}
                >
                  Xác nhận cuộc hẹn
                </Button>
              )}
              
              {appointment.status === 'Confirmed' && (
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<DoneIcon />}
                  sx={{ mb: 2 }}
                  onClick={() => handleOpenStatusDialog('Completed')}
                >
                  Đánh dấu đã hoàn thành
                </Button>
              )}
              
              {['Pending', 'Confirmed'].includes(appointment.status) && (
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  sx={{ mb: 2 }}
                  onClick={() => handleOpenStatusDialog('Cancelled')}
                >
                  Hủy cuộc hẹn
                </Button>
              )}
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {/* Payment information */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Thông tin thanh toán
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Trạng thái:
                </Typography>
                <Chip 
                  label={appointment.paymentInformation?.status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'} 
                  color={appointment.paymentInformation?.status === 'PAID' ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Phương thức:
                </Typography>
                <Typography variant="body2">
                  {appointment.paymentInformation?.method || 'Payos'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Số tiền:
                </Typography>
                <Typography variant="body2">
                  {appointment.paymentInformation?.amount 
                    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(appointment.paymentInformation.amount)
                    : '350.000 VNĐ'}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {/* System info */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Thông tin hệ thống
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>ID cuộc hẹn:</strong> {appointment._id}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Ngày tạo:</strong> {appointment.createdAt ? new Date(appointment.createdAt).toLocaleString('vi-VN') : 'N/A'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Cập nhật lần cuối:</strong> {appointment.lastModifiedBy?.timestamp 
                  ? new Date(appointment.lastModifiedBy.timestamp).toLocaleString('vi-VN') 
                  : 'N/A'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Cập nhật bởi:</strong> {
                  appointment.lastModifiedBy?.role === 'patient' ? 'Bệnh nhân' :
                  appointment.lastModifiedBy?.role === 'psychologist' ? 'Chuyên gia tâm lý' :
                  appointment.lastModifiedBy?.role === 'staff' ? 'Nhân viên' :
                  appointment.lastModifiedBy?.role || 'N/A'
                }
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Edit Notes Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>Cập nhật ghi chú nhân viên</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="notes"
            label="Ghi chú của bạn"
            type="text"
            fullWidth
            multiline
            rows={10}
            variant="outlined"
            value={staffNote}
            onChange={(e) => setStaffNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy
          </Button>
          <Button 
            onClick={handleSaveNote} 
            color="primary" 
            variant="contained"
            disabled={savingNotes}
            startIcon={<SaveIcon />}
          >
            {savingNotes ? 'Đang lưu...' : 'Lưu ghi chú'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Status Update Dialog */}
      <Dialog open={statusDialog.open} onClose={handleCloseStatusDialog} fullWidth>
        <DialogTitle>
          Cập nhật trạng thái cuộc hẹn
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Bạn đang thay đổi trạng thái cuộc hẹn thành <strong>{getStatusLabel(statusDialog.newStatus)}</strong>
          </Typography>
          
          {statusDialog.newStatus === 'Cancelled' && (
            <Alert severity="warning" sx={{ my: 2 }}>
              Hủy cuộc hẹn sẽ giải phóng khung giờ này cho các lịch đặt khác.
            </Alert>
          )}
          
          <TextField
            autoFocus
            margin="dense"
            id="statusNote"
            label="Ghi chú (tùy chọn)"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={statusDialog.note}
            onChange={(e) => setStatusDialog({...statusDialog, note: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog} color="inherit">
            Hủy
          </Button>
          <Button 
            onClick={handleUpdateStatus} 
            variant="contained" 
            color={statusDialog.newStatus === 'Cancelled' ? 'error' : 'primary'}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AppointmentDetail;
