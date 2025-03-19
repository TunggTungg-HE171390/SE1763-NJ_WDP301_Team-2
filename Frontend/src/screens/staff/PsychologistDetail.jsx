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
  IconButton,
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
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Comment as CommentIcon
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
        // First attempt to use the detailed endpoint
        let response;
        try {
          response = await getPsychologistDetails(id);
        } catch (detailError) {
          console.log("Could not fetch from details endpoint, trying basic endpoint...");
          // Fallback to the basic psychologist endpoint if detailed one fails
          response = await getPsychologist(id);
        }

        if (response && response.data) {
          setPsychologist(response.data);
          setError(null);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error('Error fetching psychologist details:', err);
        setError('Không thể tải thông tin chuyên gia tâm lý. Vui lòng thử lại sau.');
        setPsychologist(null); // Don't set mock data
      } finally {
        setLoading(false);
      }
    };

    fetchPsychologistDetails();
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
                src={psychologist.avatar || "https://via.placeholder.com/150"}
                alt={psychologist.fullname}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
              <Typography variant="h5" fontWeight="bold" align="center">
                {psychologist.fullname}
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                {psychologist.specialization}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Rating 
                  value={psychologist.rating || 0} 
                  precision={0.1} 
                  readOnly 
                  size="small" 
                  emptyIcon={<StarBorderIcon fontSize="inherit" />}
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {psychologist.rating?.toFixed(1) || 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Chip 
                  label={psychologist.status === 'active' ? 'Hoạt động' : 'Không hoạt động'} 
                  color={psychologist.status === 'active' ? 'success' : 'default'}
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
                  secondary={psychologist.email}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <PhoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Số điện thoại"
                  secondary={psychologist.phone}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Giới tính"
                  secondary={psychologist.gender}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <CalendarMonthIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Ngày sinh"
                  secondary={new Date(psychologist.dateOfBirth).toLocaleDateString('vi-VN')}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <LocationOnIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Địa chỉ"
                  secondary={psychologist.address}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <WorkIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Kinh nghiệm"
                  secondary={`${psychologist.experience} năm`}
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
                <Tab label="Thông tin" id="tab-0" />
                <Tab label="Học vấn & Chứng chỉ" id="tab-1" />
                <Tab label="Đánh giá" id="tab-2" />
              </Tabs>
            </Box>

            {/* Bio Tab */}
            <Box role="tabpanel" hidden={activeTab !== 0} sx={{ p: 3 }}>
              {activeTab === 0 && (
                <>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Tiểu sử
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {psychologist.bio || 'Không có thông tin tiểu sử.'}
                  </Typography>

                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
                    Lịch làm việc
                  </Typography>
                  {psychologist.workingHours && psychologist.workingHours.length > 0 ? (
                    <List>
                      {psychologist.workingHours.map((schedule, index) => (
                        <ListItem key={index} sx={{ py: 1 }}>
                          <ListItemIcon>
                            <CalendarMonthIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={schedule.day} 
                            secondary={schedule.hours} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1">
                      Không có thông tin lịch làm việc.
                    </Typography>
                  )}
                </>
              )}
            </Box>

            {/* Education Tab */}
            <Box role="tabpanel" hidden={activeTab !== 1} sx={{ p: 3 }}>
              {activeTab === 1 && (
                <>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Học vấn
                  </Typography>
                  {psychologist.education && psychologist.education.length > 0 ? (
                    <List>
                      {psychologist.education.map((edu, index) => (
                        <ListItem key={index} sx={{ py: 1 }}>
                          <ListItemIcon>
                            <SchoolIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={edu.degree} 
                            secondary={`${edu.institution} - ${edu.year}`} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1">
                      Không có thông tin học vấn.
                    </Typography>
                  )}

                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
                    Chứng chỉ
                  </Typography>
                  {psychologist.certifications && psychologist.certifications.length > 0 ? (
                    <List>
                      {psychologist.certifications.map((cert, index) => (
                        <ListItem key={index} sx={{ py: 1 }}>
                          <ListItemIcon>
                            <WorkIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={cert.name} 
                            secondary={`${cert.issuedBy} - ${cert.year}`} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1">
                      Không có thông tin chứng chỉ.
                    </Typography>
                  )}
                </>
              )}
            </Box>

            {/* Reviews Tab */}
            <Box role="tabpanel" hidden={activeTab !== 2} sx={{ p: 3 }}>
              {activeTab === 2 && (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Đánh giá từ bệnh nhân
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                      <Rating 
                        value={psychologist.rating || 0} 
                        precision={0.1} 
                        readOnly 
                        size="small" 
                      />
                      <Typography variant="body1" sx={{ ml: 1, fontWeight: 'medium' }}>
                        {psychologist.rating?.toFixed(1) || 'N/A'}/5
                      </Typography>
                    </Box>
                  </Box>

                  {psychologist.reviews && psychologist.reviews.length > 0 ? (
                    psychologist.reviews.map((review) => (
                      <Card key={review.id} variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {review.user}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(review.date).toLocaleDateString('vi-VN')}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Rating 
                              value={review.rating} 
                              readOnly 
                              size="small" 
                            />
                          </Box>
                          <Typography variant="body2">
                            {review.comment}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                      Chưa có đánh giá nào.
                    </Typography>
                  )}
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
