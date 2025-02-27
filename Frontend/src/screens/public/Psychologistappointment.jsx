import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Psychologistappointment() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const timeSlots = ["7:00 - 8:30", "8:30 - 10:00", "10:00 - 11:30", "13:00 - 14:30", "15:00 - 16:30"];

  return (
    <div className="p-6 max-w-6xl mx-auto text-justify">
                <div className="w-full h-64 mb-8 rounded-lg overflow-hidden">
          <img
            src="https://media.vneconomy.vn/w800/images/upload/2024/05/11/kham-chua-benh.png"
            alt="Header"
            className="w-full h-full object-cover"
          />
        </div>
      <h1 className="text-3xl font-bold text-center">TrustTalk</h1>
      <p className="text-gray-600 text-justify mt-2">
      TrustTalk provides information and appointment scheduling for leading psychological specialists in Vietnam. These experts have undergone rigorous training and possess extensive experience in the field of psychological counseling, having worked at major hospitals in Hanoi. They have been or are currently working at top medical institutions such as the National Psychiatric Hospital, the Institute of Mental Health, and Hanoi Medical University Hospital. Recognized by the state with prestigious titles such as People's Physician, Distinguished Physician, and Senior Doctor, they affirm their expertise and credibility in the field of psychology.      </p>
      <div className="flex gap-4 mt-6 justify-center items-center">
        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Psychologist Name</label>
          <Input placeholder="Type to search" className="w-40" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Location</label>
          <Input placeholder="Type to search" className="w-40" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Date</label>
          <DatePicker
            selected={selectedDate}
        
            dateFormat="dd/MM/yyyy"
            className="w-40 p-2 border rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Time slot</label>
          <Select>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Please select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7:00 - 8:30">7:00 - 8:30</SelectItem>
              <SelectItem value="8:30 - 10:00">8:30 - 10:00</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col justify-end">
          <Button className="bg-blue-500 text-white px-4 py-2">Search</Button>
        </div>
      </div>
      <Card className="mt-8 p-4 border rounded-lg shadow-md bg-[#F4F4F4] flex">
        <div className="w-1/3 flex justify-center border-r pr-4">
        <img
          src="https://imgcdn.stablediffusionweb.com/2024/11/8/da820525-511d-4389-a51e-3548432b5dc5.jpg"
          alt="Dr. Nguyễn Ngọc Nguyên"
          className="w-full h-64 object-cover rounded-lg border"
        />
        </div>
        <div className="w-2/3 p-4 text-justify">
          <h2 className="text-lg font-semibold">Dr. Nguyễn Ngọc Nguyên</h2>
          <p className="text-gray-600">
            With years of experience in psychology, Dr. Nguyễn specializes in
            counseling and treating mental health disorders for all age groups.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <span>Location: Ha Noi</span>
          </p>
          <div className="border-t mt-4 pt-4">
            <h3 className="font-semibold flex items-center gap-1">Examination Schedule</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-gray-500">{selectedDate.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "numeric" })}</span>
              <Select onValueChange={(value) => setSelectedDate(new Date(value))}>
                <SelectTrigger className="w-40 border rounded p-2">
                  <SelectValue placeholder={selectedDate.toLocaleDateString("vi-VN")} />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(7)].map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    return (
                      <SelectItem key={i} value={date.toISOString()}>
                        {date.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "numeric" })}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            {selectedDate && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {timeSlots.map((slot, i) => (
                  <Button key={i} variant="outline" className="w-full bg-gray-200">
                    {slot}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
