    import React from "react";
    import { Navigate, Route, Router, useLocation, Routes } from "react-router-dom";

    import { Helmet, HelmetProvider } from "react-helmet-async";
    // import { Toaster } from "@/components/ui/toaster";
    import 'bootstrap/dist/css/bootstrap.min.css';
    import "./App.css";

    import TeamLogo from "@/assets/TeamLogo.svg";
    import ToastReceiver from "@/components/common/toast/toast-receiver";
    import ChatWidget from "@/components/public/chat/chat-widget";
    import { useAuth } from "@/hooks/useAuth"; // Import authentication hook
    import Login from "@/screens/common/login/login";
    import SignUp from "@/screens/common/register/register";
    import Verify from "@/screens/common/verify/verify";
    import PropTypes from "prop-types";
    import Footer from "./components/common/footer";
    import Header from "./components/common/header";
    import TopBar from "./components/common/topbar";
    import CategoryDetailTest from "./screens/public/CategoryDetailTest";
    import CategoryTestSelected from "./screens/public/CategoryTestSelected";
    import Homepage from "./screens/public/home/homepage";
    import Test from "./screens/public/Test";
    import TestForm from "./screens/public/TestForm";
    import CreateNewPost from './screens/staff/CreateNewBlogPost';
    import Blog from "./screens/public/Blog";
    import Blogdetail from "./screens/public/Blogdetail";
    import Psychologistappointment from "./screens/public/Psychologistappointment";
    import ManageUsers from "./screens/admin/ManageUsers";
import { useMemo } from "react";

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
    // import TopBar from "./components/common/topbar";
    // import Header from "./components/common/header";
    // import Footer from "./components/common/footer";





// import path from "path";

    function App() {
        const {pathname} = useLocation();
        // const hideLayout = ["/login", "/signup", "/verify"].includes(location.pathname);

        const hideLayout = useMemo(() => {
            return ["/login", "/signup", "/verify"].includes(pathname);
        }, [pathname])


        return (
            <div className="app">
                <HelmetProvider>
                    <Helmet>
                        <link rel="icon" type="image/svg+xml" href={TeamLogo} />
                    </Helmet>
                    <TopBar />
                    {!hideLayout && <Header />}
                    {!hideLayout && <ChatWidget />}
                    <ToastReceiver />

                    <div>
                            <Routes>
                            <Route path="/" element={<Homepage />} />
                            <Route path="/CategoryTestSelected" element={<CategoryTestSelected />} />
                            <Route path="/getTest/:categoryId" element={<CategoryDetailTest />} />
                            <Route path="/questions-on-test/:testId" element={<TestForm />} />
                            <Route path="/Test" element={<Test />} />
                            <Route path="/login" element={<PublicRoute element={<Login />} />} />
                            <Route path="/signup" element={<PublicRoute element={<SignUp />} />} />
                            <Route path="/verify" element={<PublicRoute element={<Verify />} />} />
                            <Route path="/create-post" element={<CreateNewPost/>} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/manageusers" element={<ManageUsers />} />
                        <Route path="/blogdetail/:id" element={<Blogdetail />} />
                        <Route path="/psychologistappointment" element={<Psychologistappointment />} />
                            </Routes>
                    </div>
                    {!hideLayout && <Footer />}
                </HelmetProvider>
            </div>
        );
    }

    export default App;
