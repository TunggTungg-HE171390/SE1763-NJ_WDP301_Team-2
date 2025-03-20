import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { getTestById } from "../../api/Test.api";  // Chỉnh sửa API đúng
import { getQuestionByTestId } from "../../api/Questions.api";

export function EditTestScreen() {
  const { testId } = useParams();
  
  // States for test data
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [testOutcomes, setTestOutcomes] = useState([]);
  const [questionsArray, setQuestionsArray] = useState([]);
  const [cateName, setCateName] = useState('');
  const [categoryId, setCategoryId] = useState('');

  // Fetch test data for editing
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const testResponse = await getTestById(testId); // Get test data
        const questionResponse = await getQuestionByTestId(testId); // Get questions data
        
        // Set test data
        setTitle(testResponse.data.title);
        setDescription(testResponse.data.description);
        setTestOutcomes(testResponse.data.testOutcomes);
        setCategoryId(testResponse.data.categoryId);
        
        // Set questions data
        setQuestionsArray(questionResponse.data);

        // Fetch category name
        const categoryResponse = await getTestById(testId);  // Assuming we get category name from here
        setCateName(categoryResponse.data.categoryName);
      } catch (error) {
        console.error("Error fetching test data:", error);
      }
    };

    fetchTestData();
  }, [testId]);

  return (
    <Container>
      <Card className="text-sm text-left mb-4" style={{ marginBottom: '30px', padding: '20px' }}>
        <h2>Chỉnh sửa bài kiểm tra</h2>
        <CardContent className="grid gap-6">
          <h3>Thể loại: {cateName}</h3>
          <Label htmlFor="title">Tiêu đề bài kiểm tra</Label>
          <Input
            id="title"
            type="text"
            placeholder="Tên bài kiểm tra"
            value={title}
            disabled // Disable input to prevent changes
          />

          <Label htmlFor="description" style={{ marginTop: '20px' }}>Mô tả bài kiểm tra</Label>
          <Textarea
            id="description"
            placeholder="Mô tả bài kiểm tra"
            value={description}
            disabled // Disable input to prevent changes
          />
        </CardContent>
      </Card>

      <Card className="text-sm text-left mb-4" style={{ marginBottom: '20px', padding: '20px' }}>
        <h2>Kết quả bài kiểm tra</h2>
        <CardContent className="grid gap-6">
          {testOutcomes.map((outcome, index) => (
            <div key={index} className="border p-4 mb-4 rounded">
              <Label htmlFor={`description-${index}`}>Mô tả kết quả</Label>
              <Textarea
                id={`description-${index}`}
                value={outcome.description}
                disabled // Disable textarea to prevent changes
                placeholder="Mô tả kết quả"
              />

              <Label htmlFor={`minScore-${index}`} style={{ marginTop: '10px' }}>Điểm tối thiểu</Label>
              <Input
                id={`minScore-${index}`}
                type="number"
                value={outcome.minScore}
                disabled // Disable input to prevent changes
                placeholder="Điểm tối thiểu"
              />

              <Label htmlFor={`maxScore-${index}`} style={{ marginTop: '10px' }}>Điểm tối đa</Label>
              <Input
                id={`maxScore-${index}`}
                type="number"
                value={outcome.maxScore}
                disabled // Disable input to prevent changes
                placeholder="Điểm tối đa"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="text-sm text-left mb-4" style={{ marginBottom: '20px', padding: '20px' }}>
        <h2>Câu hỏi cho bài kiểm tra</h2>
        <CardContent className="grid gap-6">
          {questionsArray.map((question, questionIndex) => (
            <div key={questionIndex} className="border p-4 mb-4 rounded">
              <Label htmlFor={`question-${questionIndex}`}>Câu hỏi {questionIndex + 1}</Label>
              <Input
                type="text"
                placeholder="Nhập nội dung câu hỏi"
                value={question.content}
                disabled // Disable input to prevent changes
              />
              {question.answers.map((answer, answerIndex) => (
                <div key={answerIndex} className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={answer.content}
                    disabled // Disable input to prevent changes
                    placeholder="Nhập đáp án"
                  />
                  <Input
                    type="number"
                    value={answer.point}
                    disabled // Disable input to prevent changes
                    placeholder="Nhập điểm"
                  />
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </Container>
  );
}

export default EditTestScreen;
