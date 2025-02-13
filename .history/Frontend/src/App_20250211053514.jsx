import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/common/header";
import Footer from "./components/common/footer";
import Homepage from "./screens/public/homepage";
import Login from "./screens/common/login";
import SignUp from "./screens/common/register";
impoort TestScreen from

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
