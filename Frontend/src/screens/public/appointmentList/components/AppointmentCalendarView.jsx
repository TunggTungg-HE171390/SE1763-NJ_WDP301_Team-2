import PropTypes from "prop-types";
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";

const AppointmentCalendarView = ({ appointments, utils }) => {
    const [appointmentPopupOpen, setAppointmentPopupOpen] = useState(false);
    const [dayAppointments, setDayAppointments] = useState([]);
    const [dayTitle, setDayTitle] = useState("");
    const calendarRef = useRef(null);

    // Filter appointments to only show confirmed ones
    const confirmedAppointments = appointments.filter((appointment) => appointment.status === "Confirmed");
    console.log("", confirmedAppointments);

    // Group confirmed appointments by date for calendar view
    const groupedAppointments = confirmedAppointments.reduce((acc, appointment) => {
        const dateKey = appointment.scheduledTime?.date?.split("T")[0] || "";
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(appointment);
        return acc;
    }, {});

    // Create events for calendar with counts
    const calendarEvents = Object.entries(groupedAppointments).map(([date, appts]) => ({
        id: `group-${date}`,
        title: `${appts.length} cuộc hẹn`,
        start: date,
        backgroundColor: "#2563eb", // blue-600
        borderColor: "#2563eb",
        extendedProps: {
            appointments: appts,
            isGroup: true,
        },
        allDay: true,
        display: "block",
    }));

    const formatToIndochinaISO = (date) => {
        // Get the UTC date in ISO format
        const isoDate = date.toISOString().slice(0, 10); // "YYYY-MM-DD"

        // Convert to Indochina Time (GMT+7)
        const ictHours = date.getHours().toString().padStart(2, "0");
        const ictMinutes = date.getMinutes().toString().padStart(2, "0");
        const ictSeconds = date.getSeconds().toString().padStart(2, "0");

        // Construct the desired format
        return `${isoDate}T${ictHours}:${ictMinutes}:${ictSeconds}`;
    };

    // Add individual appointments for time grid views (only confirmed appointments)
    confirmedAppointments.forEach((appointment) => {
        // Extract full date objects from date strings
        const startDate = utils.parseTime(appointment.scheduledTime?.startTime);
        const endDate = utils.parseTime(appointment.scheduledTime?.endTime);
        console.log("", startDate, endDate);

        // Format for FullCalendar (YYYY-MM-DDTHH:MM:SS)
        const startDateTime = formatToIndochinaISO(startDate);
        const endDateTime = formatToIndochinaISO(endDate);
        console.log("", startDateTime, endDateTime);

        calendarEvents.push({
            id: `individual-${appointment._id}`,
            title: appointment.psychologistId?.fullName || "Appointment",
            start: startDateTime,
            end: endDateTime,
            backgroundColor: utils.getStatusColor(appointment.status),
            borderColor: utils.getStatusColor(appointment.status),
            extendedProps: { ...appointment, isGroup: false },
            classNames: ["cursor-pointer"],
            allDay: false,
        });
    });

    const calendarStyles = `
        .fc .fc-button-primary {
            background-color: #2563eb !important;
            border-color: #2563eb !important;
        }
        .fc .fc-button-primary:not(:disabled):active,
        .fc .fc-button-primary:not(:disabled).fc-button-active {
            background-color: #1d4ed8 !important;
            border-color: #1d4ed8 !important;
        }
        .fc-event {
            cursor: pointer !important;
        }
        .fc .fc-toolbar-title {
            color: #2563eb;
        }
    `;

    // Handle calendar event click
    const handleEventClick = (clickInfo) => {
        const eventData = clickInfo.event.extendedProps;

        if (eventData.isGroup) {
            // Open popup showing all appointments for that day
            setDayAppointments(eventData.appointments);
            setDayTitle(utils.formatDate(clickInfo.event.start));
            setAppointmentPopupOpen(true);
        } else {
            // Handle individual appointment click
            utils.handleAppointmentClick(eventData._id);
        }
    };

    // Status badge component
    const StatusBadge = ({ status }) => {
        const variants = {
            Confirmed:
                "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 hover:text-blue-800 hover:border-blue-200",
            Pending:
                "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 hover:text-amber-800 hover:border-amber-200",
            Completed:
                "bg-green-100 text-green-800 border-green-200 hover:bg-green-100 hover:text-green-800 hover:border-green-200",
            Cancelled:
                "bg-red-100 text-red-800 border-red-200 hover:bg-red-100 hover:text-red-800 hover:border-red-200",
            Default:
                "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-200",
        };

        return (
            <Badge className={`${variants[status] || variants.Default} border px-2 py-1`}>
                {utils.statusTranslations[status] || status}
            </Badge>
        );
    };

    // Define prop types for StatusBadge
    StatusBadge.propTypes = {
        status: PropTypes.string.isRequired,
    };

    return (
        <>
            <Card className="p-4">
                <style>{calendarStyles}</style>
                <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-blue-700">Lịch Cuộc Hẹn (Đã Xác Nhận)</h2>
                    <Button
                        variant="outline"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        onClick={() => {
                            if (calendarRef.current) {
                                const calendarApi = calendarRef.current.getApi();
                                calendarApi.today();
                            }
                        }}>
                        Hôm nay
                    </Button>
                </div>
                <div className="h-full">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        locale={viLocale}
                        headerToolbar={{
                            left: "prev,next",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay",
                        }}
                        slotMinTime="07:00:00"
                        slotMaxTime="23:00:00"
                        events={calendarEvents}
                        eventClick={handleEventClick}
                        height="auto"
                        aspectRatio={1.5}
                        allDaySlot={false}
                        themeSystem="standard"
                        slotDuration="00:30:00"
                        eventTimeFormat={{
                            hour: "2-digit",
                            minute: "2-digit",
                            meridiem: false,
                            hour12: false,
                        }}
                        dayMaxEvents={1}
                        buttonIcons={{
                            prev: "chevron-left",
                            next: "chevron-right",
                        }}
                        buttonText={{
                            today: "Hôm nay",
                            month: "Tháng",
                            week: "Tuần",
                            day: "Ngày",
                        }}
                        dayHeaders={true}
                        // Custom styling for today highlight
                        dayCellDidMount={(arg) => {
                            // Check if this is today
                            if (arg.date.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
                                arg.el.style.backgroundColor = "#dbeafe"; // blue-100
                                arg.el.style.borderColor = "#bfdbfe"; // blue-200
                            }
                        }}
                        // Custom button styling
                        customButtons={{
                            prev: {
                                text: "Trước",
                                click: function () {
                                    const calendarApi = calendarRef.current.getApi();
                                    calendarApi.prev();
                                },
                            },
                            next: {
                                text: "Tiếp",
                                click: function () {
                                    const calendarApi = calendarRef.current.getApi();
                                    calendarApi.next();
                                },
                            },
                        }}
                        eventClassNames="cursor-pointer"
                    />
                </div>
            </Card>

            {/* Day Appointments Popup */}
            <Dialog open={appointmentPopupOpen} onOpenChange={setAppointmentPopupOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <span>Cuộc hẹn ngày {dayTitle}</span>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {dayAppointments.map((appointment) => (
                            <div
                                key={appointment._id}
                                className="p-3 border rounded-lg cursor-pointer hover:bg-blue-50"
                                onClick={() => utils.handleAppointmentClick(appointment._id)}>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="font-medium">
                                        {appointment.psychologistId?.fullName || "Unknown"}
                                    </div>
                                    <StatusBadge status={appointment.status} />
                                </div>
                                <div className="flex items-center text-gray-600 text-sm">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {utils.formatTime(appointment.scheduledTime?.startTime)} -{" "}
                                    {utils.formatTime(appointment.scheduledTime?.endTime)}
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

AppointmentCalendarView.propTypes = {
    appointments: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            psychologistId: PropTypes.shape({
                fullName: PropTypes.string,
            }),
            scheduledTime: PropTypes.shape({
                date: PropTypes.string,
                startTime: PropTypes.string,
                endTime: PropTypes.string,
            }),
            status: PropTypes.string,
        })
    ).isRequired,
    utils: PropTypes.shape({
        parseTime: PropTypes.func.isRequired,
        formatDate: PropTypes.func.isRequired,
        formatTime: PropTypes.func.isRequired,
        getStatusColor: PropTypes.func.isRequired,
        handleAppointmentClick: PropTypes.func.isRequired,
        statusTranslations: PropTypes.object.isRequired,
    }).isRequired,
};

export default AppointmentCalendarView;
