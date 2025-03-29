import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Filter, Search } from "lucide-react";

const AppointmentListView = ({ appointments, utils }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [selectedGender, setSelectedGender] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState("scheduledTime.date");
    const [sortDirection, setSortDirection] = useState("asc");
    const [itemsPerPage] = useState(8);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Define all possible statuses
    const allStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];

    // Helper to safely get the value for sorting
    const getSortValue = (obj, path) => {
        const parts = path.split(".");
        let result = obj;

        for (const part of parts) {
            if (result && typeof result === "object" && part in result) {
                result = result[part];
            } else {
                return "";
            }
        }

        return result || "";
    };

    // Handle sorting when column headers are clicked
    const handleSort = (column) => {
        setSortDirection(sortColumn === column && sortDirection === "asc" ? "desc" : "asc");
        setSortColumn(column);
    };

    // Handle status checkbox changes
    const handleStatusChange = (status) => {
        setSelectedStatuses((prev) => {
            if (prev.includes(status)) {
                return prev.filter((s) => s !== status);
            } else {
                return [...prev, status];
            }
        });
    };

    // Reset filters
    const resetFilters = () => {
        setSelectedStatuses([]);
        setSelectedGender("all");
        setSearchTerm("");
        setCurrentPage(1);
    };

    // Filter and sort appointments
    const filteredAppointments = appointments
        .filter((a) => {
            // Filter by psychologist name (fullName might not be available)
            const psychologistName = a.psychologistId?.fullName || "";
            return psychologistName.toLowerCase().includes(searchTerm.toLowerCase());
        })
        .filter((a) => selectedStatuses.length === 0 || selectedStatuses.includes(a.status))
        .filter((a) => selectedGender === "all" || a.psychologistId?.gender === selectedGender)
        .sort((a, b) => {
            // Sort by the specified column
            const aValue = getSortValue(a, sortColumn) || "";
            const bValue = getSortValue(b, sortColumn) || "";

            // Handle date sorting differently
            if (sortColumn === "scheduledTime.date") {
                const dateA = new Date(aValue);
                const dateB = new Date(bValue);
                return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
            }

            // Handle string comparison
            if (typeof aValue === "string" && typeof bValue === "string") {
                return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }

            // Default comparison
            return sortDirection === "asc" ? (aValue > bValue ? 1 : -1) : bValue > aValue ? 1 : -1;
        });

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedStatuses, selectedGender]);

    // Status badge component
    const StatusBadge = ({ status }) => {
        const variants = {
            Confirmed:
                "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 hover:text-blue-800 hover:border-blue-200",
            Pending:
                "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 hover:text-amber-800 hover:border-amber-200",
            Completed:
                "bg-green-100 text-green-800 border-green-200 hover:bg-green-100 hover:text-green-800 hover:border-green-200",
            Cancelled:
                "bg-red-100 text-red-800 border-red-200 hover:bg-red-100 hover:text-red-800 hover:border-red-200",
            Default:
                "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-200",
        };

        return (
            <Badge className={`${variants[status] || variants.Default} border px-2 py-1`}>
                {utils.statusTranslations[status] || status}
            </Badge>
        );
    };

    // Define prop types for StatusBadge
    StatusBadge.propTypes = {
        status: PropTypes.string.isRequired,
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-1/3">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Tìm kiếm theo tên tư vấn viên..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 flex-wrap">
                    <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="text-blue-600 border-blue-600">
                                <Filter className="w-4 h-4 mr-2" />
                                Lọc thêm
                                {selectedStatuses.length > 0 && (
                                    <span className="ml-2 bg-blue-100 text-blue-800 rounded-full text-xs px-2 py-0.5">
                                        {selectedStatuses.length}
                                    </span>
                                )}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Lọc thêm</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Status Filters Section */}
                                <div>
                                    <h3 className="font-medium mb-4">Trạng thái:</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {allStatuses.map((status) => (
                                            <div key={status} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`status-${status}`}
                                                    checked={selectedStatuses.includes(status)}
                                                    onCheckedChange={() => handleStatusChange(status)}
                                                    className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                                                />
                                                <label htmlFor={`status-${status}`} className="cursor-pointer">
                                                    <Badge
                                                        className={`
                                                    ${
                                                        status === "Pending"
                                                            ? "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 hover:text-amber-800 hover:border-amber-200"
                                                            : ""
                                                    }
                                                    ${
                                                        status === "Confirmed"
                                                            ? "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 hover:text-blue-800 hover:border-blue-200"
                                                            : ""
                                                    }
                                                    ${
                                                        status === "Completed"
                                                            ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100 hover:text-green-800 hover:border-green-200"
                                                            : ""
                                                    }
                                                    ${
                                                        status === "Cancelled"
                                                            ? "bg-red-100 text-red-800 border-red-200 hover:bg-red-100 hover:text-red-800 hover:border-red-200"
                                                            : ""
                                                    }
                                                `}>
                                                        {utils.statusTranslations[status]}
                                                    </Badge>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-4 pt-4">
                                    <Button variant="outline" onClick={resetFilters}>
                                        Thiết lập lại
                                    </Button>
                                    <Button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white">
                                        Áp dụng
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-blue-50 border-b border-gray-300">
                                <TableHead className="w-12 text-center">#</TableHead>
                                <TableHead
                                    className="cursor-pointer text-center"
                                    onClick={() => handleSort("psychologistId.fullName")}>
                                    Tư vấn viên
                                    {sortColumn === "psychologistId.fullName" && (
                                        <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                                    )}
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer text-center"
                                    onClick={() => handleSort("scheduledTime.date")}>
                                    Ngày & Giờ
                                    {sortColumn === "scheduledTime.date" && (
                                        <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                                    )}
                                </TableHead>
                                <TableHead className="cursor-pointer text-center" onClick={() => handleSort("status")}>
                                    Trạng thái
                                    {sortColumn === "status" && (
                                        <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                                    )}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentItems.length > 0 ? (
                                currentItems.map((appointment, index) => (
                                    <TableRow
                                        key={appointment._id}
                                        className="cursor-pointer hover:bg-blue-50 border-b border-gray-300"
                                        onClick={() => utils.handleAppointmentClick(appointment._id)}>
                                        <TableCell className="font-medium text-center">
                                            {indexOfFirstItem + index + 1}
                                        </TableCell>
                                        <TableCell>{appointment.psychologistId?.fullName || "Unknown"}</TableCell>
                                        <TableCell className="text-center">
                                            {utils.formatDate(appointment.scheduledTime?.date)}
                                            <br />
                                            <span className="text-sm text-gray-500">
                                                {utils.formatTime(appointment.scheduledTime?.startTime)} -{" "}
                                                {utils.formatTime(appointment.scheduledTime?.endTime)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <StatusBadge status={appointment.status} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-6">
                                        Không tìm thấy cuộc hẹn nào
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {filteredAppointments.length > itemsPerPage && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    onClick={() => setCurrentPage(page)}
                                    isActive={currentPage === page}
                                    className={currentPage === page ? "bg-blue-600 text-white" : ""}>
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </>
    );
};

AppointmentListView.propTypes = {
    appointments: PropTypes.array.isRequired,
    utils: PropTypes.object.isRequired,
};

export default AppointmentListView;
