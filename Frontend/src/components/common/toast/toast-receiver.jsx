import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

const ToastReceiver = () => {
    const { toast } = useToast();
    const [toastQueue, setToastQueue] = useState([]);

    useEffect(() => {
        const storedToasts = sessionStorage.getItem("toastMessages");
        if (!storedToasts) return;

        try {
            const parsedToasts = JSON.parse(storedToasts);
            if (!Array.isArray(parsedToasts) || parsedToasts.length === 0) return;

            setToastQueue(parsedToasts);
            sessionStorage.removeItem("toastMessages"); // Clear stored messages after loading them
        } catch (error) {
            console.error("Error parsing toast messages:", error);
        }
    }, []);

    useEffect(() => {
        if (toastQueue.length === 0) return;

        // Show each toast with a delay between them
        const interval = setInterval(() => {
            const currentToast = toastQueue.shift(); // Get the first toast in the queue
            if (!currentToast) {
                clearInterval(interval);
                return;
            }

            toast({
                title: <span className={currentToast.titleColor}>{currentToast.title}</span>,
                description: currentToast.description,
                action: currentToast.actionText ? (
                    <ToastAction altText="Close">{currentToast.actionText}</ToastAction>
                ) : null,
                className: `${currentToast.className} mt-2.5`,
            });

            setToastQueue([...toastQueue]); // Update the queue
        }, 500); // Show each toast with a 0.5s delay

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [toastQueue, toast]);

    return null;
};

export default ToastReceiver;
