import React, { useEffect, useState } from 'react';
import ViewScheduleCalendar from './components/viewSchedule-calendar';
import { Container, Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import scheduleApi from '../../../api/schedule.api';

const ViewSchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSchedules = async () => {
            setLoading(true);
            try {
                const data = await scheduleApi.getSchedules();
                setSchedules(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching schedules:", err);
                setError("Không thể tải danh sách lịch hẹn. Vui lòng thử lại sau.");
                
                if (process.env.NODE_ENV === 'development') {
                    console.warn("Using mock data for development");
                    setSchedules([
                        {
                            id: 1,
                            date: '2023-10-15',
                            time: '10:00 AM',
                            patientName: 'John Doe'
                        },
                        {
                            id: 2,
                            date: '2023-10-16',
                            time: '2:30 PM',
                            patientName: 'Jane Smith'
                        },
                        {
                            id: 3,
                            date: '2023-10-17',
                            time: '9:15 AM',
                            patientName: 'Robert Johnson'
                        },
                        {
                            id: 4,
                            date: '2023-10-20',
                            time: '11:00 AM',
                            patientName: 'Maria Garcia'
                        },
                        {
                            id: 5,
                            date: '2023-10-22',
                            time: '3:00 PM',
                            patientName: 'David Brown'
                        },
                        {
                            id: 6,
                            date: '2023-10-23',
                            time: '10:30 AM',
                            patientName: 'Sarah Wilson'
                        },
                        {
                            id: 7,
                            date: '2023-10-25',
                            time: '4:15 PM',
                            patientName: 'Michael Taylor'
                        }
                    ]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                    Quản lý lịch hẹn
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Xem và quản lý các cuộc hẹn sắp tới với bệnh nhân của bạn
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}
                
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <ViewScheduleCalendar schedules={schedules} />
                )}
            </Paper>
        </Container>
    );
};

export default ViewSchedule;