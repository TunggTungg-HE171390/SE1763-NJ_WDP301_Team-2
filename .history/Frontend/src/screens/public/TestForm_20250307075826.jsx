import * as React from "react";
import { useState, useEffect } from "react";
import { useBootstrap } from "@/hooks/useBootstrap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getQuestionByTestId } from "../../api/Questions.api";
import { submitTest } from "../../api/TestHistory.api";
import { Modal, Spinner, Form } from "react-bootstrap";

export function TestForm() {

  useBootstrap();

  const { testId } = useParams();
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState({ testTitle: "", category: "", questions: [] });
  const [answers, setAnswers] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', mail: '' });

  useEffect(() => {
    fetchQuestionData();
  }, []);

  const fetchQuestionData = async () => {
    try {
      const response = await getQuestionByTestId(testId);
      setQuestionData(response.data);
    } catch (error) {
      console.error("Error fetching test data:", error);
    }
  };

    const handleAnswerChange = (questionIndex, answer) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionIndex]: answer,
        }));

    console.log("Answers:", answers);
  };

  // Check if all questions are answered
  const areAllQuestionsAnswered = Object.keys(answers).length === questionData.questions?.length;

  const handleSubmit = async () => {
    if (areAllQuestionsAnswered) {
      setIsModalVisible(true);
    } else {
      alert("Please answer all questions.");
    }
  };

  const handleFinalSubmit = async () => {
    try {
      console.log("helllo")
      setLoading(true);

      const answersArray = Object.keys(answers).map((questionIndex) => {
        const question = questionData.questions[questionIndex];
        return {
          questionId: question.questionId,
          questionContent: question.content,
          selectedAnswer: answers[questionIndex],
        };
      });

      console.log("Answers array:", answersArray);

      const question = answersArray.map((q) => q.questionContent);

      console.log("Questions:", question);


      const userId = "67a0374b7ad0db88c8b251c0";
      console.log("Sending data to backend:", { userId, testId, userInfo, answersArray });

      submitTest(userId, testId, answersArray, userInfo)  // Trả về promise
      .then(response => {
        console.log("API Response:", response);
        const testOutCome = response.result;
        console.log("testOutCome updated:", testOutCome);
        setLoading(false);
        setIsModalVisible(false);
        navigate('/test-outcome', { state: { testOutCome, answersArray } });
      })
      
      .catch(error => {
        console.error("Lỗi khi gửi bài kiểm tra:", error);
        setLoading(false);
      });
    } catch (error) {
      console.error("Error submitting test:", error);
      setLoading(false);
    }
  };

    return (
        <div className="flex justify-center items-center min-h-screen gap-6">
            <Card className="w-full max-w-3xl">
                <CardHeader>
                    <CardTitle>Bài kiểm tra: {questionData.testTitle}</CardTitle>
                    <CardDescription>Thể loại: {questionData.category}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {questionData.questions?.map((question, index) => (
                        <Card key={question.questionId} className="border p-4 mb-4 shadow-md">
                            <CardHeader>
                                <CardTitle>{question.content}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    {question.answers?.map((answer, i) => (
                                        <div
                                            key={i}
                                            onClick={() => handleAnswerChange(index, answer.content)}
                                            className={`cursor-pointer border p-4 flex justify-center items-center text-center ${
                                                answers[index] === answer.content
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-100"
                                            } rounded-md transition-all duration-200 ease-in-out hover:bg-blue-400`}>
                                            <Label>{answer.content}</Label>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>

        <CardFooter className="justify-between space-x-2">
          <Button style={{ marginLeft: "10px", color: "red" }} variant="ghost" onClick={() => navigate("/")}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>{loading ? "Submitting..." : "Submit"}</Button>
        </CardFooter>
      </Card>

      <Modal show={isModalVisible} onHide={() => setIsModalVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nhận thêm lời khuyên từ chuyên gia sau khi làm bài test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ fontWeight: "bold" }}>Kết quả bài kiểm tra</p>
          <label>Lưu ý:
            <ul>
              <li>- Kết quả và lời khuyên từ chuyên gia tâm lý sẽ được gửi về mail, vui lòng nhập tên và email chính xác để nhận được thông tin.</li>
              <li>- Sau khi ẩn "Xác nhận", bạn sẽ xem được kết quả bài test</li>
            </ul>
          </label>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Họ và tên của bạn (*)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Vui lòng nhập họ tên của bạn"
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>E-mail/Số điện thoại (*)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Vui lòng nhập email/số điện thoại"
                onChange={(e) => setUserInfo({ ...userInfo, mail: e.target.value })}
              />
            </Form.Group>

          </Form>
          <Button onClick={handleFinalSubmit} >Xác nhận</Button>
          <Button style={{ marginLeft: "10px", color: "red" }} variant="danger" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>
        </Modal.Body>
      </Modal>

            {/* Hiển thị spinner khi loading */}
            {loading && (
                <div className="d-flex justify-content-center mt-3">
                    <Spinner animation="border" variant="primary" />
                </div>
            )}
        </div>
    );
}

export default TestForm;
