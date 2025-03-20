import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { creatTest } from "../../api/Test.api";

import { getCateNameByCateId } from "../../api/Categories.api";
import { getQuestionByTestId } from "../../api/Questions.api";

export function EditTestScreen() {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [testOutcomes, setTestOutcomes] = useState([
    { description: '', minScore: '', maxScore: '' },
    { description: '', minScore: '', maxScore: '' },
    { description: '', minScore: '', maxScore: '' },
    { description: '', minScore: '', maxScore: '' },
    { description: '', minScore: '', maxScore: '' }
  ]);
  const [questionsArray, setQuestionsArray] = useState([]);
  const [cateName, setCateName] = useState('');
  const [categoryId, setCategoryId] = useState('');

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
        const categoryResponse = await getCateNameByCateId(testResponse.data.categoryId);
        setCateName(categoryResponse.data.categoryName);
      } catch (error) {
        console.error("Error fetching test data:", error);
      }
    };

    fetchTestData();
  }, [testId]);

  const handleSaveTest = async () => {
    try {
      const formattedQuestions = {
        questions: questionsArray.map(q => ({
          content: q.content,
          answers: q.answers.map(ans => ({
            content: ans.content,
            point: ans.point
          }))
        }))
      };

      if (formattedQuestions.questions.length === 0) {
        alert("Vui lòng nhập câu hỏi.");
      } else {
        const response = await creatTest(categoryId, title, description, testOutcomes);
        const testId = response.test;

        console.log("Formatted Questions:", JSON.stringify(formattedQuestions, null, 2));
        const response2 = await insertQuestionOnTest(testId, formattedQuestions);

        alert("Cập nhật bài kiểm tra thành công!");
        navigate(`/getTest/${categoryId}`);
      }
    } catch (err) {
      console.error("Error saving test:", err);
      alert("Có lỗi xảy ra khi lưu bài kiểm tra.");
    }
  };

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
            onChange={(e) => setTitle(e.target.value)}
          />

          <Label htmlFor="description" style={{ marginTop: '20px' }}>Mô tả bài kiểm tra</Label>
          <Textarea
            id="description"
            placeholder="Mô tả bài kiểm tra"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
                onChange={(e) => updateOutcome(index, 'description', e.target.value)}
                placeholder="Mô tả kết quả"
              />

              <Label htmlFor={`minScore-${index}`} style={{ marginTop: '10px' }}>Điểm tối thiểu</Label>
              <Input
                id={`minScore-${index}`}
                type="number"
                value={outcome.minScore}
                onChange={(e) => updateOutcome(index, 'minScore', e.target.value)}
                placeholder="Điểm tối thiểu"
              />

              <Label htmlFor={`maxScore-${index}`} style={{ marginTop: '10px' }}>Điểm tối đa</Label>
              <Input
                id={`maxScore-${index}`}
                type="number"
                value={outcome.maxScore}
                onChange={(e) => updateOutcome(index, 'maxScore', e.target.value)}
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
                onChange={(e) => updateQuestionContent(questionIndex, e.target.value)}
              />
              {question.answers.map((answer, answerIndex) => (
                <div key={answerIndex} className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={answer.content}
                    onChange={(e) => updateAnswerContent(questionIndex, answerIndex, e.target.value)}
                    placeholder="Nhập đáp án"
                  />
                  <Input
                    type="number"
                    value={answer.point}
                    onChange={(e) => updateAnswerPoint(questionIndex, answerIndex, e.target.value)}
                    placeholder="Nhập điểm"
                  />
                </div>
              ))}
              <Button onClick={() => addAnswer(questionIndex)}>Thêm đáp án</Button>
              <FaTrash onClick={() => deleteQuestion(questionIndex)} className="text-red-500 cursor-pointer" />
            </div>
          ))}
        </CardContent>
        <Button onClick={addQuestion}>Thêm câu hỏi</Button>
      </Card>

      <Button style={{ marginTop: '20px' }} onClick={handleSaveTest}>
        Lưu bài kiểm tra
      </Button>
    </Container>
  );
}

export default EditTestScreen;
