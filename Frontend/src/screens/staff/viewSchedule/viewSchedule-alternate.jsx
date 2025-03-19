import React, { useEffect, useState } from 'react';
import ViewScheduleCalendar from './components/viewSchedule-calendar';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import dayjs from 'dayjs';
import scheduleApi from '../../../api/schedule.api';

// Import dayjs plugins for date manipulations
import isBetween from 'dayjs/plugin/isBetween';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekday from 'dayjs/plugin/weekday';

// Extend dayjs with plugins
dayjs.extend(isBetween);
dayjs.extend(weekOfYear);
dayjs.extend(weekday);

const ViewSchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for time period selection
    const [timePeriod, setTimePeriod] = useState('month'); // Default to month view
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [customPeriod, setCustomPeriod] = useState(false);
    
    // For manual date input
    const [startDateStr, setStartDateStr] = useState(dayjs().format('YYYY-MM-DD'));
    const [endDateStr, setEndDateStr] = useState(dayjs().format('YYYY-MM-DD'));

    // Initialize date range based on default period (month)
    useEffect(() => {
        if (!customPeriod) {
            updateDateRangeByPeriod(timePeriod);
        }
    }, [timePeriod]);

    // Update date range when period changes
    const updateDateRangeByPeriod = (period) => {
        const today = dayjs();
        
        switch(period) {
            case 'week':
                setStartDate(today.startOf('week'));
                setEndDate(today.endOf('week'));
                break;
            case 'month':
                setStartDate(today.startOf('month'));
                setEndDate(today.endOf('month'));
                break;
            case 'three-months':
                setStartDate(today);
                setEndDate(today.add(3, 'month'));
                break;
            case 'custom':
                setCustomPeriod(true);
                // Keep current dates for custom selection
                break;
            default:
                setStartDate(today.startOf('month'));
                setEndDate(today.endOf('month'));
        }
        
        // Update string representations
        setStartDateStr(startDate.format('YYYY-MM-DD'));
        setEndDateStr(endDate.format('YYYY-MM-DD'));
    };

    // Update dayjs objects when string inputs change
    useEffect(() => {
        if (customPeriod) {
            try {
                setStartDate(dayjs(startDateStr));
                setEndDate(dayjs(endDateStr));
            } catch (e) {
                console.error("Invalid date format:", e);
            }
        }
    }, [startDateStr, endDateStr, customPeriod]);

    // Fetch schedules based on selected date range
    useEffect(() => {
        // ...existing fetch code...
    }, [startDate, endDate]);

    // Handle custom date range
    const handleApplyCustomRange = () => {
        // Validate that end date is after start date
        if (endDate.isBefore(startDate)) {
            setError("Ngày kết thúc phải sau ngày bắt đầu");
            return;
        }
        
        setCustomPeriod(true);
        setTimePeriod('custom');
    };

    // Reset to predefined periods
    const handlePeriodChange = (event) => {
        const newPeriod = event.target.value;
        setTimePeriod(newPeriod);
        
        if (newPeriod !== 'custom') {
            setCustomPeriod(false);
            updateDateRangeByPeriod(newPeriod);
        }
    };

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
                
                {/* Time period selection - with manual date input */}
                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="time-period-label">Khoảng thời gian</InputLabel>
                                <Select
                                    labelId="time-period-label"
                                    id="time-period-select"
                                    value={timePeriod}
                                    label="Khoảng thời gian"
                                    onChange={handlePeriodChange}
                                >
                                    <MenuItem value="week">Tuần này</MenuItem>
                                    <MenuItem value="month">Tháng này</MenuItem>
                                    <MenuItem value="three-months">3 tháng tới</MenuItem>
                                    <MenuItem value="custom">Tùy chỉnh</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="Từ ngày"
                                type="date"
                                value={startDateStr}
                                onChange={(e) => setStartDateStr(e.target.value)}
                                disabled={!customPeriod}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="Đến ngày"
                                type="date"
                                value={endDateStr}
                                onChange={(e) => setEndDateStr(e.target.value)}
                                disabled={!customPeriod}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} md={3}>
                            <Button 
                                variant="contained" 
                                onClick={handleApplyCustomRange}
                                disabled={!customPeriod}
                                fullWidth
                                sx={{ height: '56px' }} // Match height with other inputs
                            >
                                Áp dụng
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
                
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <ViewScheduleCalendar 
                        schedules={schedules} 
                        initialView={timePeriod === 'week' ? 'timeGridWeek' : 'dayGridMonth'}
                        initialDate={startDate.toDate()}
                    />
                )}
            </Paper>
        </Container>
    );
};

export default ViewSchedule;
