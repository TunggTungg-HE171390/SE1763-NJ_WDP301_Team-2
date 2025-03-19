import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ViewAppointmentDetailComponent from './components/viewAppointmentDetail-component';
import WeeklyCalendarSidebar from './components/WeeklyCalendarSidebar';
import DailyAppointmentsList from './components/DailyAppointmentsList';
import { 
    Container, 
    Paper, 
    Typography, 
    Box, 
    CircularProgress,
    Button,
    Alert,
    Snackbar,
    Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import appointmentApi from '../../../api/appointment.api';
import { useAuth } from '../../../components/auth/authContext'; // Updated import path

const ViewAppointmentDetail = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
    const { user } = useAuth(); // Get current user
    
    // State for weekly calendar
    const [weekDates, setWeekDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [dailyAppointments, setDailyAppointments] = useState([]);

    // Check if user is authorized (psychologist or staff)
    useEffect(() => {
        // Redirect patients to the patient version of appointment detail
        if (user && user.role === 'patient') {
            navigate(`/patient/view-appointment-detail/${appointmentId}`);
        }
    }, [user, appointmentId, navigate]);

    // Generate week dates based on the appointment date
    useEffect(() => {
        if (appointment) {
            const appointmentDate = new Date(appointment.date);
            const currentWeekDates = getWeekDates(appointmentDate);
            setWeekDates(currentWeekDates);
            setSelectedDate(appointmentDate.toISOString().split('T')[0]);
        }
    }, [appointment]);

    // Fetch daily appointments when selected date changes
    useEffect(() => {
        if (selectedDate) {
            fetchDailyAppointments(selectedDate);
        }
    }, [selectedDate]);

    // Generate array of dates for the week containing the given date
    const getWeekDates = (date) => {
        const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday
        
        const monday = new Date(date);
        monday.setDate(diff);
        
        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(monday);
            currentDate.setDate(monday.getDate() + i);
            weekDates.push({
                date: currentDate.toISOString().split('T')[0],
                dayName: currentDate.toLocaleDateString('vi-VN', { weekday: 'short' }),
                dayNumber: currentDate.getDate()
            });
        }
        
        return weekDates;
    };

    // Fetch appointments for a specific date
    const fetchDailyAppointments = async (date) => {
        try {
            setLoading(true);
            const appointments = await appointmentApi.getAppointmentsByDate(date);
            setDailyAppointments(appointments);
        } catch (err) {
            console.error('Error fetching daily appointments:', err);
            setToast({
                open: true,
                message: 'Không thể tải danh sách cuộc hẹn trong ngày',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle date selection from sidebar
    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    // Handle appointment selection from daily list
    const handleAppointmentSelect = (appointmentId) => {
        navigate(`/psychologist/view-appointment-detail/${appointmentId}`);
    };

    useEffect(() => {
        const fetchAppointmentDetail = async () => {
            if (!appointmentId) return;
            
            setLoading(true);
            try {
                const data = await appointmentApi.getAppointmentById(appointmentId);
                if (data) {
                    setAppointment(data);
                    setError(null);
                    
                    // Set week dates based on appointment date
                    const appointmentDate = new Date(data.date);
                    const currentWeekDates = getWeekDates(appointmentDate);
                    setWeekDates(currentWeekDates);
                    setSelectedDate(appointmentDate.toISOString().split('T')[0]);
                } else {
                    setError("Không tìm thấy thông tin cuộc hẹn");
                }
            } catch (err) {
                console.error("Error fetching appointment:", err);
                setError(err.message || "Có lỗi xảy ra khi lấy thông tin cuộc hẹn");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointmentDetail();
    }, [appointmentId]);

    const handleCancelAppointment = async (reason) => {
        try {
            setLoading(true);
            const updatedAppointment = await appointmentApi.cancelAppointment(appointmentId, reason);
            
            // Update local state
            setAppointment(updatedAppointment);
            
            // Refresh daily appointments
            fetchDailyAppointments(selectedDate);
            
            setToast({
                open: true,
                message: 'Cuộc hẹn đã được hủy thành công',
                severity: 'success'
            });
        } catch (err) {
            console.error("Error cancelling appointment:", err);
            setToast({
                open: true,
                message: err.message || 'Có lỗi xảy ra khi hủy cuộc hẹn',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRescheduleAppointment = async (newDate, newTime, reason) => {
        try {
            setLoading(true);
            const updatedAppointment = await appointmentApi.rescheduleAppointment(appointmentId, newDate, newTime, reason);
            
            // Update local state
            setAppointment(updatedAppointment);
            
            // Refresh daily appointments
            fetchDailyAppointments(selectedDate);
            
            setToast({
                open: true,
                message: 'Cuộc hẹn đã được đổi lịch thành công',
                severity: 'success'
            });
        } catch (err) {
            console.error("Error rescheduling appointment:", err);
            setToast({
                open: true,
                message: err.message || 'Có lỗi xảy ra khi đổi lịch cuộc hẹn',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateNotes = async (notes) => {
        try {
            setLoading(true);
            const updatedAppointment = await appointmentApi.updateNotes(appointmentId, notes);
            
            // Update local state
            setAppointment(updatedAppointment);
            
            setToast({
                open: true,
                message: 'Ghi chú đã được cập nhật',
                severity: 'success'
            });
        } catch (err) {
            console.error("Error updating notes:", err);
            setToast({
                open: true,
                message: err.message || 'Có lỗi xảy ra khi cập nhật ghi chú',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmAppointment = async () => {
        try {
            setLoading(true);
            const updatedAppointment = await appointmentApi.confirmAppointment(appointmentId);
            
            // Update local state
            setAppointment(updatedAppointment);
            
            // Refresh daily appointments
            fetchDailyAppointments(selectedDate);
            
            setToast({
                open: true,
                message: 'Cuộc hẹn đã được xác nhận',
                severity: 'success'
            });
        } catch (err) {
            console.error("Error confirming appointment:", err);
            setToast({
                open: true,
                message: err.message || 'Có lỗi xảy ra khi xác nhận cuộc hẹn',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading && !appointment) {
        return (
            <Container maxWidth="lg" sx={{ mt: 12, mb: 4, textAlign: 'center' }}>
                <CircularProgress size={40} />
                <Typography variant="h5" sx={{ mt: 2 }}>Đang tải thông tin cuộc hẹn...</Typography>
            </Container>
        );
    }

    if (error && !appointment) {
        return (
            <Container maxWidth="lg" sx={{ mt: 12, mb: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="error">{error}</Typography>
                <Button 
                    component={Link} 
                    to="/psychologist/view-schedule" 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 3 }}
                >
                    Quay lại danh sách cuộc hẹn
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 12, mb: 4 }}>
            <Box sx={{ mb: 3 }}>
                <Button 
                    component={Link} 
                    to="/psychologist/view-schedule" 
                    variant="outlined" 
                    startIcon={<ArrowBackIcon />}
                >
                    Quay lại lịch hẹn
                </Button>
            </Box>
            
            <Grid container spacing={2}>
                {/* Left Sidebar - Weekly Calendar */}
                <Grid item xs={12} md={2}>
                    <Paper elevation={2} sx={{ height: '100%', p: 2 }}>
                        <WeeklyCalendarSidebar 
                            weekDates={weekDates} 
                            selectedDate={selectedDate} 
                            onSelectDate={handleDateSelect}
                        />
                    </Paper>
                </Grid>
                
                {/* Main Content - Appointment Details */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight={600} gutterBottom>
                            Chi tiết cuộc hẹn
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Thông tin chi tiết về cuộc hẹn với bệnh nhân
                        </Typography>
                        {appointment && (
                            <ViewAppointmentDetailComponent 
                                appointment={appointment}
                                onCancel={handleCancelAppointment}
                                onReschedule={handleRescheduleAppointment}
                                onUpdateNotes={handleUpdateNotes}
                                onConfirm={handleConfirmAppointment}
                                isLoading={loading}
                            />
                        )}
                    </Paper>
                </Grid>
                
                {/* Right Sidebar - Daily Appointments */}
                <Grid item xs={12} md={3}>
                    <Paper elevation={2} sx={{ height: '100%', p: 2 }}>
                        <DailyAppointmentsList 
                            date={selectedDate}
                            appointments={dailyAppointments}
                            currentAppointmentId={Number(appointmentId)}
                            onSelectAppointment={handleAppointmentSelect}
                        />
                    </Paper>
                </Grid>
            </Grid>
            
            <Snackbar 
                open={toast.open} 
                autoHideDuration={6000} 
                onClose={() => setToast({...toast, open: false})}
            >
                <Alert 
                    onClose={() => setToast({...toast, open: false})} 
                    severity={toast.severity} 
                    sx={{ width: '100%' }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ViewAppointmentDetail;
