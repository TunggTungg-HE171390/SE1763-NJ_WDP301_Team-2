import PropTypes from "prop-types";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, Video } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

const Schedule = ({ psychologist, profile }) => {
    const [date, setDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const timeSlots = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00"];

    return (
        <Card className="mb-4">
            <CardContent className="p-4">
                <div className="p-6 rounded-lg mb-4 bg-blue-50">
                    <div className="flex items-center gap-x-8 mb-2">
                        <p className="text-lg font-medium">Online Consultation Schedule</p>
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
                                    onSelect={setDate}
                                    className="rounded-md border text-sm text-blue-600"
                                    disabled={(day) => {
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        return day < today;
                                    }}
                                    modifiersClassNames={{
                                        selected: "bg-blue-600 text-white",
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="grid grid-cols-10 gap-2 mt-4">
                        {timeSlots.map((time, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className={`text-sm h-10 transition-colors border-blue-600
                                        ${
                                            selectedTime === time
                                                ? "bg-blue-600 text-white"
                                                : "bg-white text-black hover:bg-blue-600 hover:text-white"
                                        }`}
                                onClick={() => setSelectedTime(time)}>
                                {time}
                            </Button>
                        ))}
                    </div>

                    {selectedTime && (
                        <div className="mt-6 border-t">
                            <div className="rounded-md py-4">
                                <div className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-2" />
                                    <p className="text-md font-medium">
                                        Online Consultation with {psychologist.fullName}{" "}
                                        <span className="font-bold text-blue-600">$50</span>
                                    </p>
                                </div>
                                <div className="mt-4">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center px-6 py-4 w-full sm:w-auto">
                                        <Video className="h-5 w-5 mr-2" />
                                        <span className="font-medium">Start Consultation</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="pl-8">
                    <h3 className="text-lg font-semibold uppercase mb-4 text-left">Experience & Work History</h3>
                    <ul className="text-base pl-6 text-left">
                        {profile.medicalExperience.concat(profile.workHistory).map((exp, index) => (
                            <li key={index} className="flex items-start mb-3">
                                <span className="text-green-500 mr-2">•</span>
                                <span>{exp}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};

// **Prop Validation**
Schedule.propTypes = {
    psychologist: PropTypes.shape({
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
