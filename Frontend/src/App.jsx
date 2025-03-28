import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
// import { HashRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import DoctorBooking from "./screens/public/psychologistList/DoctorBooking.jsx";
import PsychologistProfile from "./screens/public/psychologistProfile/psychologistProfile";
import ManagePosts from "./screens/staff/ManagePosts";
import CreateTestScreen from "./screens/admin/CreateTestScreen";
import TestOutCome from "./screens/public/TestOutCome";
import ChangePassword from "./screens/user/changePassword/changePassword";
import BookAppointment from "./screens/public/bookAppointment/bookAppointment";
import FinishBooking from "./screens/public/finishBooking/finishBooking";
import UpdatePost from "./screens/staff/UpdatePost";
import ViewAppointmentDetail from "./screens/psychologist/viewAppointmentDetail/viewAppointmentDetail";
import AppointmentDetail from "./screens/staff/AppointmentDetail";
import BlogScreen from "./screens/public/blog/blog.jsx";
import BlogDetail from "./screens/public/blog/Blogdetail.jsx";
import ManageUsers from "./screens/admin/ManageUsers.jsx";
import AboutUs from "./screens/common/aboutUs.jsx";
import PaymentPage from "./screens/public/paymentAppointment/PaymentPage.jsx";
import UserProfile from "./screens/common/userProfile/components/user-profile.jsx";
import ViewSchedule from "./screens/psychologist/viewAppointment/viewAppointment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ViewAppointmentList from "./screens/public/appointmentList/AppointmentManagement.jsx";
import ViewUserAppointmentDetail from "./screens/public/appointmentDetail/viewAppointmentDetail.jsx";
// import dayjs from "dayjs";
import "dayjs/locale/vi"; // Import Vietnamese locale for dayjs
import ViewPersonalSchedule from "./screens/psychologist/viewSchedule/viewSchedule";
import "dayjs/locale/vi"; // Import Vietnamese locale for dayjs
import ManagePsychologists from "./screens/staff/ManagePsychologists";
import PsychologistDetail from "./screens/staff/PsychologistDetail";
import ManagePsychologistSchedule from "./screens/staff/ManagePsychologistSchedule";
import EditPsychologistExperience from "./screens/staff/EditPsychologistExperience";
import EditPsychologistWorkHistory from "./screens/staff/EditPsychologistWorkHistory";
import ManageAppointments from "./screens/staff/ManageAppointments";

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

    console.log("ProtectedRoute check:", {
        isAuthenticated: !!user,
        userRole: user?.role,
        requiredRole,
        hasAccess: user?.role === requiredRole,
    });

    if (!user) {
        console.log("Redirecting to login: User not authenticated");
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        console.log(`Access denied: User role '${user.role}' doesn't match required role '${requiredRole}'`);
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
                        {/* Public routes */}
                        <Route path="/CategoryTestSelected" element={<CategoryTestSelected />} />
                        <Route path="/getTest/:categoryId" element={<CategoryDetailTest />} />
                        <Route path="/questions-on-test/:testId" element={<TestForm />} />
                        <Route path="/Test" element={<Test />} />
                        <Route path="/create-test/:categoryId" element={<CreateTestScreen />} />
                        <Route path="/test-outcome" element={<TestOutCome />} />
                        <Route path="/login" element={<PublicRoute element={<Login />} />} />
                        <Route path="/signup" element={<PublicRoute element={<SignUp />} />} />
                        <Route path="/verify" element={<PublicRoute element={<Verify />} />} />

                        {/* Psychologist routes */}
                        <Route
                            path="/psychologist/view-schedule"
                            element={<ProtectedRoute element={<ViewPersonalSchedule />} requiredRole="psychologist" />}
                        />
                        <Route
                            path="/psychologist/view-appointment-detail/:appointmentId"
                            element={<ProtectedRoute element={<ViewAppointmentDetail />} requiredRole="psychologist" />}
                        />

                        {/* Staff routes - properly protected with role-based access */}
                        <Route
                            path="/staff/view-schedule"
                            element={
                                <ProtectedRoute element={<ViewSchedule userRole="staff" />} requiredRole="staff" />
                            }
                        />
                        <Route
                            path="/staff/view-appointment-detail/:appointmentId"
                            element={<ProtectedRoute element={<AppointmentDetail />} requiredRole="staff" />}
                        />
                        <Route
                            path="/staff/appointment-details/:appointmentId"
                            element={<ProtectedRoute element={<AppointmentDetail />} requiredRole="staff" />}
                        />
                        <Route
                            path="/staff/manage-appointments"
                            element={<ProtectedRoute element={<ManageAppointments />} requiredRole="staff" />}
                        />
                        <Route
                            path="/staff/manage-psychologists"
                            element={<ProtectedRoute element={<ManagePsychologists />} requiredRole="staff" />}
                        />
                        <Route
                            path="/staff/psychologist-detail/:id"
                            element={<ProtectedRoute element={<PsychologistDetail />} requiredRole="staff" />}
                        />

                        {/* Make sure this route is properly defined */}
                        <Route
                            path="/staff/manage-psychologist-schedule/:id"
                            element={<ProtectedRoute element={<ManagePsychologistSchedule />} requiredRole="staff" />}
                        />

                        <Route
                            path="/staff/edit-psychologist-experience/:id"
                            element={<ProtectedRoute element={<EditPsychologistExperience />} requiredRole="staff" />}
                        />
                        <Route
                            path="/staff/edit-psychologist-work-history/:id"
                            element={<ProtectedRoute element={<EditPsychologistWorkHistory />} requiredRole="staff" />}
                        />
                        <Route
                            path="/staff/manage-posts"
                            element={<ProtectedRoute element={<ManagePosts />} requiredRole="staff" />}
                        />
                        <Route
                            path="/staff/create-post"
                            element={<ProtectedRoute element={<CreateNewPost />} requiredRole="staff" />}
                        />
                        <Route
                            path="/staff/update-post/:postId"
                            element={<ProtectedRoute element={<UpdatePost />} requiredRole="staff" />}
                        />

                        {/* Public doctor routes */}
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
                        <Route path="/checkout-booking" element={<PaymentPage />} />
                        <Route path="user-profile/:id" element={<UserProfile />} />
                        <Route path="/user/view-appointment-list" element={<ViewAppointmentList />} />
                        <Route
                            path="/user/view-appointment-detail/:appointmentId"
                            element={<ViewUserAppointmentDetail />}
                        />
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
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
                        <Layout />
                    </LocalizationProvider>
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
