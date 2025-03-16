import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import ToastReceiver from "@/components/common/toast/toast-receiver";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import * as API from "@/api";
import { useAuth } from "@/hooks/useAuth";

const FinishBooking = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchParams] = useSearchParams(); // Retrieve search params from the URL
    const appointmentId = searchParams.get("appointmentId"); // Extract appointmentId
    const [progressStage, setProgressStage] = useState(0);
    const [appointmentDetails, setAppointmentDetails] = useState(null);
    const [isSuccess, setSuccess] = useState();

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
                    if (response.data.status === "Confirmed") {
                        setSuccess(true);
                    } else if (response.data.status === "Cancelled") {
                        setSuccess(false);
                    }
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

    const handleTryAgain = () => {
        // Navigate back to the booking page or another appropriate page
        navigate("/doctor");
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
            return `w-10 h-10 rounded-full ${
                isSuccess ? "bg-blue-600" : "bg-red-600"
            } mx-auto flex items-center justify-center text-white transition-colors duration-300`;
        }
        return "w-10 h-10 rounded-full bg-gray-200 mx-auto flex items-center justify-center text-gray-500 transition-colors duration-300";
    };

    const getStepTextClass = (stepNumber) => {
        if (progressStage >= stepNumber) {
            return `mt-2 text-sm ${
                isSuccess ? "text-blue-600" : "text-red-600"
            } font-medium transition-colors duration-300`;
        }
        return "mt-2 text-sm text-gray-500 transition-colors duration-300";
    };

    // Send the email after appointment details are fetched
    useEffect(() => {
        if (appointmentDetails && isSuccess) {
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
                <p><strong>Giá tiền:</strong> 350.000 đ</p>
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
    }, [appointmentDetails, user, isSuccess]);

    // If appointmentDetails is null, show loading spinner or message
    if (!appointmentDetails && isSuccess) {
        return <div>Loading appointment details...</div>;
    }

    return (
        <>
            <Helmet>
                <title>{isSuccess ? "Đặt khám thành công" : "Đặt khám thất bại"}</title>
            </Helmet>
            <ToastReceiver />
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-center text-xl font-medium mb-6">
                    {isSuccess ? "Hoàn thành đặt khám" : "Đặt khám thất bại"}
                </h1>
                {/* Progress Steps */}
                <div className="mb-10 relative">
                    <div className="w-full bg-gray-200 h-1 absolute top-5 left-0"></div>
                    <div
                        className={`${
                            isSuccess ? "bg-blue-600" : "bg-red-600"
                        } h-1 absolute top-5 left-0 ${getProgressBarClass()}`}></div>

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
                                {progressStage >= 2 && isSuccess ? (
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
                                ) : progressStage >= 2 ? (
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
                                            d="M6 18L18 6M6 6l12 12"
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
                                {progressStage >= 3 && isSuccess ? (
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
                                ) : progressStage >= 3 ? (
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
                                            d="M6 18L18 6M6 6l12 12"
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

                {/* Success/Failure Message - Only show when animation is complete */}
                <div className={`transition-opacity duration-500 ${progressStage === 3 ? "opacity-100" : "opacity-0"}`}>
                    {isSuccess ? (
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
                                        Vui lòng chuẩn bị trước 10 phút và đảm bảo kết nối internet ổn định cho buổi tư
                                        vấn trực tuyến.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="mb-6">
                            <CardContent className="pt-6 text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8 text-red-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-semibold text-red-600 mb-2">Đặt khám thất bại!</h2>
                                <p className="text-gray-600 mb-4">
                                    Đã xảy ra lỗi trong quá trình thanh toán hoặc đặt lịch. Vui lòng thử lại sau.
                                </p>
                                <div className="border-t border-gray-200 pt-4 mt-4">
                                    <p className="text-sm text-gray-500">
                                        Nếu bạn đã bị trừ tiền, vui lòng liên hệ với chúng tôi để được hỗ trợ.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Appointment Summary - Only show for success */}
                    {appointmentDetails && (
                        <Card className="mb-6">
                            <CardContent className="pt-6">
                                <h3 className="font-medium mb-4 text-gray-800">Thông tin lịch hẹn</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                        <span className="text-gray-600">Ngày giờ:</span>
                                        <span className="font-medium">
                                            {new Date(appointmentDetails.scheduledTime.date).toLocaleDateString(
                                                "vi-VN",
                                                {
                                                    weekday: "long", // Optional: show day of the week
                                                    year: "numeric",
                                                    month: "numeric",
                                                    day: "numeric",
                                                }
                                            )}{" "}
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
                                        <span className="font-medium">
                                            {appointmentDetails.psychologistId.fullName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                        <span className="text-gray-600">Hình thức:</span>
                                        <span className="font-medium">Tư vấn trực tuyến</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Giá tiền:</span>
                                        <span className="font-medium text-blue-600">350.000 đ</span>
                                    </div>
                                    {isSuccess ? (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Trạng thái:</span>
                                            <span className="font-medium text-green-600">Thành công</span>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Trạng thái:</span>
                                            <span className="font-medium text-red-600">Bị từ chối</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-4">
                        {isSuccess ? (
                            <>
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
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={handleTryAgain}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-6 rounded-md">
                                    THỬ LẠI
                                </Button>
                                <Button
                                    onClick={handleGoHome}
                                    variant="outline"
                                    className="flex-1 border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 py-6 rounded-md">
                                    VỀ TRANG CHỦ
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default FinishBooking;
