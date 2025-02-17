import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

const testimonials = [
    {
        id: 1,
        content:
            "Làm mẹ ai mà chả thương con, nhiều khi thấy con ốm đau đưa vào bệnh viện mà nhìn cảnh xếp hàng chen chúc, chờ đợi mà sốt ruột quá. May sao nhờ mấy chị đồng nghiệp giới thiệu đặt trước lịch khám trên IVIE - Bác sĩ ơi nên cũng yên tâm mỗi lần đưa con đi khám.",
        author: "Chị Nguyễn Minh Ngọc",
        position: "Senior Marketing",
        avatar: "/api/placeholder/48/48",
    },
    {
        id: 2,
        author: "Chị Trần Sa Phia",
        position: "HR Manager",
        avatar: "/api/placeholder/48/48",
    },
    {
        id: 3,
        author: "Chị Nguyễn Văn Anh",
        position: "Sáng lập và Giám đốc điều hành CSAGA",
        avatar: "/api/placeholder/48/48",
    },
];

const TestimonialSlider = () => {
    return (
        <div className="w-full max-w-6xl mx-auto px-12 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Left: Title Section */}
            <div className="md:col-span-2 flex items-start justify-start pt-8">
                <h2 className="text-2xl font-bold text-emerald-600">Cảm nhận từ phía khách hàng</h2>
            </div>

            {/* Right: Testimonial Carousel */}
            <div className="md:col-span-3">
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="relative">
                    <CarouselContent>
                        {testimonials.map((testimonial) => (
                            <CarouselItem key={testimonial.id} className="md:basis-1/1">
                                <div className="bg-white p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col items-start">
                                            <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                                            <p className="text-gray-500 text-sm">{testimonial.position}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 mb-6">
                                        <Quote className="text-emerald-500 w-12 h-12 flex-shrink-0" />
                                        <p className="text-gray-700 text-lg leading-relaxed">{testimonial.content}</p>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 bg-emerald-500 hover:bg-emerald-600 text-white" />
                    <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 bg-emerald-500 hover:bg-emerald-600 text-white" />
                </Carousel>
            </div>
        </div>
    );
};

export default TestimonialSlider;
