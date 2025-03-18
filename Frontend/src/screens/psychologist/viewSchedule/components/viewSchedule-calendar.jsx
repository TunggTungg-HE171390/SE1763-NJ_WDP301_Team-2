import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Box } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const ViewScheduleCalendar = ({ schedules, initialView = 'dayGridMonth', initialDate = new Date() }) => {
    const navigate = useNavigate();
    const calendarRef = useRef(null);
    
    // Transform schedules data for FullCalendar
    const events = schedules.map(schedule => ({
        id: schedule.id.toString(),
        title: `${schedule.patientName}`,
        start: `${schedule.date}T${convertTimeToISO(schedule.time)}`,
        end: calculateEndTime(schedule.date, schedule.time),
        extendedProps: {
            patientName: schedule.patientName
        },
        backgroundColor: '#3788d8',
        borderColor: '#3788d8'
    }));

    // Function to convert time from format like "10:00 AM" to ISO format like "10:00:00"
    function convertTimeToISO(timeStr) {
        let [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        
        hours = parseInt(hours);
        
        // Convert to 24-hour format
        if (period === 'PM' && hours < 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }
        
        return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
    }

    // Function to calculate end time (assuming 1 hour appointment)
    function calculateEndTime(date, timeStr) {
        let [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        
        hours = parseInt(hours);
        
        // Convert to 24-hour format
        if (period === 'PM' && hours < 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }
        
        // Add 1 hour for appointment duration
        hours += 1;
        
        return `${date}T${hours.toString().padStart(2, '0')}:${minutes}:00`;
    }

    const handleEventClick = (clickInfo) => {
        // Navigate to schedule detail page when an event is clicked
        navigate(`/psychologist/view-schedule-detail/${clickInfo.event.id}`);
    };

    return (
        <Card elevation={2}>
            <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Lịch hẹn của bạn
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
            id: PropTypes.number.isRequired,
            date: PropTypes.string.isRequired,
            time: PropTypes.string.isRequired,
            patientName: PropTypes.string.isRequired,
        })
    ).isRequired,
    initialView: PropTypes.string,
    initialDate: PropTypes.instanceOf(Date)
};

export default ViewScheduleCalendar;