"use client";

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/components/auth/authContext";
import TeamLogo from "@/assets/TeamLogo.svg";
import bell from "@/assets/bell.png";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Settings, HelpCircle, LogOut, BarChart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth"; // Import authentication hook
import { getCountRequestReschedule, changeBooleanIsReschedule } from "../../api/appointment.api";
// import { useBootstrap } from "@/hooks/useBootstrap";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

function ListItem({ className, title, children, href }) {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    to={href}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}>
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</div>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}

ListItem.displayName = "ListItem";
ListItem.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    href: PropTypes.string.isRequired,
};

export function Header() {
    const { user } = useAuth(); // Get authentication state
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const [isAuthenticated, setIsAuthenticated] = useState(!!user);
    const userName = user?.fullName;
    // useBootstrap();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [patientNamesData, setPatientNamesData] = useState([]);
    const [rescheduleData, setRescheduleData] = useState([]);

    useEffect(() => {
        setIsAuthenticated(!!user); // Update when user state changes
    }, [user]);

    const [countReschedule, setCountReschedule] = useState(0);
    useEffect(() => {
        const fetchCountReschedule = async () => {
            try {
                const response = await getCountRequestReschedule();

                setRescheduleData(
                    response.patientNames.map((name, index) => ({
                        appointmentIds: response.appointmentIds[index],
                        patientNames: name,
                        psychologistNames: response.psychologistNames[index],
                        notes: response.notes[index],
                        scheduledTimes: response.scheduledTimes[index],
                        statuses: response.statuses[index],
                    }))
                );

                setCountReschedule(response.count);
                setPatientNamesData(response.scheduledTimes);
            } catch (error) {
                console.error("Error fetching count:", error);
            }
        };
        fetchCountReschedule();
    }, [user]);

    const handleBellClick = async () => {
        setIsModalVisible(true);
    };

    const formatScheduledTime = (scheduledTime) => {
        const date = new Date(scheduledTime); // Chuyển chuỗi ISO thành đối tượng Date

        // Định dạng ngày và giờ
        const formattedDate = new Intl.DateTimeFormat("vi-VN", {
            weekday: "long", // Tên đầy đủ của ngày trong tuần
            day: "2-digit", // Ngày theo định dạng 2 chữ số
            month: "2-digit", // Tháng theo định dạng 2 chữ số
            year: "numeric", // Năm đầy đủ
        }).format(date);

        // Định dạng giờ
        const formattedTime = date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

        return `Giờ: ${formattedTime} (${formattedDate})`;
    };

    const handleChangeStatus = async (appointmentId, status) => {
        try {
            console.log(appointmentId, status);
            const response = await changeBooleanIsReschedule(appointmentId, status);
            setCountReschedule(countReschedule - 1);
            if (status === "Approved") {
                alert(`Mã đơn ${appointmentId} đã được duyệt`);
            } else if (status === "Cancelled") {
                alert(`Mã đơn ${appointmentId} không được duyệt `);
            } else {
                alert(`Lỗi`);
            }
            setRescheduleData((prevData) => prevData.filter((q) => q.appointmentIds !== appointmentId));
        } catch (error) {
            console.error("Error changing status:", error);
        }
    };

    const UserMenu = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="relative h-8 w-8 rounded-full bg-inherit">
                    <Avatar className="h-9 w-9 bg-gray-300 hover:bg-gray-400 flex items-center justify-center">
                        <AvatarImage
                            src={"https://cdn-icons-png.flaticon.com/512/7996/7996254.png"}
                            alt="chevron"
                            className="h-6 w-6"
                        />
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-4" align="end">
                <DropdownMenuItem className="cursor-pointer" onSelect={() => navigate("/view-statistics")}>
                    <BarChart className="mr-2 h-4 w-4" />
                    <span>Thống kê</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onSelect={() => navigate("/user/view-appointment-list")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Lịch hẹn</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Cài đặt</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Câu hỏi thường gặp</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 cursor-pointer" onSelect={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    return (
        <NavigationMenu className="w-full absolute top-[26px] left-0 h-[75px] bg-white shadow-md z-50 flex items-stretch px-6">
            <NavigationMenuList>
                <NavigationMenuItem className="flex items-center">
                    <div className="flex items-center justify-center h-full">
                        <Link to="/">
                            <img
                                src={TeamLogo}
                                alt="Team Logo"
                                className="w-[51px] h-[48px] py-1 ml-[20px] mr-[25px]"
                            />
                        </Link>
                    </div>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Tư vấn trực tuyến</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-6  md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3 justify-center items-center">
                                <NavigationMenuLink asChild>
                                    <Link
                                        className="flex h-full w-full select-none flex-col justify-center rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        to="/">
                                        <div className="mb-2 mt-4 text-lg font-medium text-blue-600">Tâm Giao</div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            &quot;Lắng nghe để hiểu - Chia sẻ để chữa lành&quot;
                                        </p>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            <ListItem href="/doctor" title="Xem lịch khám">
                                Xem lịch khám trực tuyến
                            </ListItem>
                            <ListItem href="/doctor" title="Hồ sơ chuyên viên">
                                Các chuyên viên tư vấn tốt nhất
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Gói dịch vụ</NavigationMenuTrigger>
                    <NavigationMenuContent className="absolute bg-white shadow-lg z-50">
                        <ul className="grid w-[250px] h-full p-2 cursor-pointer">
                            <ListItem href="#" title="Gói miễn phí" className="m-1">
                                Hoàn hảo dành cho người dùng mới
                            </ListItem>
                            <ListItem href="#" title="Gói VIP" className="bg-[#1F45FF] text-white m-1">
                                <p className="text-white transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                    Dành cho những người tìm kiếm sự hỗ trợ cao cấp
                                </p>
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} cursor-pointer text-black`}>
                        <Link to="/blog" className="text-black">
                            Bài viết
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} cursor-pointer text-black`}>
                        <Link to="/CategoryTestSelected" className="text-black">
                            Kiểm tra tâm lý
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Lịch trình làm việc</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-6  md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3 justify-center items-center">
                                <NavigationMenuLink asChild>
                                    <Link
                                        className="flex h-full w-full select-none flex-col justify-center rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        to="/">
                                        <div className="mb-2 mt-4 text-lg font-medium text-blue-600">Tâm Giao</div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            &quot;Lắng nghe để hiểu - Chia sẻ để chữa lành&quot;
                                        </p>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            <ListItem href="/doctor" title="Xem lịch khám">
                                Xem lịch khám trực tuyến
                            </ListItem>
                            <ListItem href="/doctor" title="Thông báo sửa đổi lịch">
                                Người dùng chỉnh sửa lịch khám
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
            {/* Right - Login & Sign Up Buttons */}
            <div className="flex gap-3 items-center justify-between ml-auto mr-4">
                {isAuthenticated ? (
                    <div className="flex flex-row items-center gap-2">
                        {user?.role === "staff" && (
                            <div className="relative inline-block" onClick={handleBellClick}>
                                <img src={bell} alt="bell" className="w-[48px] h-[55px] py-1" />

                                <div className="absolute top-1 right-0 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                                    {countReschedule}
                                </div>
                            </div>
                        )}

                        <Dialog open={isModalVisible} onOpenChange={setIsModalVisible}>
                            <DialogContent className="sm:max-w-[600px] border-blue-200">
                                <DialogHeader className="bg-blue-50 p-4 rounded-t-lg">
                                    <DialogTitle className="text-blue-800 text-center font-bold">
                                        Thông báo đổi lịch từ người dùng
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="p-4 max-h-[60vh] overflow-y-auto">
                                    {rescheduleData.map((q, index) => (
                                        <Card
                                            key={index}
                                            className="mb-4 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-transform duration-200 hover:scale-105">
                                            <CardContent className="p-0">
                                                <div className="flex items-center">
                                                    <Avatar className="h-12 w-12 mr-3">
                                                        <AvatarFallback>{q.patientNames.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 border-b border-gray-200 pb-3">
                                                        <p className="font-bold text-lg text-gray-800">
                                                            {q.patientNames} đã yêu cầu xếp lại lịch khám.
                                                        </p>
                                                        <div className="flex flex-row mt-1 text-sm text-gray-600">
                                                            <strong className="w-[100px] font-semibold">Mã đơn:</strong>
                                                            <span>{q.appointmentIds}</span>
                                                        </div>
                                                        <div className="flex flex-row mt-1 text-sm text-gray-600">
                                                            <strong className="w-[100px] font-semibold">
                                                                Thời gian:
                                                            </strong>
                                                            <span>{formatScheduledTime(q.scheduledTimes)}</span>
                                                        </div>
                                                        <div className="flex flex-row mt-1 text-sm text-gray-600">
                                                            <strong className="w-[100px] font-semibold">Bác sĩ:</strong>
                                                            <span>{q.psychologistNames}</span>
                                                        </div>
                                                        <div className="flex flex-row mt-1 text-sm text-gray-600">
                                                            <strong className="w-[100px] font-semibold">Lý do:</strong>
                                                            <span>{q.notes}</span>
                                                        </div>
                                                        <div className="flex flex-row mt-1 text-sm">
                                                            <strong className="w-[100px] font-semibold">
                                                                Trạng thái:
                                                            </strong>
                                                            <span
                                                                className={`font-bold ${
                                                                    q.statuses === "Confirmed"
                                                                        ? "text-green-600"
                                                                        : q.statuses === "Pending"
                                                                        ? "text-yellow-500"
                                                                        : "text-red-600"
                                                                }`}>
                                                                {q.statuses}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between mt-4 gap-2">
                                                    <Button
                                                        className="w-[90px] bg-blue-600 hover:bg-blue-700"
                                                        onClick={() =>
                                                            handleChangeStatus(q.appointmentIds, "Approved")
                                                        }>
                                                        Xác nhận
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="w-[90px] border-blue-300 text-blue-600 hover:bg-blue-50">
                                                        Xem chi tiết
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        className="w-[90px] bg-red-600 hover:bg-red-700"
                                                        onClick={() =>
                                                            handleChangeStatus(q.appointmentIds, "Cancelled")
                                                        }>
                                                        Hủy
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </DialogContent>
                        </Dialog>

                        <p className="flex items-center justify-center mt-3 mr-1 font-semibold">{user.fullName}</p>
                        <Avatar className="h-9 w-9">
                            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <UserMenu userAvatar={user.avatar} userName={user.fullName} />
                    </div>
                ) : (
                    <>
                        <Link to="/login">
                            <Button variant="outline" className="px-4 py-2">
                                Đăng nhập
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button variant="default" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700">
                                Đăng ký
                            </Button>
                        </Link>
                    </>
                )}
            </div>
        </NavigationMenu>
    );
}

Header.propTypes = {
    isAuthenticated: PropTypes.bool,
    userAvatar: PropTypes.string,
    userName: PropTypes.string,
};

export default Header;
