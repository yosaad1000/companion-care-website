import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';
import Logoloader from './loaders/Logoloader';
import Card from './Card';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import generateMedicalReport from '../report/generateMedicalReport ';

const TwatchAI = () => {
    const [dragActive, setDragActive] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);
    const [detections, setDetections] = useState([
        { dateTime: "01/01/2025 12:30", patient: "Ujjwal Gupta" },
        { dateTime: "07/01/2025 1:30", patient: "Mayank Desai" },
        { dateTime: "15/01/2025 13:30", patient: "Sagar Shirgaonkar" },
        { dateTime: "17/01/2025 15:30", patient: "Saksham Thakur" },
        { dateTime: "21/01/2025 20:30", patient: "Ved Shetye" },

    ]);
    const [loading, setLoading] = useState(false);
    const [showModel, setShowModel] = useState(false);
    const [diseaseDetails, setDiseaseDetails] = useState({
        title: "Psoriasis",
        description: "Psoriasis Is A Chronic (Long-Lasting) Disease In Which The Immune System Becomes Overactive, Causing Skin Cells To Multiply Too Quickly. Patches Of Skin Become Scaly And Inflamed, Most Often On The Scalp, Elbows, Or Knees, But Other Parts Of The Body Can Be Affected As Well.",
        imageUrl: "https://picsum.photos/800",
        tags: ["Auto Immune", "Carcinogenic"],
    })

    const handleDownloadReport = () => {
        generateMedicalReport({
          patientName: "John Doe",
          patientId: "123456",
          dob: "01/15/1980",
          gender: "Male",
          doctorName: "Dr. Emily Carter",
          prediction: "Melanoma",
          confidence: 0.9091,
          category: "Carcinogenic",
          severity: "Severe",
          symptoms: [
            "New or changing moles",
            "Irregular borders, multiple colors, diameter over 6mm",
            "Itching, bleeding, or crusting of a mole",
          ],
          causes: [
            { type: "Environmental", details: "Excessive UV radiation exposure" },
            { type: "Genetic", details: "Family history of melanoma increases risk" },
            { type: "Lifestyle", details: "Use of tanning beds, history of sunburns" },
          ],
          treatments: [
            { type: "Medical", details: "Surgical excision, Immunotherapy" },
            { type: "Home Care", details: "Regular self-examinations, sunscreen" },
          ],
          base64Image: "cVxWFcZEVFW73S6KQhmjlDLGRDyO4qSWEmMCCBCCo6xxnPPpzhQhIJgqpVpZmj0NY7yxvmmMnk6nlJKYR9romPNWltVSzmYFQhhhzBjPi5xQFjAmpTTWWes8AMYYYfAe",
        });
      };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    //  console.log(images);
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (images.length >= 1) return;
        const files = [...e.dataTransfer.files];
        handleFiles(files);
    };

    const handleFiles = (files) => {
        const validFiles = files.filter(file =>
            (file.type === 'image/jpeg' || file.type === 'image/jpg') && file.size <= 5 * 1024 * 1024
        );

        if (validFiles.length === 0) {
            toast.error('Please upload only JPG/JPEG files under 5MB');
            return;
        }
        if (validFiles.length >=2) {
            toast.error('Please upload only 1 Image');
            return;
        }

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImages(prev => [...prev, {
                    url: e.target.result,
                    name: file.name
                }]);
            };
            reader.readAsDataURL(file);
        });

        toast.success('Image uploaded successfully!')
    };

    const handleFileInput = (e) => {
        const files = [...e.target.files];
        handleFiles(files);
        e.target.value = null;
    };

    const removeImage = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    const handleClick = () => {
        setClicked(prev => !prev);
    };

    const handleImageUpload = async() => {
        // backend request logic


        
          
        setLoading(true);

        setTimeout(()=>{
            setShowModel(true);
            setLoading(false);
        },2000);


         //set diseaseDetails
    };

    const getDetections = () => {
        /// logic to get previous detections 
    }

    const handleDownload = (e) => {
        // download logic 
        console.log("downloading the data of ", e);

       
    }

    return (
        <div className="min-h-screen bg-blue-50 p-4 flex flex-col items-center overflow-y-auto ml-64">
             <ToastContainer position="top-right" />
            <div className="min-h-screen max-w-2xl mx-auto text-center">
                <h1 className="text-4xl font-extrabold mb-2 text-secondary">Twatch.A.I</h1>
                <h2 className="text-3xl font-bold mb-8 text-black">
                    AI Powered Skin Disease Detection
                </h2>

                {loading ? (<Logoloader />) : <></>}

                {!loading && !showModel && (
                    <div className=''>
                        <div className="relative flex justify-center mb-2">
                            <img src="/assets/Illustration.svg" alt="Twatch Logo" className="w-150 h-80 mb-2 mx-auto" />
                        </div>

                        <div className={`border-2 bg-white border-dashed rounded-3xl p-6 mb-4 transition-colors 
                         ${dragActive || clicked ? 'border-secondary bg-purple-50' : 'border-gray-300'}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={handleClick}
                        >
                            {images.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                                    {images.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img src={image.url} alt={`Upload ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                                            <div className="absolute inset-0 bg-gray-600 bg-opacity-50 opacity-0 group-hover:opacity-70 transition-opacity rounded-lg flex items-center justify-center">
                                                <button onClick={() => removeImage(index)} className="p-2 bg-red-700 rounded-full hover:bg-red-600 transition-colors">
                                                    <X className="w-5 h-5 text-white" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {images.length <1 && (
                                        <label htmlFor="file-upload" className='text-secondary hover:cursor-pointer'>
                                            Upload
                                            <input id="file-upload" ref={fileInputRef} type="file" multiple accept="image/jpeg,image/jpg" onChange={handleFileInput} className='hidden' />
                                        </label>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <img src="/assets/Images.svg" alt="Twatch Logo" className="w-10 h-10 mb-2 mx-auto cursor-pointer" onClick={() => document.getElementById('file-upload').click()} />
                                    <div className="flex items-center space-x-1">
                                        <label htmlFor="file-upload" className="text-secondary font-medium cursor-pointer">Click to upload</label>
                                        <p className="text-gray-500">or drag and drop</p>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-1">JPG, JPEG less than 5MB</p>
                                    <input id="file-upload" type="file" className="hidden" accept=".jpg, .jpeg" onChange={handleFileInput} />
                                </div>
                            )}
                        </div>

                        <button className={`bg-secondary text-white px-14 py-2 rounded-full text-lg font-medium 
                         ${images.length > 0 ? 'hover:bg-purple-600' : 'opacity-50 cursor-not-allowed'}
                         transition-colors`}
                            disabled={images.length === 0}
                            onClick={handleImageUpload}
                        >
                            DETECT
                        </button>
                    </div>
                )}

                {!loading && showModel && (
                    <Card title={diseaseDetails.title} 
                          description={diseaseDetails.description} 
                          imageUrl={diseaseDetails.imageUrl}
                          tags={diseaseDetails.tags}
                          setShowModel={setShowModel} 
                          handleDownloadReport={handleDownloadReport}
                    />
                )}


            </div>


            {/* Previous Detection  */}
            <div className="w-full max-w-3xl  mt-8 overflow-y-auto border border-gray-300 rounded-3xl bg-primary-400 p-4 shadow-md">
                {detections.length === 0 ? (
                    <div className="w-full max-w-3xl mx-auto bg-primary-400 rounded-lg  p-6 ">
                        <h1 className="text-2xl font-bold text-purple-8 00 mb-6">Past Detections</h1>
                        <div className="text-center py-12">
                            <p className="text-lg text-black">No detections found</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-3xl mx-auto bg-primary-400 rounded-lg  p-6">
                        <div className="flex justify-center items-center">
                            <h1 className="text-4xl font-bold text-purple-600 mb-6">Past Detections</h1>
                        </div>
                        <div className="overflow-hidden rounded-lg">
                            <table className="w-full">
                                <thead className="bg-primary-400 ">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-purple-900">
                                            Date & Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-purple-900">
                                            Patient
                                        </th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-purple-900">
                                            Download
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-purple-100">
                                    {detections.map((detection, index) => (
                                        <tr
                                            key={`${detection.patient}-${detection.dateTime}-${index}`}
                                            className="hover:bg-primary transition-colors"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {detection.dateTime}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {detection.patient}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    className="mx-auto flex items-center justify-center p-2 rounded-full   transition-colors"
                                                    onClick={() => handleDownload(detection.patient)}
                                                >
                                                    <svg
                                                        className="w-5 h-5 text-purple-600 hover:text-dark"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                        <polyline points="7 10 12 15 17 10" />
                                                        <line x1="12" y1="15" x2="12" y2="3" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TwatchAI;
