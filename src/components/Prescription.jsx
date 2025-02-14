import React, { useEffect, useState } from 'react';
import { Coffee, UtensilsCrossed, Cookie, Moon, Trash2, FileText, X, Plus, Edit, Clock } from 'lucide-react';
import PrescriptionView from "./PrescriptionView"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MedicineForm = ({id}) => {
  const [showForm, setShowForm] = useState(false);
  const [medicineName, setMedicineName] = useState('');
  const [medicineText, setMedicineText] = useState('');
  const [dosage, setDosage] = useState('');
  const [medicineType, setMedicineType] = useState('');
  const [timing, setTiming] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [mealTimings, setMealTimings] = useState({});
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([
    {
      dosage: "fwfw",
      endDate:"2025-02-22",
      mealTimings:{Breakfast:{ before: '', after: '3' },
      Dinner: { before: '', after: '2' },
      Lunch:{ before: '', after: '2' },
      Snacks:{ before: '2', after: '' },},
      name:"fwefwef",
      startDate:"2025-02-09",
      timing:['Breakfast', 'Lunch', 'Snacks', 'Dinner'],
      type:"syrup",
    }]);
    
const [showPrescription, setShowPrescription] = useState(false);
const [selectedMedicineIndex, setSelectedMedicineIndex] = useState(null);
const [formErrors, setFormErrors] = useState({});
const [texts,setTexts] = useState([]);

const validateForm = () => {
  const errors = {};
  if (!medicineName.trim()) errors.medicineName = 'Medicine name is required';
  if (!medicineText.trim()) errors.medicineText = 'Medicine text is required';
  if (!dosage.trim()) errors.dosage = 'Medicine dosage is required';
  if (!medicineType) errors.medicineType = 'Medicine type is required';
  if (!startDate) errors.startDate = 'Start date is required';
  if (!endDate) errors.endDate = 'End date is required';

  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

const handleTimingChange = (time) => {
  if (timing.includes(time)) {
    setTiming(timing.filter(t => t !== time));
    setMealTimings(prev => {
      const newTimings = { ...prev };
      delete newTimings[time];
      return newTimings;
    });
  } else {
    setTiming([...timing, time]);
    setMealTimings(prev => ({
      ...prev,
      [time]: { before: '', after: '' }
    }));
  }
};

const handleMealTimingChange = (meal, field, value) => {
  const numericValue = value.replace(/[^0-9]/g, '');

  setMealTimings(prev => ({
    ...prev,
    [meal]: {
      ...prev[meal],
      [field]: numericValue,
      [field === 'before' ? 'after' : 'before']: numericValue ? '' : prev[meal]?.[field === 'before' ? 'after' : 'before']
    }
  }));
};

const resetForm = () => {
  setMedicineName('');
  setMedicineText('');
  setDosage('');
  setMedicineType('');
  setTiming([]);
  setMealTimings({});
  setStartDate('');
  setEndDate('');
  setEditingIndex(null);
  setFormErrors({});
  setShowForm(false);
};

const handleAddMedicine = () => {
  if (!validateForm()) return;

  const medicineData = {
    name: medicineName,
    medText:medicineText,
    dosage,
    type: medicineType,
    timing,
    mealTimings,
    startDate,
    endDate
  };
  if (!medicineData.timing.length) {
    console.log("Handle error for not even one selected");
    return;
  }
  if (medicineData.timing.includes('Breakfast') && !(medicineData.mealTimings.Breakfast?.before || medicineData.mealTimings.Breakfast?.after)) {
    console.log("Handle error for not selecting after before in breakfast");
    return;
  }
  if ( medicineData.timing.includes('Lunch') && !(medicineData.mealTimings.Lunch?.before || medicineData.mealTimings.Lunch?.after)) {
    console.log("Handle error for not selecting after before in lunch");
    return;
  }
  if ( medicineData.timing.includes('Snacks') && !(medicineData.mealTimings.Snacks?.before || medicineData.mealTimings.Snacks?.after)){
    console.log("Handle error for not selecting after before in snacks");
    return;
  }
  if ( medicineData.timing.includes('Dinner') && !(medicineData.mealTimings.Dinner?.before || medicineData.mealTimings.Dinner?.after)) {
    console.log("Handle error for not selecting after before in dinner");
    return;
  }
  postMedicines(medicineData)

  if (editingIndex !== null) {
    const updatedMedicines = [...medicines];
    updatedMedicines[editingIndex] = medicineData;
    setMedicines(updatedMedicines);
  } else {
    setMedicines([...medicines, medicineData]);
  }
  resetForm();
  getTimes();
  navigate(`/patients/${id}/prescription`);
  // logic to set new medicines in backend
};

const postMedicines = async (medicineData) => {
  try {
    const requests = medicineData.timing.map((meal) => {
      const body = {
        medicineName: medicineData.name,
        medicineType: medicineData.type,
        medicineDosage: medicineData.dosage,
        timing: meal.toLowerCase(),
        medText: medicineData.medText,
        startDate: medicineData.startDate,
        endDate: medicineData.endDate,
        after: parseInt(medicineData.mealTimings[meal].after) || 0,
        before: parseInt(medicineData.mealTimings[meal].before) || 0,
      };
      return axios.post(`${import.meta.env.VITE_BACKEND_URL}/medications/set-medication/${id}`, body,{headers:{"Content-Type":"application/json"}});
    });

    const responses = await Promise.all(requests);
    console.log("All medicines posted successfully", responses);
  } catch (error) {
    console.error("Error posting medicines:", error);
  }
};

const handleEdit = (index) => {
  const medicine = medicines[index];
  setMedicineName(medicine.name);
  setMedicineText(medicine.text);
  setDosage(medicine.dosage);
  setMedicineType(medicine.type);
  setTiming(medicine.timing);
  setMealTimings(medicine.mealTimings);
  setStartDate(medicine.startDate);
  setEndDate(medicine.endDate);
  setEditingIndex(index);
  setShowForm(true);

  //logic to edit medicines details 
};

const handleDelete = (index) => {
  setMedicines(medicines.filter((_, i) => i !== index));

  // logic to delete medices 
};

const getMealIcon = (meal) => {
  switch (meal) {
    case 'Breakfast': return <Coffee className="w-5 h-5" />;
    case 'Lunch': return <UtensilsCrossed className="w-5 h-5" />;
    case 'Snacks': return <Cookie className="w-5 h-5" />;
    case 'Dinner': return <Moon className="w-5 h-5" />;
    default: return null;
  }
};

const DateInput = ({ value, onChange, label, min, error }) => (
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-medium text-gray-700">{label} *</label>
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={min}
      className={`w-full p-3 rounded-lg border-2 ${error ? 'border-red-500' : 'border-purple-200'} focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all`}
    />
    {error && <span className="text-red-500 text-sm">{error}</span>}
  </div>
);

const handleViewPrescription = (index) => {
  setSelectedMedicineIndex(index);
  setShowPrescription(true);
};

useEffect(()=>{
  getTimes();
},[])

const getTimes = async()=>{
  try {
    const url = `${import.meta.env.VITE_BACKEND_URL}/medications/get-time/${id}`;
    const response = await axios.get(url);
    const res1 = await response.data;
    if(res1.success){
      const url = `${import.meta.env.VITE_BACKEND_URL}/medications/get-medications/${id}`;
      const response = await axios.get(url);
      const res = await response.data;
      
      // console.log(formatMedicineData(res.data.medications,res1.data.time.timings));
      setTexts(formatMedicineData(res.data.medications,res1.data.time.timings));
    }
  } catch (error) {
    console.log("Error : ",error);
  }
}

const generateMealMapping = (timings) => {
  const mealMapping = {};
  Object.entries(timings).forEach(([meal, time]) => {
    const dateObj = new Date(time);
    const formattedTime = dateObj.toTimeString().slice(0, 5); // Extract HH:mm format
    mealMapping[formattedTime] = meal.charAt(0).toUpperCase() + meal.slice(1); // Capitalize meal name
  });
  return mealMapping;
};

const formatMedicineData = (medicines,mealTimings) => {
  const mealMapping = generateMealMapping(mealTimings);
  const groupedData = {};

  medicines.forEach(({ medicineName, medicineType, medicineDosage, startDate, endDate, timing, before, after }) => {
    const dateObj = new Date(timing);
    const mealTime = dateObj.getHours().toString().padStart(2, "0") + ":" + dateObj.getMinutes().toString().padStart(2, "0");
    const meal = mealMapping[mealTime] || mealTime;
    const key = `${medicineName}-${startDate}-${endDate}`;
    if (!groupedData[key]) {
      groupedData[key] = {
        medicineName,
        medicineType,
        medicineDosage,
        startDate,
        endDate,
        meals: []
      };
    }
    let timeText = "";
    if (before) timeText = `(${before} mins before)`;
    if (after) timeText = `(${after} mins after)`;

    groupedData[key].meals.push(`${meal} ${timeText}`);
  });
  const results = Object.values(groupedData).map(({ medicineName, medicineType, medicineDosage, startDate, endDate, meals }) => {
    return `Medicine Name: ${medicineName}\nType: ${medicineType}\n\nDosage: ${medicineDosage}\n\nDuration: ${startDate} to ${endDate}\n\n${meals.join("\n")}`;
  });

  return results;
};
return (
  <div className="max-w-4xl mx-auto relative min-h-screen pb-20">
    {texts.length > 0 && (
      <div className="space-y-5">
        {texts.map((medicine, index) => {
          const text = medicine.split("\n")
        return (
          <div key={index} className="mb-6 bg-white shadow-lg rounded-2xl p-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-secondary">Prescribed Medicine</h2>
              <button
                onClick={() => handleViewPrescription(index)}
                className="flex items-center space-x-2 text-secondary hover:text-blue-700"
              >
                <FileText className="w-5 h-5" />
                <span>View Prescription</span>
              </button>
            </div>
            <div className="flex items-center justify-between p-5 bg-white border shadow-sm rounded-lg">
              <div>
                <span className="font-medium">{text[0].split("Medicine Name: ")[1]}</span>
                <span className="text-sm text-gray-600 ml-2">({text[1].split(" ")[1].charAt(0).toUpperCase() + text[1].split(" ")[1].slice(1)} - {text[3].split(" ")[1]})</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="p-2 text-blue-600 hover:bg-blue-400 hover:text-white rounded-full"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="p-2 text-red-600 hover:bg-red-400 hover:text-white rounded-full"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )})}
      </div>
    )}

    <button
      onClick={() => setShowForm(true)}
      className="fixed bottom-6 right-6 w-14 h-14 bg-secondary text-white rounded-full shadow-lg hover:bg-secondary-200 flex items-center justify-center transition-colors z-20"
    >
      <Plus className="w-6 h-6" />
    </button>

    {showForm && (
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center p-4 z-10 ">
        <div className="bg-white rounded-xl w-full max-w-2xl animate-slide-up ml-64 max-h-screen overflow-y-auto">
          <div className="px-6 py-2 space-y-4">
            <div className="flex justify-between items-center ">
              <div className="text-2xl font-bold text-secondary">Add Medicine Details</div>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <label className="text-sm font-medium text-gray-700">Medicine Name *</label>
                <input
                  type="text"
                  placeholder="Medicine Name"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  className={`w-full p-3 rounded-lg border-2 ${formErrors.medicineName ? 'border-red-500' : 'border-secondary'} focus:border-purple-600 focus:ring-2 focus:ring-purple-600 transition-all`}
                />
                {formErrors.medicineName && (
                  <span className="text-red-500 text-sm">{formErrors.medicineName}</span>
                )}
                <Plus className="absolute right-3 top-9 text-secondary w-5 h-5" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Dosage"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full p-2 rounded-lg border-2 border-secondary focus:border-purple-600 focus:ring-2 focus:ring-purple-600 transition-all"
                  />
                  {formErrors.dosage && (
                  <span className="text-red-500 text-sm">{formErrors.dosage}</span>
                )}
                  <Edit className="absolute right-3 top-3 text-secondary w-5 h-5" />
                </div>

                <div>
                  <select
                    value={medicineType}
                    onChange={(e) => setMedicineType(e.target.value)}
                    className={`w-full p-2 rounded-lg border-2 ${formErrors.medicineType ? 'border-red-500' : 'border-secondary'} focus:border-purple-600 focus:ring-2 focus:ring-purple-600 transition-all`}
                  >
                    <option value="">Select Type *</option>
                    <option value="pills">Pills</option>
                    <option value="syrup">Syrup</option>
                    <option value="other">Other</option>
                  </select>
                  {formErrors.medicineType && (
                    <span className="text-red-500 text-sm">{formErrors.medicineType}</span>
                  )}
                </div>
              </div>
              
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DateInput
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                error={formErrors.startDate}
              />
              <DateInput
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                min={startDate}
                error={formErrors.endDate}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map((meal) => (
                <div key={meal} className="bg-purple-50 px-4 py-3 rounded-lg">
                  <label className="flex items-center space-x-3 mb-2">
                    <input
                      type="checkbox"
                      checked={timing.includes(meal)}
                      onChange={() => handleTimingChange(meal)}
                      className="w-5 h-5 text-purple-700 bg-white border-2 rounded peer-checked:bg-purple-600"
                    />
                    <span className="flex items-center space-x-2">
                      {getMealIcon(meal)}
                      <span className="font-medium">{meal}</span>
                    </span>
                  </label>

                  {timing.includes(meal) && (
                    <div className="ml-8 space-y-2 mt-1">
                      <input
                        type="text"
                        placeholder="Minutes before"
                        value={mealTimings[meal]?.before || ''}
                        onChange={(e) => handleMealTimingChange(meal, 'before', e.target.value)}
                        disabled={mealTimings[meal]?.after}
                        className="w-full p-2 rounded border border-purple-200 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <input
                        type="text"
                        placeholder="Minutes after"
                        value={mealTimings[meal]?.after || ''}
                        onChange={(e) => handleMealTimingChange(meal, 'after', e.target.value)}
                        disabled={mealTimings[meal]?.before}
                        className="w-full p-2 rounded border border-purple-200 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="relative">
                <label className="text-sm font-medium text-gray-700">Medicine Text *</label>
                <input
                  type="text"
                  placeholder="Medicine Text"
                  value={medicineText}
                  onChange={(e) => setMedicineText(e.target.value)}
                  className={`w-full p-3 rounded-lg border-2 ${formErrors.medicineText ? 'border-red-500' : 'border-secondary'} focus:border-purple-600 focus:ring-2 focus:ring-purple-600 transition-all`}
                />
                {formErrors.medicineText && (
                  <span className="text-red-500 text-sm">{formErrors.medicineText}</span>
                )}
                <Plus className="absolute right-3 top-9 text-secondary w-5 h-5" />
              </div>

            <button
              onClick={handleAddMedicine}
              className="w-full bg-secondary hover:bg-secondary text-white py-2 rounded-lg font-medium transition-all transform hover:scale-102 flex items-center justify-center space-x-2"
            >
              <Clock className="w-5 h-5" />
              <span>{editingIndex !== null ? "Update Medicine" : "Add Medicine"}</span>
            </button>
          </div>
        </div>
      </div>
    )}

    {showPrescription && selectedMedicineIndex !== null && (
      <PrescriptionView
        setShowPrescription={setShowPrescription}
        medicines={[medicines[selectedMedicineIndex]]}
        med={texts[selectedMedicineIndex]}
      />
    )}
  </div>
);
};

export default MedicineForm;