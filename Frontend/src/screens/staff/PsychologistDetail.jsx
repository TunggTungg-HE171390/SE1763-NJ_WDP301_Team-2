import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Divider,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  Rating,
  Card,
  CardContent,
  Tab,
  Tabs
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  LocationOn as LocationOnIcon,
  CalendarMonth as CalendarMonthIcon,
  EventNote as EventNoteIcon,
  Edit as EditIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { getPsychologistDetails, getPsychologist } from '../../api/psychologist.api';

const PsychologistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [psychologist, setPsychologist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchPsychologistDetails = async () => {
      setLoading(true);
      try {
        // Try to get data from the API
        console.log("Fetching psychologist with ID:", id);
        let response = await getPsychologist(id);
        console.log("API Response:", response);

        // Check for different possible response formats
        let psychologistData = null;
        
        if (response?.data?.success && response.data.data) {
          // Format: { success: true, data: {...} }
          psychologistData = response.data.data;
        } else if (response?.data?.data) {
          // Format: { data: {...} }
          psychologistData = response.data.data;
        } else if (response?.data) {
          // Format: direct data object
          psychologistData = response.data;
        }
        
        if (psychologistData) {
          console.log("Processed psychologist data:", psychologistData);
          setPsychologist(psychologistData);
          setError(null);
        } else {
          throw new Error("Invalid or empty response format");
        }
      } catch (err) {
        console.error('Error fetching psychologist details:', err);
        setError('Không thể tải thông tin chuyên gia tâm lý. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPsychologistDetails();
    }
  }, [id]);

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !psychologist) {
    return (
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Không tìm thấy thông tin chuyên gia tâm lý'}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/staff/manage-psychologists')}
        >
          Quay lại danh sách
        </Button>
      </Container>
    );
  }

  // Extract psychologist profile data for easier access
  const profile = psychologist.psychologist?.psychologistProfile || {};

  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        component={Link}
        to="/staff/manage-psychologists"
        sx={{ mb: 3 }}
      >
        Quay lại danh sách
      </Button>

      <Grid container spacing={3}>
        {/* Left column - Profile Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={psychologist.profileImg || "https://via.placeholder.com/150"}
                alt={psychologist.fullName}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
              <Typography variant="h5" fontWeight="bold" align="center">
                {psychologist.fullName}
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                {profile.specialization || "Chưa cập nhật chuyên môn"}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Rating 
                  value={profile.rating || 0} 
                  precision={0.1} 
                  readOnly 
                  size="small" 
                  emptyIcon={<StarBorderIcon fontSize="inherit" />}
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {profile.rating ? `${profile.rating.toFixed(1)} (${profile.numberOfRatings || 0} đánh giá)` : 'Chưa có đánh giá'}
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Chip 
                  label={psychologist.status === 'Active' ? 'Hoạt động' : 'Không hoạt động'} 
                  color={psychologist.status === 'Active' ? 'success' : 'default'}
                  sx={{ fontWeight: 'medium' }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <List disablePadding>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={psychologist.email || "Chưa cập nhật"}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <PhoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Số điện thoại"
                  secondary={psychologist.phone || "Chưa cập nhật"}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Giới tính"
                  secondary={psychologist.gender || "Chưa cập nhật"}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <CalendarMonthIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Ngày sinh"
                  secondary={psychologist.dob ? new Date(psychologist.dob).toLocaleDateString('vi-VN') : "Chưa cập nhật"}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <LocationOnIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Địa chỉ"
                  secondary={psychologist.address || "Chưa cập nhật"}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <SchoolIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Trình độ"
                  secondary={profile.professionalLevel || profile.educationalLevel || "Chưa cập nhật"}
                />
              </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                component={Link}
                to={`/staff/edit-psychologist/${psychologist._id}`}
                fullWidth
              >
                Chỉnh sửa thông tin
              </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<EventNoteIcon />}
                component={Link}
                to={`/staff/view-schedule?doctor=${psychologist._id}`}
                fullWidth
              >
                Xem lịch làm việc
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right column - Tabbed Details */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={activeTab} 
                onChange={handleChangeTab} 
                variant="fullWidth"
              >
                <Tab label="Kinh nghiệm làm việc" id="tab-0" />
                <Tab label="Lịch sử công việc" id="tab-1" />
                <Tab label="Thông tin khác" id="tab-2" />
              </Tabs>
            </Box>

            {/* Medical Experience Tab */}
            <Box role="tabpanel" hidden={activeTab !== 0} sx={{ p: 3 }}>
              {activeTab === 0 && (
                <>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Kinh nghiệm chuyên môn
                  </Typography>
                  
                  {profile.medicalExperience && profile.medicalExperience.length > 0 ? (
                    <List>
                      {profile.medicalExperience.map((exp, index) => (
                        <ListItem key={index} sx={{ py: 1 }}>
                          <ListItemIcon>
                            <WorkIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={exp} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1" paragraph>
                      Chưa cập nhật thông tin kinh nghiệm chuyên môn.
                    </Typography>
                  )}
                  
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      component={Link}
                      to={`/staff/edit-psychologist-experience/${psychologist._id}`}
                    >
                      Cập nhật kinh nghiệm
                    </Button>
                  </Box>
                </>
              )}
            </Box>

            {/* Work History Tab */}
            <Box role="tabpanel" hidden={activeTab !== 1} sx={{ p: 3 }}>
              {activeTab === 1 && (
                <>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Lịch sử công việc
                  </Typography>
                  
                  {profile.workHistory && profile.workHistory.length > 0 ? (
                    <List>
                      {profile.workHistory.map((history, index) => (
                        <ListItem key={index} sx={{ py: 1 }}>
                          <ListItemIcon>
                            <WorkIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={history} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1">
                      Chưa cập nhật thông tin lịch sử công việc.
                    </Typography>
                  )}
                  
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      component={Link}
                      to={`/staff/edit-psychologist-work-history/${psychologist._id}`}
                    >
                      Cập nhật lịch sử công việc
                    </Button>
                  </Box>
                </>
              )}
            </Box>

            {/* Additional Info Tab */}
            <Box role="tabpanel" hidden={activeTab !== 2} sx={{ p: 3 }}>
              {activeTab === 2 && (
                <>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Thống kê hoạt động
                          </Typography>
                          <List dense>
                            <ListItem>
                              <ListItemText 
                                primary="Số buổi đã tham gia" 
                                secondary={profile.appointmentsAttended || 0} 
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Số lượt tư vấn" 
                                secondary={profile.consultationsCount || 0} 
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Số lượt đánh giá" 
                                secondary={profile.numberOfRatings || 0} 
                              />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Thông tin xác thực
                          </Typography>
                          <List dense>
                            <ListItem>
                              <ListItemText 
                                primary="Email đã xác thực" 
                                secondary={
                                  <Chip 
                                    label={psychologist.isEmailVerified ? "Đã xác thực" : "Chưa xác thực"} 
                                    color={psychologist.isEmailVerified ? "success" : "default"}
                                    size="small"
                                  />
                                } 
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Số điện thoại đã xác thực" 
                                secondary={
                                  <Chip 
                                    label={psychologist.isPhoneVerified ? "Đã xác thực" : "Chưa xác thực"} 
                                    color={psychologist.isPhoneVerified ? "success" : "default"}
                                    size="small"
                                  />
                                } 
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Ngày cập nhật" 
                                secondary={psychologist.updatedAt ? new Date(psychologist.updatedAt).toLocaleString('vi-VN') : "Chưa có thông tin"} 
                              />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PsychologistDetail;
