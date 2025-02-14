import React from 'react';
import { Phone } from 'lucide-react';

const PatientCard = ({ patient }) => {
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
  
  return (
    <div className="bg-purple-900/30 rounded-xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl">
      {/* Avatar Section with darker gradient */}
      <div className="bg-purple-900/30 px-4 pt-4 pb-2 flex justify-center">
        <div className="w-20 h-20 rounded-full shadow-md overflow-hidden">
          <img
            src={`https://picsum.photos/800?random=${patient.id}`}
            alt={patient.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Patient Info Section - More Compact */}
      <div className="bg-purple-900/30 px-3 py-2">
        <h3 className="text-base font-semibold text-white mb-1 text-center truncate">
          {patient.name}
        </h3>
        
        <div className="space-y-1.5">
          {/* Age & Gender */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="px-2 py-0.5 bg-purple-600 text-white rounded-full text-xs">
              {patient.gender}
            </span>
            <span className="px-2 py-0.5 bg-purple-600 text-white rounded-full text-xs">
              {calculateAge(patient.dob)} yrs
            </span>
          </div>

          {/* Phone Number */}
          <div className="flex items-center justify-center text-sm pb-2">
            <Phone size={12} className="text-white mr-1" />
            <span className="text-white text-sm">{patient.phNo}</span>
          </div>
        </div>
      </div>

      {/* Action Footer - More Compact */}
      <div className="border-t border-purple-800 p-2 bg-purple-800/50">
        <button className="w-full text-xs text-white hover:text-white font-medium transition-colors duration-200">
          View Details →
        </button>
      </div>
    </div>
  );
};

export default PatientCard;