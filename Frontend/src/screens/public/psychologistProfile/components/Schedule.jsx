import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, Video } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import * as API from "@/api";
import { useNavigate } from "react-router-dom";

const Schedule = ({ psychologist, profile }) => {
    const navigate = useNavigate();
    const [date, setDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await API.getScheduleListByDoctorId(psychologist._id);
                const scheduleData = response.data;

                const selectedDateUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

                const availableSlots = scheduleData
                    .filter((slot) => {
                        const slotDate = new Date(slot.date);
                        const slotDateUTC = new Date(
                            Date.UTC(slotDate.getFullYear(), slotDate.getMonth(), slotDate.getDate())
                        );
                        return slotDateUTC.getTime() === selectedDateUTC.getTime() && !slot.isBooked;
                    })
                    .map((slot) => {
                        const startTime = new Date(slot.startTime);
                        const endTime = new Date(slot.endTime);

                        // Convert to local hours and minutes
                        const startHours = startTime.getHours();
                        const startMinutes = startTime.getMinutes();
                        const endHours = endTime.getHours();
                        const endMinutes = endTime.getMinutes();

                        return {
                            id: slot._id,
                            startTime, // Keep the date object for sorting
                            localStartTime: startHours * 60 + startMinutes, // Convert time to minutes for correct sorting
                            time: `${startHours.toString().padStart(2, "0")}:${startMinutes
                                .toString()
                                .padStart(2, "0")} - 
                               ${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`,
                        };
                    })
                    .sort((a, b) => a.localStartTime - b.localStartTime); // Sort using minutes-based comparison

                setTimeSlots(availableSlots);
            } catch (error) {
                console.error("Error fetching schedule:", error);
                setTimeSlots([]);
            }
        };

        fetchSchedule();
    }, [date, psychologist._id]);

    const handleStartConsultation = () => {
        if (selectedTime) {
            navigate(`/book-appointment/?psychologistId=${psychologist._id}&scheduleId=${selectedTime.id}`);
        }
    };

    return (
        <Card className="mb-4">
            <CardContent className="p-4">
                <div className="p-6 rounded-lg mb-4 bg-blue-50">
                    <div className="flex items-center gap-x-8 mb-2">
                        <p className="text-lg font-medium">Lịch tư vấn trực tuyến</p>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2 text-sm text-blue-600 hover:text-blue-900">
                                    {date.toLocaleDateString()} <span className="ml-1">▼</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(newDate) => {
                                        if (newDate && newDate.getTime() !== date.getTime()) {
                                            setDate(newDate);
                                        }
                                    }}
                                    className="rounded-md border text-sm text-blue-600"
                                    disabled={(day) => {
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        const sevenDaysLater = new Date();
                                        sevenDaysLater.setDate(today.getDate() + 7);
                                        sevenDaysLater.setHours(0, 0, 0, 0);
                                        return day < today || day > sevenDaysLater;
                                    }}
                                    modifiersClassNames={{
                                        selected: "bg-blue-600 text-white",
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="grid grid-cols-10 gap-2 mt-4">
                        {timeSlots.length > 0 ? (
                            timeSlots.map(({ id, time }) => (
                                <Button
                                    key={id}
                                    variant="outline"
                                    size="sm"
                                    className={`text-sm h-10 transition-colors border-blue-600
                                        ${
                                            selectedTime?.id === id
                                                ? "bg-blue-600 text-white hover:bg-blue-800 hover:text-white"
                                                : "bg-white text-black hover:bg-blue-600 hover:text-white"
                                        }`}
                                    onClick={() => setSelectedTime(selectedTime?.id === id ? null : { id, time })}>
                                    {time}
                                </Button>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm col-span-10">Không có lịch tư vấn cho ngày hôm nay.</p>
                        )}
                    </div>

                    {selectedTime && (
                        <div className="mt-6 border-t">
                            <div className="rounded-md py-4">
                                <div className="flex items-center">
                                    <Check className="h-5 w-5 text-blue-500 mr-2" />
                                    <p className="text-md font-medium">
                                        Tư vấn trực tuyến với {psychologist.fullName}{" "}
                                        <span className="font-bold text-blue-600">350.000đ</span>
                                    </p>
                                </div>
                                <div className="mt-4">
                                    <Button
                                        onClick={handleStartConsultation}
                                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center px-6 py-4 w-full sm:w-auto">
                                        <Video className="h-5 w-5 mr-2" />
                                        <span className="font-medium">Đặt lịch tư vấn</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="pl-8">
                    <h3 className="text-lg font-semibold uppercase mb-4 text-left">Kinh nghiệm và Lịch sử làm việc</h3>
                    <ul className="text-base pl-6 text-left">
                        {profile.medicalExperience.concat(profile.workHistory).map((exp, index) => (
                            <li key={index} className="flex items-start mb-3">
                                <span className="text-blue-500 mr-2">•</span>
                                <span>{exp}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};

Schedule.propTypes = {
    psychologist: PropTypes.shape({
        _id: PropTypes.string,
        fullName: PropTypes.string.isRequired,
    }).isRequired,
    profile: PropTypes.shape({
        professionalLevel: PropTypes.string,
        educationalLevel: PropTypes.string,
        specialization: PropTypes.string,
        appointmentsAttended: PropTypes.number,
        consultationsCount: PropTypes.number,
        rating: PropTypes.number,
        numberOfRatings: PropTypes.number,
        medicalExperience: PropTypes.array,
        workHistory: PropTypes.array,
    }).isRequired,
};

export default Schedule;
