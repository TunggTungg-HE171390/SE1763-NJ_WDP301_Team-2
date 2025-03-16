import { useEffect, useState } from "react";
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
import * as API from "@/api";

const DoctorBooking = () => {
    const [psychologists, setPsychologists] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpecializations, setSelectedSpecializations] = useState([]);
    const [sortByRating, setSortByRating] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGender, setSelectedGender] = useState(null);
    const doctorsPerPage = 8;

    useEffect(() => {
        const fetchPsychologists = async () => {
            try {
                const response = await API.getPsychologistList();

                if (response.data.success) {
                    setPsychologists(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching psychologists:", error);
            }
        };

        fetchPsychologists();
    }, []);

    useEffect(() => {
        const fetchPsychologists = async () => {
            try {
                const response = await API.getPsychologistList();
                if (response.data.success) {
                    setPsychologists(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching psychologists:", error);
            }
        };

        const fetchSpecializations = async () => {
            try {
                const response = await API.getSpecializationList();
                if (response.data.success) {
                    setSpecializations(response.data.data); // Store unique specializations
                }
            } catch (error) {
                console.error("Error fetching specializations:", error);
            }
        };

        fetchPsychologists();
        fetchSpecializations(); // Fetch specializations on mount
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [psychResponse, specResponse] = await Promise.all([
                    API.getPsychologistList(),
                    API.getSpecializationList(),
                ]);

                if (psychResponse.data.success) {
                    setPsychologists(psychResponse.data.data);
                    setFilteredDoctors(psychResponse.data.data);
                }
                if (specResponse.data.success) {
                    setSpecializations(specResponse.data.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        let filtered = psychologists.filter(
            (doctor) =>
                doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.psychologist.psychologistProfile.specialization.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (selectedSpecializations.length > 0) {
            filtered = filtered.filter((doctor) =>
                selectedSpecializations.includes(doctor.psychologist.psychologistProfile.specialization)
            );
        }

        if (sortByRating === "high") {
            filtered.sort(
                (a, b) => b.psychologist.psychologistProfile.rating - a.psychologist.psychologistProfile.rating
            );
        } else if (sortByRating === "low") {
            filtered.sort(
                (a, b) => a.psychologist.psychologistProfile.rating - b.psychologist.psychologistProfile.rating
            );
        }

        if (selectedGender) {
            filtered = filtered.filter((doctor) => doctor.gender.toLowerCase() === selectedGender.toLowerCase());
        }

        setFilteredDoctors(filtered);
    }, [searchTerm, selectedSpecializations, sortByRating, selectedGender, psychologists]);

    const handleGenderSelect = (value) => {
        setSelectedGender((prev) => (prev === value ? null : value)); // Toggle selection
    };

    const resetFilters = () => {
        setSearchTerm("");
        setSelectedSpecializations([]);
        setSortByRating(null);
        setSelectedGender(null);
    };

    const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
    const currentDoctors = filteredDoctors.slice((currentPage - 1) * doctorsPerPage, currentPage * doctorsPerPage);

    return (
        <>
            <Helmet>
                <title>Đặt tư vấn từ danh sách chuyên viên</title>
            </Helmet>
            <ToastReceiver />
            <div className="max-w-7xl mx-auto px-6 pt-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-blue-500 mb-2">Đặt lịch trước qua Tâm Giao</h1>
                    <p className="text-gray-600">Để được tư vấn trực tuyến</p>
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
                                    placeholder="Tìm theo tên chuyên viên..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
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
                                <Select onValueChange={(value) => setSortByRating(value)}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Đánh giá" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="high">Cao nhất</SelectItem>
                                        <SelectItem value="low">Thấp nhất</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Filter Button */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="text-blue-500 border-blue-500">
                                        Lọc thêm
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Chọn tư vấn viên</DialogTitle>
                                    </DialogHeader>

                                    <div className="space-y-6">
                                        {/* Specialties Section */}
                                        <div>
                                            <h3 className="font-medium mb-4">Chuyên khoa:</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                                {specializations.map((specialty, index) => (
                                                    <div key={index} className="flex items-center space-x-4">
                                                        <Checkbox
                                                            id={specialty}
                                                            checked={selectedSpecializations.includes(specialty)}
                                                            className="border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 data-[state=checked]:text-white"
                                                            onCheckedChange={() =>
                                                                setSelectedSpecializations((prev) =>
                                                                    prev.includes(specialty)
                                                                        ? prev.filter((s) => s !== specialty)
                                                                        : [...prev, specialty]
                                                                )
                                                            }
                                                        />
                                                        <Label htmlFor={specialty}>{specialty}</Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Gender Section */}
                                        <div>
                                            <h3 className="font-medium mb-4">Giới tính:</h3>
                                            <RadioGroup value={selectedGender || "all"} className="flex space-x-6">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="male"
                                                        id="male"
                                                        onClick={() => handleGenderSelect("male")}
                                                        checked={selectedGender === "male"}
                                                        className="border-gray-300 data-[state=checked]:bg-white data-[state=checked]:border-blue-500 data-[state=checked]:text-blue-500"
                                                    />
                                                    <Label htmlFor="male">Tư vấn viên nam</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="female"
                                                        id="female"
                                                        onClick={() => handleGenderSelect("female")}
                                                        checked={selectedGender === "female"}
                                                        className="border-gray-300 data-[state=checked]:bg-white data-[state=checked]:border-blue-500 data-[state=checked]:text-blue-500"
                                                    />
                                                    <Label htmlFor="female">Tư vấn viên nữ</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-end space-x-4 pt-4">
                                            <Button variant="outline" onClick={resetFilters}>
                                                Thiết lập lại
                                            </Button>
                                            {/* <Button className="bg-emerald-500 hover:bg-emerald-600">Áp dụng</Button> */}
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <h2 className="font-semibold mb-8 text-xl">Chọn tư vấn viên</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {currentDoctors.map((doctor, index) => (
                            <DoctorCard
                                key={index}
                                doctor={{
                                    id: doctor._id, // Ensure the doctor ID is included
                                    name: doctor.fullName,
                                    gender: doctor.gender,
                                    specialty: doctor.psychologist.psychologistProfile.specialization,
                                    rating: doctor.psychologist.psychologistProfile.rating || 0,
                                    appointments: doctor.psychologist.psychologistProfile.appointments || 0,
                                    image: doctor.profileImg,
                                    isAvailable: true,
                                }}
                            />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
                                &lt;
                            </Button>

                            {Array.from({ length: totalPages }, (_, i) => (
                                <Button
                                    key={i + 1}
                                    variant={currentPage === i + 1 ? "default" : "outline"}
                                    onClick={() => setCurrentPage(i + 1)}>
                                    {i + 1}
                                </Button>
                            ))}

                            <Button
                                variant="outline"
                                size="icon"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>
                                &gt;
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DoctorBooking;
