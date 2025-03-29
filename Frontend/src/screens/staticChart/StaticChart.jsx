"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getTestOutcomeDistribution } from "../../api/TestHistory.api";

export function StaticChart() {
    const [chartData, setChartData] = useState([]);

    // Gọi API để lấy dữ liệu
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getTestOutcomeDistribution();
                const { labels, data } = response;

                // Tính tổng số bản ghi
                const totalRecords = data.reduce((sum, value) => sum + value, 0);

                // Chuyển đổi dữ liệu thành định dạng với tỷ lệ phần trăm
                const formattedData = labels.map((label, index) => ({
                    name: label, // "Rất kém", "Kém", "Trung bình", "Tốt", "Rất tốt"
                    percentage: totalRecords > 0 ? ((data[index] / totalRecords) * 100).toFixed(1) : 0, // Tỷ lệ phần trăm
                }));
                setChartData(formattedData);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu biểu đồ:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <Card className="border-blue-200 shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800">
                        Tỷ lệ kết quả bài test
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                        Biểu đồ hiển thị tỷ lệ phần trăm kết quả bài test trong năm 2025
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                                tickFormatter={(value) => `${value}%`} // Hiển thị phần trăm
                                tick={{ fill: "#666" }}
                                domain={[0, 100]} // Giới hạn trục Y từ 0-100%
                            />
                            <Tooltip
                                formatter={(value) => `${value}%`} // Hiển thị phần trăm trong tooltip
                                labelFormatter={(label) => `Kết quả: ${label}`}
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "4px",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                }}
                            />
                            <Legend verticalAlign="top" height={36} />
                            <Bar
                                dataKey="percentage" // Sử dụng percentage thay vì total
                                fill="#1F45FF" // Giữ màu xanh dương như giao diện cũ
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