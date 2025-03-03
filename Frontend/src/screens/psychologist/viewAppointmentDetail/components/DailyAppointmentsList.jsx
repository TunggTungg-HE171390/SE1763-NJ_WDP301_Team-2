import React from 'react';
import PropTypes from 'prop-types';
import { 
    Box, 
    Typography, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemText, 
    Divider, 
    Chip,
    Paper
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventNoteIcon from '@mui/icons-material/EventNote';
import TodayIcon from '@mui/icons-material/Today';

const DailyAppointmentsList = ({ date, appointments, currentAppointmentId, onSelectAppointment }) => {
    // Format date to display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const dateObj = new Date(dateString);
        return dateObj.toLocaleDateString('vi-VN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };
    
    // Sort appointments by time
    const sortedAppointments = [...appointments].sort((a, b) => {
        return a.time.localeCompare(b.time);
    });
    
    const getStatusColor = (status) => {
        switch(status.toLowerCase()) {
            case 'confirmed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'error';
            case 'rescheduled': return 'info';
            default: return 'default';
        }
    };

    // Group appointments by time slots (morning, afternoon, evening)
    const morningAppointments = sortedAppointments.filter(app => {
        const hour = parseInt(app.time.split(':')[0]);
        return hour < 12;
    });

    const afternoonAppointments = sortedAppointments.filter(app => {
        const hour = parseInt(app.time.split(':')[0]);
        return hour >= 12 && hour < 17;
    });

    const eveningAppointments = sortedAppointments.filter(app => {
        const hour = parseInt(app.time.split(':')[0]);
        return hour >= 17;
    });

    const renderAppointmentGroup = (title, icon, appointments) => (
        <>
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mt: 2, 
                mb: 1, 
                backgroundColor: 'primary.50', 
                p: 1, 
                borderRadius: 1 
            }}>
                {icon}
                <Typography variant="subtitle1" fontWeight="bold" sx={{ ml: 1 }}>
                    {title}
                </Typography>
            </Box>
            
            {appointments.length > 0 ? (
                <List sx={{ p: 0 }}>
                    {appointments.map((appointment) => (
                        <ListItem 
                            key={appointment.id} 
                            disablePadding 
                            sx={{ mb: 1 }}
                        >
                            <ListItemButton 
                                onClick={() => onSelectAppointment(appointment.id)}
                                selected={appointment.id === currentAppointmentId}
                                sx={{
                                    borderRadius: 1,
                                    border: appointment.id === currentAppointmentId ? '1px solid' : 'none',
                                    borderColor: 'primary.main',
                                    '&.Mui-selected': {
                                        bgcolor: 'primary.light',
                                        '&:hover': {
                                            bgcolor: 'primary.main',
                                            color: 'white'
                                        }
                                    }
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                                                <Typography variant="body2">
                                                    {appointment.time}
                                                </Typography>
                                            </Box>
                                            <Chip 
                                                label={appointment.status} 
                                                color={getStatusColor(appointment.status)} 
                                                size="small"
                                                sx={{ fontSize: '0.7rem' }}
                                            />
                                        </Box>
                                    }
                                    secondary={appointment.patientName}
                                    primaryTypographyProps={{ component: 'div' }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2, mb: 2 }}>
                    Không có cuộc hẹn
                </Typography>
            )}
        </>
    );
    
    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventNoteIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                    Lịch hẹn trong ngày
                </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TodayIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle1" fontWeight={500}>
                    {date ? formatDate(date) : 'Chọn một ngày'}
                </Typography>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            {sortedAppointments.length > 0 ? (
                <>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        mb: 1 
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            Tổng số cuộc hẹn: {sortedAppointments.length}
                        </Typography>
                        <Box>
                            <Chip 
                                label={`${morningAppointments.length} Sáng`} 
                                size="small" 
                                sx={{ mr: 0.5, bgcolor: 'info.50' }} 
                            />
                            <Chip 
                                label={`${afternoonAppointments.length} Chiều`} 
                                size="small" 
                                sx={{ mr: 0.5, bgcolor: 'warning.50' }} 
                            />
                            <Chip 
                                label={`${eveningAppointments.length} Tối`} 
                                size="small" 
                                sx={{ bgcolor: 'error.50' }} 
                            />
                        </Box>
                    </Box>
                    
                    <Paper 
                        variant="outlined" 
                        sx={{ 
                            mt: 2, 
                            p: 1, 
                            maxHeight: 400, 
                            overflow: 'auto',
                            boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)'
                        }}
                    >
                        {renderAppointmentGroup("Sáng", <AccessTimeIcon color="info" />, morningAppointments)}
                        {renderAppointmentGroup("Chiều", <AccessTimeIcon color="warning" />, afternoonAppointments)}
                        {renderAppointmentGroup("Tối", <AccessTimeIcon color="error" />, eveningAppointments)}
                    </Paper>
                </>
            ) : (
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    py: 5 
                }}>
                    <EventNoteIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary" align="center">
                        Không có cuộc hẹn nào trong ngày này
                    </Typography>
                </Box>
            )}
        </>
    );
};

DailyAppointmentsList.propTypes = {
    date: PropTypes.string,
    appointments: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            time: PropTypes.string.isRequired,
            patientName: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired
        })
    ),
    currentAppointmentId: PropTypes.number,
    onSelectAppointment: PropTypes.func.isRequired
};

DailyAppointmentsList.defaultProps = {
    appointments: [],
    currentAppointmentId: null
};

export default DailyAppointmentsList;
