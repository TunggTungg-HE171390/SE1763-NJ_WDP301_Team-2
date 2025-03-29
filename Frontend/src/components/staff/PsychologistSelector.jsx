import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Menu, 
  MenuItem, 
  Box, 
  Typography, 
  CircularProgress, 
  Divider, 
  List, 
  ListItemAvatar, 
  Avatar, 
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { SwapHoriz as SwapHorizIcon } from '@mui/icons-material';
import * as psychologistApi from '@/api/psychologist.api';

/**
 * Reusable component for selecting a psychologist across staff management pages
 * 
 * @param {Object} props
 * @param {string} props.currentPsychologistId - The currently selected psychologist ID
 * @param {Function} props.onPsychologistSelect - Function called when a psychologist is selected
 * @param {boolean} props.showMobileSelector - Whether to show the mobile dropdown selector
 * @param {string} props.buttonText - Custom button text (default: "Chuyển chuyên gia")
 */
const PsychologistSelector = ({ 
  currentPsychologistId, 
  onPsychologistSelect, 
  showMobileSelector = false,
  buttonText = "Chuyển chuyên gia" 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loadingPsychologists, setLoadingPsychologists] = useState(false);
  const [allPsychologists, setAllPsychologists] = useState([]);
  const [openPsychologistMenu, setOpenPsychologistMenu] = useState(false);
  const [psychologistMenuAnchor, setPsychologistMenuAnchor] = useState(null);

  // Fetch all psychologists for the selector
  useEffect(() => {
    const fetchAllPsychologists = async () => {
      setLoadingPsychologists(true);
      try {
        console.log("Fetching all psychologists for selector");
        const response = await psychologistApi.getAllPsychologists();
        
        // Handle different response formats
        let psychologistsData = [];
        if (response && response.psychologists) {
          psychologistsData = response.psychologists;
        } else if (response && Array.isArray(response)) {
          psychologistsData = response;
        } else if (response && response.data) {
          psychologistsData = response.data;
        } else {
          console.error("Unexpected response format:", response);
        }
        
        // Set psychologists list
        setAllPsychologists(psychologistsData);
      } catch (err) {
        console.error("Error fetching psychologists:", err);
      } finally {
        setLoadingPsychologists(false);
      }
    };

    fetchAllPsychologists();
  }, []);

  const handleOpenPsychologistMenu = (event) => {
    setPsychologistMenuAnchor(event.currentTarget);
    setOpenPsychologistMenu(true);
  };

  const handleClosePsychologistMenu = () => {
    setPsychologistMenuAnchor(null);
    setOpenPsychologistMenu(false);
  };

  const handleSelectPsychologist = (newPsychologistId) => {
    handleClosePsychologistMenu();
    if (newPsychologistId !== currentPsychologistId) {
      onPsychologistSelect(newPsychologistId);
    }
  };

  return (
    <>
      {/* Button to open the menu */}
      <Button
        variant="outlined"
        color="primary"
        startIcon={<SwapHorizIcon />}
        onClick={handleOpenPsychologistMenu}
        disabled={loadingPsychologists}
        id="psychologist-menu-button"
      >
        {loadingPsychologists ? 'Đang tải...' : buttonText}
      </Button>
      
      {/* Menu for selecting psychologists */}
      <Menu 
        anchorEl={psychologistMenuAnchor}
        open={openPsychologistMenu}
        onClose={handleClosePsychologistMenu}
        PaperProps={{
          style: {
            maxHeight: 300,
            width: 300,
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Chọn chuyên gia
          </Typography>
          <Divider sx={{ mb: 1 }} />
        </Box>
        
        {loadingPsychologists ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <>
            {allPsychologists && allPsychologists.length > 0 ? (
              <List sx={{ pt: 0 }}>
                {allPsychologists.map((psychologist) => (
                  <MenuItem 
                    key={psychologist._id}
                    onClick={() => handleSelectPsychologist(psychologist._id)}
                    selected={psychologist._id === currentPsychologistId}
                    sx={{ 
                      py: 1.5,
                      backgroundColor: psychologist._id === currentPsychologistId ? 'action.selected' : 'inherit'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        src={psychologist.profileImg} 
                        alt={psychologist.fullName || "Unknown"}
                        sx={{ width: 32, height: 32 }}
                      >
                        {(psychologist.fullName || "?").charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={psychologist.fullName || "Unknown psychologist"} 
                      secondary={
                        psychologist.psychologist?.psychologistProfile?.specialization || 
                        psychologist.specialization || 
                        'Chuyên gia tâm lý'
                      } 
                    />
                  </MenuItem>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  Không có chuyên gia nào
                </Typography>
              </Box>
            )}
          </>
        )}
      </Menu>

      {/* Mobile dropdown selector */}
      {showMobileSelector && isMobile && (
        <FormControl fullWidth size="small" sx={{ mt: 2 }}>
          <InputLabel id="psychologist-select-label">Chuyên gia</InputLabel>
          <Select
            labelId="psychologist-select-label"
            value={currentPsychologistId || ''}
            label="Chuyên gia"
            onChange={(e) => onPsychologistSelect(e.target.value)}
            disabled={loadingPsychologists}
          >
            {allPsychologists.map((psychologist) => (
              <MenuItem key={psychologist._id} value={psychologist._id}>
                {psychologist.fullName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </>
  );
};

export default PsychologistSelector;
