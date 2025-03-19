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
  Event as EventIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getAllPsychologists } from '../../api/psychologist.api';

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
      const response = await getAllPsychologists();
      setPsychologists(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching psychologists:', err);
      setError('Không thể tải danh sách chuyên gia tâm lý. Vui lòng thử lại sau.');
      
      // For development/demo purposes only
      if (process.env.NODE_ENV === 'development') {
        setPsychologists([
          {
            _id: '1',
            fullname: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com',
            phone: '0901234567',
            specialization: 'Tâm lý lâm sàng',
            experience: 8,
            status: 'active',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            rating: 4.8
          },
          {
            _id: '2',
            fullname: 'Trần Thị B',
            email: 'tranthib@example.com',
            phone: '0912345678',
            specialization: 'Tâm lý trẻ em',
            experience: 5,
            status: 'active',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            rating: 4.5
          },
          {
            _id: '3',
            fullname: 'Lê Văn C',
            email: 'levanc@example.com',
            phone: '0923456789',
            specialization: 'Tâm lý học đường',
            experience: 10,
            status: 'inactive',
            avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
            rating: 4.9
          },
          {
            _id: '4',
            fullname: 'Phạm Thị D',
            email: 'phamthid@example.com',
            phone: '0934567890',
            specialization: 'Tâm lý gia đình',
            experience: 7,
            status: 'active',
            avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
            rating: 4.7
          },
          {
            _id: '5',
            fullname: 'Hoàng Văn E',
            email: 'hoangvane@example.com',
            phone: '0945678901',
            specialization: 'Tâm lý lão khoa',
            experience: 12,
            status: 'active',
            avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
            rating: 4.6
          }
        ]);
      }
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

  // Filter psychologists based on search term
  const filteredPsychologists = psychologists.filter(psy => {
    const searchTerm = search.toLowerCase();
    return (
      psy.fullname?.toLowerCase().includes(searchTerm) ||
      psy.email?.toLowerCase().includes(searchTerm) ||
      psy.specialization?.toLowerCase().includes(searchTerm) ||
      psy.phone?.includes(searchTerm)
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
                    <TableCell>Avatar</TableCell>
                    <TableCell>Tên chuyên gia</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Số điện thoại</TableCell>
                    <TableCell>Chuyên môn</TableCell>
                    <TableCell>Kinh nghiệm</TableCell>
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
                            src={psy.avatar || "https://via.placeholder.com/40"}
                            alt={psy.fullname}
                            sx={{ 
                              width: 40, 
                              height: 40, 
                              borderRadius: '50%',
                              objectFit: 'cover'
                            }}
                          />
                        </TableCell>
                        <TableCell>{psy.fullname}</TableCell>
                        <TableCell>{psy.email}</TableCell>
                        <TableCell>{psy.phone}</TableCell>
                        <TableCell>{psy.specialization}</TableCell>
                        <TableCell>{psy.experience} năm</TableCell>
                        <TableCell>
                          {psy.rating?.toFixed(1) || 'N/A'} / 5 
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={psy.status === 'active' ? 'Hoạt động' : 'Không hoạt động'} 
                            color={psy.status === 'active' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <IconButton 
                              component={Link} 
                              to={`/staff/psychologist-detail/${psy._id}`} // Updated this line
                              color="primary"
                              size="small"
                              title="Xem chi tiết"
                            >
                              <VisibilityIcon />
                            </IconButton>
                            
                            <IconButton 
                              component={Link} 
                              to={`/staff/edit-psychologist/${psy._id}`}
                              color="info"
                              size="small"
                              title="Chỉnh sửa thông tin"
                            >
                              <EditIcon />
                            </IconButton>
                            
                            <IconButton 
                              component={Link}
                              to={`/staff/view-schedule?doctor=${psy._id}`}
                              color="secondary"
                              size="small"
                              title="Xem lịch làm việc"
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
