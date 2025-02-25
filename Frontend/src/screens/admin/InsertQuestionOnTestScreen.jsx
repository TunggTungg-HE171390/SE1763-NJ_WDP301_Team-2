import React, { useState, useEffect } from 'react';
import { Form, Container, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch"
import { FaTrash } from 'react-icons/fa';
import { getCateNameByCateId } from "../../api/Categories.api";

export function InsertQuestionOnTestScreen() {

    const { categoryId } = useParams();
    const [title, setTitle] = useState('Mẫu không có tiêu đề');
    const [description, setDescription] = useState('Mô tả bài kiểm tra');
    const [cateName, setCateName] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchCateName = async () => {
            try {
                const response = await getCateNameByCateId(categoryId);
                setCateName(response.data);
                console.log("DATA", response.data);
            } catch (error) {
                console.error("Error fetching test data:", error);
            }
        };

        fetchCateName();
    }, [categoryId]);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const [questions, setQuestions] = useState([
        {
            type: 'multiple-choice',
            title: '',
            options: ['Tùy chọn 1'],
            required: true,
        },
    ]);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                type: 'multiple-choice',
                title: '',
                options: ['Tùy chọn 1'],
                required: false,
            },
        ]);
    };

    const updateQuestion = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    // Thêm đáp án mới nhưng giới hạn tối đa 6 đáp án
    const addOption = (questionIndex) => {
        const updatedQuestions = [...questions];
        const currentOptions = updatedQuestions[questionIndex].options;

        if (currentOptions.length < 6) {
            currentOptions.push('Tùy chọn ' + (currentOptions.length + 1));
            setQuestions(updatedQuestions);
        } else {
            Alert.alert("Tối đa 6 đáp án cho mỗi câu hỏi");
        }
    };

    return (
        <Container>
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
            </Card>

            <Card className="text-sm text-left mb-4" style={{ marginBottom: '20px', padding: '20px' }}>
                <CardContent className="grid gap-6">
                    {questions.map((question, questionIndex) => (
                        <div key={questionIndex} className="border p-4 mb-4 rounded">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="md:col-span-1">
                                    <div className="grid gap-2">
                                        <Label htmlFor={`question-${questionIndex}`}>Câu hỏi {questionIndex + 1}</Label>
                                        <Input
                                            id={`question-${questionIndex}`}
                                            type="text"
                                            placeholder="Câu hỏi này không có tiêu đề"
                                            value={question.title}
                                            onChange={(e) => updateQuestion(questionIndex, 'title', e.target.value)}
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
                                    {question.options.map((option, optionIndex) => (
                                        <Input
                                            key={optionIndex}
                                            type="text"
                                            value={option}
                                            onChange={(e) => {
                                                const updatedQuestions = [...questions];
                                                updatedQuestions[questionIndex].options[optionIndex] = e.target.value;
                                                setQuestions(updatedQuestions);
                                            }}
                                            placeholder="Tùy chọn"
                                        />
                                    ))}
                                    <Button
                                        onClick={() => addOption(questionIndex)}
                                        disabled={question.options.length >= 6}
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
                                            cursor: question.options.length < 6 ? 'pointer' : 'not-allowed',
                                        }}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>

                        </div>
                    ))}
                </CardContent>
            </Card>

            <Button onClick={addQuestion}>Thêm câu hỏi</Button>
        </Container>
    );
}

export default InsertQuestionOnTestScreen;
