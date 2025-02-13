import * as React from "react";
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

export function TestForm() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState({ testTitle: "", category: "", questions: [] });
  const [answers, setAnswers] = useState({});

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
  };

  const handleSubmit = async () => {
    try {
      const answersArray = Object.keys(answers).map((questionIndex) => {
        const question = questionData.questions[questionIndex]; 
        return {
          questionId: question._id, 
          selectedAnswer: answers[questionIndex],
        };
      });

      const response = await submitTest(answersArray);
      console.log("Test OkOk:", response);
    } catch (error) {
      console.error("Error submitting test:", error);
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
            <Card key={index} className="border p-4 mb-4 shadow-md">
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
          <Button onClick={handleSubmit}>Submit</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default TestForm;
