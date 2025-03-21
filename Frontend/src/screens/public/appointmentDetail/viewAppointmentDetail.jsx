import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
    Calendar,
    Clock,
    User,
    FileText,
    Phone,
    Mail,
    X,
    RefreshCw,
    ArrowLeft,
    Video,
    Hash,
    School,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Toaster } from "@/components/ui/sonner";
import { Helmet } from "react-helmet-async";
import ToastReceiver from "@/components/common/toast/toast-receiver";
import * as API from "@/api";
import { useAuth } from "@/hooks/useAuth";
import PaymentInformation from "./components/paymentDetail"; // Import the PaymentInformation component

const ViewAppointmentDetail = () => {
    const { appointmentId } = useParams(); // Get appointment ID from URL
    const { user } = useAuth();
    const [appointment, setAppointment] = useState(null);
    const [openCancel, setOpenCancel] = useState(false);
    const [openReschedule, setOpenReschedule] = useState(false);
    const [openNotes, setOpenNotes] = useState(false);
    const [noteContent, setNoteContent] = useState("");
    const [rescheduleDate, setRescheduleDate] = useState("");
    const [rescheduleTime, setRescheduleTime] = useState("");
    const [rescheduleReason, setRescheduleReason] = useState("");
    const [cancelReason, setCancelReason] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointmentDetail = async () => {
            try {
                if (user && appointmentId) {
                    const response = await API.getUserAppointmentById({
                        userId: user._id,
                        appointmentId: appointmentId,
                    });
                    setAppointment(response.data.appointment);
                    // If there's a note, set it to the state
                    if (response.note) {
                        setNoteContent(response.note);
                    }
                }
            } catch (error) {
                console.error("Error fetching appointment:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointmentDetail();
    }, [user, appointmentId]);

    const statusMappings = {
        Pending: {
            style: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 hover:text-amber-800 hover:border-amber-200",
            label: "Chờ xác nhận",
        },
        Confirmed: {
            style: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 hover:text-blue-800 hover:border-blue-200",
            label: "Đã xác nhận",
        },
        Completed: {
            style: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100 hover:text-green-800 hover:border-green-200",
            label: "Hoàn thành",
        },
        Cancelled: {
            style: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100 hover:text-red-800 hover:border-red-200",
            label: "Đã hủy",
        },
        Default: {
            style: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-200",
            label: "Không xác định",
        },
    };

    const getStatusClasses = (status) => statusMappings[status]?.style || statusMappings.Default.style;
    const getStatusLabel = (status) => statusMappings[status]?.label || statusMappings.Default.label;

    // Format date and time for display
    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return "";
        // Extract hours and minutes from the time string
        const date = new Date(timeString);
        return date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Calculate appointment duration in minutes
    const calculateDuration = (startTime, endTime) => {
        if (!startTime || !endTime) return 0;
        const start = new Date(startTime);
        const end = new Date(endTime);
        return Math.round((end - start) / (1000 * 60));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Đang tải thông tin cuộc hẹn...</p>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Không tìm thấy thông tin cuộc hẹn.</p>
            </div>
        );
    }

    // Disable actions if appointment is already cancelled or completed
    const isCancelled = appointment.status === "Cancelled";
    const isCompleted = appointment.status === "Completed";
    const disableActions = isCancelled || isCompleted;

    return (
        <>
            <Helmet>
                <title>Chi tiết cuộc hẹn</title>
            </Helmet>
            <ToastReceiver />
            <Toaster />
            <div className="flex justify-center">
                <div className="mt-8 mb-8 w-full max-w-[80%]">
                    <div className="mb-6 flex justify-between"></div>

                    {/* Main content with two-column layout */}
                    <div className="flex justify-center gap-6">
                        <div className="w-full md:w-[30%]"></div>
                        <div className="w-full max-w-5xl">
                            <Card className="border-blue-200 shadow-md">
                                <CardHeader className="bg-blue-50 flex flex-col md:flex-row justify-between items-center gap-4 p-4">
                                    {/* Back Button */}
                                    <Button
                                        variant="outline"
                                        asChild
                                        className="border-blue-600 text-blue-600 hover:bg-blue-200 hover:text-blue-800">
                                        <Link to="/user/view-appointment-list" className="flex items-center">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Quay lại lịch hẹn
                                        </Link>
                                    </Button>

                                    {/* Title & Description */}
                                    <div className="flex flex-col text-center">
                                        <CardTitle className="text-2xl font-bold">Chi tiết cuộc hẹn</CardTitle>
                                        <div className="flex flex-col md:flex-row gap-1 md:items-center md:justify-start">
                                            <p>Thông tin chi tiết về cuộc hẹn với tư vấn viên</p>
                                            <p className="font-bold">{appointment.psychologistId.fullName}</p>
                                        </div>
                                    </div>

                                    {/* Join Meeting Button */}
                                    <Button
                                        variant="outline"
                                        disabled={disableActions}
                                        className="bg-blue-600 text-white hover:bg-blue-800 hover:text-white"
                                        onClick={() => {
                                            if (appointment.status === "Confirmed" && appointment.meetingURL) {
                                                window.open(appointment.meetingURL, "_blank", "noopener,noreferrer");
                                            }
                                        }}>
                                        <Video className="mr-2 h-4 w-4" />
                                        Tham gia cuộc hẹn
                                    </Button>
                                </CardHeader>

                                <CardContent className="p-6">
                                    <div className="flex-1">
                                        <Card className="shadow-sm border-blue-100">
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-center mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Hash className="h-6 w-6 text-blue-600" />
                                                        <h3 className="text-xl font-medium">
                                                            Mã cuộc hẹn: {appointment._id}
                                                        </h3>
                                                    </div>
                                                    <Badge
                                                        className={`${getStatusClasses(
                                                            appointment.status
                                                        )} font-medium text-sm h-9 w-21 flex justify-center`}>
                                                        {getStatusLabel(appointment.status)}
                                                    </Badge>
                                                </div>

                                                <Separator className="my-4 bg-blue-100" />

                                                <div className="max-w-[750px] min-w-[750px] flex flex-row justify-between items-start gap-6 px-4 py-4">
                                                    <div className="flex flex-col gap-4">
                                                        <div className="flex items-center text-start gap-4">
                                                            <User className="h-6 w-6 text-blue-600" />
                                                            <div>
                                                                <p className="font-bold">Thông tin tư vấn viên</p>
                                                                <p>{appointment.psychologistId.fullName}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center text-start gap-4">
                                                            <School className="h-6 w-6 text-blue-600" />
                                                            <div>
                                                                <p className="font-bold">Chuyên ngành</p>
                                                                <p className="text-sm text-gray-600">
                                                                    {
                                                                        appointment.psychologistId.psychologist
                                                                            .psychologistProfile.professionalLevel
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center text-start gap-4">
                                                            <Mail className="h-6 w-6 text-blue-600" />
                                                            <div>
                                                                <p className="font-bold">Email</p>
                                                                <p>{appointment.psychologistId.email}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center text-start gap-4">
                                                            <Phone className="h-6 w-6 text-blue-600" />
                                                            <div>
                                                                <p className="font-bold">Số điện thoại</p>
                                                                <p>{appointment.psychologistId.phone}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-4">
                                                        <div className="flex items-center text-start gap-4">
                                                            <Calendar className="h-6 w-6 text-blue-600" />
                                                            <div>
                                                                <p className="font-bold">Ngày hẹn</p>
                                                                <p>{formatDate(appointment.scheduledTime.date)}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center text-start gap-4">
                                                            <Clock className="h-6 w-6 text-blue-600" />
                                                            <div>
                                                                <p className="font-bold">Thời gian</p>
                                                                <p>
                                                                    {formatTime(appointment.scheduledTime.startTime)} -{" "}
                                                                    {formatTime(appointment.scheduledTime.endTime)} (
                                                                    {calculateDuration(
                                                                        appointment.scheduledTime.startTime,
                                                                        appointment.scheduledTime.endTime
                                                                    )}{" "}
                                                                    phút)
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {appointment.cancelReason && (
                                                    <>
                                                        <Separator className="my-4 bg-blue-100" />
                                                        <Alert
                                                            variant="destructive"
                                                            className="mt-4 px-4 py-4 text-start">
                                                            <AlertDescription>
                                                                <span className="font-semibold">Lý do hủy:</span>{" "}
                                                                {appointment.cancelReason}
                                                            </AlertDescription>
                                                        </Alert>
                                                    </>
                                                )}

                                                {appointment.rescheduleReason && (
                                                    <Alert
                                                        variant="info"
                                                        className="mt-4 bg-blue-50 border-blue-200 text-blue-800 px-4 py-4 text-start">
                                                        <AlertDescription>
                                                            <span className="font-semibold">Lý do đổi lịch:</span>{" "}
                                                            {appointment.rescheduleReason}
                                                        </AlertDescription>
                                                    </Alert>
                                                )}

                                                <Separator className="my-4 bg-blue-100" />

                                                <div className="mb-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-5 w-5 text-blue-600" />
                                                            <h4 className="font-semibold m-0">Ghi chú</h4>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="m-0 text-start px-4 py-2 border rounded-lg bg-gray-100"
                                                        dangerouslySetInnerHTML={{
                                                            __html: appointment.note || "Không có ghi chú",
                                                        }}
                                                    />
                                                </div>

                                                <Separator className="my-4 bg-blue-100" />

                                                <div className="flex flex-wrap justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                                                        onClick={() => setOpenCancel(true)}
                                                        disabled={disableActions}>
                                                        <X className="mr-2 h-4 w-4" />
                                                        Hủy cuộc hẹn
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setOpenReschedule(true)}
                                                        disabled={disableActions}
                                                        className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:text-blue-700">
                                                        <RefreshCw className="mr-2 h-4 w-4" />
                                                        Đổi lịch hẹn
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="w-full md:w-[30%]">
                            <PaymentInformation paymentInfo={appointment.paymentInformation} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Dialogs - Only shown when triggered */}
            {/* Cancel Dialog */}
            <Dialog open={openCancel} onOpenChange={setOpenCancel}>
                <DialogContent className="border-blue-200">
                    <DialogHeader className="bg-blue-50 p-4 rounded-t-lg">
                        <DialogTitle className="text-blue-800">Xác nhận hủy cuộc hẹn</DialogTitle>
                        <DialogDescription className="text-blue-600">
                            Bạn có chắc muốn hủy cuộc hẹn với {appointment.psychologistId.fullName} vào ngày{" "}
                            {formatDate(appointment.scheduledTime.date)} lúc{" "}
                            {formatTime(appointment.scheduledTime.startTime)}? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            id="cancel-reason"
                            placeholder="Vui lòng nhập lý do hủy cuộc hẹn"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            className="min-h-24 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                        />
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setOpenCancel(false)}
                            className="sm:w-auto w-full border-blue-300 text-blue-600 hover:bg-blue-50">
                            Trở lại
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                // Handle cancel appointment logic here
                                setOpenCancel(false);
                            }}
                            className="sm:w-auto w-full bg-red-600 hover:bg-red-700">
                            Xác nhận hủy
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reschedule Dialog */}
            <Dialog open={openReschedule} onOpenChange={setOpenReschedule}>
                <DialogContent className="border-blue-200">
                    <DialogHeader className="bg-blue-50 p-4 rounded-t-lg">
                        <DialogTitle className="text-blue-800">Đổi lịch hẹn</DialogTitle>
                        <DialogDescription className="text-blue-600">
                            Chọn ngày và giờ mới cho cuộc hẹn với {appointment.psychologistId.fullName}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="new-date" className="text-sm font-medium text-blue-700">
                                    Ngày hẹn mới
                                </label>
                                <Input
                                    id="new-date"
                                    type="date"
                                    value={rescheduleDate}
                                    onChange={(e) => setRescheduleDate(e.target.value)}
                                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="new-time" className="text-sm font-medium text-blue-700">
                                    Thời gian mới
                                </label>
                                <Input
                                    id="new-time"
                                    type="time"
                                    value={rescheduleTime}
                                    onChange={(e) => setRescheduleTime(e.target.value)}
                                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                                />
                            </div>
                        </div>
                        <div className="space-y-2 mt-4">
                            <label htmlFor="reschedule-reason" className="text-sm font-medium text-blue-700">
                                Lý do đổi lịch (sẽ thông báo đến tư vấn viên) *
                            </label>
                            <Textarea
                                id="reschedule-reason"
                                placeholder="Vui lòng nhập lý do đổi lịch"
                                value={rescheduleReason}
                                onChange={(e) => setRescheduleReason(e.target.value)}
                                className="min-h-16 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setOpenReschedule(false)}
                            className="sm:w-auto w-full border-blue-300 text-blue-600 hover:bg-blue-50">
                            Hủy bỏ
                        </Button>
                        <Button
                            variant="default"
                            onClick={() => {
                                // Handle reschedule appointment logic here
                                setOpenReschedule(false);
                            }}
                            disabled={!rescheduleDate || !rescheduleTime || !rescheduleReason}
                            className="sm:w-auto w-full bg-blue-600 hover:bg-blue-700">
                            Xác nhận đổi lịch
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Notes Dialog */}
            <Dialog open={openNotes} onOpenChange={setOpenNotes}>
                <DialogContent className="border-blue-200">
                    <DialogHeader className="bg-blue-50 p-4 rounded-t-lg">
                        <DialogTitle className="text-blue-800">Chỉnh sửa ghi chú</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            id="notes"
                            placeholder="Nhập ghi chú về cuộc hẹn"
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            className="min-h-32 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                        />
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setOpenNotes(false)}
                            className="sm:w-auto w-full border-blue-300 text-blue-600 hover:bg-blue-50">
                            Hủy bỏ
                        </Button>
                        <Button
                            variant="default"
                            onClick={() => {
                                // Handle save notes logic here
                                setOpenNotes(false);
                            }}
                            className="sm:w-auto w-full bg-blue-600 hover:bg-blue-700">
                            Lưu ghi chú
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ViewAppointmentDetail;
