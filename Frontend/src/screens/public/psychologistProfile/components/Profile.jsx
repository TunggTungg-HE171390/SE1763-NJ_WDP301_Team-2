import PropTypes from "prop-types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = ({ psychologist, profile }) => {
    return (
        <Card className="mb-4">
            <CardContent className="p-4">
                <div className="flex items-start gap-8">
                    <Avatar className="w-[20vh] h-[20vh]">
                        <AvatarImage src={psychologist.profileImg} />
                        <AvatarFallback>{psychologist.fullName}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex flex-col py-4">
                        <h2 className="text-xl font-bold text-black-900 text-start">{psychologist.fullName}</h2>
                        <div className="flex flex-row mt-2">
                            <div className="flex items-start">
                                <div>
                                    <p className="text-sm text-gray-600 text-start pb-3">150.000đ</p>
                                    <div className="mt-1 flex flex-wrap gap-2 max-w-[400px]">
                                        <Badge variant="outline" className="bg-slate-200 rounded-md">
                                            {profile.professionalLevel}
                                        </Badge>
                                        <Badge variant="outline" className="bg-slate-200 rounded-md">
                                            {profile.educationalLevel}
                                        </Badge>
                                        <Badge variant="outline" className="bg-slate-200 rounded-md">
                                            {profile.specialization}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2 pl-[4rem]">
                                <div className="flex items-center">
                                    <CalendarDays className="h-4 w-4 text-blue-500 mr-1" />
                                    <span className="font-semibold">Cuộc hẹn đã tham gia: {profile.appointmentsAttended}</span>
                                </div>
                                <div className="flex items-center">
                                    <CalendarDays className="h-4 w-4 text-blue-500 mr-1" />
                                    <span className="font-semibold">Số người đã tư vấn: {profile.consultationsCount}</span>
                                </div>
                                <div className="flex items-center">
                                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                    <span className="font-semibold">
                                        Đánh giá: {profile.rating} ({profile.numberOfRatings} đánh giá)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Prop Validation
Profile.propTypes = {
    psychologist: PropTypes.shape({
        fullName: PropTypes.string.isRequired,
        profileImg: PropTypes.string,
    }).isRequired,
    profile: PropTypes.shape({
        professionalLevel: PropTypes.string,
        educationalLevel: PropTypes.string,
        specialization: PropTypes.string,
        appointmentsAttended: PropTypes.number,
        consultationsCount: PropTypes.number,
        rating: PropTypes.number,
        numberOfRatings: PropTypes.number,
    }).isRequired,
};

export default Profile;
