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

const ageGroups = [
  { id: 1, label: '0-18', value: [0, 18] },
  { id: 2, label: '19-40', value: [19, 40] },
  { id: 3, label: '41-60', value: [41, 60] },
  { id: 4, label: '60+', value: [60, 150] }
];

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({
    genders: [],
    ageGroups: []
  });

  const handleGenderChange = (gender) => {
    setSelectedGenders(prev => 
      prev.includes(gender)
        ? prev.filter(g => g !== gender)
        : [...prev, gender]
    );
  };

  const handleAgeGroupChange = (ageGroup) => {
    setSelectedAgeGroups(prev => {
      const newGroups = prev.includes(ageGroup)
        ? prev.filter(a => a !== ageGroup)
        : [...prev, ageGroup];
      return newGroups;
    });
  };

  const handleApplyFilter = () => {
    setAppliedFilters({
      genders: selectedGenders,
      ageGroups: selectedAgeGroups
    });
  };

  const { user } = useAuth();
  const { data, error, isLoading } = useSWR(`${import.meta.env.VITE_BACKEND_URL}/users/get-patients/${user.id}`, fetcher)

  if (isLoading) return null;

  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

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

  const isInAgeGroup = (age) => {
    
    if (appliedFilters.ageGroups.length === 0) {
      return true;
    }
    
    return appliedFilters.ageGroups.some(groupId => {
      const group = ageGroups.find(g => g.id === groupId);
      
      if (!group) {
        return false;
      }
      
      if (group.id === 4) {
        const result = age >= 60;
        return result;
      }
      
      const result = age >= group.value[0] && age <= group.value[1];
      return result;
    });
  };

  const filteredPatients = data?.data?.patients
    ? data.data.patients
        .filter((patient) => {
          
          // Search filter
          const searchMatch = patient.name.toLowerCase().includes(searchQuery.toLowerCase());
          
          // Gender filter
          const genderMatch = appliedFilters.genders.length === 0 || 
                            appliedFilters.genders.includes(patient.gender);
          
          // Age filter
          const age = calculateAge(patient.dob);
          const ageMatch = isInAgeGroup(age);
  
          return searchMatch && genderMatch && ageMatch;
        })
    : [];

  const handleAddPatient = () => {
    setIsModalOpen(true);
  };

  const handlePatientCardClick = (patient) => {
    navigate(`/patients/${patient.id}`);
  };

  return (
    <div className="p-6 ml-64">
      <ToastContainer position="top-right" />
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <div className="relative flex items-center w-full mr-4">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-20 py-2 border border-gray-700 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <SlidersHorizontal 
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-10 text-gray-700 cursor-pointer mx-6" 
              size={24} 
            />
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

        {showFilters && (
           <div className="p-4 max-w-4xl mx-auto">
           <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
             <div className="p-4">
               <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                 <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                   {/* Gender Filter */}
                   <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                     <span className="text-sm font-medium text-gray-700">Gender:</span>
                     <div className="flex gap-4">
                       {['Male', 'Female'].map((gender) => (
                         <label key={gender} className="flex items-center gap-2">
                           <input
                             type="checkbox"
                             checked={selectedGenders.includes(gender)}
                             onChange={() => handleGenderChange(gender)}
                             className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                           />
                           <span className="text-sm text-gray-600">{gender}</span>
                         </label>
                       ))}
                     </div>
                   </div>
     
                   {/* Vertical Divider - visible only on larger screens */}
                   <div className="hidden lg:block h-8 w-px bg-gray-200" />
     
                   {/* Age Group Filter */}
                   <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                     <span className="text-sm font-medium text-gray-700">Age Group:</span>
                     <div className="flex flex-wrap gap-4">
                       {ageGroups.map((age) => (
                         <label key={age.id} className="flex items-center gap-2">
                           <input
                             type="checkbox"
                             checked={selectedAgeGroups.includes(age.id)}
                             onChange={() => handleAgeGroupChange(age.id)}
                             className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                           />
                           <span className="text-sm text-gray-600">{age.label}</span>
                         </label>
                       ))}
                     </div>
                   </div>
                 </div>
     
                 {/* Apply Button */}
                 <button
                   onClick={handleApplyFilter}
                   className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-full cursor-pointer hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-green-500"
                 >
                   Apply Filters
                 </button>
               </div>
             </div>
           </div>
         </div>
        )}
      </div>
      
      <div className="relative mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6 auto-rows-fr">
          {filteredPatients.length === 0 ? (
            <div className="col-span-full text-center">
              <p className="text-lg font-semibold">No patients added</p>
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => handlePatientCardClick(patient)}
                className="transform hover:-translate-y-1 transition-all duration-200"
              >
                <PatientCard patient={patient} />
              </div>
            ))
          )}
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