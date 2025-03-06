import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Banner from "@/assets/banner.jpg";

const HeroSection = () => {
    return (
        <div className="relative w-full h-[65vh] overflow-hidden mb-8">
            {/* Background Image */}
            <img src={Banner} alt="Mobile App" className="absolute inset-0 w-full h-full object-cover" />

            {/* Overlay for better contrast */}
            <div className="absolute inset-0 "></div>

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto flex items-center h-full">
                <div className="w-[55%] p-8">
                    <h1 className="text-7xl font-bold text-[#104a93] mb-2">TrustTalk</h1>
                    <p className="text-[#10409a] text-xl font-bold mb-6">
                        Having a mental breakdown? Try Genshin Impact
                    </p>
                    <div className="grid grid-cols-2 gap-6 mr-4">
                        <Card className="p-4 text-center rounded-[15px] hover:shadow-lg transition-shadow hover:border-2 hover:border-blue-500">
                            <CardContent className="p-2 flex flex-col items-center justify-center">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className="text-2xl mb-2">Online Consultation</div>
                                <div className="text-sm">Online medical consultation at home</div>
                            </CardContent>
                        </Card>
                        <Card className="p-4 text-center rounded-[15px] hover:shadow-lg transition-shadow hover:border-2 hover:border-blue-500">
                            <CardContent className="p-2 flex flex-col items-center justify-center">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className="text-2xl mb-2">Online Consultation</div>
                                <div className="text-sm">Online medical consultation at home</div>
                            </CardContent>
                        </Card>
                        <Card className="p-4 text-center rounded-[15px] hover:shadow-lg transition-shadow hover:border-2 hover:border-blue-500">
                            <CardContent className="p-2 flex flex-col items-center justify-center">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className="text-2xl mb-2">Online Consultation</div>
                                <div className="text-sm">Online medical consultation at home</div>
                            </CardContent>
                        </Card>
                        <Card className="p-4 text-center rounded-[15px] hover:shadow-lg transition-shadow hover:border-2 hover:border-blue-500">
                            <CardContent className="p-2 flex flex-col items-center justify-center">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className="text-2xl mb-2">Online Consultation</div>
                                <div className="text-sm">Online medical consultation at home</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;