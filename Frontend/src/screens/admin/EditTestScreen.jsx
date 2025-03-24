import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { getTestById, updateTest } from "../../api/Test.api";
import { Button } from "@/components/ui/button";
import { getQuestionByTestId, updateQuestion, deleteQuestion, insertQuestionOnTest } from "../../api/Questions.api";
import { useBootstrap } from "@/hooks/useBootstrap";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FaTrash } from 'react-icons/fa';
import { Switch } from "@/components/ui/switch"

export function EditTestScreen() {
    const { testId } = useParams();
    const navigate = useNavigate();
    useBootstrap();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [testOutcomes, setTestOutcomes] = useState([]);
    const [questionsArray, setQuestionsArray] = useState([]);
    const [cateName, setCateName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [deletedQuestions, setDeletedQuestions] = useState([]);
    const [newQuestions, setNewQuestions] = useState([]);

    useEffect(() => {
        const fetchTestData = async () => {
            try {
                const testResponse = await getTestById(testId);
                setTitle(testResponse.title);
                setDescription(testResponse.description);
                setTestOutcomes(testResponse.testOutcomes);
                setCategoryId(testResponse.categoryId);
                setCateName(testResponse.category.categoryName);

                const questionResponse = await getQuestionByTestId(testId);
                const formattedQuestions = questionResponse.data.questions.map(q => ({
                    questionId: q.questionId,
                    content: q.content,
                    answers: q.answers.map(a => ({
                        content: a.content,
                        point: a.point
                    }))
                }));

                setQuestionsArray(formattedQuestions);
                // console.log("Formatted questions:", formattedQuestions);
            } catch (error) {
                console.error("Error fetching test data:", error);
            }
        };

        fetchTestData();
    }, [testId]);

    const addQuestion = () => {
        const newQuestion = {
            content: "", // Câu hỏi chưa có nội dung
            answers: [{ content: "Đáp án 1", point: 0 }] // Đảm bảo câu trả lời có đủ content và point
        };

        // Cập nhật newQuestions và questionsArray với cấu trúc đúng
        setNewQuestions(prevNewQuestions => [...prevNewQuestions, newQuestion]);
        setQuestionsArray(prevQuestionsArray => [...prevQuestionsArray, newQuestion]);
    };

    const handleSaveTest = async () => {
        try {
            const testUpdateResponse = await updateTest(testId, title, description, testOutcomes);

            console.log("questionsArray", questionsArray);
            console.log("newQuestions", newQuestions);

            if (newQuestions.length > 0) {
                console.log("Adding new questions:", newQuestions);

                const insertResponse = await insertQuestionOnTest(testId, newQuestions);

                const newQuestionsWithId = insertResponse.questionIds.map((questionId, index) => ({
                    questionId: questionId,
                    content: newQuestions[index].content,
                    answers: newQuestions[index].answers
                }));

                console.log("newQuestionsWithId", newQuestionsWithId);

                // Cập nhật questionsArray với câu hỏi mới
                // setQuestionsArray(prevQuestionsArray => [
                //     ...prevQuestionsArray,
                //     ...newQuestionsWithId  // Thêm các câu hỏi mới vào questionsArray
                // ]);

                questionsArray.push(...newQuestionsWithId);

                // console.log("questionsArrayId", newQuestionsWithId.map(q => q.questionId));
                // console.log("New questions added:", insertResponse);

                console.log("questionsArrayID all ", questionsArray.map(q => q.questionId));
            }

            // Cập nhật các câu hỏi sau khi bài kiểm tra đã được cập nhật
            const questionUpdatePromises = questionsArray
                .filter(q => q.questionId !== undefined)
                .map(q => updateQuestion(q.questionId, { content: q.content, answers: q.answers }));
            await Promise.all(questionUpdatePromises);


            console.log("questionUpdatePromises", questionUpdatePromises);

            // Chờ tất cả các cập nhật câu hỏi hoàn thành
            await Promise.all(questionUpdatePromises);

            // Xóa các câu hỏi đã chọn
            if (deletedQuestions.length > 0) {
                const deletePromises = deletedQuestions.map(questionId =>
                    console.log("Deleting question with ID", questionId) ||
                    deleteQuestion(questionId)
                );

                // Chờ tất cả các xóa câu hỏi hoàn thành
                await Promise.all(deletePromises);
            }

            console.log("newQuestions", newQuestions);

            alert("Cập nhật bài kiểm tra thành công!");
            navigate(-1);
            // navigate(`/CategoryTestSelected`);
        } catch (err) {
            console.error("Error saving test:", err);
            alert("Có lỗi xảy ra khi lưu bài kiểm tra.");
        }
    };

    // Cập nhật kết quả bài kiểm tra
    const updateOutcome = (index, field, value) => {
        const updatedOutcomes = [...testOutcomes];
        updatedOutcomes[index][field] = value;
        setTestOutcomes(updatedOutcomes);
    };

    // Cập nhật nội dung câu hỏi
    const updateQuestionContent = (index, value) => {
        const updatedQuestions = [...questionsArray];
        updatedQuestions[index].content = value;
        setQuestionsArray(updatedQuestions);
    };

    // Cập nhật nội dung đáp án
    const updateAnswerContent = (questionIndex, answerIndex, value) => {
        const updatedQuestions = [...questionsArray];
        updatedQuestions[questionIndex].answers[answerIndex].content = value;
        setQuestionsArray(updatedQuestions);
    };

    // Cập nhật điểm số đáp án
    const updateAnswerPoint = (questionIndex, answerIndex, value) => {
        const updatedQuestions = [...questionsArray];
        updatedQuestions[questionIndex].answers[answerIndex].point = Number(value);
        setQuestionsArray(updatedQuestions);
    };

    // Thêm đáp án mới
    const addAnswer = (questionIndex) => {
        const updatedQuestions = [...questionsArray];
        if (updatedQuestions[questionIndex].answers.length < 6) {
            updatedQuestions[questionIndex].answers.push({ content: "Đáp án " + (updatedQuestions[questionIndex].answers.length + 1), point: 0 });
            setQuestionsArray(updatedQuestions);
        } else {
            alert("Tối đa 6 đáp án cho mỗi câu hỏi");
        }
    };

    useEffect(() => {
        console.log("Deleted questions:", deletedQuestions);
    }, [deletedQuestions]);

    const deleteQuestionButton = (questionId, index) => {
        console.log("Deleting question at index", index);
        const updatedQuestions = questionsArray.filter((_, i) => i !== index);
        setDeletedQuestions((prevDeletedQuestions) => [...prevDeletedQuestions, questionId]);
        console.log("Deleted questions:", deletedQuestions);

        setQuestionsArray(updatedQuestions);
    };

    return (
        <Container>
            <Card className="text-sm text-left mb-4" style={{ marginBottom: '30px', padding: '20px' }}>
                <h2>Chỉnh sửa bài kiểm tra</h2>
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
                                        onClick={() => deleteQuestionButton(question.questionId, questionIndex)}
                                    />

                                    {/* Required Switch */}
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id={`required-${questionIndex}`}
                                            checked={question.isRequired}
                                            onChange={() => toggleRequired(questionIndex)}
                                        />
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
                Lưu bài kiểm tra
            </Button>
        </Container>
    );
}

export default EditTestScreen;
