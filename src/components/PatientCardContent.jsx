import React, { useState,useEffect} from "react";
import { useParams, useNavigate, Routes, Route, Link } from "react-router-dom";
import { ArrowLeft, Search, MessageCircle, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import Prescription from "./Prescription";
import Reports from "./Reports";
import Documents from "./Documents";
import axios from "axios";

const PatientCardContent = () => {
  const { id } = useParams();
  // const id = 1;
  const navigate = useNavigate();
  const tabs = ["Prescription", "Reports", "Documents"];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [patient,setPatient] = useState(null);
  const [isLoading,setIsLoading] = useState(true);

  useEffect(() => {
    getPatient();
    navigate(`/patients/${id}/prescription`);
  }, []);

  const getPatient = async()=>{
    try {
      setIsLoading(true);
      const url = `${import.meta.env.VITE_BACKEND_URL}/users/current-patient/${id}`;
      const response = await axios.get(url);
      const res = await response.data;
      if(res.success){
        setPatient(res.data.patient);
      }
      
    } catch (error) {
      console.log("Error : ",error);
    }
    finally{
      setIsLoading(false);
    }
  }

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  };
  

  if (isLoading) {
    return <p className="text-center text-green-500 my-52">Loading</p>;
  }
  if (!patient) {
    return <p className="text-center text-red-500">Patient not found</p>;
  }

  return (
    <div className="flex bg-primary">
      <div className="w-64 bg-gray-900 text-white h-screen p-4"></div>

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate('/patients')} className="text-gray-700 hover:text-gray-900">
            <ArrowLeft size={24} />
          </button>
          <div className="relative flex items-center w-full mx-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* <SlidersHorizontal className="absolute right-10 text-gray-700 cursor-pointer mx-6" size={24} /> */}
            <Search className="absolute right-3 text-gray-700 cursor-pointer mx-3" size={24} />
          </div>
          <Link to={`/chat/${id}`} className="flex items-center bg-green-800 text-white px-4 py-2 rounded-full hover:bg-green-600">
            <MessageCircle className="mr-2" size={20} />
            Chat
          </Link>
        </div>

        <div className="flex items-start gap-6">
          <div className="w-69 h-48 flex-shrink-0 ml-7 mr-3 mt-5">
            <img
              src={`https://picsum.photos/800?random=${patient.id}`}
              alt={patient.name}
              className="w-full h-full rounded-2xl object-cover"
            />
          </div>
          <div className="flex-grow mt-4">
            <h2 className="text-2xl font-bold mb-2">{patient.name}</h2>
            <p className="text-gray-600 mb-2">Age: {calculateAge(patient.dob)}</p>
            <p className="text-gray-600 mb-2">Gender: {patient.gender}</p>
            <p className="text-gray-600 mb-2">Phone: +91 {patient.phNo}</p>
            <p className="text-gray-600 mb-2">Email: {patient.email}</p>
          </div>
        </div>

        <div className="relative flex justify-center mt-12 gap-40 text-lg font-semibold text-gray-400">
      {tabs.map((tab) => (
        <div
          key={tab}
          onClick={() => {
            setSelectedTab(tab);
            navigate(`/patients/${id}/${tab.toLowerCase()}`);
          }}
          className="relative px-4 py-2  rounded-3xl cursor-pointer transition-all hover:bg-purple-300 hover:text-white"
        >
          {selectedTab === tab && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 text-white rounded-3xl bg-secondary"
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          )}
          <span className={`relative  ${tab===selectedTab?'text-white':""} z-10`}>{tab}</span>
        </div>
      ))}
    </div>

        <div
          key={selectedTab}
          initial={{ scale: 0.8, opacity: 0  }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0}}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="mt-6 p-4"
        >
          <Routes>
            <Route path="prescription" element={<Prescription id={id} />} />
            <Route path="reports" element={<Reports />} />
            <Route path="documents" element={<Documents />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default PatientCardContent;