import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

const testimonials = [
    {
        id: 1,
        content:
            "Ban đầu, tôi khá e ngại khi tìm kiếm sự giúp đỡ về tâm lý, nhưng website này đã thay đổi suy nghĩ của tôi. Các chuyên gia tư vấn rất tận tâm, lắng nghe và đưa ra những lời khuyên thực sự hữu ích. Nhờ các buổi tư vấn, tôi cảm thấy nhẹ nhõm hơn và học cách đối diện với những khó khăn trong cuộc sống.",
        author: "Ẩn danh",
        position: "Ẩn danh",
        avatar: "/api/placeholder/48/48",
    },
    {
        id: 2,
        content:
            "Tôi đã trải qua một giai đoạn căng thẳng và mất phương hướng, nhưng nhờ dịch vụ tư vấn tâm lý trực tuyến trên website, tôi đã tìm lại được sự cân bằng. Quá trình đặt lịch rất dễ dàng, chuyên gia thì vô cùng chuyên nghiệp và thấu hiểu. Tôi cảm thấy mình được lắng nghe và hỗ trợ thực sự.",
        author: "Ẩn danh",
        position: "Ẩn danh",
        avatar: "/api/placeholder/48/48",
    },
];

const TestimonialSlider = () => {
    return (
        <div className="w-full max-w-6xl mx-auto px-12 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Left: Title Section */}
            <div className="md:col-span-2 flex items-start justify-start pt-8">
                <h2 className="text-2xl font-bold text-blue-600">Cảm nhận từ phía khách hàng</h2>
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
                                            <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col items-start">
                                            <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                                            <p className="text-gray-500 text-sm">{testimonial.position}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 mb-6">
                                        <Quote className="text-blue-500 w-12 h-12 flex-shrink-0" />
                                        <p className="text-gray-700 text-lg leading-relaxed">{testimonial.content}</p>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white" />
                    <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white" />
                </Carousel>
            </div>
        </div>
    );
};

export default TestimonialSlider;
