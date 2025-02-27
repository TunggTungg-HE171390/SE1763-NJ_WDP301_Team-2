import React, { useState, useEffect } from 'react';
import { Alert, Container } from 'react-bootstrap';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card, CardContent,
} from "@/components/ui/card";
import { useBootstrap } from "@/hooks/useBootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { creatTest } from "../../api/Test.api";
import { getCateNameByCateId } from "../../api/Categories.api";
import { insertQuestionOnTest } from "../../api/Questions.api";

import { Switch } from "@/components/ui/switch"
import { FaTrash } from 'react-icons/fa';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function CreateTestScreen() {
    useBootstrap();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [testOutcomes, setTestOutcomes] = useState([
        { description: '', minScore: '', maxScore: '' },
        { description: '', minScore: '', maxScore: '' },
        { description: '', minScore: '', maxScore: '' }
    ]);

    const { categoryId } = useParams();
    const [cateName, setCateName] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCateName = async () => {
            try {
                const response = await getCateNameByCateId(categoryId);
                setCateName(response.data);
            } catch (error) {
                console.error("Error fetching test data:", error);
            }
        };

        fetchCateName();
    }, [categoryId]);

    // Kiểm tra và đảm bảo điểm min và max hợp lệ, không chồng lấn
    const validateOutcomes = () => {
        for (let i = 0; i < testOutcomes.length; i++) {
            const outcome = testOutcomes[i];
            const minScore = parseInt(outcome.minScore, 10);
            const maxScore = parseInt(outcome.maxScore, 10);

            // Kiểm tra nếu điểm min lớn hơn hoặc bằng điểm max
            if (minScore >= maxScore) {
                alert("Điểm tối thiểu phải nhỏ hơn điểm tối đa.");
                return false;
            }

            // Kiểm tra không chồng lấn phạm vi điểm
            for (let j = 0; j < testOutcomes.length; j++) {
                if (i !== j) {
                    const otherOutcome = testOutcomes[j];
                    const otherMinScore = parseInt(otherOutcome.minScore, 10);
                    const otherMaxScore = parseInt(otherOutcome.maxScore, 10);

                    if (
                        (minScore >= otherMinScore && minScore <= otherMaxScore) ||
                        (maxScore >= otherMinScore && maxScore <= otherMaxScore) ||
                        (minScore <= otherMinScore && maxScore >= otherMaxScore)
                    ) {
                        alert("Các phạm vi điểm của các kết quả không được chồng lấn nhau.");
                        return false;
                    }
                }
            }
        }
        return true;
    };

    // Cập nhật thông tin kết quả
    const updateOutcome = (index, field, value) => {
        const updatedOutcomes = [...testOutcomes];
        updatedOutcomes[index][field] = value;
        setTestOutcomes(updatedOutcomes);
    };

    const [questionsArray, setQuestionsArray] = useState([
        {
            content: "",
            answers: [{ content: "Đáp án 1", point: 0 }],
        },
    ]);

    const updateQuestionContent = (index, value) => {
        const updatedQuestions = [...questionsArray];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            content: value
        };
        setQuestionsArray(updatedQuestions);
    };

    // Thêm câu hỏi mới
    const addQuestion = () => {
        setQuestionsArray([...questionsArray, { content: "", answers: [{ content: "Đáp án 1", point: 0 }] }]);
    };

    // Xóa câu hỏi
    const deleteQuestion = (index) => {
        const updatedQuestions = questionsArray.filter((_, i) => i !== index);
        setQuestionsArray(updatedQuestions);
    };

    // Cập nhật nội dung đáp án
    const updateAnswerContent = (questionIndex, answerIndex, value) => {
        const updatedQuestions = [...questionsArray];
        updatedQuestions[questionIndex].answers[answerIndex] = {
            ...updatedQuestions[questionIndex].answers[answerIndex],
            content: value,
        };
        setQuestionsArray(updatedQuestions);
    };

    // Cập nhật điểm số của đáp án
    const updateAnswerPoint = (questionIndex, answerIndex, value) => {
        const updatedQuestions = [...questionsArray];
        updatedQuestions[questionIndex].answers[answerIndex] = {
            ...updatedQuestions[questionIndex].answers[answerIndex],
            point: Number(value),
        };
        setQuestionsArray(updatedQuestions);
    };

    // Thêm đáp án mới nhưng tối đa 6 đáp án
    const addAnswer = (questionIndex) => {
        const updatedQuestions = [...questionsArray];
        if (updatedQuestions[questionIndex].answers.length < 6) {
            updatedQuestions[questionIndex].answers.push({ content: "Đáp án " + (updatedQuestions[questionIndex].answers.length + 1), point: 0 });
            setQuestionsArray(updatedQuestions);
        } else {
            alert("Tối đa 6 đáp án cho mỗi câu hỏi");
        }
    };

    // Xử lý khi lưu bài kiểm tra
    const handleSaveTest = async () => {
        try {
            // Định dạng câu hỏi đúng format
            const formattedQuestions = {
                questions: questionsArray.map(q => ({
                    content: q.content,
                    answers: q.answers.map(ans => ({
                        content: ans.content,
                        point: ans.point
                    }))
                }))
            };

            if(formattedQuestions.questions.length === 0) {
                alert("Vui lòng nhập câu hỏi.");
            }else{
                const response = await creatTest(categoryId, title, description, testOutcomes);
                const testId = response.test;
    
                console.log("Formatted Questions:", JSON.stringify(formattedQuestions, null, 2));
                const response2 = await insertQuestionOnTest(testId, formattedQuestions);
                console.log("Response từ insertQuestionOnTest:", response2);
    
                alert("Tạo bài kiểm tra thành công!");
                navigate(`/getTest/${categoryId}`);
            }
        } catch (err) {
            console.error("Lỗi khi tạo bài kiểm tra hoặc chèn câu hỏi:", err);
            alert("Có lỗi xảy ra!");
        }
    };

    return (
        <Container>
            <Card className="text-sm text-left mb-4" style={{ marginBottom: '30px', padding: '20px' }}>
                <h2>Tạo bài kiểm tra</h2>
                <CardContent className="grid gap-6">
                    <h3>Thể loại: {cateName.categoryName}</h3>
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
            {/* 
            <Card className="text-sm text-left mb-4" style={{ marginBottom: '30px', padding: '20px' }}>
                <CardContent className="grid gap-6">
                    <h2>Thể loại: {cateName.categoryName}</h2>
                    <Input style={{ fontSize: '30px', fontWeight: 'bold' }}
                        type="text"
                        placeholder="Tên bài kiểm tra"
                        onDoubleClick={handleDoubleClick}
                        onBlur={handleBlur}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} />
                    <Input type="text"
                        placeholder="Mô tả bài kiểm tra"
                        onDoubleClick={handleDoubleClick}
                        onBlur={handleBlur}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                </CardContent>
            </Card> */}

            <Card className="text-sm text-left mb-4" style={{ marginBottom: '20px', padding: '20px' }}>
                <h2>Câu hỏi cho bài kiểm tra</h2>
                <CardContent className="grid gap-6">
                    {questionsArray.map((question, questionIndex) => (
                        <div key={questionIndex} className="border p-4 mb-4 rounded">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="md:col-span-1">
                                    <div className="grid gap-2">
                                        <Label htmlFor={`question-${questionIndex}`}>Câu hỏi {questionIndex + 1}</Label>
                                        <Input
                                            type="text"
                                            placeholder="Nhập nội dung câu hỏi"
                                            value={question.content}
                                            onChange={(e) => updateQuestionContent(questionIndex, e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-1 flex items-center justify-end gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor={`type-${questionIndex}`}>Kiểu câu hỏi</Label>
                                        <Select
                                            defaultValue="2"
                                            className="w-[160px]"
                                            id={`type-${questionIndex}`} // Added ID
                                        >
                                            <SelectTrigger className="line-clamp-1 w-full">
                                                <SelectValue placeholder="Chọn kiểu" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Hộp kiểm</SelectItem>
                                                <SelectItem value="2">Trắc nghiệm</SelectItem>
                                                <SelectItem value="3">Trả lời ngắn</SelectItem>
                                                <SelectItem value="4">Menu thả xuống</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Delete Button */}
                                    <FaTrash
                                        className="text-red-500 text-lg cursor-pointer"
                                        onClick={() => deleteQuestion(questionIndex)}
                                    />

                                    {/* Required Switch */}
                                    <div className="flex items-center space-x-2">
                                        <Switch id={`required-${questionIndex}`} />
                                        <Label htmlFor={`required-${questionIndex}`}>Bắt buộc</Label>
                                    </div>
                                </div>

                                {/* Render các đáp án */}
                                <div className="grid gap-2">
                                    <Label>Đáp án</Label>
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
                                    <Button
                                        onClick={() => addAnswer(questionIndex)}
                                        disabled={question.answers.length >= 6}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            fontSize: '24px',
                                            backgroundColor: '#4CAF50',
                                            color: 'white',
                                            border: 'none',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            cursor: question.answers.length < 6 ? 'pointer' : 'not-allowed',
                                        }}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>

                        </div>
                    ))}
                </CardContent>
                <Button onClick={addQuestion}>Thêm câu hỏi</Button>
            </Card>

            <Button style={{ marginTop: '20px' }} onClick={handleSaveTest}>
                Tạo bài kiểm tra
            </Button>
        </Container>
    );
}

export default CreateTestScreen;
