import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";
import { useState, useEffect } from "react";

const testimonials = [
    {
        id: 1,
        content:
            "As a mother, who doesn't love their child? Sometimes seeing my child sick and taking them to the hospital, looking at the crowded queues, waiting makes me so anxious. Luckily, thanks to my colleagues' recommendation to book an appointment in advance on IVIE - Doctor Oi, I feel more at ease every time I take my child to the doctor.",
        author: "Nguyen Minh Ngoc",
        position: "Senior Marketing",
        avatar: "/api/placeholder/48/48",
    },
    {
        id: 2,
        content:
            "IVIE - Doctor Oi has made it so much easier for me to manage my health appointments. The convenience of booking online and avoiding long waits is a game-changer.",
        author: "Tran Sa Phia",
        position: "HR Manager",
        avatar: "/api/placeholder/48/48",
    },
    {
        id: 3,
        content:
            "As the founder and CEO of CSAGA, I highly recommend IVIE - Doctor Oi for its excellent service and the peace of mind it provides.",
        author: "Nguyen Van Anh",
        position: "Founder and CEO of CSAGA",
        avatar: "/api/placeholder/48/48",
    },
];

const TestimonialSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % testimonials.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handlePrev = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + testimonials.length) % testimonials.length);
    };

    const handleNext = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % testimonials.length);
    };

    return (
        <div className="w-full flex flex-col items-center">
            <h2 className="text-2xl font-bold text-emerald-600 text-center mb-6">
                Customer Testimonials
            </h2>

            <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 md:grid-cols-5 gap-8 justify-center">
                <div className="md:col-span-5 mt-6 relative">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="relative"
                    >
                        <CarouselContent
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {testimonials.map((testimonial) => (
                                <CarouselItem key={testimonial.id} className="md:basis-1/1">
                                    <div className="bg-white p-8 shadow-lg rounded-lg">
                                        <div className="flex items-center gap-4 mb-6">
                                            <Avatar>
                                                <AvatarImage src={testimonial.avatar} />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col items-start">
                                                <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                                                <p className="text-gray-500 text-sm">{testimonial.position}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 mb-6">
                                            <Quote className="text-emerald-500 w-12 h-12 flex-shrink-0" />
                                            <p className="text-gray-700 text-lg leading-relaxed">
                                                {testimonial.content}
                                            </p>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <CarouselPrevious
                            className="absolute -left-12 top-1/2 -translate-y-1/2 bg-emerald-500 hover:bg-emerald-600 text-white"
                            onClick={handlePrev}
                        />
                        <CarouselNext
                            className="absolute -right-12 top-1/2 -translate-y-1/2 bg-emerald-500 hover:bg-emerald-600 text-white"
                            onClick={handleNext}
                        />
                    </Carousel>
                </div>
            </div>
        </div>
    );
};

export default TestimonialSlider;
