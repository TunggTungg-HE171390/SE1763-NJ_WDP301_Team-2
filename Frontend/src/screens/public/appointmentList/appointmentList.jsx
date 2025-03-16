import { Helmet } from "react-helmet-async";
import ToastReceiver from "@/components/common/toast/toast-receiver";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    SearchIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    MoreHorizontalIcon,
} from "lucide-react";

const AppointmentsList = () => {
    // Sample data for appointments - expanded for pagination demo
    const [appointments, setAppointments] = useState([
        {
            id: 1,
            doctorName: "Dr. Sarah Johnson",
            date: "2025-03-15",
            startTime: "09:00",
            endTime: "09:30",
            status: "Confirmed",
        },
        {
            id: 2,
            doctorName: "Dr. Michael Chen",
            date: "2025-03-16",
            startTime: "14:00",
            endTime: "14:45",
            status: "Pending",
        },
        {
            id: 3,
            doctorName: "Dr. Emily Rodriguez",
            date: "2025-03-18",
            startTime: "10:30",
            endTime: "11:00",
            status: "Completed",
        },
        {
            id: 4,
            doctorName: "Dr. Robert Patel",
            date: "2025-03-20",
            startTime: "16:15",
            endTime: "16:45",
            status: "Cancelled",
        },
        {
            id: 5,
            doctorName: "Dr. Sarah Johnson",
            date: "2025-03-21",
            startTime: "11:00",
            endTime: "11:30",
            status: "Confirmed",
        },
        {
            id: 6,
            doctorName: "Dr. Lisa Wong",
            date: "2025-03-22",
            startTime: "13:30",
            endTime: "14:00",
            status: "Confirmed",
        },
        {
            id: 7,
            doctorName: "Dr. James Smith",
            date: "2025-03-23",
            startTime: "15:45",
            endTime: "16:15",
            status: "Pending",
        },
        {
            id: 8,
            doctorName: "Dr. Maria Garcia",
            date: "2025-03-24",
            startTime: "08:30",
            endTime: "09:15",
            status: "Confirmed",
        },
        {
            id: 9,
            doctorName: "Dr. David Kim",
            date: "2025-03-25",
            startTime: "11:30",
            endTime: "12:00",
            status: "Completed",
        },
        {
            id: 10,
            doctorName: "Dr. Angela Martinez",
            date: "2025-03-26",
            startTime: "14:30",
            endTime: "15:00",
            status: "Confirmed",
        },
        {
            id: 11,
            doctorName: "Dr. William Brown",
            date: "2025-03-27",
            startTime: "09:45",
            endTime: "10:15",
            status: "Cancelled",
        },
        {
            id: 12,
            doctorName: "Dr. Jennifer Lee",
            date: "2025-03-28",
            startTime: "16:00",
            endTime: "16:30",
            status: "Pending",
        },
    ]);

    // Sorting state
    const [sortConfig, setSortConfig] = useState({
        key: "date",
        direction: "ascending",
    });

    // Search state
    const [searchTerm, setSearchTerm] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Handle sorting
    const requestSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    // Apply sorting to appointments
    const sortedAppointments = [...appointments].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
    });

    // Apply search filter
    const filteredAppointments = sortedAppointments.filter((appointment) => {
        return (
            appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.date.includes(searchTerm)
        );
    });

    // Calculate pagination
    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);

    // Page change handlers
    const goToPage = (pageNumber) => {
        setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
    };

    const goToFirstPage = () => goToPage(1);
    const goToLastPage = () => goToPage(totalPages);
    const goToPreviousPage = () => goToPage(currentPage - 1);
    const goToNextPage = () => goToPage(currentPage + 1);

    // Helper function to get status color
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "confirmed":
                return "text-blue-600 bg-blue-100";
            case "pending":
                return "text-yellow-600 bg-yellow-100";
            case "completed":
                return "text-green-600 bg-green-100";
            case "cancelled":
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    // Format date to be more readable
    const formatDate = (dateString) => {
        const options = { weekday: "short", year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Handle view details action
    const handleViewDetails = (appointmentId) => {
        console.log("View details for appointment", appointmentId);
        // This would typically open a modal or navigate to a details page
        alert(`View details for appointment #${appointmentId}`);
    };

    return (
        <>
            <Helmet>
                <title>Cuộc hẹn của bạn</title>
            </Helmet>
            <ToastReceiver />
            <div className="p-6 bg-blue-50 min-h-screen">
                <Card className="border-blue-200">
                    <CardHeader className="bg-blue-600 text-white rounded-t-lg">
                        <CardTitle className="text-2xl font-bold"></CardTitle>
                        <CardDescription className="text-blue-100"></CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-center mb-6">
                            <div className="relative flex-grow">
                                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                                <Input
                                    placeholder="Search appointments..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 border-blue-200 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="rounded-md border border-blue-200 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-blue-50">
                                    <TableRow className="border-b-2 border-blue-200">
                                        <TableHead className="w-12 text-left">#</TableHead>
                                        <TableHead
                                            className="text-center cursor-pointer hover:bg-blue-100"
                                            onClick={() => requestSort("doctorName")}>
                                            Tư vấn viên
                                            {sortConfig.key === "doctorName" && (
                                                <span className="ml-2">
                                                    {sortConfig.direction === "ascending" ? (
                                                        <ArrowUpIcon className="h-4 w-4 inline" />
                                                    ) : (
                                                        <ArrowDownIcon className="h-4 w-4 inline" />
                                                    )}
                                                </span>
                                            )}
                                        </TableHead>
                                        <TableHead
                                            className="text-center cursor-pointer hover:bg-blue-100"
                                            onClick={() => requestSort("date")}>
                                            Ngày
                                            {sortConfig.key === "date" && (
                                                <span className="ml-2">
                                                    {sortConfig.direction === "ascending" ? (
                                                        <ArrowUpIcon className="h-4 w-4 inline" />
                                                    ) : (
                                                        <ArrowDownIcon className="h-4 w-4 inline" />
                                                    )}
                                                </span>
                                            )}
                                        </TableHead>
                                        <TableHead
                                            className="text-center cursor-pointer hover:bg-blue-100"
                                            onClick={() => requestSort("startTime")}>
                                            Thời gian bắt đầu
                                            {sortConfig.key === "startTime" && (
                                                <span className="ml-2">
                                                    {sortConfig.direction === "ascending" ? (
                                                        <ArrowUpIcon className="h-4 w-4 inline" />
                                                    ) : (
                                                        <ArrowDownIcon className="h-4 w-4 inline" />
                                                    )}
                                                </span>
                                            )}
                                        </TableHead>
                                        <TableHead
                                            className="text-center cursor-pointer hover:bg-blue-100"
                                            onClick={() => requestSort("endTime")}>
                                            Thời gian kết thúc
                                            {sortConfig.key === "endTime" && (
                                                <span className="ml-2">
                                                    {sortConfig.direction === "ascending" ? (
                                                        <ArrowUpIcon className="h-4 w-4 inline" />
                                                    ) : (
                                                        <ArrowDownIcon className="h-4 w-4 inline" />
                                                    )}
                                                </span>
                                            )}
                                        </TableHead>
                                        <TableHead
                                            className="text-center cursor-pointer hover:bg-blue-100"
                                            onClick={() => requestSort("status")}>
                                            Trạng thái
                                            {sortConfig.key === "status" && (
                                                <span className="ml-2">
                                                    {sortConfig.direction === "ascending" ? (
                                                        <ArrowUpIcon className="h-4 w-4 inline" />
                                                    ) : (
                                                        <ArrowDownIcon className="h-4 w-4 inline" />
                                                    )}
                                                </span>
                                            )}
                                        </TableHead>
                                        <TableHead className="text-center">Chức năng</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentItems.length > 0 ? (
                                        currentItems.map((appointment, index) => (
                                            <TableRow
                                                key={appointment.id}
                                                className="hover:bg-blue-50 border-b border-blue-100 last:border-b-0">
                                                <TableCell className="font-medium text-gray-500">
                                                    {indexOfFirstItem + index + 1}
                                                </TableCell>
                                                <TableCell className="font-medium">{appointment.doctorName}</TableCell>
                                                <TableCell>{formatDate(appointment.date)}</TableCell>
                                                <TableCell>{appointment.startTime}</TableCell>
                                                <TableCell>{appointment.endTime}</TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                                            appointment.status
                                                        )}`}>
                                                        {appointment.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleViewDetails(appointment.id)}
                                                        className="h-8 w-8 text-blue-600 hover:bg-blue-100 rounded-full">
                                                        <MoreHorizontalIcon className="h-5 w-5" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                                No appointments found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-blue-600">
                                Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredAppointments.length)}{" "}
                                trên {filteredAppointments.length} cuộc hẹn
                            </div>

                            <div className="flex items-center space-x-2">
                                {/* Items per page selector */}
                                <div className="flex items-center mr-4">
                                    <span className="text-sm text-gray-600 mr-2">Số cuộc hẹn:</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1); // Reset to first page when changing items per page
                                        }}
                                        className="text-sm border border-blue-200 rounded p-1">
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                    </select>
                                </div>

                                {/* Page navigation buttons */}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={goToFirstPage}
                                    disabled={currentPage === 1}
                                    className="h-8 w-8 border-blue-200 text-blue-600">
                                    <ChevronsLeftIcon className="h-4 w-4" />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    className="h-8 w-8 border-blue-200 text-blue-600">
                                    <ChevronLeftIcon className="h-4 w-4" />
                                </Button>

                                <span className="text-sm text-gray-600 mx-2">
                                    Trang {currentPage} / {totalPages}
                                </span>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className="h-8 w-8 border-blue-200 text-blue-600">
                                    <ChevronRightIcon className="h-4 w-4" />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={goToLastPage}
                                    disabled={currentPage === totalPages}
                                    className="h-8 w-8 border-blue-200 text-blue-600">
                                    <ChevronsRightIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default AppointmentsList;
