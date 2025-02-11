import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormLabel, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";

const FormSchema = z
    .object({
        email: z.string().email({ message: "Invalid email address" }),
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
        path: ["confirmPassword"], // path of error
    });

const images = [
    "https://marinwellnesscounseling.com/wp-content/uploads/2021/03/pexels-polina-zimmerman-3958461-scaled-1.jpeg",
    "https://media.istockphoto.com/id/1405778999/photo/psychologist-working-with-teenage-boy-at-office.jpg?s=612x612&w=0&k=20&c=X0QbEXz_IwYOFTViKIbWYuAn4ZCNsyQ4PFK0hIRlp3Q=",
    "https://www.tomstrust.org.uk/wp-content/uploads/2024/05/FEATURED-IMAGE-SIZE-9.jpg",
    "https://static.wixstatic.com/media/01f222_447457f5a7f1488db8100a5c0a094d8b~mv2.jpg/v1/crop/x_337,y_0,w_1903,h_1436/fill/w_574,h_434,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/01f222_447457f5a7f1488db8100a5c0a094d8b~mv2.jpg",
];

const Register = () => {
    const [currentImage, setCurrentImage] = useState(images[0]);
    const [fade, setFade] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(true); // Start fade effect
            setTimeout(() => {
                setCurrentImage((prevImage) => {
                    const currentIndex = images.indexOf(prevImage);
                    return images[(currentIndex + 1) % images.length]; // Loop through images
                });
                setFade(false); // Reset fade after image change
            }, 500); // 1-second fade duration
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            name: "",
            password: "",
            confirmPassword: "",
        },
    });

    function onSubmit(data) {
        const { toast } = Toaster();
        toast({
            title: "Registration Submitted",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        });
    }

    return (
        <>
            <Helmet>
                <title>Register</title>
            </Helmet>
            <div className="min-h-screen w-full fixed inset-0 flex items-center justify-center bg-cover bg-center">
                <div
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                        fade ? "opacity-0" : "opacity-100"
                    }`}
                    style={{
                        backgroundImage: `url(${currentImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}></div>

                {/* Background Overlay for Readability */}
                <div className="absolute inset-0 bg-white opacity-20"></div>

                <Card className="w-[400px] shadow-lg relative z-10 bg-white bg-opacity-95 backdrop-blur-md p-6 rounded-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-4xl">Register</CardTitle>
                    </CardHeader>
                    <CardContent className="text-start">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email or Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: abc@gmail.com" {...field} className="italic" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="flex-grow">
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Jane Doe" {...field} />
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
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Confirm Password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full bg-[#4262FF]">
                                    Continue
                                </Button>

                                <div className="text-center text-sm">
                                    Already have an account?{" "}
                                    <a href="/login" className="text-blue-600 hover:underline">
                                        Login Now
                                    </a>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};
export default Register;
