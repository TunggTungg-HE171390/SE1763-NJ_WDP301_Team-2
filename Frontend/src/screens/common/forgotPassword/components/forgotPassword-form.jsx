import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
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
import { forgotPassword } from "../../../../api/user.api";

const FormSchema = z.object({
  contact: z.string().refine(
    (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Accepts international phone formats
      return emailRegex.test(value) || phoneRegex.test(value);
    },
    { message: "Invalid email or phone number" }
  ),
});

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      contact: "",
    },
  });

  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      // Gửi OTP đến email/số điện thoại của người dùng
      await API.forgotPassword({ contact: data.contact });

      // Hiển thị thông báo khi gửi OTP thành công
      setToast({
        title: "OTP Sent",
        description: "We have sent an OTP to your email/phone.",
        actionText: "Close",
        titleColor: "text-green-600",
        className: "text-start",
      });

      // Điều hướng người dùng đến trang nhập OTP
      navigate("/verify", {
        state: { contact: data.contact, forgotPassword: "true" },
      });
    } catch (error) {
      // Xử lý lỗi nếu email/số điện thoại không tồn tại
      if (
        error.response?.data?.message === "Email not found" ||
        error.response?.data?.message === "Phone number not registered"
      ) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "This email/phone number is not registered with us.",
          action: <ToastAction altText="Close">Try Again</ToastAction>,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            error.response?.data?.message ||
            "There was a problem with your request.",
          action: <ToastAction altText="Close">Try Again</ToastAction>,
        });
      }
    }
  };

  return (
    <>
      <Card className="w-[400px] shadow-lg relative z-10 bg-white bg-opacity-95 backdrop-blur-md p-6 rounded-lg">
        <CardHeader className="text-center space-y-1">
          <div className="flex items-center justify-center h-full">
            <Link to="/">
              <img
                src={TeamLogo}
                alt="Team Logo"
                className="w-[61px] h-[58px] py-1"
              />
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <p className="text-sm text-gray-500">
            Please enter your email or phone number
          </p>
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
                      <FormLabel className="text-start">
                        Email or Phone Number
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="mail@example.com or +1234567890"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="flex justify-end" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-[#4262FF] hover:bg-[#3a56e0]"
              >
                Send OTP
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#fcfcfc] px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 group"
                >
                  <FaFacebook className="h-5 w-5 text-[#4262FF] group-hover:text-[#3a56e0] transition duration-200" />
                  <span className="text-sm font-medium">Facebook</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 group"
                >
                  <FcGoogle className="h-5 w-5" />
                  <span className="text-sm font-medium">Google</span>
                </Button>
              </div>

              <div className="text-center text-sm text-gray-500">
                Remember your password?{" "}
                <a
                  href="/login"
                  className="font-semibold text-[#4262FF] hover:text-[#15298b]"
                >
                  Login
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default ForgotPasswordForm;
