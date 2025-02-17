import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormLabel, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import TeamLogo from "@/assets/TeamLogo.svg";
import { Link, useNavigate } from "react-router-dom";
import { setToast } from "@/components/common/toast/setToast";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import * as API from "@/api";

const FormSchema = z.object({
    contact: z.string().refine(
        (value) => {
            // Regex patterns
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
            const phonePattern = /^\+?\d{10,15}$/; // Accepts 10-15 digits, optional '+' prefix

            return emailPattern.test(value) || phonePattern.test(value);
        },
        {
            message: "Invalid credentials",
        }
    ),
    password: z.string().min(6, "Invalid credentials"),
});

const LoginForm = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            contact: "",
            password: "",
        },
    });

    async function onSubmit(data) {
        try {
            const response = await API.loginUser({
                contact: data.contact,
                password: data.password,
            });
            const { token, user } = response.data;

            // Save JWT to localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            // Store the toast message in session storage
            setToast({
                title: "Success!",
                description: "Login successfully!",
                actionText: "Close",
                titleColor: "text-green-600",
                className: "text-start",
            });

            navigate("/");
            window.location.reload();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: error.response?.data?.message || "There was a problem with your request.",
                action: "Try Again",
            });
        }
    }

    return (
        <>
            <Card className="w-[400px] shadow-lg relative z-10 bg-white bg-opacity-95 backdrop-blur-md p-6 rounded-lg">
                <CardHeader className="text-center space-y-1">
                    <div className="flex items-center justify-center h-full">
                        <Link to="/">
                            <img src={TeamLogo} alt="Team Logo" className="w-[61px] h-[58px] py-1 mb-[15px]" />
                        </Link>
                    </div>
                    <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                    <p className="text-sm text-gray-500">Login to your TrustTalk account</p>
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
                                            <FormLabel className="text-start">Email or Phone Number</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input placeholder="mail@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex justify-between items-center">
                                            <FormLabel>Password</FormLabel>
                                            <a
                                                href="/forgot-password"
                                                className="text-[13px] text-gray-500 hover:text-[#4262FF]">
                                                Forgot your password?
                                            </a>
                                        </div>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full bg-[#4262FF] hover:bg-[#3a56e0]">
                                Login
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <Separator className="w-full" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-[#fcfcfc] px-2 text-gray-500">Or continue with</span>
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
                                Don&apos;t have an account?{" "}
                                <a href="/signup" className="font-semibold text-[#4262FF] hover:text-[#15298b]">
                                    Sign up
                                </a>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    );
};
export default LoginForm;
