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
            { message: "Invalid email or phone number" }
        ),
        name: z.string().min(4, { message: "Name must be at least 4 characters" }),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .max(32, "Password must be at most 32 characters long")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/\d/, "Password must contain at least one number"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

const RegisterForm = () => {
    const navigate = useNavigate();
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            contact: "",
            name: "",
            password: "",
            confirmPassword: "",
        },
    });

    const { toast } = useToast();

    const onSubmit = async (data) => {
        try {
            await API.registerUser({
                contact: data.contact,
                name: data.name,
                password: data.password,
            });

            // Store the toast message in session storage
            setToast({
                title: "Success!",
                description: "Account created successfully!",
                actionText: "Close",
                titleColor: "text-green-600",
                className: "text-start",
            });

            navigate("/login"); // Redirect to login page
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: error.response?.data?.message || "There was a problem with your request.",
                actionText: "Try Again",
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
                    <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
                    <p className="text-sm text-gray-500">Create your TrustTalk account</p>
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
                                            <Input placeholder="mail@example.com or +1234567890" {...field} />
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
                                            <FormLabel className="text-start">Full Name</FormLabel>
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
                                            <FormLabel>Password</FormLabel>
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
                                            <FormLabel>Confirm Password</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage className="flex justify-end" />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full bg-[#4262FF] hover:bg-[#3a56e0]">
                                Continue
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
                                Already have an account?{" "}
                                <a href="/login" className="font-semibold text-[#4262FF] hover:text-[#15298b]">
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
export default RegisterForm;
