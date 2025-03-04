import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import TeamLogo from "@/assets/TeamLogo.svg";
import { useToast } from "@/hooks/use-toast";
import * as API from "@/api";

// Form validation schema
const FormSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const ChangePasswordForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get contact from localStorage
  const contact = localStorage.getItem("contact"); // Retrieve contact (email/phone) from localStorage

  // If contact doesn't exist in localStorage, navigate to login page
  if (!contact) {
    navigate("/login");
  }

  // Initialize form
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // Call the change password API
      const response = await API.changePassword({
        contact, // Use contact from localStorage
        newPassword: data.newPassword,
      });

      toast({
        title: "Password changed successfully!",
        description: response.message || "Your password has been updated.",
      });

      // Redirect to login page after password reset
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          error.response?.data?.message ||
          "There was an issue resetting your password.",
      });
    }
  };

  return (
    <Card className="w-[400px] shadow-lg relative z-10 bg-white bg-opacity-95 backdrop-blur-md p-6 rounded-lg">
      <CardHeader className="text-center space-y-1">
        <div className="flex items-center justify-center h-full">
          <Link to="/">
            <img
              src={TeamLogo}
              alt="Team Logo"
              className="w-[61px] h-[58px] py-1 mb-[15px]"
            />
          </Link>
        </div>
        <CardTitle className="text-2xl font-bold">Change account password</CardTitle>
        <p className="text-sm text-gray-500">Forgot your password?</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* New Password Field */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-content-start">New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-content-start">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#4262FF] hover:bg-[#3a56e0]"
            >
              Change Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordForm;
