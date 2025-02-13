import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";
import TopBar from "./components/common/topbar";
import Header from "./components/common/header";
import Footer from "./components/common/footer";
import Homepage from "./screens/public/homepage";
import Login from "./screens/common/login";
import SignUp from "./screens/common/register";
import Verify from "./screens/common/verify";
import TeamLogo from "./assets/TeamLogo.svg";
import { AuthProvider } from "@/components/auth/authContext";
import { useAuth } from "@/hooks/useAuth"; // Import authentication hook
import PropTypes from "prop-types";
import ToastReceiver from "@/components/common/toast/toast-receiver";

// Protected route with role-based access control
function ProtectedRoute({ element, requiredRole }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" replace />; // Redirect unauthorized users to homepage
    }

    return element;
}

// Public routes (only accessible if not logged in)
function PublicRoute({ element }) {
    const { user } = useAuth();
    return user ? <Navigate to="/" replace /> : element;
}

// Prop validation
ProtectedRoute.propTypes = {
    element: PropTypes.node.isRequired, // Use `node` instead of `element`
    requiredRole: PropTypes.string, // Optional role check
};

PublicRoute.propTypes = {
    element: PropTypes.node.isRequired, // Fix for missing prop validation
};

function Layout() {
    const location = useLocation();
    const hideHeaderFooter = ["/login", "/signup", "/verify"].includes(location.pathname);

    return (
        <div className="app">
            <HelmetProvider>
                <Helmet>
                    <link rel="icon" type="image/svg+xml" href={TeamLogo} />
                </Helmet>
                <TopBar />
                {!hideHeaderFooter && <Header />}
                <Toaster />
                <ToastReceiver />
                <div>
                    <Routes>
                        <Route path="/" element={<Homepage />} />
                        <Route path="/login" element={<PublicRoute element={<Login />} />} />
                        <Route path="/signup" element={<PublicRoute element={<SignUp />} />} />
                        <Route path="/verify" element={<PublicRoute element={<Verify />} />} />
                    </Routes>
                </div>
                {!hideHeaderFooter && <Footer />}
            </HelmetProvider>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Layout />
            </Router>
        </AuthProvider>
    );
}

export default App;
