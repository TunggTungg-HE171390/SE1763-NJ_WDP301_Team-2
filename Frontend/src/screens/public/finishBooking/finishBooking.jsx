import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import ToastReceiver from "@/components/common/toast/toast-receiver";

const BookAppointment = () => {
    return (
        <>
            <Helmet>
                <title>Finish Booking</title>
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

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-md">ĐẶT KHÁM</Button>
            </div>
        </>
    );
};

export default BookAppointment;
