import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';
import Logoloader from './loaders/Logoloader';
import Card from './Card';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';

const TwatchAI = () => {
    const [dragActive, setDragActive] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [showModel, setShowModel] = useState(false);
    const [diseaseDetails, setDiseaseDetails] = useState(null);

    // Handle image files
    const handleFiles = (files) => {
        const validFiles = files.filter(file =>
            (file.type === 'image/jpeg' || file.type === 'image/jpg') && file.size <= 5 * 1024 * 1024
        );

        if (validFiles.length === 0) {
            toast.error('Please upload only JPG/JPEG files under 5MB');
            return;
        }
        if (validFiles.length > 1) {
            toast.error('Please upload only 1 image');
            return;
        }

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImages([{ url: e.target.result, file }]);
            };
            reader.readAsDataURL(file);
        });

        toast.success('Image uploaded successfully!');
    };

    // Upload image and get prediction from FastAPI
    const handleImageUpload = async () => {
        if (images.length === 0) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("file", images[0].file);

        try {
            const response = await axios.post("http://localhost:8000/predict", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setDiseaseDetails(response.data);
            setShowModel(true);
        } catch (error) {
            toast.error("Error uploading image. Please try again.");
            console.error("Upload Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-blue-50 p-4 flex flex-col items-center overflow-y-auto ml-64">
            <ToastContainer position="top-right" />
            <div className="min-h-screen max-w-2xl mx-auto text-center">
                <h1 className="text-4xl font-extrabold mb-2 text-secondary text-center">Twatch.A.I</h1>
                <h2 className="text-3xl font-bold mb-8 text-black text-center">AI Powered Skin Disease Detection</h2>

                <img src="/assets/Illustration.svg" alt="Twatch Logo" className="w-150 h-80 mb-2 mx-auto" />

                {loading && <Logoloader />}

                {!loading && !showModel && (
                    <div className=''>
                        <div className={`border-2 bg-white border-dashed rounded-3xl p-6 mb-4 transition-colors 
                         ${dragActive || clicked ? 'border-secondary bg-purple-50' : 'border-gray-300'}`}
                            onClick={() => fileInputRef.current.click()}
                        >
                            {images.length > 0 ? (
                                <div className="relative group">
                                    <img src={images[0].url} alt="Uploaded" className="w-full h-32 object-cover rounded-lg" />
                                    <button onClick={() => setImages([])} className="absolute top-2 right-2 bg-red-700 text-white p-2 rounded-full">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <p className="text-gray-500">Click or drag & drop to upload an image</p>
                                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg" onChange={(e) => handleFiles([...e.target.files])} className='hidden' />
                                </div>
                            )}
                        </div>
                        <button className="bg-secondary text-white px-14 py-2 rounded-full text-lg font-medium transition-colors disabled:opacity-50" disabled={images.length === 0} onClick={handleImageUpload}>
                            DETECT
                        </button>
                    </div>
                )}

                {showModel && diseaseDetails && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mt-6 text-left">
                        <h3 className="text-2xl font-bold">{diseaseDetails.prediction}</h3>
                        <p className="text-gray-700 mt-2">Disease Category: {diseaseDetails["Disease Category"]}</p>
                        {diseaseDetails.highlighted_image && (
                            <div className="mt-4">
                                <h4 className="font-semibold">Highlighted Image</h4>
                                <img src={`data:image/jpeg;base64,${diseaseDetails.highlighted_image}`} alt="Highlighted" className="w-full h-64 object-cover rounded-lg mt-2" />
                            </div>
                        )}
                        {/* <p className="text-gray-700 mt-2">
                            Accuracy: {Object.values(diseaseDetails?.top_probabilities || {})[0]
                                ? (parseFloat(Object.values(diseaseDetails.top_probabilities)[0]) * 100).toFixed(2)
                                : "N/A"}%
                        </p> */}

                        <p className="text-gray-700">Affected Area Percentage: {parseFloat(diseaseDetails["affected_area_percentage"]).toFixed(2)}%</p>
                        <p className="text-gray-700">Severity Level: {diseaseDetails["Severity Level"]}</p>
                        <div className="mt-4">
                            <h4 className="font-semibold">Symptoms Overview</h4>
                            <ul className="list-disc pl-6">
                                {diseaseDetails["Symptoms Overview"]?.["Common Symptoms"].map((symptom, index) => (
                                    <li key={index}>{symptom}</li>
                                ))}
                            </ul>
                            <p className="mt-2">{diseaseDetails["Symptoms Overview"]?.["Progression and Stages"]}</p>
                        </div>
                        <div className="mt-4">
                            <h4 className="font-semibold">Possible Causes & Risk Factors</h4>
                            <ul className="list-disc pl-6">
                                {diseaseDetails["Possible Causes & Risk Factors"]?.["Environmental Factors"].map((factor, index) => (
                                    <li key={index}>{factor}</li>
                                ))}
                            </ul>
                            <p className="mt-2">Genetic Influence: {diseaseDetails["Possible Causes & Risk Factors"]?.["Genetic Influence"]}</p>
                            <ul className="list-disc pl-6 mt-2">
                                {diseaseDetails["Possible Causes & Risk Factors"]?.["Lifestyle-related Risks"].map((risk, index) => (
                                    <li key={index}>{risk}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-4">
                            <h4 className="font-semibold">Suggested Treatment & Remedies</h4>
                            <ul className="list-disc pl-6">
                                {diseaseDetails["Suggested Treatment & Remedies"]?.["Prescription Medications"].map((med, index) => (
                                    <li key={index}>{med}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-4">
                            <h4 className="font-semibold">When to See a Doctor?</h4>
                            <ul className="list-disc pl-6">
                                {diseaseDetails["When to See a Doctor?"]?.["Indications for Urgent Medical Consultation"].map((indication, index) => (
                                    <li key={index}>{indication}</li>
                                ))}
                            </ul>
                            <p className="mt-2">Recommended Specialist: {diseaseDetails["When to See a Doctor?"]?.["Recommended Specialist"]}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TwatchAI;
