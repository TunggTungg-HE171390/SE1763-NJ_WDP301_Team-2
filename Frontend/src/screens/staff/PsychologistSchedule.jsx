import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { schedulePsychologistId } from "../../api/appointment.api";

// Cấu hình với date-fns thay vì moment
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }), // Thiết lập tuần bắt đầu vào thứ 2
  getDay,
  locales: { "en-US": enUS }, // Sử dụng locale "en-US" từ date-fns
});

export const PsychologistSchedule = () => {
  const { psychologistId } = useParams();
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", start: new Date(), end: new Date() });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPsychologistSchedule = async () => {
      try {
        const psychologistSchedule = await schedulePsychologistId(psychologistId);
        const formattedEvents = psychologistSchedule.map(event => {
          const { startTime, endTime } = event.scheduleTime;
          const patientName = event.patientProfile.patientName;

          let eventStyle = {};

          if (event.status === "Pending") {
            eventStyle = { backgroundColor: "orange", fontSize: "13px" };
          } else if (event.status === "Confirmed") {
            eventStyle = { backgroundColor: "green", fontSize: "13px"  };
          } else if (event.status === "Completed") {
            eventStyle = { fontSize: "13px"  };
          } else if (event.status === "Cancelled") {
            eventStyle = { backgroundColor: "red", fontSize: "13px"  };
          } else {
            eventStyle = { backgroundColor: "#CC33FF", fontSize: "13px"  };
          }

          return {
            ...event,
            title: `Meeting with ${patientName}`,
            start: new Date(startTime),
            end: new Date(endTime),
            style: eventStyle,
          };
        });

        setEvents(formattedEvents);

        console.log("Psychologist schedule:", psychologistSchedule);
      } catch (error) {
        console.error("Error fetching psychologist schedule:", error);
      }
    };

    fetchPsychologistSchedule();
  }, [psychologistId]);

  const handleEventAdd = (slotInfo) => {
    setNewEvent({
      title: "",
      start: slotInfo.start,
      end: slotInfo.end,
    });
    setOpenDialog(true);
  };

  const handleEventSave = () => {
    if (newEvent.title && newEvent.start && newEvent.end) {
      setEvents([...events, newEvent]);
      setOpenDialog(false);
      setNewEvent({ title: "", start: new Date(), end: new Date() });
    } else {
      alert("Please fill out the event details.");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-background px-4 w-full" style={{ margin: "2vh" }}>
      <div className="w-full max-w-screen-xl">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100vh" }}
          views={["month", "week", "day"]} // Hiển thị theo các chế độ: tháng, tuần, ngày
          defaultView="month"
          selectable
          onSelectSlot={handleEventAdd} // Chọn thời gian để thêm sự kiện
          eventPropGetter={(event) => ({
            style: event.style,
          })}
        />
      </div>

      {/* Dialog để thêm sự kiện mới */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button>Add Event</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogTitle>Add a new event</DialogTitle>
          <DialogDescription>
            <input
              type="text"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full p-2 mt-2 rounded border"
            />
            <div className="mt-4 flex space-x-4">
              <div>
                <label className="block text-sm font-semibold">Start Date</label>
                <input
                  type="datetime-local"
                  value={format(newEvent.start, "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
                  className="w-full p-2 mt-2 rounded border"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">End Date</label>
                <input
                  type="datetime-local"
                  value={format(newEvent.end, "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
                  className="w-full p-2 mt-2 rounded border"
                />
              </div>
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button onClick={handleEventSave}>Save Event</Button>
            <Button onClick={() => setOpenDialog(false)} variant="outline">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PsychologistSchedule;
