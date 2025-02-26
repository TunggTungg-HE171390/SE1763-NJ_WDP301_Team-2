import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import * as API from "@/api";
import Profile from "./components/Profile";
import Schedule from "./components/Schedule";

const DoctorProfile = () => {
    const { doctorId } = useParams();
    const [psychologist, setPsychologist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPsychologist = async () => {
            try {
                const response = await API.getPsychologist(doctorId);
                setPsychologist(response.data.data);
            } catch (err) {
                setError("Failed to load psychologist data. " + err);
            } finally {
                setLoading(false);
            }
        };

        fetchPsychologist();
    }, [doctorId]);

    if (loading) return <p>Loading psychologist information...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!psychologist) return <p>No psychologist data available.</p>;

    const profile = psychologist?.psychologist?.psychologistProfile;

    return (
        <div className="max-w-7xl mx-auto bg-gray-50 px-6 py-8">
            <Profile psychologist={psychologist} profile={profile} />
            <Schedule psychologist={psychologist} profile={profile} />
        </div>
    );
};

export default DoctorProfile;
