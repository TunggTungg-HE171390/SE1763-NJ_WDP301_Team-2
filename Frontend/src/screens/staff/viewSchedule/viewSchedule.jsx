import React, { useEffect, useState } from 'react';
import ViewScheduleCalendar from '../../../screens/psychologist/viewSchedule/components/viewSchedule-calendar';
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
  TextField,
  Avatar,
  Chip,
  Divider,
  Autocomplete,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { useSearchParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  NavigateNext as NavigateNextIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import scheduleApi from '../../../api/schedule.api';
import { getAllPsychologists, getPsychologist } from '../../../api/psychologist.api';
import PropTypes from 'prop-types'; // Add this import for PropTypes
import { debugObjectStructure } from '../../../utils/debugHelper';
import { analyzeApiResponse, extractResponseData } from '../../../utils/apiResponseLogger';
import { extractArrayData, processPsychologistData } from '../../../utils/dataExtractor';

// Import dayjs plugins for date manipulations
import isBetween from 'dayjs/plugin/isBetween';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekday from 'dayjs/plugin/weekday';

// Extend dayjs with plugins
dayjs.extend(isBetween);
dayjs.extend(weekOfYear);
dayjs.extend(weekday);

const ViewSchedule = ({ userRole = "staff" }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingPsychologists, setLoadingPsychologists] = useState(true);
    const [error, setError] = useState(null);
    
    // State for psychologist selection
    const [psychologists, setPsychologists] = useState([]);
    const [selectedPsychologist, setSelectedPsychologist] = useState(null);
    
    // State for time period selection
    const [timePeriod, setTimePeriod] = useState('month'); // Default to month view
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [customPeriod, setCustomPeriod] = useState(false);
    
    // For date input using native controls
    const [startDateStr, setStartDateStr] = useState(dayjs().format('YYYY-MM-DD'));
    const [endDateStr, setEndDateStr] = useState(dayjs().format('YYYY-MM-DD'));

    // Load psychologists on component mount
    useEffect(() => {
        const loadData = async () => {
            // Only fetch psychologists list in staff view
            if (userRole === "staff") {
                await fetchPsychologists();
            }
        };
        
        loadData();
    }, [userRole]);
    
    // Function to fetch psychologists with improved handling
    const fetchPsychologists = async () => {
        setLoadingPsychologists(true);
        try {
            console.log("Fetching psychologists for schedule view...");
            const response = await getAllPsychologists();
            
            // Analyze the response structure
            analyzeApiResponse(response, "ViewSchedule Psychologists API Response");
            
            // Extract and process the data
            const rawData = extractArrayData(response);
            const processedData = processPsychologistData(rawData);
            
            if (processedData.length > 0) {
                setPsychologists(processedData);
                
                // Check URL for doctor ID
                const doctorId = searchParams.get('doctor');
                
                if (doctorId) {
                    // Try to find the doctor in the fetched list
                    const doctorFromList = processedData.find(p => p._id === doctorId);
                    
                    if (doctorFromList) {
                        setSelectedPsychologist(doctorFromList);
                    } else {
                        // If not in the list, fetch the individual doctor
                        try {
                            const doctorResponse = await getPsychologist(doctorId);
                            
                            // Extract and process single doctor data
                            const singleDoctorData = processPsychologistData([extractArrayData(doctorResponse)[0] || doctorResponse.data])[0];
                            
                            if (singleDoctorData) {
                                setSelectedPsychologist(singleDoctorData);
                            }
                        } catch (err) {
                            console.error("Could not fetch specific doctor:", err);
                        }
                    }
                } else if (processedData.length > 0) {
                    // Default to first psychologist if none is specified
                    setSelectedPsychologist(processedData[0]);
                }
                
                setError(null); // Clear any previous errors
            } else {
                console.log("No psychologists found after processing");
            }
        } catch (err) {
            console.error("Error fetching psychologists:", err);
            setPsychologists([]);
            setError("Không thể tải danh sách chuyên gia tâm lý. Vui lòng thử lại sau.");
        } finally {
            setLoadingPsychologists(false);
        }
    };

    // Initialize date range based on default period (month)
    useEffect(() => {
        if (!customPeriod) {
            updateDateRangeByPeriod(timePeriod);
        }
    }, [timePeriod]);

    // Update date range when period changes
    const updateDateRangeByPeriod = (period) => {
        const today = dayjs();
        let newStartDate, newEndDate;
        
        switch(period) {
            case 'week':
                newStartDate = today.startOf('week');
                newEndDate = today.endOf('week');
                break;
            case 'month':
                newStartDate = today.startOf('month');
                newEndDate = today.endOf('month');
                break;
            case 'three-months':
                newStartDate = today;
                newEndDate = today.add(3, 'month');
                break;
            case 'custom':
                setCustomPeriod(true);
                return; // Don't update dates for custom selection
            default:
                newStartDate = today.startOf('month');
                newEndDate = today.endOf('month');
        }
        
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        
        // Update string representations for the input fields
        setStartDateStr(newStartDate.format('YYYY-MM-DD'));
        setEndDateStr(newEndDate.format('YYYY-MM-DD'));
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

    // Fetch schedules based on selected date range and psychologist
    useEffect(() => {
        const fetchSchedules = async () => {
            if (!startDate || !endDate) return;
            
            // For staff view, ensure we have a selected psychologist
            if (userRole === "staff" && !selectedPsychologist) {
                console.log("No psychologist selected yet, skipping schedule fetch");
                return;
            }
            
            setLoading(true);
            try {
                // Format dates for API
                const formattedStartDate = startDate.format('YYYY-MM-DD');
                const formattedEndDate = endDate.format('YYYY-MM-DD');
                
                let response;
                // For staff view, fetch schedules for the selected psychologist
                if (userRole === "staff" && selectedPsychologist) {
                    console.log(`Fetching schedules for psychologist ${selectedPsychologist._id} from ${formattedStartDate} to ${formattedEndDate}`);
                    response = await scheduleApi.getSchedulesByTimePeriodAndDoctor(
                        formattedStartDate, 
                        formattedEndDate, 
                        selectedPsychologist._id
                    );
                } else {
                    // For psychologist view, fetch their own schedules
                    console.log(`Fetching own schedules from ${formattedStartDate} to ${formattedEndDate}`);
                    response = await scheduleApi.getSchedulesByTimePeriod(
                        formattedStartDate, 
                        formattedEndDate
                    );
                }
                
                // Transform API response to fit the expected format for the calendar
                const transformedSchedules = transformSchedulesFromAPI(response);
                setSchedules(transformedSchedules);
                setError(null);
            } catch (err) {
                console.error("Error fetching schedules:", err);
                setError("Không thể tải danh sách lịch hẹn. Vui lòng thử lại sau.");
                setSchedules([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
    }, [startDate, endDate, selectedPsychologist, userRole]);
    
    // Function to transform API data to the format expected by the calendar
    const transformSchedulesFromAPI = (apiData) => {
        if (!apiData || !Array.isArray(apiData)) return [];
        
        return apiData.map((item, index) => ({
            id: item._id || item.id || index,
            date: formatDate(item.date), // Availability slots have a date field
            time: formatTime(item.startTime), // Use startTime from availability slot
            patientName: item.isBooked ? 'Đã đặt lịch' : 'Lịch trống', // Show if slot is booked or not
            duration: calculateDuration(item.startTime, item.endTime), // Calculate duration from start and end
            status: item.isBooked ? 'confirmed' : 'available', // For color coding
            isBooked: item.isBooked // Keep track of booking status
        }));
    };

    // Helper function to calculate duration in minutes between two time strings
    const calculateDuration = (startTime, endTime) => {
        try {
            const start = dayjs(startTime);
            const end = dayjs(endTime);
            return end.diff(start, 'minute');
        } catch (e) {
            console.error('Error calculating duration:', e);
            return 60; // Default to 60 minutes
        }
    };

    // Helper function to format date strings
    const formatDate = (dateInput) => {
        if (!dateInput) return '';
        
        // If it's already a YYYY-MM-DD format, return as is
        if (typeof dateInput === 'string' && dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return dateInput;
        }
        
        try {
            return dayjs(dateInput).format('YYYY-MM-DD');
        } catch (e) {
            console.error('Error formatting date:', e);
            return '';
        }
    };
    
    // Helper function to format time strings
    const formatTime = (timeInput) => {
        if (!timeInput) return '';
        
        try {
            // If it's a Date object or ISO string with time
            const time = dayjs(timeInput);
            
            // Check if it's a valid time
            if (time.isValid()) {
                const hour = time.hour();
                const minute = time.minute();
                const period = hour >= 12 ? 'PM' : 'AM';
                const displayHour = hour % 12 || 12; // Convert 0 to 12 for 12AM
                
                return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
            }
            
            // If it's already in the expected format like "10:00 AM"
            if (typeof timeInput === 'string' && 
                (timeInput.includes('AM') || timeInput.includes('PM'))) {
                return timeInput;
            }
            
            // For HH:MM format
            if (typeof timeInput === 'string' && timeInput.includes(':')) {
                const [hours, minutes] = timeInput.split(':').map(Number);
                const period = hours >= 12 ? 'PM' : 'AM';
                const displayHour = hours % 12 || 12;
                return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
            }
        } catch (e) {
            console.error('Error formatting time:', e);
        }
        
        return timeInput.toString();
    };

    // Handler for psychologist change
    const handlePsychologistChange = (event, newValue) => {
        if (newValue) {
            console.log("Changing selected psychologist to:", newValue);
            setSelectedPsychologist(newValue);
            
            // Update the URL to reflect the selected doctor
            const newURL = `${location.pathname}?doctor=${newValue._id}`;
            navigate(newURL, { replace: true });
        }
    };

    // Handle custom date range
    const handleApplyCustomRange = () => {
        // Validate that end date is after start date
        const start = dayjs(startDateStr);
        const end = dayjs(endDateStr);
        
        if (end.isBefore(start)) {
            setError("Ngày kết thúc phải sau ngày bắt đầu");
            return;
        }
        
        setStartDate(start);
        setEndDate(end);
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

    // Handle date input changes
    const handleStartDateChange = (e) => {
        setStartDateStr(e.target.value);
    };
    
    const handleEndDateChange = (e) => {
        setEndDateStr(e.target.value);
    };

    // Generate mock schedules for development/testing
    const generateMockSchedules = (startDateStr, endDateStr) => {
        const mockSchedules = [];
        const start = new Date(startDateStr);
        const end = new Date(endDateStr);
        const daysBetween = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        
        // Generate random appointments
        const appointmentCount = Math.min(daysBetween * 2, 20); // At most 2 per day, maximum 20
        
        for (let i = 1; i <= appointmentCount; i++) {
            const randomDayOffset = Math.floor(Math.random() * daysBetween);
            const appointmentDate = new Date(start);
            appointmentDate.setDate(start.getDate() + randomDayOffset);
            
            // Random hour between 8 AM and 5 PM
            const hour = Math.floor(Math.random() * 9) + 8;
            const minute = Math.random() > 0.5 ? '00' : '30';
            const period = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour > 12 ? hour - 12 : hour;
            
            mockSchedules.push({
                id: i,
                date: appointmentDate.toISOString().split('T')[0],
                time: `${displayHour}:${minute} ${period}`,
                patientName: getRandomName()
            });
        }
        
        return mockSchedules;
    };
    
    // Helper function to generate random names
    const getRandomName = () => {
        const firstNames = ['Anh', 'Bình', 'Cường', 'Dung', 'Hiếu', 'Lan', 'Minh', 'Nga', 'Phong', 'Quỳnh'];
        const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ'];
        
        return `${lastNames[Math.floor(Math.random() * lastNames.length)]} ${firstNames[Math.floor(Math.random() * firstNames.length)]}`;
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
            {/* Breadcrumbs Navigation */}
            <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center' }}>
                <Button 
                    startIcon={<ArrowBackIcon />}
                    onClick={() => {
                        if (userRole === "staff") {
                            navigate('/staff/manage-psychologists');
                        } else {
                            navigate(-1); // Go back to previous page
                        }
                    }}
                    sx={{ mr: 2 }}
                >
                    Quay lại
                </Button>
                
                <Breadcrumbs 
                    separator={<NavigateNextIcon fontSize="small" />} 
                    aria-label="breadcrumb"
                >
                    <MuiLink 
                        component={Link} 
                        to="/" 
                        underline="hover" 
                        color="inherit"
                    >
                        Trang chủ
                    </MuiLink>
                    
                    {userRole === "staff" && (
                        <MuiLink 
                            component={Link} 
                            to="/staff/manage-psychologists" 
                            underline="hover" 
                            color="inherit"
                        >
                            Quản lý chuyên gia tâm lý
                        </MuiLink>
                    )}
                    
                    <Typography color="text.primary">
                        {userRole === "staff" 
                            ? "Xem lịch làm việc" 
                            : "Lịch của tôi"
                        }
                    </Typography>
                </Breadcrumbs>
            </Paper>

            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                    {userRole === "staff" ? "Lịch hẹn của chuyên gia tâm lý" : "Lịch hẹn của bạn"}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {userRole === "staff" 
                        ? "Xem và quản lý các cuộc hẹn của chuyên gia tâm lý" 
                        : "Xem và quản lý các cuộc hẹn sắp tới với bệnh nhân của bạn"}
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}
                
                {/* Psychologist selector - only shown for staff */}
                {userRole === "staff" && (
                    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 2 }}>
                            Chọn chuyên gia tâm lý
                        </Typography>
                        <Box display="flex" alignItems="center">
                            <Autocomplete
                                options={psychologists}
                                getOptionLabel={(option) => option.fullname}
                                value={selectedPsychologist}
                                onChange={handlePsychologistChange}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        label="Chuyên gia tâm lý" 
                                        variant="outlined" 
                                    />
                                )}
                                sx={{ width: 300, mr: 2 }}
                                loading={loadingPsychologists}
                                loadingText="Đang tải..."
                                noOptionsText="Không có dữ liệu"
                            />
                            {selectedPsychologist && (
                                <Box display="flex" alignItems="center">
                                    <Avatar src={selectedPsychologist.avatar} alt={selectedPsychologist.fullname} sx={{ mr: 2 }} />
                                    <Box>
                                        <Typography variant="body1" fontWeight={500}>
                                            {selectedPsychologist.fullname}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {selectedPsychologist.specialization}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                )}
                
                <Divider sx={{ mb: 3 }} />
                
                {/* Time period selection - with native date inputs */}
                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 2 }}>
                        Chọn khoảng thời gian
                    </Typography>
                    
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
                                onChange={handleStartDateChange}
                                disabled={!customPeriod}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={{ '& input': { py: 1.5 } }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="Đến ngày"
                                type="date"
                                value={endDateStr}
                                onChange={handleEndDateChange}
                                disabled={!customPeriod}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={{ '& input': { py: 1.5 } }}
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
                        psychologist={userRole === "staff" ? selectedPsychologist : null} // Only pass psychologist info in staff view
                        showAvailabilityStatus={true} // New prop to indicate we're showing availability
                    />
                )}
            </Paper>
        </Container>
    );
};

ViewSchedule.propTypes = {
    userRole: PropTypes.string // "staff" or "psychologist"
};

export default ViewSchedule;