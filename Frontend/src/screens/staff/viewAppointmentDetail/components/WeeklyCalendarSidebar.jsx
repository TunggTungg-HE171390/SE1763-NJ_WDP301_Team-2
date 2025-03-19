import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, List, ListItemButton, ListItemText, Divider } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const WeeklyCalendarSidebar = ({ weekDates, selectedDate, onSelectDate }) => {
    // Check if today is in the current week
    const today = new Date().toISOString().split('T')[0];
    const isToday = (date) => date === today;
    
    // Format date for display
    const formatDisplayDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' });
    };
    
    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                    Lịch tuần
                </Typography>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <List sx={{ p: 0 }}>
                {weekDates.map((dateInfo) => (
                    <ListItemButton
                        key={dateInfo.date}
                        selected={dateInfo.date === selectedDate}
                        onClick={() => onSelectDate(dateInfo.date)}
                        sx={{
                            borderRadius: 1,
                            mb: 1,
                            bgcolor: isToday(dateInfo.date) ? 'primary.50' : 'transparent',
                            border: isToday(dateInfo.date) ? '1px solid' : 'none',
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
                                    <Typography variant="body2" fontWeight={500}>
                                        {dateInfo.dayName}
                                    </Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        {dateInfo.dayNumber}
                                    </Typography>
                                </Box>
                            }
                            secondary={formatDisplayDate(dateInfo.date)}
                            primaryTypographyProps={{ component: 'div' }}
                        />
                    </ListItemButton>
                ))}
            </List>
        </>
    );
};

WeeklyCalendarSidebar.propTypes = {
    weekDates: PropTypes.arrayOf(
        PropTypes.shape({
            date: PropTypes.string.isRequired,
            dayName: PropTypes.string.isRequired,
            dayNumber: PropTypes.number.isRequired
        })
    ).isRequired,
    selectedDate: PropTypes.string,
    onSelectDate: PropTypes.func.isRequired
};

export default WeeklyCalendarSidebar;
