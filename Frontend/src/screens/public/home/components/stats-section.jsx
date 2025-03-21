import { Users, Building2, HeartPulse, MessageSquareText } from "lucide-react";
import { useState, useEffect } from "react";

const StatsSection = () => {
    const stats = [
        {
            value: "1",
            label: "Doctors",
            subLabel: "Accompanying",
            icon: <Users className="w-12 h-12" />,
        },
        {
            value: "0",
            label: "Top medical facilities",
            subLabel: "Partnering with",
            icon: <Building2 className="w-12 h-12" />,
        },
        {
            value: "2",
            label: "Customers",
            subLabel: "Supporting",
            icon: <HeartPulse className="w-12 h-12" />,
        },
        {
            value: "0",
            label: "Questions per day",
            subLabel: "Free answers",
            icon: <MessageSquareText className="w-12 h-12" />,
        },
    ];

    return (
        <div className="bg-blue-500 text-white py-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 p-4 md:p-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-start gap-4 border-r border-gray-300 last:border-none px-4"
                    >
                        {/* Icon on the left */}
                        <div className="text-3xl text-white">{stat.icon}</div>

                        {/* Text Content */}
                        <div className="text-left">
                            <div className="font-semibold text-white">{stat.subLabel}</div>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <div className="font-semibold text-white">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatsSection;