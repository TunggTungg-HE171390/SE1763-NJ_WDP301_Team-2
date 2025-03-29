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
import { useNavigate } from "react-router-dom"; 
import { getAllCategories, getTestByCateId } from "../../api/Categories.api"; 

export function CategoryTestSelected() {
  const [categories, setCategories] = useState([]);  
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data); 
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();  
  }, []);  

  const handleCategoryClick = (categoryId) => {
    getTestByCateId(categoryId); 
    navigate(`/getTest/${categoryId}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen gap-6">
      {categories.map((category) => (
        <Card key={category.id} className="w-[350px] border-primary hover:scale-105 hover:border-2 hover:border-yellow-500 transition-all duration-300 ease-in-out">
          <CardHeader>
            <CardTitle className="text-left">{category.categoryName}</CardTitle> 
            <CardDescription className="text-left text-red-500">* Đăng ký để có thể nhận kết quả</CardDescription>
          </CardHeader>

          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="text-left">
                  <Label htmlFor="name" className="text-left text-lg">Khám phá sức khỏe tâm lý</Label>
                  <CardDescription>Hiểu rõ hơn về tâm trạng và cảm xúc của bạn.</CardDescription>
                </div>
                <div className="text-left">
                  <Label htmlFor="name" className="text-left text-lg">Làm quen với Tâm Giao</Label>
                  <CardDescription>
                    Nhận sự hỗ trợ, tư vấn và thăm khám từ các tư vấn viên tâm lý
                  </CardDescription>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex w-full" onClick={() => handleCategoryClick(category._id)}>
            <Button style={{ backgroundColor: '#ffcd1f', color: 'black' }} className="w-full">Chọn thể loại</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default CategoryTestSelected;
