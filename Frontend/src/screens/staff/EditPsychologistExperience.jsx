import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { getPsychologist, updatePsychologistExperience } from '../../api/psychologist.api';

const EditPsychologistExperience = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [psychologist, setPsychologist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [experiences, setExperiences] = useState([]);
  const [newExperience, setNewExperience] = useState('');

  useEffect(() => {
    const fetchPsychologist = async () => {
      setLoading(true);
      try {
        console.log("Fetching psychologist with ID:", id);
        const response = await getPsychologist(id);
        
        // Process response data
        let psychologistData = null;
        if (response?.data?.success && response.data.data) {
          psychologistData = response.data.data;
        } else if (response?.data) {
          psychologistData = response.data;
        }
        
        if (psychologistData) {
          setPsychologist(psychologistData);
          
          // Set experiences from psychologist data
          const profile = psychologistData.psychologist?.psychologistProfile || {};
          setExperiences(profile.medicalExperience || []);
          
          setError(null);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error('Error fetching psychologist:', err);
        setError('Không thể tải thông tin chuyên gia tâm lý. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPsychologist();
    }
  }, [id]);

  const handleAddExperience = () => {
    if (newExperience.trim()) {
      setExperiences([...experiences, newExperience.trim()]);
      setNewExperience('');
    }
  };

  const handleRemoveExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const response = await updatePsychologistExperience(id, { medicalExperience: experiences });
      console.log("Update response:", response);
      setSuccess(true);
      
      // Auto-navigate back after successful save
      setTimeout(() => {
        navigate(`/staff/psychologist-detail/${id}`);
      }, 2000);
    } catch (err) {
      console.error('Error updating experience:', err);
      setError('Không thể cập nhật kinh nghiệm. Vui lòng thử lại sau.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 12, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 12, mb: 4 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        component={Link}
        to={`/staff/psychologist-detail/${id}`}
        sx={{ mb: 3 }}
      >
        Quay lại chi tiết
      </Button>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Cập nhật kinh nghiệm chuyên môn
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {psychologist?.fullName}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Danh sách kinh nghiệm chuyên môn
          </Typography>
          
          <List>
            {experiences.length > 0 ? (
              experiences.map((exp, index) => (
                <ListItem key={index} divider={index < experiences.length - 1}>
                  <ListItemText primary={exp} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleRemoveExperience(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                Chưa có thông tin kinh nghiệm chuyên môn. Vui lòng thêm mới bên dưới.
              </Typography>
            )}
          </List>
        </Box>
        
        <Box sx={{ display: 'flex', mb: 3 }}>
          <TextField
            fullWidth
            label="Thêm kinh nghiệm mới"
            variant="outlined"
            value={newExperience}
            onChange={(e) => setNewExperience(e.target.value)}
            placeholder="Ví dụ: Điều trị 50+ bệnh nhân mắc chứng lo âu trong 5 năm"
            sx={{ mr: 1 }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddExperience}
            disabled={!newExperience.trim()}
          >
            Thêm
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </Box>
      </Paper>
      
      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        message="Đã cập nhật kinh nghiệm thành công"
      />
    </Container>
  );
};

export default EditPsychologistExperience;
