import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import ToastReceiver from "@/components/common/toast/toast-receiver";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import * as API from "@/api";
import { useAuth } from "@/hooks/useAuth";

const BookingSuccess = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchParams] = useSearchParams(); // Retrieve search params from the URL
    const appointmentId = searchParams.get("appointmentId"); // Extract appointmentId
    const [progressStage, setProgressStage] = useState(0);
    const [appointmentDetails, setAppointmentDetails] = useState(null);

    useEffect(() => {
        // Start the animation sequence
        let currentStage = 0;
        const animationInterval = setInterval(() => {
            if (currentStage < 3) {
                currentStage += 1;
                setProgressStage(currentStage);
            } else {
                clearInterval(animationInterval);
            }
        }, 600); // Each stage takes 600ms

        return () => clearInterval(animationInterval);
    }, []);

    // Fetch appointment details when the appointmentId is available
    useEffect(() => {
        if (appointmentId) {
            API.getAppointmentById(appointmentId)
                .then((response) => {
                    setAppointmentDetails(response.data); // Store the fetched appointment data in state
                })
                .catch((error) => {
                    console.error("Error fetching appointment data:", error);
                });
        }
    }, [appointmentId]);

    const handleViewAppointments = () => {
        navigate("#");
    };

    const handleGoHome = () => {
        navigate("/");
    };

    // Define classes for each progress step based on the current stage
    const getProgressBarClass = () => {
        if (progressStage === 0) return "w-0";
        if (progressStage === 1) return "w-1/3 transition-all duration-500";
        if (progressStage === 2) return "w-2/3 transition-all duration-500";
        return "w-full transition-all duration-500";
    };

    const getStepClass = (stepNumber) => {
        if (progressStage >= stepNumber) {
            return "w-10 h-10 rounded-full bg-blue-600 mx-auto flex items-center justify-center text-white transition-colors duration-300";
        }
        return "w-10 h-10 rounded-full bg-gray-200 mx-auto flex items-center justify-center text-gray-500 transition-colors duration-300";
    };

    const getStepTextClass = (stepNumber) => {
        if (progressStage >= stepNumber) {
            return "mt-2 text-sm text-blue-600 font-medium transition-colors duration-300";
        }
        return "mt-2 text-sm text-gray-500 transition-colors duration-300";
    };

    // Send the email after appointment details are fetched
    useEffect(() => {
        if (appointmentDetails) {
            const email = user.email; // User's email
            const subject = "Thông báo lịch hẹn khám của bạn"; // Email subject
            const content = `
                <h3>Thông báo về lịch hẹn khám</h3>
                <p>Chào ${user?.fullName},</p>
                <p>Chúng tôi xin thông báo về lịch hẹn khám của bạn với chuyên gia ${
                    appointmentDetails.psychologistId.fullName
                }.</p>
                <p><strong>Thông tin lịch hẹn:</strong></p>
                <p><strong>Ngày:</strong> ${new Date(appointmentDetails.scheduledTime.date).toLocaleDateString(
                    "vi-VN",
                    {
                        weekday: "long",
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                    }
                )}</p> 
                <p><strong>Giờ:</strong> ${new Date(appointmentDetails.scheduledTime.startTime).toLocaleTimeString(
                    "vi-VN",
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    }
                )} đến ${new Date(appointmentDetails.scheduledTime.endTime).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            })}</p>
                <p><strong>Chuyên gia tư vấn:</strong> ${appointmentDetails.psychologistId.fullName}</p>
                <p><strong>Hình thức:</strong> Tư vấn trực tuyến</p>
                <p><strong>Giá tiền:</strong> 150.000 đ</p>
                <p>Vui lòng chuẩn bị trước 10 phút và đảm bảo kết nối internet ổn định cho buổi tư vấn trực tuyến.</p>
                <p>Trân trọng,</p>
                <p>Đội ngũ hỗ trợ</p>
            `;

            // Send the email via the API
            API.sendEmail({ email, subject, content })
                .then((response) => {
                    console.log("Email sent successfully:", response);
                })
                .catch((error) => {
                    console.error("Error sending email:", error);
                });
        }
    }, [appointmentDetails, user]);

    // If appointmentDetails is null, show loading spinner or message
    if (!appointmentDetails) {
        return <div>Loading appointment details...</div>;
    }

    return (
        <>
            <Helmet>
                <title>Đặt khám thành công</title>
            </Helmet>
            <ToastReceiver />
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-center text-xl font-medium mb-6">Hoàn thành đặt khám</h1>
                {/* Progress Steps */}
                <div className="mb-10 relative">
                    <div className="w-full bg-gray-200 h-1 absolute top-5 left-0"></div>
                    <div className={`bg-blue-600 h-1 absolute top-5 left-0 ${getProgressBarClass()}`}></div>

                    <div className="flex justify-between relative">
                        <div className="text-center">
                            <div className={getStepClass(1)}>
                                {progressStage >= 1 ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ) : (
                                    <span>1</span>
                                )}
                            </div>
                            <p className={getStepTextClass(1)}>Thông tin đặt khám</p>
                        </div>

                        <div className="text-center">
                            <div className={getStepClass(2)}>
                                {progressStage >= 2 ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ) : (
                                    <span>2</span>
                                )}
                            </div>
                            <p className={getStepTextClass(2)}>Thanh toán</p>
                        </div>

                        <div className="text-center">
                            <div className={getStepClass(3)}>
                                {progressStage >= 3 ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ) : (
                                    <span>3</span>
                                )}
                            </div>
                            <p className={getStepTextClass(3)}>Hoàn thành đặt khám</p>
                        </div>
                    </div>
                </div>

                {/* Success Message - Only show when animation is complete */}
                <div className={`transition-opacity duration-500 ${progressStage === 3 ? "opacity-100" : "opacity-0"}`}>
                    <Card className="mb-6">
                        <CardContent className="pt-6 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-green-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-green-600 mb-2">Đặt khám thành công!</h2>
                            <p className="text-gray-600 mb-4">
                                Chúng tôi đã gửi thông tin chi tiết về cuộc hẹn tới email của bạn.
                            </p>
                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <p className="text-sm text-gray-500">
                                    Vui lòng chuẩn bị trước 10 phút và đảm bảo kết nối internet ổn định cho buổi tư vấn
                                    trực tuyến.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Appointment Summary */}
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <h3 className="font-medium mb-4 text-gray-800">Thông tin lịch hẹn</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                    <span className="text-gray-600">Ngày giờ:</span>
                                    <span className="font-medium">
                                        {new Date(appointmentDetails.scheduledTime.date).toLocaleDateString("vi-VN", {
                                            weekday: "long", // Optional: show day of the week
                                            year: "numeric",
                                            month: "numeric",
                                            day: "numeric",
                                        })}{" "}
                                        -{" "}
                                        {new Date(appointmentDetails.scheduledTime.startTime).toLocaleTimeString(
                                            "vi-VN",
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false,
                                            }
                                        )}{" "}
                                        đến{" "}
                                        {new Date(appointmentDetails.scheduledTime.endTime).toLocaleTimeString(
                                            "vi-VN",
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false,
                                            }
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                    <span className="text-gray-600">Chuyên gia tư vấn:</span>
                                    <span className="font-medium">{appointmentDetails.psychologistId.fullName}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                    <span className="text-gray-600">Hình thức:</span>
                                    <span className="font-medium">Tư vấn trực tuyến</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Giá tiền:</span>
                                    <span className="font-medium text-blue-600">150.000 đ</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-4">
                        <Button
                            onClick={handleViewAppointments}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-md">
                            XEM LỊCH HẸN CỦA TÔI
                        </Button>
                        <Button
                            onClick={handleGoHome}
                            variant="outline"
                            className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 py-6 rounded-md">
                            VỀ TRANG CHỦ
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookingSuccess;
