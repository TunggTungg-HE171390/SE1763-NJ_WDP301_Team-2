import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Button,
    Divider,
    Chip,
    CircularProgress,
    Alert,
    Avatar,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
    AccessTime as TimeIcon,
    Event as EventIcon,
    Person as PersonIcon,
    Psychology as PsychologyIcon,
    Edit as EditIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useAuth } from "../../../components/auth/authContext";
import { getAppointmentById, updateNotes } from "../../../api/appointment.api";

const ViewAppointmentDetail = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [psychologistNote, setPsychologistNote] = useState("");
    const [openDialog, setOpenDialog] = useState(false);

    // Fetch appointment details on component mount
    useEffect(() => {
        const fetchAppointmentDetails = async () => {
            setLoading(true);
            try {
                const response = await getAppointmentById(appointmentId);
                if (response && response.data) {
                    setAppointment(response.data);
                    setPsychologistNote(response.data.notes?.psychologist || "");
                } else {
                    setError("Không tìm thấy thông tin cuộc hẹn");
                }
            } catch (err) {
                console.error("Error fetching appointment details:", err);
                setError("Không thể tải thông tin cuộc hẹn. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointmentDetails();
    }, [appointmentId]);

    // Handle opening note dialog
    const handleOpenNoteDialog = () => {
        setOpenDialog(true);
    };

    // Handle closing note dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // Handle saving note
    const handleSaveNote = async () => {
        try {
            setLoading(true);
            const response = await updateNotes(appointmentId, psychologistNote);
            if (response && response.data) {
                setAppointment(response.data);
                setSuccess("Đã cập nhật ghi chú thành công");
                setTimeout(() => setSuccess(""), 3000);
            }
        } catch (err) {
            console.error("Error saving note:", err);
            setError("Không thể cập nhật ghi chú. Vui lòng thử lại sau.");
            setTimeout(() => setError(""), 3000);
        } finally {
            setLoading(false);
            setOpenDialog(false);
        }
    };

    // Format functions
    const formatDate = (date) => {
        if (!date) return "N/A";
        try {
            return format(new Date(date), "dd/MM/yyyy", { locale: vi });
        } catch (err) {
            return String(date);
        }
    };

    const formatTime = (time) => {
        if (!time) return "N/A";
        try {
            return format(new Date(time), "HH:mm", { locale: vi });
        } catch (err) {
            return String(time);
        }
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return "N/A";
        try {
            return format(new Date(dateTime), "EEEE, dd/MM/yyyy - HH:mm", { locale: vi });
        } catch (err) {
            return String(dateTime);
        }
    };

    // Get status label and color
    const getStatusLabel = (status) => {
        const statusMap = {
            Pending: "Đang chờ",
            Confirmed: "Đã xác nhận",
            Completed: "Đã hoàn thành",
            Cancelled: "Đã hủy",
            Rescheduled: "Đổi lịch",
            "No-show": "Không đến",
        };
        return statusMap[status] || status;
    };

    const getStatusColor = (status) => {
        const colorMap = {
            Pending: "warning",
            Confirmed: "info",
            Completed: "success",
            Cancelled: "error",
            Rescheduled: "secondary",
            "No-show": "default",
        };
        return colorMap[status] || "default";
    };

    // Loading state
    if (loading && !appointment) {
        return (
            <Container maxWidth="lg" sx={{ mt: 12, mb: 4, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </Container>
        );
    }

    // Error state
    if (error && !appointment) {
        return (
            <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    component={Link}
                    to="/psychologist/view-schedule"
                    sx={{ mb: 3 }}>
                    Quay lại lịch làm việc
                </Button>

                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
            <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                component={Link}
                to="/psychologist/view-schedule"
                sx={{ mb: 3 }}>
                Quay lại lịch làm việc
            </Button>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            {appointment && (
                <>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="h5" component="h1" fontWeight={600}>
                                Chi tiết cuộc hẹn
                            </Typography>
                            <Chip
                                label={getStatusLabel(appointment.status)}
                                color={getStatusColor(appointment.status)}
                                size="medium"
                            />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Mã cuộc hẹn:{" "}
                            <Box component="span" fontFamily="monospace">
                                {appointment._id}
                            </Box>
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                                    <EventIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Ngày hẹn
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatDate(appointment.scheduledTime?.date)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                                    <TimeIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Thời gian
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatTime(appointment.scheduledTime?.startTime)} -{" "}
                                            {formatTime(appointment.scheduledTime?.endTime)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        {/* Patient info */}
                        <Box sx={{ mb: 3 }}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={500}
                                sx={{ mb: 1, display: "flex", alignItems: "center" }}>
                                <PersonIcon sx={{ mr: 1 }} />
                                Thông tin bệnh nhân
                            </Typography>

                            <Box sx={{ display: "flex", alignItems: "center", pl: 4 }}>
                                <Avatar
                                    src={appointment.patient?.avatar}
                                    alt={appointment.patient?.fullName || "Patient"}
                                    sx={{ width: 50, height: 50, mr: 2 }}
                                />
                                <Box>
                                    <Typography variant="body1" fontWeight={500}>
                                        {appointment.patient?.fullName || "Không có thông tin"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Email: {appointment.patient?.email || "N/A"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        SĐT: {appointment.patient?.phone || "N/A"}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Patient notes */}
                        {appointment.notes?.patient && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
                                    Ghi chú của bệnh nhân
                                </Typography>
                                <Paper variant="outlined" sx={{ p: 2, bgcolor: "background.default" }}>
                                    <Typography variant="body2">{appointment.notes.patient}</Typography>
                                </Paper>
                            </Box>
                        )}

                        {/* Psychologist notes */}
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                <Typography variant="subtitle1" fontWeight={500}>
                                    Ghi chú của bạn
                                </Typography>
                                <Button variant="text" startIcon={<EditIcon />} onClick={handleOpenNoteDialog}>
                                    Chỉnh sửa
                                </Button>
                            </Box>
                            <Paper variant="outlined" sx={{ p: 2, bgcolor: "background.default" }}>
                                <Typography variant="body2">
                                    {appointment.notes?.psychologist || "Chưa có ghi chú"}
                                </Typography>
                            </Paper>
                        </Box>

                        {/* Additional appointment details if needed */}
                        {appointment.rescheduleRequest && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
                                    Thông tin đổi lịch
                                </Typography>
                                <Paper variant="outlined" sx={{ p: 2, bgcolor: "background.default" }}>
                                    <Typography variant="body2" gutterBottom>
                                        <strong>Người yêu cầu:</strong>{" "}
                                        {appointment.rescheduleRequest.requestedBy === "patient"
                                            ? "Bệnh nhân"
                                            : appointment.rescheduleRequest.requestedBy === "psychologist"
                                            ? "Chuyên gia"
                                            : "Nhân viên"}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        <strong>Thời gian yêu cầu:</strong>{" "}
                                        {formatDateTime(appointment.rescheduleRequest.requestedTime)}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        <strong>Lý do:</strong>{" "}
                                        {appointment.rescheduleRequest.reason || "Không có lý do"}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        <strong>Trạng thái:</strong>{" "}
                                        {appointment.rescheduleRequest.status === "Pending"
                                            ? "Đang chờ phê duyệt"
                                            : appointment.rescheduleRequest.status === "Approved"
                                            ? "Đã chấp nhận"
                                            : "Đã từ chối"}
                                    </Typography>
                                </Paper>
                            </Box>
                        )}
                    </Paper>
                </>
            )}

            {/* Dialog for editing psychologist note */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>Cập nhật ghi chú buổi tư vấn</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>Nhập ghi chú của bạn về buổi tư vấn này.</DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Ghi chú"
                        fullWidth
                        multiline
                        rows={6}
                        value={psychologistNote}
                        onChange={(e) => setPsychologistNote(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button onClick={handleSaveNote} variant="contained" color="primary">
                        Lưu ghi chú
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ViewAppointmentDetail;
