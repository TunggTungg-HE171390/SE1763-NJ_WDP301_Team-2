import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import "./App.css";
import TopBar from "./components/common/topbar";
import Homepage from "./screens/public/homepage";
import Login from "./screens/common/login";
import SignUp from "./screens/common/register";
import TeamLogo from "./assets/TeamLogo.svg";

function App() {
    return (
        <HelmetProvider>
            <Helmet>
                <link rel="icon" type="image/svg+xml" href={TeamLogo} />
            </Helmet>
            <Router>
                <TopBar />
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                </Routes>
            </Router>
        </HelmetProvider>
    );
}

export default App;
