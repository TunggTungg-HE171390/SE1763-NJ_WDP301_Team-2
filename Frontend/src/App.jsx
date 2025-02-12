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

function Layout() {
    const location = useLocation(); // Get the current route
    const hideHeaderFooter = ["/login", "/signup"].includes(location.pathname); // Exclude header/footer on these routes

    return (
        <div className="app">
            <HelmetProvider>
                <Helmet>
                    <link rel="icon" type="image/svg+xml" href={TeamLogo} />
                </Helmet>
                <TopBar />
                {!hideHeaderFooter && <Header />}
                <Toaster />
                <div>
                    <Routes>
                        <Route path="/" element={<Homepage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                    </Routes>
                </div>
                {!hideHeaderFooter && <Footer />}
            </HelmetProvider>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Layout />
        </Router>
    );
}

export default App;
