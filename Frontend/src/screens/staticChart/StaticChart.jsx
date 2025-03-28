"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Dữ liệu tĩnh
const data = [
    { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "May", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Jul", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Aug", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Sep", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Oct", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Nov", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Dec", total: Math.floor(Math.random() * 5000) + 1000 },
];

export function StaticChart() {
    return (
        <div className="container mx-auto p-6">
            <Card className="border-blue-200 shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800">
                        Doanh thu theo tháng
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                        Biểu đồ hiển thị doanh thu hàng tháng trong năm 2025
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={14}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: "#666" }}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={14}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value.toLocaleString()}`}
                                tick={{ fill: "#666" }}
                            />
                            <Tooltip
                                formatter={(value) => `$${value.toLocaleString()}`}
                                labelFormatter={(label) => `Tháng: ${label}`}
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "4px",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                }}
                            />
                            <Legend verticalAlign="top" height={36} />
                            <Bar
                                dataKey="total"
                                fill="#1F45FF"
                                radius={[4, 4, 0, 0]}
                                barSize={30}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}

export default StaticChart;