import * as React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { getQuestionByTestId } from "../../api/Questions.api";
import { submitTest } from "../../api/TestHistory.api";
import { Modal, Spinner, Form } from "react-bootstrap";

export function TestForm() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState({ testTitle: "", category: "", questions: [] });
  const [answers, setAnswers] = useState({});
  const [testOutCome, setTestOutCome] = useState(" ");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        const response = await getQuestionByTestId(testId);
        setQuestionData(response.data);
        console.log("DATA", response.data);
      } catch (error) {
        console.error("Error fetching test data:", error);
      }
    };

    fetchQuestionData();
  }, [testId]);

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answer,
    }));

    console.log("Answers:", answers);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const answersArray = Object.keys(answers).map((questionIndex) => {
        const question = questionData.questions[questionIndex];
        return {
          questionId: question.questionId,
          selectedAnswer: answers[questionIndex],
        };
      });

      console.log("Answers array:", answersArray);

      const userId = "67a0374b7ad0db88c8b251c0";
      const userEmail = "tunggtungg2202@gmail.com"; 
      console.log("Sending data to backend:", { userId, testId, answersArray });

      const response = await submitTest(userId, testId, answersArray, userEmail);

      console.log("Test submitted successfully:", response);
      setTestOutCome(response.result);
      setLoading(false);
      setIsModalVisible(true);
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
                      className={`cursor-pointer border p-4 flex justify-center items-center text-center ${answers[index] === answer.content
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100"
                        } rounded-md transition-all duration-200 ease-in-out hover:bg-blue-400`}
                    >
                      <Label>{answer.content}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>

        <CardFooter className="justify-between space-x-2">
          <Button variant="ghost" onClick={() => navigate("/")}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>{loading ? "Submitting..." : "Submit"}</Button>
        </CardFooter>
      </Card>

      <Modal show={isModalVisible} onHide={() => setIsModalVisible(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Nhận thêm lời khuyên từ chuyên gia sau khi làm bài test</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p style={{ fontWeight: "bold" }}>{testOutCome}</p>
    <label>Lưu ý:
      <ul>
        <li>- Kết quả và lời khuyên từ chuyên gia tâm lý sẽ được gửi về mail, vui lòng nhập tên và email chính xác để nhận được thông tin.</li>
        <li>- Sau khi ẩn "Xác nhận", bạn sẽ xem được kết quả bài test</li>
      </ul>
    </label>
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Họ và tên của bạn (*)</Form.Label>
        <Form.Control type="text" placeholder="Vui lòng nhập họ tên của bạn" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>E-mail/Số điện thoại (*)</Form.Label>
        <Form.Control type="text" placeholder="Vui lòng nhập email/số điện thoại" />
      </Form.Group>
      <Button variant="secondary" onClick={() => setIsModalVisible(false)}>
      Đăng ký
    </Button>
      <Button variant="secondary" onClick={() => setIsModalVisible(false)}>
      Đóng
    </Button>
    </Form>
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
