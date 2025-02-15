import React, { useState, useEffect } from 'react';

const Documents = () => {
  const [documents, setDocuments] = useState([
    { dateTime: '01/01/2025 12:30', treatment: 'MRI', fileUrl: null },
    { dateTime: '07/01/2025 1:30', treatment: 'CGD', fileUrl: null },
    { dateTime: '15/01/2025 13:30', treatment: 'VJB', fileUrl: null },
    { dateTime: '17/01/2025 15:30', treatment: 'TISSUE', fileUrl: null },
    { dateTime: '21/01/2025 20:30', treatment: 'BONE', fileUrl: null },
    { dateTime: '27/01/2025 23:30', treatment: 'FULL BODY', fileUrl: null }
  ]);

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newTreatment, setNewTreatment] = useState('');
  const [newFile, setNewFile] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');

  const handleAddDocument = (e) => {
    e.preventDefault();
    if (!newTreatment || !newFile) return;

    const now = new Date();
    const formattedDate = now.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(',', '');

    const fileUrl = URL.createObjectURL(newFile);
    setDocuments([...documents, { dateTime: formattedDate, treatment: newTreatment, fileUrl }]);

    setShowUploadForm(false);
    setNewTreatment('');
    setNewFile(null);
    setFileName('No file chosen');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFile(file);
      setFileName(file.name);
    } else {
      setNewFile(null);
      setFileName('No file chosen');
    }
  };

  const handleViewFile = (fileUrl) => {
    if (!fileUrl) return alert('No file available to view');
    window.open(fileUrl, '_blank');
  };

  useEffect(() => {
    return () => {
      documents.forEach((doc) => doc.fileUrl && URL.revokeObjectURL(doc.fileUrl));
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-primary rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Medical Documents</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {documents.length} Documents
        </span>
      </div>

      <div className="space-y-4">
        {documents.map((doc, index) => (
          <div 
            key={index} 
            className="flex justify-between items-center p-5 bg-white border border-gray-300 rounded-xl hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg border border-gray-300">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{doc.treatment}</h3>
                <div className="flex items-center space-x-2 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{doc.dateTime}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleViewFile(doc.fileUrl)}
              className={`p-3 rounded-lg transition-colors duration-200 ${
                doc.fileUrl 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-gray-200 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Upload Document</h3>
              <button 
                onClick={() => setShowUploadForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddDocument} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Treatment Name"
                  value={newTreatment}
                  onChange={(e) => setNewTreatment(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex-shrink-0 bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-700 transition-colors">
                  Choose File
                  <input 
                    type="file" 
                    accept=".pdf,.docx" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    required 
                  />
                </label>
                <span className="text-sm text-gray-500 truncate">{fileName}</span>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowUploadForm(true)}
        className="fixed bottom-8 right-8 bg-purple-600 text-white rounded-full p-4 shadow-lg hover:bg-purple-700 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default Documents;