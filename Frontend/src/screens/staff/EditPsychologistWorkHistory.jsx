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
import { getPsychologist, updatePsychologistWorkHistory } from '../../api/psychologist.api';

const EditPsychologistWorkHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [psychologist, setPsychologist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [workHistory, setWorkHistory] = useState([]);
  const [newWorkHistory, setNewWorkHistory] = useState('');

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
          
          // Set work history from psychologist data
          const profile = psychologistData.psychologist?.psychologistProfile || {};
          setWorkHistory(profile.workHistory || []);
          
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

  const handleAddWorkHistory = () => {
    if (newWorkHistory.trim()) {
      setWorkHistory([...workHistory, newWorkHistory.trim()]);
      setNewWorkHistory('');
    }
  };

  const handleRemoveWorkHistory = (index) => {
    setWorkHistory(workHistory.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const response = await updatePsychologistWorkHistory(id, { workHistory });
      console.log("Update response:", response);
      setSuccess(true);
      
      // Auto-navigate back after successful save
      setTimeout(() => {
        navigate(`/staff/psychologist-detail/${id}`);
      }, 2000);
    } catch (err) {
      console.error('Error updating work history:', err);
      setError('Không thể cập nhật lịch sử công việc. Vui lòng thử lại sau.');
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
          Cập nhật lịch sử công việc
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
            Danh sách lịch sử công việc
          </Typography>
          
          <List>
            {workHistory.length > 0 ? (
              workHistory.map((job, index) => (
                <ListItem key={index} divider={index < workHistory.length - 1}>
                  <ListItemText primary={job} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleRemoveWorkHistory(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                Chưa có thông tin lịch sử công việc. Vui lòng thêm mới bên dưới.
              </Typography>
            )}
          </List>
        </Box>
        
        <Box sx={{ display: 'flex', mb: 3 }}>
          <TextField
            fullWidth
            label="Thêm công việc mới"
            variant="outlined"
            value={newWorkHistory}
            onChange={(e) => setNewWorkHistory(e.target.value)}
            placeholder="Ví dụ: 2018-2023: Chuyên gia tâm lý cấp cao tại Viện Sức khỏe Tâm thần"
            sx={{ mr: 1 }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddWorkHistory}
            disabled={!newWorkHistory.trim()}
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
        message="Đã cập nhật lịch sử công việc thành công"
      />
    </Container>
  );
};

export default EditPsychologistWorkHistory;
