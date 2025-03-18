import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    Container,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Button,
    Chip,
    Divider,
    Grid,
    Alert,
    Snackbar,
    Card,
    CardContent,
    Avatar,
} from "@mui/material";
import {
    CalendarMonth,
    AccessTime,
    Person,
    MedicalInformation,
    Phone,
    Email,
    ArrowBack,
    CheckCircle,
    Assessment,
    Healing,
    Psychology,
    NoteAlt,
    MedicalServices,
} from "@mui/icons-material";
import * as API from "@/api";
import { useAuth } from "@/hooks/useAuth";

const AppointmentList = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState({ open: false, message: "", severity: "info" });
    const { user } = useAuth();

    // Get appointment history for this patient with this psychologist
    const [appointmentHistory, setAppointmentHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        const fetchAppointmentDetail = async () => {
            if (!appointmentId) return;

            setLoading(true);
            try {
                const data = await appointmentApi.getAppointmentById(appointmentId);
                if (data) {
                    // Check if this appointment belongs to the current user
                    if (user && user.id !== data.patientId) {
                        setError("Bạn không có quyền xem thông tin của cuộc hẹn này");
                        return;
                    }

                    setAppointment(data);
                    setError(null);

                    // Fetch appointment history
                    if (data.psychologistId) {
                        fetchAppointmentHistory(data.psychologistId);
                    }
                } else {
                    setError("Không tìm thấy thông tin cuộc hẹn");
                }
            } catch (err) {
                console.error("Error fetching appointment:", err);
                setError(err.message || "Có lỗi xảy ra khi lấy thông tin cuộc hẹn");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointmentDetail();
    }, [appointmentId, user]);

    const fetchAppointmentHistory = async (psychologistId) => {
        setLoadingHistory(true);
        try {
            const history = await appointmentApi.getPatientAppointmentsWithPsychologist(user.id, psychologistId);

            // Sort by date descending
            const sortedHistory = history
                .filter((app) => app.id !== parseInt(appointmentId)) // Exclude current appointment
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            setAppointmentHistory(sortedHistory);
        } catch (err) {
            console.error("Error fetching appointment history:", err);
            setToast({
                open: true,
                message: "Không thể tải lịch sử cuộc hẹn",
                severity: "error",
            });
        } finally {
            setLoadingHistory(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "confirmed":
                return "success";
            case "pending":
                return "warning";
            case "cancelled":
                return "error";
            case "rescheduled":
                return "info";
            case "completed":
                return "success";
            default:
                return "default";
        }
    };

    if (loading && !appointment) {
        return (
            <Container maxWidth="lg" sx={{ mt: 12, mb: 4, textAlign: "center" }}>
                <CircularProgress size={40} />
                <Typography variant="h5" sx={{ mt: 2 }}>
                    Đang tải thông tin cuộc hẹn...
                </Typography>
            </Container>
        );
    }

    if (error && !appointment) {
        return (
            <Container maxWidth="lg" sx={{ mt: 12, mb: 4, textAlign: "center" }}>
                <Typography variant="h5" color="error">
                    {error}
                </Typography>
                <Button
                    component={Link}
                    to="/patient/view-appointments"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}>
                    Quay lại danh sách cuộc hẹn
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
            <Box sx={{ mb: 3 }}>
                <Button component={Link} to="/patient/view-appointments" variant="outlined" startIcon={<ArrowBack />}>
                    Quay lại lịch hẹn
                </Button>
            </Box>

            <Grid container spacing={3}>
                {/* Main Appointment Detail */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight={600} gutterBottom>
                            Chi tiết cuộc hẹn
                        </Typography>

                        <Card sx={{ mb: 3 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 2,
                                    }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Psychology color="primary" />
                                        <Box component="h3" sx={{ fontSize: "1.25rem", fontWeight: 500, m: 0 }}>
                                            {appointment.psychologistName}
                                        </Box>
                                    </Box>
                                    <Chip
                                        label={appointment.status}
                                        color={getStatusColor(appointment.status)}
                                        sx={{ fontWeight: "bold" }}
                                    />
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                                            <CalendarMonth color="primary" sx={{ mt: 0.5 }} />
                                            <Box>
                                                <Box
                                                    component="p"
                                                    sx={{ color: "text.secondary", fontSize: "0.875rem", m: 0 }}>
                                                    Ngày hẹn
                                                </Box>
                                                <Box component="p" sx={{ m: 0 }}>
                                                    {new Date(appointment.date).toLocaleDateString("vi-VN", {
                                                        weekday: "long",
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                                            <AccessTime color="primary" sx={{ mt: 0.5 }} />
                                            <Box>
                                                <Box
                                                    component="p"
                                                    sx={{ color: "text.secondary", fontSize: "0.875rem", m: 0 }}>
                                                    Thời gian
                                                </Box>
                                                <Box component="p" sx={{ m: 0 }}>
                                                    {appointment.time} ({appointment.duration} phút)
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                                            <MedicalInformation color="primary" sx={{ mt: 0.5 }} />
                                            <Box>
                                                <Box
                                                    component="p"
                                                    sx={{ color: "text.secondary", fontSize: "0.875rem", m: 0 }}>
                                                    Lý do thăm khám
                                                </Box>
                                                <Box component="p" sx={{ m: 0 }}>
                                                    {appointment.reason}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                                            <Person color="primary" sx={{ mt: 0.5 }} />
                                            <Box>
                                                <Box
                                                    component="p"
                                                    sx={{ color: "text.secondary", fontSize: "0.875rem", m: 0 }}>
                                                    Bác sĩ tâm lý
                                                </Box>
                                                <Box component="p" sx={{ m: 0 }}>
                                                    {appointment.psychologistName}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>

                                {appointment.cancelReason && (
                                    <Box sx={{ mt: 3, p: 2, bgcolor: "#FFEBEE", borderRadius: 1 }}>
                                        <Typography variant="subtitle2" color="#C62828" fontWeight="bold">
                                            Lý do hủy:
                                        </Typography>
                                        <Typography variant="body2">{appointment.cancelReason}</Typography>
                                    </Box>
                                )}

                                {appointment.rescheduleReason && (
                                    <Box sx={{ mt: 3, p: 2, bgcolor: "#E1F5FE", borderRadius: 1 }}>
                                        <Typography variant="subtitle2" color="#0277BD" fontWeight="bold">
                                            Lý do đổi lịch:
                                        </Typography>
                                        <Typography variant="body2">{appointment.rescheduleReason}</Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>

                        {/* Professional assessment and treatment plan - only for completed appointments */}
                        {appointment.status.toLowerCase() === "completed" && (
                            <>
                                <Typography variant="h5" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
                                    Kết quả đánh giá
                                </Typography>

                                <Card sx={{ mb: 3 }}>
                                    <CardContent sx={{ p: 3 }}>
                                        {appointment.professionalAssessment && (
                                            <Box sx={{ mb: 2 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                                    <Assessment color="primary" />
                                                    <Box component="h4" sx={{ fontWeight: 600, m: 0 }}>
                                                        Nhận xét chuyên môn
                                                    </Box>
                                                </Box>
                                                <Box component="p" sx={{ m: 0 }}>
                                                    {appointment.professionalAssessment}
                                                </Box>
                                            </Box>
                                        )}

                                        {appointment.professionalAssessment && appointment.treatmentPlan && (
                                            <Divider sx={{ my: 3 }} />
                                        )}

                                        {appointment.treatmentPlan && (
                                            <Box sx={{ mb: 2 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                                    <Healing color="primary" />
                                                    <Box component="h4" sx={{ fontWeight: 600, m: 0 }}>
                                                        Phương pháp điều trị
                                                    </Box>
                                                </Box>
                                                <Box component="p" sx={{ m: 0 }}>
                                                    {appointment.treatmentPlan}
                                                </Box>
                                            </Box>
                                        )}

                                        {/* New Section - Medical Notes */}
                                        {appointment.notes && (
                                            <>
                                                <Divider sx={{ my: 3 }} />
                                                <Box sx={{ mb: 2 }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                                        <NoteAlt color="primary" />
                                                        <Box component="h4" sx={{ fontWeight: 600, m: 0 }}>
                                                            Ghi chú
                                                        </Box>
                                                    </Box>
                                                    <Box component="p" sx={{ m: 0 }}>
                                                        {appointment.notes}
                                                    </Box>
                                                </Box>
                                            </>
                                        )}

                                        {/* New Section - Medical Information */}
                                        {appointment.medicalInformation && (
                                            <>
                                                <Divider sx={{ my: 3 }} />
                                                <Box sx={{ mb: 2 }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                                        <MedicalServices color="primary" />
                                                        <Box component="h4" sx={{ fontWeight: 600, m: 0 }}>
                                                            Thông tin bệnh án
                                                        </Box>
                                                    </Box>
                                                    <Box component="p" sx={{ m: 0 }}>
                                                        {appointment.medicalInformation}
                                                    </Box>
                                                </Box>
                                            </>
                                        )}

                                        {/* Empty state when no information is available */}
                                        {!appointment.professionalAssessment &&
                                            !appointment.treatmentPlan &&
                                            !appointment.notes &&
                                            !appointment.medicalInformation && (
                                                <Box sx={{ textAlign: "center", py: 3 }}>
                                                    <MedicalInformation
                                                        sx={{ fontSize: 48, color: "text.disabled", mb: 2 }}
                                                    />
                                                    <Typography color="text.secondary">
                                                        Chưa có thông tin đánh giá cho cuộc hẹn này
                                                    </Typography>
                                                </Box>
                                            )}
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </Paper>
                </Grid>

                {/* Appointment History */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            Lịch sử cuộc hẹn
                        </Typography>

                        {loadingHistory ? (
                            <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                                <CircularProgress size={30} />
                            </Box>
                        ) : appointmentHistory.length > 0 ? (
                            <Box sx={{ mt: 2 }}>
                                {appointmentHistory.map((app) => (
                                    <Card
                                        key={app.id}
                                        sx={{
                                            mb: 2,
                                            boxShadow: 1,
                                            cursor: "pointer",
                                            "&:hover": { boxShadow: 3 },
                                        }}
                                        onClick={() => navigate(`/patient/view-appointment-detail/${app.id}`)}>
                                        <CardContent sx={{ p: 2 }}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    mb: 1,
                                                }}>
                                                <Typography variant="subtitle1" fontWeight={500}>
                                                    {new Date(app.date).toLocaleDateString("vi-VN")}
                                                </Typography>
                                                <Chip
                                                    label={app.status}
                                                    size="small"
                                                    color={getStatusColor(app.status)}
                                                />
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {app.time} • {app.duration} phút
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                {app.reason}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    p: 3,
                                    bgcolor: "background.paper",
                                }}>
                                <CalendarMonth color="disabled" sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="body1" color="text.secondary">
                                    Chưa có cuộc hẹn nào trước đây
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            <Snackbar open={toast.open} autoHideDuration={6000} onClose={() => setToast({ ...toast, open: false })}>
                <Alert
                    onClose={() => setToast({ ...toast, open: false })}
                    severity={toast.severity}
                    sx={{ width: "100%" }}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AppointmentList;
