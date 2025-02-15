import React, { useEffect } from "react";
import { Search } from "lucide-react";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TodoList from "./loaders/TodoList";
import { useAuth } from "../hooks/useAuth";
import useSWR from "swr";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const MedicalDashboard = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem("calendarEvents");
    return savedEvents ? JSON.parse(savedEvents) : {};
  });
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState("");
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEventMode, setIsEventMode] = useState(false);
  const { user } = useAuth();
  const { data, error, isLoading } = useSWR(
    `${import.meta.env.VITE_BACKEND_URL}/users/get-patients/${user?.id}`,
    fetcher
  );

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const handleDateChange = (selectedDate) => {
    const formattedDate = selectedDate.toDateString();
    setDate(selectedDate);

    if (events[formattedDate]) {
      setSelectedEvents(events[formattedDate]);
      setIsEventMode(false);
      setShowModal(true);
    } else {
      setSelectedEvents([]);
      setIsEventMode(true);
    }
  };

  const filteredPatients =
    isLoading || error
      ? []
      : data?.data?.patients?.filter((patient) =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleSubmitEvent = () => {
    const formattedDate = date.toDateString();
    if (newEvent) {
      setEvents((prevEvents) => {
        const updatedEvents = {
          ...prevEvents,
          [formattedDate]: prevEvents[formattedDate]
            ? [...new Set([...prevEvents[formattedDate], newEvent])]
            : [newEvent],
        };
        localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));
        return updatedEvents;
      });
      setShowModal(false);
      setNewEvent("");
      setDate(new Date());
      toast.success("Event added successfully");
    }
  };

  const handleDeleteEvent = (eventToDelete) => {
    const formattedDate = date.toDateString();
    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };
      updatedEvents[formattedDate] = updatedEvents[formattedDate]?.filter(
        (event) => event !== eventToDelete
      );

      if (updatedEvents[formattedDate].length === 0) {
        delete updatedEvents[formattedDate];
      }

      localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));
      return updatedEvents;
    });
    setShowModal(false);
    setNewEvent("");
    toast.success("Event deleted successfully");
    setDate(new Date());
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddEventToExistingDay = () => {
    setIsEventMode(true);
    setNewEvent("");
  };

  const processPatientData = (patients) => {
    const visitData = {};

    patients.forEach((patient) => {
      const createdAt = new Date(patient.createdAt);
      const month = createdAt.toLocaleString("default", { month: "short" }); // e.g., "Feb"
      const year = createdAt.getFullYear(); // e.g., 2025
      const key = `${month} ${year}`; // e.g., "Feb 2025"
      const gender = patient.gender.toLowerCase(); // 'male' or 'female'

      if (!visitData[key]) {
        visitData[key] = { month: key, male: 0, female: 0 };
      }

      visitData[key][gender] += 1; // Increment count based on gender
    });

    return Object.values(visitData).sort(
      (a, b) => new Date(`1 ${a.month}`) - new Date(`1 ${b.month}`)
    );
  };
  const visitData =
    isLoading || error ? [] : processPatientData(data?.data?.patients || []);

  return (
    <div className="min-h-screen bg-primary p-2 ml-64">
      <ToastContainer position="top-right" />
      {/* Search Bar */}
      <div className="flex justify-between items-center mb-2 ml-20">
        <div className="relative flex items-center w-5xl mx-2">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-8 pr-2 py-2 border border-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
            onChange={handleSearch}
            disabled={isLoading || !data?.data?.patients?.length}
          />
          {/* <SlidersHorizontal
            className="absolute right-10 text-gray-700 cursor-pointer mx-6"
            size={24}
          /> */}
          <Search
            className="absolute right-3 text-gray-700 cursor-pointer mx-3"
            size={24}
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-5">
        {/* Left Column (2/3) */}
        <div className="col-span-2 space-y-2 ">
          {/* Patient Visits */}
          <div className="bg-white rounded-2xl p-2 border border-gray-300 shadow-md">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 ml-4">👤</span>
                <span className="font-semibold text-gray-800 text-lg">
                  Patients Visits
                </span>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span className="text-sm text-gray-600">Male</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                    <span className="text-sm text-gray-600">Female</span>
                  </div>
                </div>
              </div>

            </div>
            <ResponsiveContainer width="100%" height={255}>
              <BarChart
                data={visitData.length > 0 ? visitData : [{ month: '', male: 0, female: 0 }]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
                <XAxis dataKey="month" tick={{ fill: "#4A90E2" }} />
                <YAxis tick={{ fill: "#4A90E2" }} domain={[0, `${visitData.length > 0? 'dataMax':'dataMax+5'}`]} /> 
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#333",
                    color: "#fff",
                    borderRadius: "10px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="male"
                  fill="url(#maleColor)"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="female"
                  fill="url(#femaleColor)"
                  radius={[6, 6, 0, 0]}
                />
                <defs>
                  <linearGradient id="maleColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4A90E2" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="femaleColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E24A90" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#E24A90" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>

          </div>

          {/* Todo & Calendar side-by-side */}
          <div className="grid grid-cols-2 gap-6 ">
            {/* Todo (Narrowed) */}
            <div className="bg-white border border-gray-300 shadow-lg rounded-2xl p-2 max-h-[48vh]  ">
              <TodoList />
            </div>

            {/* Calendar (Placed Beside Todo) */}
            <div className="bg-white p-3 rounded-2xl border border-gray-300 shadow-md  max-h-[48vh]">
              <div className="flex justify-between items-center mb-1 ">
                <h2 className="text-lg font-semibold">Event Calendar</h2>
                {!selectedEvents.length && isEventMode && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md"
                  >
                    Set Event
                  </button>
                )}
              </div>

              {/* Calendar directly below title and button */}
              <div className="custom-calendar-container rounded-xl border border-gray-300 shadow-lg bg-white  max-h-[41vh] overflow-y-auto custom-scrollbar">
                <Calendar
                  onClickDay={handleDateChange}
                  tileClassName={({ date, view }) => {
                    if (view === "month") {
                      const hasEvent = events[date.toDateString()];
                      return hasEvent ? "react-calendar__tile--hasEvent" : "";
                    }
                  }}
                  value={date}
                />
              </div>

              {/* Modal for Event Details */}
              {showModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] z-10">
                  <div className="bg-primary-400 p-6 rounded-lg shadow-lg w-96">
                    <h3 className="text-lg font-semibold mb-4">
                      {selectedEvents.length
                        ? "Event Details"
                        : `Set Event for : ${date.toDateString()}`}
                    </h3>

                    {/* Event Details or Set Event Form */}
                    {selectedEvents.length && !isEventMode ? (
                      <div>
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Events:</h4>
                          <ul className="space-y-2">
                            {selectedEvents.map((event, index) => (
                              <li
                                key={index}
                                className="flex justify-between items-center bg-gray-50 p-2 rounded-md"
                              >
                                <span className="font-semibold">
                                  • {event}
                                </span>
                                <button
                                  className="ml-2 text-red-600 hover:text-red-800"
                                  onClick={() => handleDeleteEvent(event)}
                                >
                                  <X />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex justify-between">
                          <button
                            onClick={handleAddEventToExistingDay}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md"
                          >
                            Add Event
                          </button>
                          <button
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="text"
                          value={newEvent}
                          onChange={(e) => setNewEvent(e.target.value)}
                          placeholder="Enter event description"
                          className="w-full p-2 border bg-white border-gray-200 rounded-md mb-4"
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={handleSubmitEvent}
                            className="px-4 py-2 bg-secondary text-white rounded-md"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setShowModal(false);
                              setIsEventMode(false);
                            }}
                            className="ml-2 px-4 py-2 bg-gray-600 text-white rounded-md"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1/3) - Contacts */}
        <div className="bg-primary rounded-2xl p-3 overflow-y-auto max-h-[91vh] space-y-2 custom-scrollbar">
          {filteredPatients.length === 0 ? (
            <p className="text-center text-gray-500 ">No patients available</p>
          ) : (
            filteredPatients.map((contact, idx) => (
              <Link
                to={`/chat/${contact.id}`}
                key={idx}
                className="flex bg-white border border-gray-300 shadow-md items-center gap-3 p-3 hover:bg-gray-100 rounded-xl"
              >
                <img
                  src={`/assets/Logo.png`}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                  <p className="text-sm text-gray-500">{contact.email}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalDashboard;
