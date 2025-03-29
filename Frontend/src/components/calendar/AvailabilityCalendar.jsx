import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, FormControl, 
  InputLabel, Select, MenuItem, Chip
} from '@mui/material';
import { format, isWeekend, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Calendar component that displays availability slots
 * 
 * @param {Object} props
 * @param {Date} props.currentDate - Current displayed date
 * @param {Array} props.dates - Array of dates to display
 * @param {Object} props.availableSlots - Object with slots grouped by date
 * @param {Function} props.onSlotClick - Function called when a slot is clicked
 * @param {string} props.timeSlotFilter - Filter for time slots (all, available, booked)
 * @param {Function} props.onChangeTimeSlotFilter - Handler for filter change
 */
const AvailabilityCalendar = ({ 
  currentDate, 
  dates, 
  availableSlots = {},
  onSlotClick,
  timeSlotFilter = 'all',
  onChangeTimeSlotFilter = () => {}
}) => {
  const today = new Date();

  // Get slots for a specific date
  const getSlotsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return availableSlots[dateStr] || [];
  };

  // Filter slots based on selection
  const filterSlots = (slots) => {
    if (timeSlotFilter === 'all') return slots;
    if (timeSlotFilter === 'available') return slots.filter(slot => !slot.isBooked);
    if (timeSlotFilter === 'booked') return slots.filter(slot => slot.isBooked);
    return slots;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Lịch làm việc</Typography>
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="time-slot-filter-label">Hiển thị</InputLabel>
          <Select
            labelId="time-slot-filter-label"
            id="time-slot-filter"
            value={timeSlotFilter}
            label="Hiển thị"
            onChange={(e) => onChangeTimeSlotFilter(e.target.value)}
          >
            <MenuItem value="all">Tất cả khung giờ</MenuItem>
            <MenuItem value="available">Khung giờ trống</MenuItem>
            <MenuItem value="booked">Khung giờ đã đặt</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Grid container spacing={2}>
        {dates.map((date) => {
          const isToday = isSameDay(date, today);
          const isWeekendDay = isWeekend(date);
          const slots = getSlotsForDate(date);
          const filteredSlots = filterSlots(slots);
          
          // Debug log
          console.log(`${format(date, 'dd/MM/yyyy')} - Found ${slots.length} slots, showing ${filteredSlots.length}`);
          
          return (
            <Grid item xs={12} md={4} lg={3} key={date.toString()}>
              <Paper 
                elevation={isToday ? 3 : 1}
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  border: isToday ? '1px solid #3788d8' : 'none',
                  backgroundColor: isWeekendDay ? '#f8f9fa' : 'white',
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    p: 1, 
                    textAlign: 'center',
                    backgroundColor: isToday ? '#3788d8' : (isWeekendDay ? '#f1f3f5' : '#f5f5f5'),
                    color: isToday ? 'white' : 'text.primary',
                    borderRadius: 1,
                    mb: 2
                  }}
                >
                  {format(date, 'EEEE, dd/MM', { locale: vi })}
                </Typography>
                
                {filteredSlots.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {filteredSlots.map((slot) => (
                      <Chip
                        key={slot.id}
                        label={`${format(slot.start, 'HH:mm')} - ${format(slot.end, 'HH:mm')}`}
                        color={slot.isBooked ? 'primary' : 'success'}
                        variant={slot.isBooked ? 'filled' : 'outlined'}
                        onClick={() => onSlotClick(slot)}
                        sx={{ maxWidth: '100%' }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography color="text.secondary" variant="body2">
                      {slots.length === 0 
                        ? 'Không có lịch làm việc' 
                        : 'Không có khung giờ phù hợp với bộ lọc'}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default AvailabilityCalendar;
