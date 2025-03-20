import * as React from "react";
import { useParams } from "react-router-dom";
import { getTestByCateId } from "../../api/Categories.api";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useBootstrap } from "@/hooks/useBootstrap";
import { useNavigate } from "react-router-dom";
import { getQuestionByTestId } from "../../api/Questions.api";
import { deleteTest } from "../../api/Test.api";

export function CategoryDetailTest() {
    useBootstrap();

    const { categoryId } = useParams();
    const [testData, setTestData] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTestData = async () => {
            try {
                const response = await getTestByCateId(categoryId);
                setTestData(response.data);
            } catch (error) {
                console.error("Error fetching test data:", error);
            }
        };

        fetchTestData();
    }, [categoryId]);

    const handleTestIdClick = (testId) => {
        getQuestionByTestId(testId);
        navigate(`/questions-on-test/${testId}`);
    };

    const handleCloseCard = async (testId) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete this test ${testId}?`);
        if (isConfirmed) {
            try {
                await deleteTest(testId);
                const updatedTestData = testData.filter(test => test._id !== testId);
                setTestData(updatedTestData);
                alert(`Test with ID ${testId} has been deleted.`);
            } catch (error) {
                console.error("Error deleting test:", error);
                alert("Failed to delete the test.");
            }
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {/* Phai co role Manager */}
            <Card className="w-[500px] p-4 border rounded-md shadow-lg hover:scale-105 hover:border-yellow-500 transition-all duration-300 ease-in-out mb-8">
                <CardContent className="flex-grow flex justify-center items-center h-full">
                    <div
                        className="rounded-full bg-gray-300 w-60 h-60 flex items-center justify-center cursor-pointer hover:bg-gray-400 transition duration-300"
                        onClick={() => navigate(`/create-test/${categoryId}`)}>
                        {" "}
                        {/* Larger circle */}
                        <span className="text-6xl font-bold text-gray-600">+</span>
                    </div>
                </CardContent>
            </Card>
            {/* Phai co role Manager */}

            {testData.map((test) => (
                <Card
                    key={test.id}
                    className="w-[500px] p-4 border rounded-md shadow-lg hover:scale-105 hover:border-yellow-500 transition-all duration-300 ease-in-out mb-8">
                    <button
                        className="absolute top-2 right-2 text-5xl text-gray-600 hover:text-gray-900"
                        onClick={() => handleCloseCard(test._id)}
                    >
                        &times;
                    </button>
                    <button
                        className="absolute top-2 right-2 text-3xl text-gray-600 hover:text-gray-900"
                        // onClick={() => handleEdit(test._id)}
                    >
                        <i className="fas fa-pencil-alt"></i> {/* FontAwesome pencil icon */}
                    </button>

                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-left text-gray-800 mb-2">
                            Bài kiểm tra:
                            <Label className="ml-2 text-red-500 font-bold" style={{ fontSize: "1.25rem" }}>
                                {test.title}
                            </Label>
                        </CardTitle>
                        <CardDescription className="text-sm text-left mb-4">
                            <Label className="text-black-500" style={{ fontSize: "1rem" }}>
                                Mô tả:
                            </Label>
                            {test.description}
                        </CardDescription>
                        <CardDescription className="text-sm text-left mb-4">
                            <Label className="text-black-500" style={{ fontSize: "1rem" }}>
                                Số câu hỏi: {test.questionCount}
                            </Label>
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-grow">
                        <form className="space-y-6">
                            <div className="space-y-4">
                                <Label htmlFor="outcomes" className="text-left text-lg font-medium">
                                    Thang điểm đánh giá:
                                </Label>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto border-collapse">
                                        <thead>
                                            <tr>
                                                <th className="border px-4 py-2 text-left" style={{ width: "35%" }}>
                                                    Điểm
                                                </th>
                                                <th className="border px-4 py-2 text-left">Mô tả</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {test.testOutcomes.map((outcome, index) => (
                                                <tr key={index}>
                                                    <td className="border px-4 py-2">{`Điểm ${outcome.minScore} - ${outcome.maxScore}`}</td>
                                                    <td className="border px-4 py-2">
                                                        {outcome.description
                                                            .split(/(Kết quả tốt|Kết quả trung bình|Kết quả kém)/)
                                                            .map((part, index) => {
                                                                if (
                                                                    part === "Kết quả tốt" ||
                                                                    part === "Kết quả trung bình" ||
                                                                    part === "Kết quả kém"
                                                                ) {
                                                                    return (
                                                                        <span key={index} style={{ color: "red" }}>
                                                                            {part}
                                                                        </span>
                                                                    );
                                                                }
                                                                return <span key={index}>{part}</span>;
                                                            })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </form>
                    </CardContent>

                    <CardFooter className="mt-auto flex w-full" onClick={() => handleTestIdClick(test._id)}>
                        <Button style={{ backgroundColor: "#ffcd1f", color: "black" }} className="w-full">
                            Làm bài kiểm tra
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}

export default CategoryDetailTest;
