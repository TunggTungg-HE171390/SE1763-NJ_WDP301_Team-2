import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card, CardContent,
} from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { creatTest } from "../../api/Test.api";
import { getCateNameByCateId } from "../../api/Categories.api";

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

    // Xử lý khi lưu bài kiểm tra
    const handleSaveTest = async () => {
        if (validateOutcomes()) {
            try {
                const response = await creatTest(categoryId, title, description, testOutcomes);
                console.log("Test created successfully:", response);
                alert("Tạo bài kiểm tra thành công!");
                navigate(`/getTest/${categoryId}`);
            } catch (err) {
                console.log("Error saving test:", err);
            }
        }
    };

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
                <Button onClick={addQuestion}>Thêm câu hỏi</Button>
            </Card>

            <Button style={{ marginTop: '20px' }} onClick={handleSaveTest}>
                Lưu bài kiểm tra
            </Button>
        </Container>
    );
}

export default CreateTestScreen;
