import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
    Card,
    CardContent,
    Grid, 
    Chip,
    Divider, 
    IconButton,
    Tooltip,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Button,
    CircularProgress,
    Typography
} from '@mui/material';

import {
    CalendarMonth,
    AccessTime,
    Person,
    Notes,
    MedicalInformation,
    Phone,
    Email,
    Edit,
    Cancel,
    CheckCircle,
    Close
} from '@mui/icons-material';

const ViewAppointmentDetailComponent = ({ 
    appointment, 
    onCancel, 
    onReschedule, 
    onUpdateNotes, 
    onConfirm,
    isLoading 
}) => {
    const [openCancel, setOpenCancel] = useState(false);
    const [openReschedule, setOpenReschedule] = useState(false);
    const [openNotes, setOpenNotes] = useState(false);
    const [noteContent, setNoteContent] = useState(appointment.notes || "");
    const [rescheduleDate, setRescheduleDate] = useState(appointment.date);
    const [rescheduleTime, setRescheduleTime] = useState(appointment.time.split(' ')[0]);
    const [rescheduleReason, setRescheduleReason] = useState('');
    const [cancelReason, setCancelReason] = useState('');
    
    const getStatusColor = (status) => {
        switch(status.toLowerCase()) {
            case 'confirmed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'error';
            case 'rescheduled':
                return 'info';
            default:
                return 'default';
        }
    };
    
    const handleSaveNotes = () => {
        onUpdateNotes(noteContent);
        setOpenNotes(false);
    };

    const handleCancelAppointment = () => {
        onCancel(cancelReason);
        setOpenCancel(false);
    };

    const handleRescheduleAppointment = () => {
        onReschedule(rescheduleDate, rescheduleTime, rescheduleReason);
        setOpenReschedule(false);
    };

    // Disable actions if appointment is already cancelled
    const isCancelled = appointment.status.toLowerCase() === 'cancelled';
    const isConfirmed = appointment.status.toLowerCase() === 'confirmed';

    return (
        <>
            <Card>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Person />
                            <Box component="h3" sx={{ fontSize: '1.25rem', fontWeight: 500, m: 0 }}>
                                {appointment.patientName}
                            </Box>
                        </Box>
                        <Chip 
                            label={appointment.status} 
                            color={getStatusColor(appointment.status)}
                            sx={{ fontWeight: 'bold' }}
                        />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <CalendarMonth color="primary" sx={{ mt: 0.5 }} />
                                <Box>
                                    <Box component="p" sx={{ color: 'text.secondary', fontSize: '0.875rem', m: 0 }}>
                                        Ngày hẹn
                                    </Box>
                                    <Box component="p" sx={{ m: 0 }}>
                                        {new Date(appointment.date).toLocaleDateString('vi-VN', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <AccessTime color="primary" sx={{ mt: 0.5 }} />
                                <Box>
                                    <Box component="p" sx={{ color: 'text.secondary', fontSize: '0.875rem', m: 0 }}>
                                        Thời gian
                                    </Box>
                                    <Box component="p" sx={{ m: 0 }}>
                                        {appointment.time} ({appointment.duration} phút)
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <Person color="primary" sx={{ mt: 0.5 }} />
                                <Box>
                                    <Box component="p" sx={{ color: 'text.secondary', fontSize: '0.875rem', m: 0 }}>
                                        Thông tin bệnh nhân
                                    </Box>
                                    <Box component="p" sx={{ m: 0 }}>
                                        {appointment.patientName}, {appointment.patientAge} tuổi, {appointment.patientGender}
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <MedicalInformation color="primary" sx={{ mt: 0.5 }} />
                                <Box>
                                    <Box component="p" sx={{ color: 'text.secondary', fontSize: '0.875rem', m: 0 }}>
                                        Lý do thăm khám
                                    </Box>
                                    <Box component="p" sx={{ m: 0 }}>
                                        {appointment.reason}
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <Phone color="primary" sx={{ mt: 0.5 }} />
                                <Box>
                                    <Box component="p" sx={{ color: 'text.secondary', fontSize: '0.875rem', m: 0 }}>
                                        Số điện thoại
                                    </Box>
                                    <Box component="p" sx={{ m: 0 }}>
                                        {appointment.contactNumber}
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <Email color="primary" sx={{ mt: 0.5 }} />
                                <Box>
                                    <Box component="p" sx={{ color: 'text.secondary', fontSize: '0.875rem', m: 0 }}>
                                        Email
                                    </Box>
                                    <Box component="p" sx={{ m: 0 }}>
                                        {appointment.email}
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>

                    {appointment.cancelReason && (
                        <Box sx={{ mt: 3, p: 2, bgcolor: '#FFEBEE', borderRadius: 1 }}>
                            <Typography variant="subtitle2" color="#C62828" fontWeight="bold">Lý do hủy:</Typography>
                            <Typography variant="body2">{appointment.cancelReason}</Typography>
                        </Box>
                    )}

                    {appointment.rescheduleReason && (
                        <Box sx={{ mt: 3, p: 2, bgcolor: '#E1F5FE', borderRadius: 1 }}>
                            <Typography variant="subtitle2" color="#0277BD" fontWeight="bold">Lý do đổi lịch:</Typography>
                            <Typography variant="body2">{appointment.rescheduleReason}</Typography>
                        </Box>
                    )}

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Notes color="primary" />
                                <Box component="h4" sx={{ fontWeight: 600, m: 0 }}>
                                    Ghi chú
                                </Box>
                            </Box>
                            <Tooltip title={isCancelled ? "Không thể chỉnh sửa cuộc hẹn đã hủy" : "Chỉnh sửa ghi chú"}>
                                <span>
                                    <IconButton 
                                        size="small" 
                                        onClick={() => setOpenNotes(true)}
                                        disabled={isLoading || isCancelled}
                                    >
                                        <Edit fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Box>
                        <Box component="p" sx={{ color: 'text.secondary', m: 0 }}>
                            {appointment.notes || "Không có ghi chú"}
                        </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <MedicalInformation color="primary" />
                            <Box component="h4" sx={{ fontWeight: 600, m: 0 }}>
                                Thông tin bệnh án
                            </Box>
                        </Box>
                        <Box component="p" sx={{ color: 'text.secondary', m: 0 }}>
                            {appointment.medicalHistory || "Không có thông tin bệnh án"}
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        {isLoading ? (
                            <CircularProgress size={24} sx={{ mr: 2 }} />
                        ) : (
                            <>
                                <Button 
                                    variant="outlined" 
                                    color="error"
                                    startIcon={<Cancel />}
                                    onClick={() => setOpenCancel(true)}
                                    disabled={isCancelled}
                                >
                                    Hủy cuộc hẹn
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    color="primary"
                                    startIcon={<CalendarMonth />}
                                    onClick={() => setOpenReschedule(true)}
                                    disabled={isCancelled}
                                >
                                    Đổi lịch hẹn
                                </Button>
                                <Button 
                                    variant="contained" 
                                    color="success"
                                    startIcon={<CheckCircle />}
                                    onClick={onConfirm}
                                    disabled={isConfirmed || isCancelled || isLoading}
                                >
                                    Xác nhận
                                </Button>
                            </>
                        )}
                    </Box>
                </CardContent>
            </Card>

            {/* Cancel Dialog */}
            <Dialog open={openCancel} onClose={() => setOpenCancel(false)}>
                <DialogTitle>Xác nhận hủy cuộc hẹn</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc muốn hủy cuộc hẹn với {appointment.patientName} vào ngày {new Date(appointment.date).toLocaleDateString('vi-VN')} lúc {appointment.time}? Hành động này không thể hoàn tác.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="cancel-reason"
                        label="Lý do hủy (tùy chọn)"
                        type="text"
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCancel(false)} disabled={isLoading}>Trở lại</Button>
                    <Button 
                        onClick={handleCancelAppointment} 
                        color="error" 
                        variant="contained" 
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Xác nhận hủy'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Reschedule Dialog */}
            <Dialog open={openReschedule} onClose={() => setOpenReschedule(false)}>
                <DialogTitle>Đổi lịch hẹn</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Chọn ngày và giờ mới cho cuộc hẹn với {appointment.patientName}.
                    </DialogContentText>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                id="new-date"
                                label="Ngày hẹn mới"
                                type="date"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={rescheduleDate}
                                onChange={(e) => setRescheduleDate(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                id="new-time"
                                label="Thời gian mới"
                                type="time"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={rescheduleTime}
                                onChange={(e) => setRescheduleTime(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="reschedule-reason"
                                label="Lý do đổi lịch (sẽ thông báo đến bệnh nhân)"
                                type="text"
                                fullWidth
                                multiline
                                rows={2}
                                variant="outlined"
                                value={rescheduleReason}
                                onChange={(e) => setRescheduleReason(e.target.value)}
                                required
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenReschedule(false)} disabled={isLoading}>Hủy bỏ</Button>
                    <Button 
                        onClick={handleRescheduleAppointment} 
                        color="primary" 
                        variant="contained" 
                        disabled={isLoading || !rescheduleDate || !rescheduleTime || !rescheduleReason}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Xác nhận đổi lịch'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notes Dialog */}
            <Dialog open={openNotes} onClose={() => setOpenNotes(false)}>
                <DialogTitle>Chỉnh sửa ghi chú</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="notes"
                        label="Ghi chú về bệnh nhân"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenNotes(false)} disabled={isLoading}>Hủy bỏ</Button>
                    <Button onClick={handleSaveNotes} color="primary" variant="contained" disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} /> : 'Lưu ghi chú'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

ViewAppointmentDetailComponent.propTypes = {
    appointment: PropTypes.shape({
        id: PropTypes.number.isRequired,
        patientName: PropTypes.string.isRequired,
        patientAge: PropTypes.number.isRequired,
        patientGender: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
        duration: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
        reason: PropTypes.string,
        notes: PropTypes.string,
        medicalHistory: PropTypes.string,
        contactNumber: PropTypes.string,
        email: PropTypes.string,
        cancelReason: PropTypes.string,
        rescheduleReason: PropTypes.string
    }).isRequired,
    onCancel: PropTypes.func.isRequired,
    onReschedule: PropTypes.func.isRequired,
    onUpdateNotes: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
};

export default ViewAppointmentDetailComponent;
