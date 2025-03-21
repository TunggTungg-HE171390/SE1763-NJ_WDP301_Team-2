import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Helmet } from "react-helmet-async";
import ToastReceiver from "@/components/common/toast/toast-receiver";
import * as API from "@/api";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import AppointmentListView from "./components/AppointmentListView";
import AppointmentCalendarView from "./components/AppointmentCalendarView";

const AppointmentManagementPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                if (user?._id) {
                    const response = await API.getAppointmentListByUserId(user._id);
                    // Handle the array response from the API
                    if (Array.isArray(response.data.appointments)) {
                        setAppointments(response.data.appointments);
                    } else {
                        console.error("Unexpected API response format:", response.data);
                        setAppointments([]);
                    }
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };

        fetchAppointments();
    }, [user]);

    // Parse time string to Date object
    const parseTime = (timeString) => {
        if (!timeString) return new Date();
        // Handle different time formats
        if (typeof timeString === "string" && timeString.includes("GMT")) {
            // Format: "Tue Mar 18 2025 17:30:00 GMT+0700 (Indochina Time)"
            return new Date(timeString);
        } else {
            // Format: "2025-03-18T10:30:00.000Z"
            return new Date(timeString);
        }
    };

    // Format date to display
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString("vi-VN", options);
    };

    // Format time to display
    const formatTime = (timeString) => {
        if (!timeString) return "";
        const time = parseTime(timeString);
        return time.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    };

    // Get color based on status
    const getStatusColor = (status) => {
        switch (status) {
            case "Confirmed":
                return "#2563eb"; // blue-600
            case "Pending":
                return "#d97706"; // amber-600
            case "Completed":
                return "#059669"; // green-600
            case "Cancelled":
                return "#dc2626"; // red-600
            default:
                return "#4b5563"; // gray-600
        }
    };

    // Handle appointment click
    const handleAppointmentClick = (appointmentId) => {
        // Here you would implement navigation to the appointment detail page
        navigate(`/user/view-appointment-detail/${appointmentId}`);
    };

    // Vietnamese translations for statuses
    const statusTranslations = {
        Pending: "Đang chờ",
        Confirmed: "Đã xác nhận",
        Completed: "Đã hoàn thành",
        Cancelled: "Bị từ chối",
    };

    // Utility functions and data to pass to child components
    const utils = {
        parseTime,
        formatDate,
        formatTime,
        getStatusColor,
        handleAppointmentClick,
        statusTranslations,
    };

    return (
        <>
            <Helmet>
                <title>Đặt tư vấn từ danh sách chuyên viên</title>
            </Helmet>
            <ToastReceiver />
            <div className="container mx-auto py-6 max-w-6xl">
                <h1 className="text-3xl font-bold mb-6 text-blue-700">Cuộc hẹn của bạn</h1>

                <Tabs defaultValue="list" className="space-y-4">
                    <div className="flex justify-start items-center space-x-4">
                        <TabsList className="bg-blue-50">
                            <TabsTrigger
                                value="list"
                                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                                Danh sách
                            </TabsTrigger>
                            <TabsTrigger
                                value="calendar"
                                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                                Lịch
                            </TabsTrigger>
                        </TabsList>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="text-gray-400 h-5 w-5" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Lịch sẽ chỉ hiển thị những cuộc hẹn đã xác nhận</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    {/* List View Tab Content */}
                    <TabsContent value="list" className="space-y-4">
                        <AppointmentListView appointments={appointments} utils={utils} />
                    </TabsContent>

                    {/* Calendar View Tab Content */}
                    <TabsContent value="calendar">
                        <AppointmentCalendarView appointments={appointments} utils={utils} />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
};

export default AppointmentManagementPage;
