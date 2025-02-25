import { useLocation, useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBootstrap } from "@/hooks/useBootstrap";

export function TestOutCome() {
    useBootstrap();
    const location = useLocation();
    const navigate = useNavigate();
    const { testOutCome, answersArray } = location.state || {};

    console.log("answers", answersArray);
    console.log("testOutCome", testOutCome);


    const handleDownload = () => {
        alert("Downloading file...");
    };

    const handleRetry = () => {
        navigate('/CategoryTestSelected');
    };

    return (
        <div className="flex justify-center items-center min-h-screen gap-6">
            <Card className="w-full md:w-1/2 max-w-3xl">
                <CardHeader className="text-center">
                    <CardTitle>Bạn đã hoàn thành Bài Test</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">

                    {/* Display Results */}
                    {answersArray && Object.keys(answersArray).map((key, index) => (
                        <Card key={index} className="border p-4 shadow-md mb-4">
                            <CardContent className="text-left">
                                <div className="mb-2"> 
                                    <span className="font-semibold">Câu hỏi:</span>
                                    <p style={{ fontSize: "20px" }}>{answersArray[key].questionContent}</p>
                                </div>
                                <div className="bg-green-100 p-2 rounded"> 
                                    <span className="font-semibold">Câu trả lời:</span> 
                                    <p>{answersArray[key].selectedAnswer}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <CardContent style={{ fontSize: "30px" }}> {testOutCome.split(/(Kết quả tốt|Kết quả trung bình|Kết quả kém)/).map((part, index) => {
                        if (part === "Kết quả tốt" || part === "Kết quả trung bình" || part === "Kết quả kém") {
                            return (
                                <span key={index} style={{ color: "red" }}>{part}</span>
                            );
                        }
                        return <span key={index}>{part}</span>;
                    })}</CardContent>

                    {/* Disclaimer */}
                    <p className="text-sm text-gray-500">
                        Kết quả bài test này chỉ mang tính chất tham khảo, không có giá trị thay thế chẩn đoán y khoa
                        bởi bác sĩ chuyên gia có chuyên môn.
                    </p>
                    <p className="text-sm text-gray-500">
                        Trong trường hợp có bất kỳ vấn đề băn khoăn câu hỏi về tình trạng sức khoẻ hiện tại, bạn có
                        thể lựa chọn các Bác sĩ Sức khỏe tâm thần, Chuyên gia tâm lý để được thăm khám, tư vấn.
                    </p>
                    <p className="text-sm text-gray-500">
                        Đối tác bảo trợ nội dung: Phòng khám | Tâm Giao Website
                    </p>

                    <div className="flex justify-center space-x-4">
                        <Button onClick={handleDownload}>Tải file kết quả</Button>
                        <Button variant="destructive" onClick={handleRetry}>Làm lại bài kiểm tra</Button>
                    </div>

                    {/* Additional Information */}
                    <div className="text-center text-sm text-gray-500 mt-4">
                        <p>Kết quả bài test chỉ là bước đầu tiên, hãy tiếp tục hành trình khám phá bản thân với các tính năng bổ trợ.</p>
                        <Button className="mt-2" onClick={() => navigate('/login')}>Khám phá ngay</Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}

export default TestOutCome;