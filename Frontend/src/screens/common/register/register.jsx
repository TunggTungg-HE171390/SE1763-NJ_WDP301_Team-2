import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import RegisterForm from "./components/register-form";

const images = [
    "https://marinwellnesscounseling.com/wp-content/uploads/2021/03/pexels-polina-zimmerman-3958461-scaled-1.jpeg",
    "https://media.istockphoto.com/id/1405778999/photo/psychologist-working-with-teenage-boy-at-office.jpg?s=612x612&w=0&k=20&c=X0QbEXz_IwYOFTViKIbWYuAn4ZCNsyQ4PFK0hIRlp3Q=",
    "https://www.tomstrust.org.uk/wp-content/uploads/2024/05/FEATURED-IMAGE-SIZE-9.jpg",
    "https://static.wixstatic.com/media/01f222_447457f5a7f1488db8100a5c0a094d8b~mv2.jpg/v1/crop/x_337,y_0,w_1903,h_1436/fill/w_574,h_434,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/01f222_447457f5a7f1488db8100a5c0a094d8b~mv2.jpg",
];

const Register = () => {
    const [currentImage, setCurrentImage] = useState(images[0]);
    const [fade, setFade] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(true); // Start fade effect
            setTimeout(() => {
                setCurrentImage((prevImage) => {
                    const currentIndex = images.indexOf(prevImage);
                    return images[(currentIndex + 1) % images.length]; // Loop through images
                });
                setFade(false); // Reset fade after image change
            }, 500); // 1-second fade duration
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    return (
        <>
            <Helmet>
                <title>Đăng ký</title>
            </Helmet>
            <div className="min-h-screen w-full fixed inset-0 flex items-center justify-center bg-cover bg-center">
                <div
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                        fade ? "opacity-0" : "opacity-100"
                    }`}
                    style={{
                        backgroundImage: `url(${currentImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}></div>

                {/* Background Overlay for Readability */}
                <div className="absolute inset-0 bg-white opacity-20"></div>

                <RegisterForm />
            </div>
        </>
    );
};
export default Register;
