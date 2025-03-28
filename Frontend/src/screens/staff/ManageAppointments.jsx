import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Tab, 
  Tabs, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Chip,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
  Tooltip,
  Divider,
  Card,
  CardContent,
  Badge,
  Grid,
  useTheme,
  useMediaQuery,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Person as PersonIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { getAllAppointments, updateAppointmentStatus } from '../../api/appointment.api';

const ManageAppointments = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Tab status groupings
  const statusGroups = [
    { label: 'Tất cả', statuses: [], count: 0 },
    { label: 'Đang chờ', statuses: ['Pending'], count: 0, color: 'warning' },
    { label: 'Đã xác nhận', statuses: ['Confirmed'], count: 0, color: 'info' },
    { label: 'Đã hoàn thành', statuses: ['Completed'], count: 0, color: 'success' },
    { label: 'Đổi lịch', statuses: ['Rescheduled'], count: 0, color: 'secondary' },
    { label: 'Đã hủy', statuses: ['Cancelled', 'No-show'], count: 0, color: 'error' }
  ];

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setIsRefreshing(true);
    try {
      const response = await getAllAppointments();
      if (response && response.data) {
        setAppointments(response.data);
        setFilteredAppointments(response.data);
        
        // Update counts for tabs
        statusGroups.forEach((group, index) => {
          if (index === 0) {
            // Total count for "All" tab
            group.count = response.data.length;
          } else {
            // Count for specific status groups
            group.count = response.data.filter(app => 
              group.statuses.includes(app.status)
            ).length;
          }
        });
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Không thể tải danh sách cuộc hẹn. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    filterAppointments();
  }, [activeTab, statusFilter, search, appointments]);

  const filterAppointments = () => {
    let filtered = [...appointments];
    
    // Apply tab filter
    if (activeTab > 0 && statusGroups[activeTab]) {
      const allowedStatuses = statusGroups[activeTab].statuses;
      filtered = filtered.filter(appointment => allowedStatuses.includes(appointment.status));
    }
    
    // Apply status filter if it's not 'all'
    if (statusFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === statusFilter);
    }
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(appointment => 
        (appointment.patient?.fullName || '').toLowerCase().includes(searchLower) ||
        (appointment.psychologist?.fullName || '').toLowerCase().includes(searchLower) ||
        appointment._id.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredAppointments(filtered);
  };

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0);
    // Reset additional filters when changing tabs
    setStatusFilter('all');
    setShowFilters(false);
  };

  const handleChangeStatusFilter = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenStatusDialog = (appointment, status) => {
    setCurrentAppointment(appointment);
    setNewStatus(status);
    setStatusNote('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentAppointment(null);
    setNewStatus('');
    setStatusNote('');
  };

  const handleUpdateStatus = async () => {
    if (!currentAppointment || !newStatus) return;
    
    setLoading(true);
    try {
      const response = await updateAppointmentStatus(
        currentAppointment._id, 
        { 
          status: newStatus, 
          note: statusNote,
          staffId: "staff-id-here" // Replace with actual staff ID from auth context
        }
      );
      
      if (response && response.data) {
        // Update the local state with the updated appointment
        const updatedAppointments = appointments.map(app => 
          app._id === currentAppointment._id ? response.data : app
        );
        setAppointments(updatedAppointments);
        
        setSuccess(`Cập nhật trạng thái thành công thành ${getStatusLabel(newStatus)}`);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error updating appointment status:', err);
      setError('Không thể cập nhật trạng thái. Vui lòng thử lại sau.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
      handleCloseDialog();
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'Pending': 'Đang chờ',
      'Confirmed': 'Đã xác nhận',
      'Completed': 'Đã hoàn thành',
      'Cancelled': 'Đã hủy',
      'Rescheduled': 'Đổi lịch',
      'No-show': 'Không đến'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'Pending': 'warning',
      'Confirmed': 'info',
      'Completed': 'success',
      'Cancelled': 'error',
      'Rescheduled': 'secondary',
      'No-show': 'default'
    };
    return colorMap[status] || 'default';
  };

  const formatDateTime = (dateTimeStr) => {
    try {
      const date = new Date(dateTimeStr);
      return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch (err) {
      return 'Invalid date';
    }
  };

  // Get displayed appointments based on pagination
  const displayedAppointments = filteredAppointments
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
      <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
        Quản lý lịch hẹn
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Xem và quản lý tất cả các lịch hẹn trong hệ thống.
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          {statusGroups.map((group, index) => (
            <Tab key={index} label={group.label} />
          ))}
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', mb: 3, gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
            <TextField
              label="Tìm kiếm"
              variant="outlined"
              size="small"
              fullWidth
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 2 }}
            />
            
            <FormControl size="small" variant="outlined" sx={{ minWidth: 200, flex: 1 }}>
              <InputLabel id="status-filter-label">Trạng thái</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                onChange={handleChangeStatusFilter}
                label="Trạng thái"
              >
                <MenuItem value="all">Tất cả trạng thái</MenuItem>
                <MenuItem value="Pending">Đang chờ</MenuItem>
                <MenuItem value="Confirmed">Đã xác nhận</MenuItem>
                <MenuItem value="Completed">Đã hoàn thành</MenuItem>
                <MenuItem value="Cancelled">Đã hủy</MenuItem>
                <MenuItem value="Rescheduled">Đổi lịch</MenuItem>
                <MenuItem value="No-show">Không đến</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Mã cuộc hẹn</TableCell>
                      <TableCell>Bệnh nhân</TableCell>
                      <TableCell>Chuyên gia</TableCell>
                      <TableCell>Ngày & giờ</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell>Thanh toán</TableCell>
                      <TableCell align="center">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedAppointments.length > 0 ? (
                      displayedAppointments.map((appointment) => (
                        <TableRow key={appointment._id} hover>
                          <TableCell>
                            <Typography variant="body2" fontFamily="monospace">
                              {appointment._id.substring(0, 8)}...
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {appointment.patient?.fullName || 'Unknown'}
                          </TableCell>
                          <TableCell>
                            {appointment.psychologist?.fullName || 'Unknown'}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                              <Typography variant="body2">
                                {formatDateTime(appointment.scheduledTime?.startTime)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={getStatusLabel(appointment.status)} 
                              color={getStatusColor(appointment.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={appointment.payment?.status === 'Paid' ? 'Đã thanh toán' : 'Chưa thanh toán'} 
                              color={appointment.payment?.status === 'Paid' ? 'success' : 'warning'}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                              <IconButton 
                                component={Link}
                                to={`/staff/appointment-details/${appointment._id}`}
                                color="info"
                                size="small"
                                title="Xem chi tiết"
                              >
                                <VisibilityIcon />
                              </IconButton>
                              
                              {appointment.status === 'Pending' && (
                                <>
                                  <IconButton 
                                    color="success"
                                    size="small"
                                    title="Xác nhận"
                                    onClick={() => handleOpenStatusDialog(appointment, 'Confirmed')}
                                  >
                                    <CheckCircleIcon />
                                  </IconButton>
                                  
                                  <IconButton 
                                    color="error"
                                    size="small"
                                    title="Hủy"
                                    onClick={() => handleOpenStatusDialog(appointment, 'Cancelled')}
                                  >
                                    <CancelIcon />
                                  </IconButton>
                                </>
                              )}
                              
                              {appointment.status === 'Confirmed' && (
                                <>
                                  <IconButton 
                                    color="success"
                                    size="small"
                                    title="Hoàn thành"
                                    onClick={() => handleOpenStatusDialog(appointment, 'Completed')}
                                  >
                                    <CheckCircleIcon />
                                  </IconButton>
                                  
                                  <IconButton 
                                    color="secondary"
                                    size="small"
                                    title="Đổi lịch"
                                    onClick={() => handleOpenStatusDialog(appointment, 'Rescheduled')}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </>
                              )}
                              
                              {appointment.status === 'Rescheduled' && (
                                <IconButton 
                                  color="info"
                                  size="small"
                                  title="Xem yêu cầu đổi lịch"
                                  component={Link}
                                  to={`/staff/reschedule-request/${appointment._id}`}
                                >
                                  <CalendarIcon />
                                </IconButton>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                          <Typography color="text.secondary">
                            Không tìm thấy cuộc hẹn nào
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredAppointments.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Hiển thị:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
              />
            </>
          )}
        </Box>
      </Paper>
      
      {/* Status Update Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          Cập nhật trạng thái cuộc hẹn
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Bạn đang thay đổi trạng thái cuộc hẹn thành <strong>{getStatusLabel(newStatus)}</strong>.
            {newStatus === 'Cancelled' && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                Lưu ý: Hủy cuộc hẹn sẽ giải phóng khung giờ này cho các lịch đặt khác.
              </Typography>
            )}
          </DialogContentText>
          
          <TextField
            autoFocus
            margin="dense"
            label="Ghi chú"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Hủy
          </Button>
          <Button 
            onClick={handleUpdateStatus} 
            variant="contained" 
            color={newStatus === 'Cancelled' ? 'error' : 'primary'}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Example of disabled button inside Tooltip */}
      <Tooltip title="Không thể thực hiện">
        <span>
          <Button
            variant="outlined"
            size="small"
            disabled
          >
            Không khả dụng
          </Button>
        </span>
      </Tooltip>
    </Container>
  );
};

export default ManageAppointments;
