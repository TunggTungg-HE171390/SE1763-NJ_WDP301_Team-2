// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";
import TopBar from "./components/common/topbar";
import Header from "./components/common/header";
import Footer from "./components/common/footer";
import Homepage from "./screens/public/home/homepage";
import Login from "@/screens/common/login/login";
import SignUp from "@/screens/common/register/register";
import Verify from "@/screens/common/verify/verify";
import ForgotPassword from "@/screens/common/forgotPassword/forgotPassword";
import TeamLogo from "@/assets/TeamLogo.svg";
import CategoryTestSelected from "./screens/public/CategoryTestSelected";
import CategoryDetailTest from "./screens/public/CategoryDetailTest";
import TestForm from "./screens/public/TestForm";
import Test from "./screens/public/Test";
import { AuthProvider } from "@/components/auth/authContext";
import { useAuth } from "@/hooks/useAuth"; // Import authentication hook
import PropTypes from "prop-types";
import ToastReceiver from "@/components/common/toast/toast-receiver";
import CreateNewPost from "./screens/staff/CreateNewBlogPost";
import DoctorBooking from "./screens/public/psychologistList/DoctorBooking";
import PsychologistProfile from "./screens/public/psychologistProfile/psychologistProfile";
import ManagePosts from "./screens/staff/ManagePosts";
import CreateTestScreen from "./screens/admin/CreateTestScreen";
import TestOutCome from "./screens/public/TestOutCome";
import ChangePassword from "./screens/user/changePassword/changePassword";
import BookAppointment from "./screens/public/bookAppointment/bookAppointment";
import FinishBooking from "./screens/public/finishBooking/finishBooking";
import UpdatePost from "./screens/staff/UpdatePost";
import ViewAppointment from "./screens/psychologist/viewAppointment/viewAppointment";
import ViewAppointmentDetail from "./screens/psychologist/viewAppointmentDetail/viewAppointmentDetail";
import BlogScreen from "./screens/public/blog/blog.jsx";
import BlogDetail from "./screens/public/blog/Blogdetail.jsx";
import ManageUsers from "./screens/admin/ManageUsers.jsx";
import AboutUs from "./screens/common/aboutUs.jsx";
// Create MUI theme
const theme = createTheme({
    palette: {
        primary: {
            main: "#3788d8",
        },
        secondary: {
            main: "#f50057",
        },
        success: {
            main: "#4caf50",
        },
        warning: {
            main: "#ff9800",
        },
        error: {
            main: "#f44336",
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                },
            },
        },
    },
});

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
    element: PropTypes.node.isRequired,
    requiredRole: PropTypes.string,
};

PublicRoute.propTypes = {
    element: PropTypes.node.isRequired,
};

function Layout() {
    const location = useLocation();
    const hideLayout = ["/login", "/signup", "/verify", "/forgotPassword", "/changePassword"].includes(
        location.pathname
    );

    return (
        <div className="app">
            <HelmetProvider>
                <Helmet>
                    <link rel="icon" type="image/svg+xml" href={TeamLogo} />
                </Helmet>
                <TopBar />
                <Toaster />
                <ToastReceiver />
                {!hideLayout && <Header />}
                <div>
                    <Routes>
                        <Route path="/" element={<Homepage />} />
                        <Route path="/CategoryTestSelected" element={<CategoryTestSelected />} />
                        <Route path="/getTest/:categoryId" element={<CategoryDetailTest />} />
                        <Route path="/questions-on-test/:testId" element={<TestForm />} />
                        <Route path="/Test" element={<Test />} />
                        <Route path="/create-test/:categoryId" element={<CreateTestScreen />} />
                        <Route path="/test-outcome" element={<TestOutCome />} />
                        <Route path="/login" element={<PublicRoute element={<Login />} />} />
                        <Route path="/signup" element={<PublicRoute element={<SignUp />} />} />
                        <Route path="/verify" element={<PublicRoute element={<Verify />} />} />
                        <Route path="/manage-posts" element={<ManagePosts />} />
                        <Route path="/create-post" element={<CreateNewPost />} />
                        <Route path="/update-post/:postId" element={<UpdatePost />} />
                        <Route path="/manage-posts" element={<ManagePosts />} />
                        <Route path="/psychologist/view-appointments" element={<ViewAppointment />} />
                        <Route
                            path="/psychologist/view-appointment-detail/:appointmentId"
                            element={<ViewAppointmentDetail />}
                        />
                        <Route path="/create-post" element={<CreateNewPost />} />
                        <Route path="/doctor" element={<DoctorBooking />} />
                        <Route path="/doctor/profile/:doctorId" element={<PsychologistProfile />} />
                        <Route path="/book-appointment" element={<BookAppointment />} />
                        <Route path="/finish-booking" element={<FinishBooking />} />
                        <Route path="/blog" element={<BlogScreen />} />
                        <Route path="/blogdetail/:id" element={<BlogDetail />} />
                        <Route path="/manageusers" element={<ManageUsers />} />
                        <Route path="/about-us" element={<AboutUs />} />
                        <Route path="/changePassword" element={<ChangePassword />} />
                        <Route path="/forgotPassword" element={<ForgotPassword />} />
                    </Routes>
                </div>
                {!hideLayout && <Footer />}
            </HelmetProvider>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                    <Layout />
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
