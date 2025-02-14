import React, { useState } from "react";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PatientCard from "./PatientCard";
import AddPatientModal from "./loaders/AddPatientModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useSWR from 'swr'
import { useAuth } from "../hooks/useAuth";

const fetcher = (...args) => fetch(...args).then(res => res.json())

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {user} = useAuth();
  const { data, error, isLoading } = useSWR(`${import.meta.env.VITE_BACKEND_URL}/users/get-patients/${user.id}`, fetcher)
  // console.log(data?.data?.patients);

  if(isLoading) return null
  
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPatients = data?.data?.patients?.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPatient = () => {
    setIsModalOpen(true);
    console.log("Add New Patient button clicked");
    // Logic for adding a new patient (modal or form navigation)
  };

  const handlePatientCardClick = (patient) => {
    navigate(`/patients/${patient.id}`);
  };

  return (
    <div className="p-6 ml-64">
      <ToastContainer position="top-right"/>
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex items-center w-full mr-4">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-20 py-2 border border-gray-700 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SlidersHorizontal className="absolute right-10 text-gray-700 cursor-pointer mx-6" size={24} />
          <Search className="absolute right-3 text-gray-700 cursor-pointer mx-3" size={24} />
        </div>

        <button
          onClick={handleAddPatient}
          className="flex items-center bg-green-800 text-white px-4 py-2.5 rounded-full hover:bg-green-600 whitespace-nowrap"
        >
          <Plus className="mr-2" size={20} />
          Add New Patient
        </button>
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6 auto-rows-fr">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => handlePatientCardClick(patient)}
              className="transform hover:-translate-y-1 transition-all duration-200"
            >
              <PatientCard patient={patient} />
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 || error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No patients found matching your search.</p>
          </div>
        )}
      </div>

      <AddPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        toast={toast}
      />
    </div>
  );
};

export default Patients;
