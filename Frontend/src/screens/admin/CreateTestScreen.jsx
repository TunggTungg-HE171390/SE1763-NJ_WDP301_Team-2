import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { creatTest } from "../../api/Test.api";
import { getCateNameByCateId } from "../../api/Categories.api";

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

    return (
        <Container>
            <Card className="text-sm text-left mb-4" style={{ marginBottom: '30px', padding: '20px' }}>
                <h2>Tạo bài kiểm tra</h2>
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
            </Card>

            <Card className="text-sm text-left mb-4" style={{ marginBottom: '20px', padding: '20px' }}>
                <h3>Kết quả bài kiểm tra</h3>

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
            </Card>

            <Button style={{ marginTop: '20px' }} onClick={handleSaveTest}>
                Lưu bài kiểm tra
            </Button>
        </Container>
    );
}

export default CreateTestScreen;
