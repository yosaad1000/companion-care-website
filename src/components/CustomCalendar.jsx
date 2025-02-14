import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";

const CustomCalendar = ({ events = {} }) => {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  return (
    <div className="rounded-xl border border-gray-300 shadow-lg bg-white dark:bg-gray-900 p-4 max-h-[40vh] overflow-y-auto custom-scrollbar">
      <Calendar
        onClickDay={handleDateChange}
        tileClassName={({ date, view }) => {
          if (view === "month" && events) {
            const eventDate = date.toDateString();
            return events[eventDate] ? "bg-pink-200 text-pink-700 font-semibold rounded-lg" : "";
          }
          return "";
        }}
        className="w-full text-gray-800 dark:text-gray-100"
        value={date}
      />
    </div>
  );
};

export default CustomCalendar;
