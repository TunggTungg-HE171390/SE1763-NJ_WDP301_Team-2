import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Alert } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const ViewScheduleCalendar = ({ 
    schedules, 
    initialView = 'dayGridMonth', 
    initialDate = new Date(), 
    psychologist,
    showAvailabilityStatus = false
}) => {
    const navigate = useNavigate();
    const calendarRef = useRef(null);
    
    // Ensure schedules is always an array and has required properties
    const validSchedules = Array.isArray(schedules) ? schedules.filter(Boolean) : [];
    
    // Transform schedules data for FullCalendar
    const events = validSchedules
        .filter(schedule => schedule && schedule.date && schedule.time)
        .map(schedule => {
            try {
                return {
                    id: String(schedule.id),
                    title: showAvailabilityStatus 
                        ? (schedule.isBooked ? 'Đã đặt' : 'Lịch trống') 
                        : (schedule.patientName || 'Cuộc hẹn'),
                    start: `${schedule.date}T${convertTimeToISO(schedule.time)}`,
                    end: calculateEndTime(schedule.date, schedule.time, schedule.duration),
                    extendedProps: {
                        patientName: schedule.patientName,
                        appointmentId: schedule.id,
                        status: schedule.status,
                        isBooked: schedule.isBooked
                    },
                    backgroundColor: showAvailabilityStatus 
                        ? getAvailabilityColor(schedule.isBooked)
                        : getEventColor(schedule.status),
                    borderColor: showAvailabilityStatus 
                        ? getAvailabilityColor(schedule.isBooked)
                        : getEventColor(schedule.status)
                };
            } catch (error) {
                console.error("Error processing schedule item:", error, schedule);
                return null;
            }
        })
        .filter(Boolean); // Remove any null items

    // Function to determine event color based on status
    function getEventColor(status) {
        switch (status) {
            case 'confirmed': return '#4CAF50'; // green
            case 'pending': return '#FFC107'; // amber
            case 'cancelled': return '#F44336'; // red
            case 'completed': return '#2196F3'; // blue
            default: return '#3788d8'; // default blue
        }
    }

    // Function to determine event color based on availability
    function getAvailabilityColor(isBooked) {
        return isBooked ? '#FF9800' : '#4CAF50'; // Orange if booked, green if available
    }

    // Function to convert time from format like "10:00 AM" to ISO format like "10:00:00"
    function convertTimeToISO(timeStr) {
        try {
            if (!timeStr) return "00:00:00";
            
            if (timeStr.includes('T') && timeStr.includes('Z')) {
                // It's already an ISO string
                const date = new Date(timeStr);
                return date.toTimeString().split(' ')[0];
            }
            
            let hours, minutes, period;
            
            if (timeStr.includes('AM') || timeStr.includes('PM')) {
                // Format: "10:00 AM"
                let [time, ampm] = timeStr.split(' ');
                [hours, minutes] = time.split(':').map(Number);
                period = ampm;
            } else {
                // Format: "10:00" (24-hour)
                [hours, minutes] = timeStr.split(':').map(Number);
                period = hours >= 12 ? 'PM' : 'AM';
            }
            
            // Convert to 24-hour format
            if (period === 'PM' && hours < 12) {
                hours += 12;
            } else if (period === 'AM' && hours === 12) {
                hours = 0;
            }
            
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
        } catch (error) {
            console.error("Error converting time format:", error, timeStr);
            return "00:00:00"; // Return default value on error
        }
    }

    // Function to calculate end time (considering duration if available)
    function calculateEndTime(date, timeStr, durationMinutes = 60) {
        try {
            if (!date || !timeStr) return "";
            
            const startTime = convertTimeToISO(timeStr);
            const [hours, minutes, seconds] = startTime.split(':').map(Number);
            
            // Calculate end time by adding duration
            const startDate = new Date(`2000-01-01T${startTime}`);
            const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
            const endHours = endDate.getHours().toString().padStart(2, '0');
            const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
            
            return `${date}T${endHours}:${endMinutes}:00`;
        } catch (error) {
            console.error("Error calculating end time:", error);
            return ""; // Return empty string on error
        }
    }

    const handleEventClick = (clickInfo) => {
        // For availability slots, we might handle differently
        if (showAvailabilityStatus) {
            const slotId = clickInfo.event.id;
            const isBooked = clickInfo.event.extendedProps.isBooked;
            
            // You could add different behavior here based on whether the slot is booked or not
            if (isBooked) {
                // Navigate to appointment detail (if we have a reference to the appointment)
                const appointmentId = clickInfo.event.extendedProps.appointmentId;
                if (appointmentId) {
                    const basePath = psychologist ? '/staff' : '/psychologist';
                    navigate(`${basePath}/view-appointment-detail/${appointmentId}`);
                } else {
                    alert('This slot is booked but appointment details are not available.');
                }
            } else {
                // For available slots, you could navigate to a booking page or show info
                alert('This time slot is available for booking.');
            }
            return;
        }
        
        // Original event click handler for regular appointments
        const appointmentId = clickInfo.event.extendedProps.appointmentId || clickInfo.event.id;
        const basePath = psychologist ? '/staff' : '/psychologist';
        navigate(`${basePath}/view-appointment-detail/${appointmentId}`);
    };

    // Create a title based on the psychologist prop
    const calendarTitle = psychologist 
        ? `Lịch hẹn của ${psychologist.fullname || 'Chuyên gia'}`
        : 'Lịch hẹn của bạn';

    return (
        <Card elevation={2}>
            <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    {calendarTitle}
                </Typography>
                <Box sx={{ height: 700 }}>
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        initialView={initialView}
                        initialDate={initialDate}
                        editable={false}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        weekends={true}
                        events={events}
                        eventClick={handleEventClick}
                        eventTimeFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            meridiem: true
                        }}
                        allDaySlot={false}
                        slotMinTime="08:00:00"
                        slotMaxTime="20:00:00"
                        height="100%"
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

ViewScheduleCalendar.propTypes = {
    schedules: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            date: PropTypes.string.isRequired,
            time: PropTypes.string.isRequired,
            patientName: PropTypes.string,
            isBooked: PropTypes.bool
        })
    ).isRequired,
    initialView: PropTypes.string,
    initialDate: PropTypes.instanceOf(Date),
    psychologist: PropTypes.object,
    showAvailabilityStatus: PropTypes.bool
};

export default ViewScheduleCalendar;