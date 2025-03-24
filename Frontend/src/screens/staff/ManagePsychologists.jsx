import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Box,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  TablePagination,
  Alert
} from '@mui/material';
import { 
  Search as SearchIcon,
  Edit as EditIcon, 
  Visibility as VisibilityIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getAllPsychologists } from '../../api/psychologist.api';
import { analyzeApiResponse } from '../../utils/apiResponseLogger';
import { extractArrayData, processPsychologistData } from '../../utils/dataExtractor';

const ManagePsychologists = () => {
  const [psychologists, setPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchPsychologists();
  }, []);

  const fetchPsychologists = async () => {
    setLoading(true);
    try {
      console.log("Fetching psychologists from database...");
      const response = await getAllPsychologists();
      
      // Use the response analyzer to debug
      analyzeApiResponse(response, "Psychologists API Response");
      
      // Extract data array using our utility
      const rawData = extractArrayData(response);
      
      // Process the data into a consistent format
      const processedData = processPsychologistData(rawData);
      
      console.log("Processed psychologist data:", processedData);
      
      // Update state with processed data
      setPsychologists(processedData);
      setError(null);
      
      // Check for empty data after processing
      if (processedData.length === 0) {
        console.log("No psychologists found after processing");
      }
    } catch (err) {
      console.error('Error fetching psychologists:', err);
      setError('Không thể tải danh sách chuyên gia tâm lý. Vui lòng thử lại sau.');
      setPsychologists([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Filter psychologists based on search term - handle potential missing fields
  const filteredPsychologists = psychologists.filter(psy => {
    if (!psy) return false;
    
    const searchTerm = search.toLowerCase();
    return (
      (psy.fullName || '').toLowerCase().includes(searchTerm) ||
      (psy.email || '').toLowerCase().includes(searchTerm) ||
      (psy.specialization || '').toLowerCase().includes(searchTerm) ||
      (psy.phone || '').includes(searchTerm) ||
      (psy.professionalLevel || '').toLowerCase().includes(searchTerm)
    );
  });

  // Apply pagination
  const displayedPsychologists = filteredPsychologists
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    
  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
      <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
        Quản lý chuyên gia tâm lý
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Xem và quản lý thông tin của các chuyên gia tâm lý trong hệ thống.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <TextField
          label="Tìm kiếm"
          variant="outlined"
          size="small"
          value={search}
          onChange={handleSearchChange}
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'primary.50' }}>
                    <TableCell>Ảnh đại diện</TableCell>
                    <TableCell>Tên chuyên gia</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Số điện thoại</TableCell>
                    <TableCell>Chuyên môn</TableCell>
                    <TableCell>Trình độ</TableCell>
                    <TableCell>Đánh giá</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedPsychologists.length > 0 ? (
                    displayedPsychologists.map((psy) => (
                      <TableRow key={psy._id} hover>
                        <TableCell>
                          <Box
                            component="img"
                            src={psy.profileImg || "https://via.placeholder.com/40"}
                            alt={psy.fullName}
                            sx={{ 
                              width: 40, 
                              height: 40, 
                              borderRadius: '50%',
                              objectFit: 'cover'
                            }}
                          />
                        </TableCell>
                        <TableCell>{psy.fullName}</TableCell>
                        <TableCell>{psy.email}</TableCell>
                        <TableCell>{psy.phone}</TableCell>
                        <TableCell>{psy.specialization || "Chưa cập nhật"}</TableCell>
                        <TableCell>{psy.professionalLevel || psy.educationalLevel || "Chưa cập nhật"}</TableCell>
                        <TableCell>
                          {psy.rating > 0 ? 
                            `${psy.rating.toFixed(1)} / 5 (${psy.numberOfRatings || 0})` : 
                            "Chưa có đánh giá"}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={psy.status === 'Active' ? 'Hoạt động' : 'Không hoạt động'} 
                            color={psy.status === 'Active' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <IconButton 
                              component={Link} 
                              to={`/staff/psychologist-detail/${psy._id}`}
                              color="primary"
                              size="small"
                              title="Xem chi tiết"
                            >
                              <VisibilityIcon />
                            </IconButton>
                            
                            {/* Combined View/Manage Schedule Button - ensure correct route format */}
                            <IconButton 
                              component={Link}
                              to={`/staff/manage-psychologist-schedule/${psy._id}`}
                              color="info"
                              size="small"
                              title="Xem và quản lý lịch làm việc"
                            >
                              <ScheduleIcon />
                            </IconButton>
                            
                            {/* Add View Appointments Button */}
                            <IconButton 
                              component={Link}
                              to={`/staff/view-schedule?doctor=${psy._id}`}
                              color="success"
                              size="small"
                              title="Xem lịch hẹn"
                            >
                              <EventIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography sx={{ py: 2 }}>
                          {search ? 'Không tìm thấy chuyên gia tâm lý nào phù hợp' : 'Không có chuyên gia tâm lý nào trong hệ thống'}
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
              count={filteredPsychologists.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Hiển thị:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
            />
          </>
        )}
      </Paper>
    </Container>
  );
};

export default ManagePsychologists;
