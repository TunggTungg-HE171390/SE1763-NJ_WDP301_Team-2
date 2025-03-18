import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import apiClient from "@/api/apiClient";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from React Router

const PromoCarousel = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await apiClient.get("/blogposts/allblogs");
                // Filter blogs that have "ads" in the tag array
                const filteredArticles = response.data.filter((blog) => blog.tag && blog.tag.includes("ads"));
                setArticles(filteredArticles.slice(0, 3)); // Get only the top 3 filtered blogs
            } catch (err) {
                console.error(err);
            }
        };
        fetchArticles();
    }, []);

    return (
        <div className="w-full max-w-6xl mx-auto px-4">
            <div>
                <h1 className="text-2xl font-bold text-blue-600">Ưu đãi hấp dẫn</h1>
                <p className="text-blue-600 text-[20px] font-bold mb-6">được nhiều khách hàng lựa chọn</p>
            </div>
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="relative">
                <CarouselContent className="flex">
                    {articles.map((slide) => (
                        <CarouselItem key={slide._id} className="md:basis-1/2 basis-full">
                            <Link to={`/blogdetail/${slide._id}`}>
                                <div className="relative rounded-lg overflow-hidden cursor-pointer">
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className="w-full h-[200px] object-cover"
                                    />
                                </div>
                            </Link>
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
