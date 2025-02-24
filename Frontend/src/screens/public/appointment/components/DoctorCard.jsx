import PropTypes from "prop-types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DoctorCard = ({ doctor }) => (
    <Card className="overflow-hidden">
        <div className="p-4 flex flex-col items-center">
            {/* Avatar container */}

            <div className="relative flex justify-center items-center">
                <Avatar className="w-[20vh] h-[20vh]">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>

            <div className="mt-4 text-center">
                <h3 className="font-semibold text-lg">{doctor.name}</h3>
                <div className="flex justify-center gap-4 my-2">
                    <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-500">{doctor.appointments}</span>
                        <span className="text-sm text-emerald-500">
                            <Calendar />
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-500">{doctor.rating}</span>
                        <span className="text-sm text-emerald-500">
                            <Star />
                        </span>
                    </div>
                </div>
                <div className="mt-2 bg-gray-100 inline-block px-3 py-1 rounded-full text-sm">{doctor.specialty}</div>
            </div>
        </div>
        <Button className="w-full rounded-none bg-emerald-500 hover:bg-emerald-600">Đặt khám</Button>
    </Card>
);

// PropTypes validation
DoctorCard.propTypes = {
    doctor: PropTypes.shape({
        name: PropTypes.string.isRequired,
        specialty: PropTypes.string.isRequired,
        appointments: PropTypes.number.isRequired,
        rating: PropTypes.number.isRequired,
        image: PropTypes.string,
        isAvailable: PropTypes.bool.isRequired,
    }).isRequired,
};

export default DoctorCard;
