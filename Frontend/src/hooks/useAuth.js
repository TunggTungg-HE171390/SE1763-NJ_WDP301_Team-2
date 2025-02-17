import { useContext } from "react";
import { AuthContext } from "@/components/auth/authContext";

export const useAuth = () => useContext(AuthContext);
