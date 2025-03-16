import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Form, FormControl, FormField, FormLabel, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Separator } from "@/components/ui/separator";
import TeamLogo from "@/assets/TeamLogo.svg";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { setToast } from "@/components/common/toast/setToast";
import * as API from "@/api";

const FormSchema = z
    .object({
        contact: z.string().refine(
            (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Accepts international phone formats
                return emailRegex.test(value) || phoneRegex.test(value);
            },
            { message: "Sai định dạng email hoặc số điện thoại" }
        ),
        name: z.string().min(4, { message: "Tên phải ít nhất 4 ký tự trở lên" }),
        password: z
            .string()
            .min(8, "Mật khẩu phải ít nhất 8 ký tự")
            .max(32, "Mật khẩu không được quá 32 ký tự")
            .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất một ký tự viết hoa")
            .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất một ký tự viết thường")
            .regex(/\d/, "Mật khẩu phải chứa ít nhất một chữ số"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu không trùng",
        path: ["confirmPassword"],
    });

const RegisterForm = () => {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const navigate = useNavigate();
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            contact: "",
            name: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data) => {
        if (!executeRecaptcha) {
            toast({ variant: "destructive", title: "Error", description: "reCAPTCHA not ready" });
            return;
        }

        try {
            const token = await executeRecaptcha("register");
            await API.registerUser({
                contact: data.contact,
                name: data.name,
                password: data.password,
                recaptchaToken: token,
            });

            // Store the toast message in session storage
            setToast({
                title: "Thành công!",
                description: "Đã gửi mã xác thực!",
                actionText: "Đóng",
                titleColor: "text-green-600",
                className: "text-start",
            });

            navigate("/verify", { state: { contact: data.contact } });
            // navigate("/login");
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Đã có lỗi xảy ra.",
                description: error.response?.data?.message || "Đã xảy ra sự cố với yêu cầu của bạn.",
                action: <ToastAction altText="Close">Try Again</ToastAction>,
            });
        }
    };

    return (
        <>
            <Card className="w-[400px] shadow-lg relative z-10 bg-white bg-opacity-95 backdrop-blur-md p-6 rounded-lg">
                <CardHeader className="text-center space-y-1">
                    <div className="flex items-center justify-center h-full">
                        <Link to="/">
                            <img src={TeamLogo} alt="Team Logo" className="w-[61px] h-[58px] py-1" />
                        </Link>
                    </div>
                    <CardTitle className="text-2xl font-bold">Đăng ký</CardTitle>
                    <p className="text-sm text-gray-500">Tạo tài khoản Tâm Giao của bạn</p>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="contact"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex justify-between items-start">
                                            <FormLabel className="text-start">Email hoặc Số điện thoại</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input placeholder="mail@example.com hoặc +1234567890" {...field} />
                                        </FormControl>
                                        <FormMessage className="flex justify-end" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex justify-between items-start">
                                            <FormLabel className="text-start">Tên đầy đủ</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input placeholder="Jane Doe" {...field} />
                                        </FormControl>
                                        <FormMessage className="flex justify-end" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex justify-between items-center">
                                            <FormLabel>Mật khẩu</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage className="flex justify-end" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex justify-between items-center">
                                            <FormLabel>Nhập lại mật khẩu</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage className="flex justify-end" />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full bg-[#4262FF] hover:bg-[#3a56e0]">
                                Tiếp tục
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <Separator className="w-full" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-[#fcfcfc] px-2 text-gray-500">Hoặc tiếp tục với</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    className="w-full flex items-center justify-center gap-2 group">
                                    <FaFacebook className="h-5 w-5 text-[#4262FF] group-hover:text-[#3a56e0] transition duration-200" />
                                    <span className="text-sm font-medium">Facebook</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full flex items-center justify-center gap-2 group">
                                    <FcGoogle className="h-5 w-5" />
                                    <span className="text-sm font-medium">Google</span>
                                </Button>
                            </div>

                            <div className="text-center text-sm text-gray-500">
                                Đã có tài khoản?{" "}
                                <Link to="/login" className="font-semibold text-[#4262FF] hover:text-[#15298b]">
                                    Đăng nhập
                                </Link>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    );
};
export default RegisterForm;
