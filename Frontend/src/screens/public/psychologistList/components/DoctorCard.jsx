import PropTypes from "prop-types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom"; // Import Link

const DoctorCard = ({ doctor }) => (
    <Card className="overflow-hidden min-h-[350px] flex flex-col justify-between">
        <div className="p-4 flex flex-col items-center flex-1">
            {/* Avatar container */}
            <div className="relative flex justify-center items-center">
                <Avatar className="w-[20vh] h-[20vh]">
                    <AvatarImage src={doctor.image} />
                    <AvatarFallback>{doctor.name}</AvatarFallback>
                </Avatar>
            </div>

            <div className="mt-4 text-center flex-1 flex flex-col justify-between">
                <h3 className="font-semibold text-lg">{doctor.name}</h3>
                <p className="hidden">{doctor.gender}</p>
                <div className="flex justify-center gap-4 my-2">
                    <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-500">{doctor.appointments || 0}</span>
                        <span className="text-sm text-blue-500">
                            <Calendar />
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-500">{doctor.rating}</span>
                        <span className="text-sm text-blue-500">
                            <Star />
                        </span>
                    </div>
                </div>
                <div className="mt-2 bg-gray-100 inline-block px-3 py-1 rounded-full text-sm">{doctor.specialty}</div>
            </div>
        </div>

        {/* Navigate to Doctor Profile */}
        <Link to={`/doctor/profile/${doctor.id}`}>
            <Button className="w-full rounded-none bg-blue-500 hover:bg-blue-600">Đặt khám</Button>
        </Link>
    </Card>
);

// PropTypes validation
DoctorCard.propTypes = {
    doctor: PropTypes.shape({
        id: PropTypes.string.isRequired, // Ensure doctor has an ID
        name: PropTypes.string.isRequired,
        gender: PropTypes.string.isRequired,
        specialty: PropTypes.string.isRequired,
        appointments: PropTypes.number,
        rating: PropTypes.number.isRequired,
        image: PropTypes.string,
        isAvailable: PropTypes.bool.isRequired,
    }).isRequired,
};

export default DoctorCard;
