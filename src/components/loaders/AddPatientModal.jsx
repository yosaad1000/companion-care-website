import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const AddPatientModal = ({ isOpen, onClose, toast }) => {
  const [pairingCode, setPairingCode] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = import.meta.env.VITE_BACKEND_URL + "/users/pair-patient";
      const response = await axios.post(
        url,
        { code: pairingCode, doctorId: user.id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = await response.data;
      console.log(res.data);
      toast.success("Patient Paired Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Invalid Code");
      // console.log("Error : ",error?.message || error);
    } finally {
      onClose();
      setPairingCode("");
    }
  };

  // Handle click outside modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50 "
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 relative animate-fadeIn ml-64 p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-600 hover:text-gray-800 transition-colors"
          aria-label="Close"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
          Enter Patient Pairing Code
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            {/* Lock Icon */}
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>

            {/* Input Field */}
            <input
              type="text"
              value={pairingCode || ""}
              onChange={(e) => setPairingCode(e.target.value)}
              placeholder="Enter pairing code"
              className="w-full pl-10 pr-4 py-2 border bg-gray-50 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={pairingCode.length !== 6}
            className={`w-full py-2 rounded-lg font-medium transition duration-200 shadow-md 
      ${
        pairingCode.length === 6
          ? "bg-purple-600 hover:bg-purple-700 text-white"
          : "bg-gray-400 cursor-not-allowed"
      }`}
          >
            Add Patient
          </button>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddPatientModal;
