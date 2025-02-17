import { Coffee, UtensilsCrossed, Cookie, Moon, X } from "lucide-react";

const getMealIconn = (meal) => {
  switch (meal) {
    case "Breakfast":
      return <Coffee className="w-5 h-5" />;
    case "Lunch":
      return <UtensilsCrossed className="w-5 h-5" />;
    case "Snacks":
      return <Cookie className="w-5 h-5" />;
    case "Dinner":
      return <Moon className="w-5 h-5" />;
    default:
      return null;
  }
};
const getMealIcon = (index) => {
  switch (index) {
    case 7:
      return <Coffee className="w-5 h-5" />;
    case 8:
      return <UtensilsCrossed className="w-5 h-5" />;
    case 9:
      return <Cookie className="w-5 h-5" />;
    case 10:
      return <Moon className="w-5 h-5" />;
    default:
      return null;
  }
};

const PrescriptionView = ({ setShowPrescription, medicines, med }) => {
  console.log(med.split("\n"));
  const text = med.split("\n");
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto ml-64">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-secondary">
            Prescription Details
          </h2>
          <button
            onClick={() => setShowPrescription(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Prescription details rendering logic */}
        {medicines.map((medicine, index) => (
          <div key={index} className="border-b border-gray-200 py-4">
            <h3 className="font-semibold text-lg mb-2">
              {text[0]}
            </h3>
            <p className="text-gray-600 mb-2">{text[1].replace(/\b\w/g, (char) => char.toUpperCase())}</p>
            <p className="text-gray-600 mb-2">{text[3]}</p>
            <p className="text-gray-600 mb-2">
              {text[5]}
            </p>
            <div className="space-y-2">
              {
                text.map((element,index) => {
                  if (index<7) return;
                  return (
                    <div className="flex items-center space-x-2" key={index}>{getMealIcon(index)}  {element.split(" ")[0]} <span>{" "}</span> <span className="text-sm text-gray-500">{element.split(`${element.split(" ")[0]}`)[1]}</span></div>
                  )
                })
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrescriptionView;
