import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { psychologistList } from "../../api/user.api";

export function PsychologistList() {
  const navigate = useNavigate();
  const [psychologistData, setPsychologistData] = useState([]);

  useEffect(() => {
    const fetchPsychologistList = async () => {
      try {
        const response = await psychologistList();
        setPsychologistData(response);
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };
    fetchPsychologistList();
  }, []);

  const handlePsychologicalSchdule = (psychologistId) => {
    // getTestByCateId(categoryId); 
    navigate(`/psychologist-schedule/${psychologistId}`);
  };

  return (
    <div className="h-screen flex justify-center items-center bg-background px-4">
      <ScrollArea className="w-full max-w-screen-xl">
        <div className="flex space-x-4 pb-4 justify-center flex-wrap gap-6">
          {psychologistData.map((psychologist) => (
            <Card
              key={psychologist.id}
              className="w-[420px] border border-gray-300 rounded-lg shadow-lg hover:scale-105 hover:border-yellow-500 hover:shadow-2xl transition-all duration-300 ease-in-out  bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 px-6"
            >
              <CardHeader className="text-left">
                <CardTitle className="text-lg font-bold text-primary">{psychologist.psychologistName}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/imgs?q=tbn:ANd9GcTFc0Cry8E_MF-5Qkl5umnXnZ77LI0B8tYKTn-nIG48KTFKnzxLHhIP2Usqb8Hsq0ERpH8_pM0M06a1kB-A0CToMw"
                    alt={psychologist.psychologistName}
                    className="rounded-lg w-[300px] h-[330px] object-cover"
                  />
                </div>

                <div className="px-4">
                <h3 className="text-sm font-semibold text-left text-white">Email: <span className="text-sm font-medium text-black">{psychologist.email}</span></h3>
                <h3 className="text-sm font-semibold text-left text-white">Phone Number: <span className="text-sm font-medium text-black">{psychologist.phone}</span></h3>

                  <div className="mt-3">
                    <h3 className="text-sm font-semibold text-left text-white">Achievements:</h3>
                    <ul className="list-disc pl-5 text-sm font-medium text-black text-left">
                      <li>{psychologist.psychologistProfile?.specialization}</li>
                    </ul>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-sm font-semibold text-left text-white">Professional Details:</h3>
                    <div className="space-y-2">
                    <h3 className="text-sm font-medium text-left text-white">Psychological Category: <span className="text-sm font-medium text-black">{psychologist.psychologistProfile?.psychologicalCategory}</span></h3>
                      <h3 className="text-sm font-medium text-left text-white">Professional Level: <span className="text-sm font-medium text-black">{psychologist.psychologistProfile?.professionalLevel}</span></h3>
                      <h3 className="text-sm font-medium text-left text-white">Educational Level: <span className="text-sm font-medium text-black">{psychologist.psychologistProfile?.educationalLevel}</span></h3>
                      <h3 className="text-sm font-medium text-left text-white">Rating: <span className="text-sm font-medium text-black">{psychologist.psychologistProfile?.rating} ⭐</span></h3>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex w-full">
                <Button style={{ backgroundColor: '#ffcd1f', color: 'black' }} className="w-full py-2 text-sm font-medium hover:bg-yellow-600 transition-all duration-200" onClick={() => handlePsychologicalSchdule(psychologist.psychologistId)}>
                  Booking
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

export default PsychologistList;