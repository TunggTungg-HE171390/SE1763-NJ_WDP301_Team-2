import { useContext } from "react";
// import { AuthContext } from "@/components/auth/authContext";
import { AuthContext } from "../components/auth/authContext";

const useAuth = () => useContext(AuthContext);

export {
    useAuth
}