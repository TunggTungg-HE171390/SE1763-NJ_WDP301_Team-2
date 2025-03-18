import { Helmet } from "react-helmet-async";
import ToastReceiver from "@/components/common/toast/toast-receiver";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { usePayOS } from "payos-checkout";
import * as API from "@/api";
// import { useAuth } from "@/hooks/useAuth";

const BookingSuccess = () => {
    const navigate = useNavigate();
    // const { user } = useAuth();
    const [searchParams] = useSearchParams(); // Retrieve search params from the URL
    const appointmentId = searchParams.get("appointmentId"); // Extract appointmentId
    const [progressStage, setProgressStage] = useState(0);
    const [appointmentDetails, setAppointmentDetails] = useState(null);
    const payOSInitialized = useRef(false); // Prevent multiple init calls
    const pollingRef = useRef(null);

    const [payOSConfig, setPayOSConfig] = useState({
        RETURN_URL: "https://tamgiao.github.io/tamgiao/#/",
        ELEMENT_ID: "embedded-payment-container",
        CHECKOUT_URL: null,
        embedded: true,
        onSuccess: () => {},
    });

    const { open } = usePayOS(payOSConfig);

    // Fetch appointment details when component mounts
    useEffect(() => {
        if (appointmentId) {
            API.getAppointmentById(appointmentId)
                .then((response) => {
                    setAppointmentDetails(response.data);
                    // Set payment link for PayOS
                    if (response.data.paymentInformation.checkoutUrl) {
                        setPayOSConfig((oldConfig) => ({
                            ...oldConfig,
                            CHECKOUT_URL: response.data.paymentInformation.checkoutUrl,
                        }));
                    }
                })
                .catch((error) => {
                    console.error("Error fetching appointment data:", error);
                });
        }
    }, [appointmentId]);

    useEffect(() => {
        if (payOSConfig.CHECKOUT_URL && !payOSInitialized.current) {
            payOSInitialized.current = true; // Prevent future calls
            open();
        }
    }, [payOSConfig.CHECKOUT_URL, open]);

    useEffect(() => {
        if (payOSConfig.CHECKOUT_URL && !pollingRef.current) {
            console.log("Opening PayOS checkout...");
            pollingRef.current = setInterval(async () => {
                try {
                    const response = await API.getAppointmentById(appointmentId);
                    const orderCode = response.data.paymentInformation.orderCode;
                    const responsePayment = await API.checkPaymentStatus({ orderCode });

                    if (responsePayment.data.status === "PAID") {
                        console.log("✅ Payment completed, triggering onSuccess...");

                        // Clear the interval before proceeding
                        clearInterval(pollingRef.current);
                        pollingRef.current = null;

                        // Wait for 5 seconds
                        await new Promise((resolve) => setTimeout(resolve, 5000));

                        // Continue execution
                        // await API.confirmPayment({ appointmentId });
                        navigate(`/finish-booking?appointmentId=${appointmentId}`);
                    } else if (responsePayment.data.status === "EXPIRED") {
                        console.log("❌ Payment expired, redirecting...");
                        clearInterval(pollingRef.current);
                        pollingRef.current = null;
                        navigate(`/finish-booking?appointmentId=${appointmentId}`);
                    }
                } catch (error) {
                    console.error("Error checking payment status:", error);
                }
            }, 10000); // Check every 10 seconds
        }

        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
        };
    }, [appointmentId, navigate, payOSConfig.CHECKOUT_URL]);

    const handleCancelAppointment = async () => {
        if (!appointmentId) {
            console.error("No appointment ID found.");
            return;
        }

        const confirmCancel = window.confirm("Bạn có chắc muốn hủy lịch hẹn này?");
        if (!confirmCancel) return;

        try {
            // Cancel appointment
            await API.cancelPayment({ appointmentId });
            alert("Lịch hẹn đã được hủy.");

            // Stop polling if active
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }

            navigate(`/finish-booking?appointmentId=${appointmentId}`);
        } catch (error) {
            console.error("Error canceling appointment:", error);
            alert("Có lỗi xảy ra khi hủy lịch hẹn.");
        }
    };

    useEffect(() => {
        // Start the animation sequence - Modified to stop at stage 2
        let currentStage = 0;
        const animationInterval = setInterval(() => {
            if (currentStage < 2) {
                // Changed from 3 to 2
                currentStage += 1;
                setProgressStage(currentStage);
            } else {
                clearInterval(animationInterval);
            }
        }, 600); // Each stage takes 600ms

        return () => clearInterval(animationInterval);
    }, []);

    // Define classes for each progress step based on the current stage
    const getProgressBarClass = () => {
        if (progressStage === 0) return "w-0";
        if (progressStage === 1) return "w-1/3 transition-all duration-500";
        return "w-2/3 transition-all duration-500"; // Stops at 2/3 width for stage 2
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

    // If appointmentDetails is null, show loading spinner or message
    if (!appointmentDetails) {
        return <div>Loading appointment details...</div>;
    }

    return (
        <>
            <Helmet>
                <title>Thanh toán tư vấn</title>
            </Helmet>
            <ToastReceiver />
            <div className="min-w-[920px] max-w-[920px] mx-auto p-6">
                <h1 className="text-center text-xl font-medium mb-6">Thanh toán</h1>
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
                                {/* Always show "2" for step 2, never the check icon */}
                                <span>2</span>
                            </div>
                            <p className={getStepTextClass(2)}>Thanh toán</p>
                        </div>

                        <div className="text-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 mx-auto flex items-center justify-center text-gray-500">
                                <span>3</span>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">Hoàn thành đặt khám</p>
                        </div>
                    </div>
                </div>

                {/* Success Message - Show when animation reaches stage 2 */}
                <div className={`transition-opacity duration-500 ${progressStage >= 2 ? "opacity-100" : "opacity-0"}`}>
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
                                    <span className="font-medium text-blue-600">350.000 đ</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Card */}
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <h3 className="font-medium text-gray-800">Thanh toán</h3>
                            <>
                                <div className="mb-4">
                                    <p className="text-gray-600 mb-2">
                                        Vui lòng thanh toán để hoàn tất đặt lịch hẹn của bạn.
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Sau khi thực hiện thanh toán thành công, vui lòng đợi từ 5 - 10s để hệ thống tự
                                        động cập nhật.
                                    </p>
                                </div>
                                {/* Payment container */}
                                <div id="embedded-payment-container" className="h-[350px]"></div>
                            </>
                        </CardContent>
                    </Card>
                    {/* Action Buttons */}

                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            className="border-gray-300 text-gray-600 hover:bg-gray-50 py-4 rounded-md"
                            onClick={handleCancelAppointment}>
                            HỦY ĐẶT LỊCH
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookingSuccess;
