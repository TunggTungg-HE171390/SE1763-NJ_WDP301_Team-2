import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const slides = [
    {
        id: 1,
        imageUrl:
            "https://preview.redd.it/shrek-harvey-and-his-companion-the-god-of-swamps-ruler-of-v0-9h1vt1ay37j91.jpg?width=640&crop=smart&auto=webp&s=8b9c9ad97b94a34334ae78c616521aac17e6afa5",
        title: "Slide 1",
    },
    {
        id: 2,
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiGH692JKGKQ6t9K1nxWdKRaDa8V387Yqe1w&s",
        title: "Slide 2",
    },
    {
        id: 3,
        imageUrl: "https://placekitten.com/640/400",
        title: "Slide 3",
    },
    {
        id: 4,
        imageUrl: "https://placebear.com/640/400",
        title: "Slide 4",
    },
];

const PromoCarousel = () => {
    return (
        <div className="w-full max-w-6xl mx-auto px-4">
            <div>
                <h1 className="text-2xl font-bold text-[#104a93]">Attractive Offers</h1>
                <p className="text-[#10409a] text-[20px] font-bold mb-6">Something something</p>
            </div>
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="relative">
                <CarouselContent className="flex">
                    {slides.map((slide) => (
                        <CarouselItem key={slide.id} className="md:basis-1/2 basis-full">
                            <div className="relative rounded-lg overflow-hidden">
                                <img src={slide.imageUrl} alt={slide.title} className="w-full h-[200px] object-cover" />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Navigation Arrows */}
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
            </Carousel>
        </div>
    );
};

export default PromoCarousel;
