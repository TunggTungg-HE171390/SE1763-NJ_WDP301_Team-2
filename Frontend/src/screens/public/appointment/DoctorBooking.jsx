import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import DoctorCard from "./components/DoctorCard"; // Import the DoctorCard component
import ToastReceiver from "@/components/common/toast/toast-receiver";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Helmet } from "react-helmet-async";

const DoctorBooking = () => {
    const doctors = [
        {
            name: "ThsBS CHU THI MINH",
            specialty: "Chuyên Khoa Lao và bệnh phổi",
            appointments: 321,
            rating: 5,
            image: "/api/placeholder/150/150",
            isAvailable: true,
        },
        {
            name: "BS NGUYỄN HOÀNG GIANG",
            specialty: "Y Học Gia Đình",
            appointments: 53,
            rating: 5,
            image: "/api/placeholder/150/150",
            isAvailable: true,
        },
    ];

    const specialties = [
        { id: "chan-doan-hinh-anh", label: "Chẩn Đoán Hình Ảnh" },
        { id: "chan-thuong-chinh-hinh", label: "Chấn thương chỉnh hình" },
        { id: "co-xuong-khop", label: "Cơ Xương Khớp" },
        { id: "da-lieu", label: "Da Liễu" },
        { id: "dinh-duong", label: "Dinh dưỡng" },
        { id: "gan-mat", label: "Gan mật" },
        { id: "nhi-khoa", label: "Nhi Khoa" },
        { id: "noi-tiet", label: "Nội tiết" },
        { id: "rang-ham-mat", label: "Răng Hàm Mặt" },
        { id: "san-phu-khoa", label: "Sản phụ khoa" },
        { id: "tai-mui-hong", label: "Tai Mũi Họng" },
        { id: "tam-ly", label: "Tâm lý" },
        { id: "than-tiet-nieu", label: "Thận Tiết niệu" },
        { id: "tieu-hoa", label: "Tiêu hoá" },
    ];

    return (
        <>
            <Helmet>
                <title>Book Doctor</title>
            </Helmet>
            <ToastReceiver />
            <div className="max-w-7xl mx-auto px-6 pt-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-emerald-500 mb-2">Đặt khám trước qua TrustTalk</h1>
                    <p className="text-gray-600">Để được kham online</p>
                </div>
            </div>
            <div className="max-w-7xl mx-auto p-6">
                <div className="p-8 bg-slate-50 rounded-md">
                    <div className="p-8 bg-slate-50 rounded-md">
                        <div className="flex items-center gap-4 mb-8">
                            {/* Search Bar */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input
                                    className="w-full pl-10"
                                    placeholder="Tìm triệu chứng, chuyên khoa, tên bác sĩ..."
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex gap-4">
                                <Select>
                                    <SelectTrigger className="w-40">
                                        {" "}
                                        {/* Set a fixed width */}
                                        <SelectValue placeholder="Ngày khám" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="today">Hôm nay</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Đánh giá" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="high">Cao nhất</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Filter Button */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="text-emerald-500 border-emerald-500">
                                        Lọc thêm
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Chọn bác sĩ</DialogTitle>
                                    </DialogHeader>

                                    <div className="space-y-6">
                                        {/* Specialties Section */}
                                        <div>
                                            <h3 className="font-medium mb-4">Chuyên khoa:</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {specialties.map((specialty) => (
                                                    <div key={specialty.id} className="flex items-center space-x-2 ">
                                                        <Checkbox
                                                            id={specialty.id}
                                                            className="border-gray-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 data-[state=checked]:text-white"
                                                        />
                                                        <Label htmlFor={specialty.id}>{specialty.label}</Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Gender Section */}
                                        <div>
                                            <h3 className="font-medium mb-4">Giới tính:</h3>
                                            <RadioGroup defaultValue="all" className="flex space-x-6">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="male"
                                                        id="male"
                                                        className="border-gray-300 data-[state=checked]:bg-white data-[state=checked]:border-emerald-500 data-[state=checked]:text-emerald-500"
                                                    />
                                                    <Label htmlFor="male">Bác sĩ nam</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="female"
                                                        id="female"
                                                        className="border-gray-300 data-[state=checked]:bg-white data-[state=checked]:border-emerald-500 data-[state=checked]:text-emerald-500"
                                                    />
                                                    <Label htmlFor="female">Bác sĩ nữ</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-end space-x-4 pt-4">
                                            <Button variant="outline">Thiết lập lại</Button>
                                            <Button className="bg-emerald-500 hover:bg-emerald-600">Áp dụng</Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <h2 className="font-semibold mb-8 text-xl">Chọn bác sĩ</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {doctors.map((doctor, index) => (
                            <DoctorCard key={index} doctor={doctor} />
                        ))}
                    </div>

                    <div className="flex justify-center gap-2 mt-8">
                        <Button variant="outline" size="icon">
                            &lt;
                        </Button>
                        <Button variant="outline">1</Button>
                        <Button variant="outline">2</Button>
                        <Button variant="outline">3</Button>
                        <span className="px-2">...</span>
                        <Button variant="outline">9</Button>
                        <Button variant="outline" size="icon">
                            &gt;
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DoctorBooking;
