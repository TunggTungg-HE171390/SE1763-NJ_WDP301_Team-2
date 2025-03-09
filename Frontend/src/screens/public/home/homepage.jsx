import { Helmet } from "react-helmet-async";
import ChatWidget from "@/components/public/chat/chat-widget";
import HeroSection from "@/screens/public/home/components/hero-section";
import DoctorsSection from "@/screens/public/home/components/doctor-section";
import StatsSection from "@/screens/public/home/components/stats-section";
import Slide from "@/screens/public/home/components/slide";
import TestimonialSection from "@/screens/public/home/components/testimonial-section";
import FeatureSection from "@/screens/public/home/components/feature-section";

function Homepage() {
    return (
        <div>
            <Helmet>
                <title>Tâm Giao</title>
            </Helmet>
            <div>
                <ChatWidget />
            </div>
            <div>
                <HeroSection />
            </div>
            <div className="pb-16">
                <Slide />
            </div>
            <div className="pb-16">
                <DoctorsSection />
            </div>
            <div className="pb-16">
                <TestimonialSection />
            </div>
            <div className="pb-16">
                <StatsSection />
            </div>
            <div className="pb-16">
                <FeatureSection />
            </div>
        </div>
    );
}

export default Homepage;
