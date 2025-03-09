import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import TeamLogo from "@/assets/TeamLogo.svg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { setToast } from "@/components/common/toast/setToast";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import * as API from "@/api";
import { useAuth } from "@/hooks/useAuth";

const VerifyTokenForm = () => {
    const [otp, setOtp] = useState("");
    const { toast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useAuth();

    const contact = location.state?.contact || ""; // Passed from register page

    const onSubmit = async () => {
        try {
            API.verifyOTP({ contact, otp });
            console.log(contact);

            // After OTP is verified, store user data in AuthContext
            // setUser({ contact }); // You can store more user details here, like name, email, etc.

            setToast({
                title: "Thành công!",
                description: "Xác thực thành công!",
                actionText: "Đóng",
                titleColor: "text-green-600",
                className: "text-start",
            });

            if (location.state?.forgotPassword) {
                navigate("/changePassword", { state: { contact } });
            } else {
                // Nếu không phải reset mật khẩu, điều hướng về trang login (hoặc trang khác)
                navigate("/login");
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Xác thực thất bại",
                description: error.response?.data?.message || "Sai mã OTP. Vui lòng thử lại.",
            });
        }
    };

    const handleRequestAgain = async () => {
        try {
            const response = API.resendOTP({ contact });

            setToast({
                title: "Đã gửi lại mã OTP!",
                description: response.data.message,
                actionText: "Đóng",
                titleColor: "text-blue-600",
                className: "text-start",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Gửi lại mã OTP thất bại",
                description: error.response?.data?.message || "Vui lòng thử lại.",
            });
        }
    };

    return (
        <>
            <Card className="w-[400px] shadow-lg relative z-10 bg-white bg-opacity-95 backdrop-blur-md p-6 rounded-lg">
                <CardHeader className="text-center space-y-1">
                    <div className="flex items-center justify-center h-full">
                        <Link to="/">
                            <img src={TeamLogo} alt="Team Logo" className="w-[61px] h-[58px] py-1 mb-[15px]" />
                        </Link>
                    </div>
                    <CardTitle className="text-2xl font-bold">Xác thực</CardTitle>
                    <p className="text-sm text-gray-500">Mã đã được gửi tới email của bạn</p>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 justify-center mb-4">
                        <InputOTP maxLength={6} value={otp} onChange={setOtp} pattern={REGEXP_ONLY_DIGITS}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    <Button className="w-full mb-4 bg-[#4262FF] hover:bg-[#3a56e0]" onClick={onSubmit}>
                        Verify
                    </Button>
                    <div className="text-center text-sm">
                        Không nhận được mã?{" "}
                        <a
                            onClick={handleRequestAgain}
                            className="text-[#4262FF] hover:text-[#3a56e0] hover:underline cursor-pointer">
                            Gửi lại
                        </a>
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default VerifyTokenForm;
