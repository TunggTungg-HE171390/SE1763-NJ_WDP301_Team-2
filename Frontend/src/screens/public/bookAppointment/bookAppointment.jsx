import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";
import { RichTextEditor } from "@mantine/rte";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Helmet } from "react-helmet-async";
import ToastReceiver from "@/components/common/toast/toast-receiver";
import * as API from "@/api";
import { useLocation, useNavigate } from "react-router-dom";
import { setToast } from "@/components/common/toast/setToast";

const appointmentSchema = z.object({
    symptoms: z.string().min(17, "Vui lòng nhập ít nhất 10 ký tự"),
    images: z.array(z.any()).optional(),
});

const BookAppointment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const [psychologist, setPsychologist] = useState(null);
    const [schedule, setSchedule] = useState(null);
    const [symptoms, setSymptoms] = useState("");

    const {
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(appointmentSchema),
    });

    // Ensure form recognizes changes in symptoms
    useEffect(() => {
        setValue("symptoms", symptoms, { shouldValidate: true });
    }, [symptoms, setValue]);

    const searchParams = new URLSearchParams(location.search);
    const psychologistId = searchParams.get("psychologistId");
    const scheduleId = searchParams.get("scheduleId");

    useEffect(() => {
        const fetchPsychologist = async () => {
            if (!psychologistId) return;
            try {
                const response = await API.getPsychologist(psychologistId);
                setPsychologist(response.data.data);
            } catch (error) {
                console.error("Error fetching psychologist data:", error);
            }
        };
        fetchPsychologist();
    }, [psychologistId]);

    const profile = psychologist?.psychologist?.psychologistProfile;

    useEffect(() => {
        const fetchSchedule = async () => {
            if (!scheduleId) return;
            try {
                const response = await API.getScheduleById(scheduleId);
                setSchedule(response.data);
            } catch (error) {
                console.error("Error fetching schedule data:", error);
            }
        };
        fetchSchedule();
    }, [scheduleId]);

    const onSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("userId", user._id);
            formData.append("psychologistId", psychologistId);
            formData.append("scheduleId", scheduleId);
            formData.append("symptoms", symptoms);

            console.log(formData.get("userId")); // Should log user._id
            console.log(formData.get("psychologistId")); // Should log psychologistId
            console.log(formData.get("scheduleId")); // Should log scheduleId
            console.log(formData.get("symptoms")); // Should log symptoms

            const response = await API.saveAppointment(formData);

            setToast({
                title: "Đặt lịch thành công!",
                description: "Bạn đã đặt lịch hẹn thành công.",
                actionText: "Đóng",
                titleColor: "text-green-600",
                className: "text-start",
            });

            if (response.data?.appointmentId) {
                navigate(`/finish-booking?appointmentId=${response.data.appointmentId}`);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Lỗi đặt lịch",
                description: error.response?.data?.message || "Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại!",
                action: <ToastAction altText="Close">Thử lại</ToastAction>,
            });
        }
    };

    return (
        <>
            <Helmet>
                <title>Đặt lịch khám</title>
            </Helmet>
            <ToastReceiver />
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-center text-xl font-medium mb-6">Thông tin đặt khám</h1>
                {/* Progress Steps */}
                <div className="mb-10 relative">
                    <div className="w-full bg-gray-200 h-1 absolute top-5 left-0"></div>
                    <div className="w-1/3 bg-blue-600 h-1 absolute top-5 left-0"></div>

                    <div className="flex justify-between relative">
                        <div className="text-center">
                            <div className="w-10 h-10 rounded-full bg-blue-600 mx-auto flex items-center justify-center text-white">
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
                            </div>
                            <p className="mt-2 text-sm text-blue-600 font-medium">Thông tin đặt khám</p>
                        </div>

                        <div className="text-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 mx-auto flex items-center justify-center">
                                <span className="text-gray-500">2</span>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">Thanh toán</p>
                        </div>

                        <div className="text-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 mx-auto flex items-center justify-center">
                                <span className="text-gray-500">3</span>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">Hoàn thành đặt khám</p>
                        </div>
                    </div>
                </div>
                {/* User Information */}
                <Card className="mb-4">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-[5vh] h-[5vh]">
                                {user?.avatar ? (
                                    <AvatarImage src={user.avatar} alt={user.fullName} />
                                ) : (
                                    <AvatarFallback>{user?.fullName?.charAt(0) || "A"}</AvatarFallback>
                                )}
                            </Avatar>
                            <div className="text-left">
                                {user ? (
                                    <>
                                        <p className="font-medium">{user.fullName}</p>
                                        <p className="text-gray-600">{user.email}</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-medium">Người tới khám</p>
                                        <p className="text-red-500">Bạn chưa đăng nhập</p>
                                        <Link to="/login">
                                            <Button variant="link" className="p-0 h-auto text-sm text-gray-800">
                                                Đăng nhập ngay
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* Schedule Information */}
                <Card className="mb-4">
                    <CardContent className="py-4 flex justify-between items-center">
                        <p className="font-medium">Giờ hẹn:</p>
                        {schedule ? (
                            <div className="flex items-center gap-2">
                                <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-normal">
                                    {new Date(schedule.startTime).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    })}{" "}
                                    -{" "}
                                    {new Date(schedule.endTime).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    })}
                                </Badge>
                                <span>{new Date(schedule.date).toLocaleDateString()}</span>
                            </div>
                        ) : (
                            <p className="text-gray-500">Chưa chọn lịch hẹn</p>
                        )}
                    </CardContent>
                </Card>

                {/* Psychologist Information */}
                <Card className="mb-4">
                    <CardContent className="pt-6">
                        {psychologist ? (
                            <div className="flex items-center justify-between gap-4">
                                {/* Left Section - Avatar & Profile Info */}
                                <div className="flex gap-4">
                                    <Avatar className="w-12 h-12">
                                        {psychologist.avatar ? (
                                            <AvatarImage src={psychologist.avatar} alt={psychologist.fullName} />
                                        ) : (
                                            <AvatarFallback>{psychologist.fullName?.charAt(0) || "?"}</AvatarFallback>
                                        )}
                                    </Avatar>

                                    <div className="text-left">
                                        <h3 className="font-medium">Tư vấn trực tuyến với {psychologist.fullName}</h3>
                                        <div className="mt-1 flex flex-wrap gap-2 max-w-[200px]">
                                            <Badge variant="outline" className="bg-slate-200 rounded-md">
                                                {profile.professionalLevel}
                                            </Badge>
                                            <Badge variant="outline" className="bg-slate-200 rounded-md">
                                                {profile.educationalLevel}
                                            </Badge>
                                            <Badge variant="outline" className="bg-slate-200 rounded-md">
                                                {profile.specialization}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section - Price */}
                                <div className="text-right flex flex-col items-end justify-start">
                                    <span className="text-lg font-semibold text-blue-600">350.000 đ</span>
                                    <p className="text-sm text-gray-500">một phiên</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">
                                <p>Không thể tải dữ liệu bác sĩ.</p>
                                <p>Vui lòng thử lại sau.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Symptom Input */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card className="mb-4">
                        <CardContent className="pt-6">
                            <label className="block font-medium mb-1 text-left">
                                Triệu chứng <span className="text-red-500">*</span>
                            </label>
                            <RichTextEditor
                                value={symptoms}
                                onChange={(value) => {
                                    const sanitizedValue = value.trim();
                                    setSymptoms(sanitizedValue);
                                    setValue("symptoms", sanitizedValue, { shouldValidate: true }); // Trigger validation
                                }}
                            />
                            {errors.symptoms && (
                                <p className="text-red-500 text-sm text-end">{errors.symptoms.message}</p>
                            )}
                        </CardContent>
                    </Card>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-md">
                        ĐẶT KHÁM
                    </Button>
                </form>
            </div>
        </>
    );
};

export default BookAppointment;
