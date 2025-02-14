import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";
import TopBar from "./components/common/topbar";
import Header from "./components/common/header";
import Footer from "./components/common/footer";

import Homepage from "./screens/public/homepage";
import Login from "./screens/common/login";
import SignUp from "./screens/common/register";
import TeamLogo from "./assets/TeamLogo.svg";
import Blog from "./screens/public/Blog";
import Blogdetail from "./screens/public/Blogdetail";
function App() {
    return (
        <HelmetProvider>
            <Helmet>ghgughbghb
                <link rel="icon" type="image/svg+xml" href={TeamLogo} />
            </Helmet>
            <Router>
           
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blogdetail/:id" element={<Blogdetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                </Routes>
            </Router>
        </HelmetProvider>
    );
}

export default App;
