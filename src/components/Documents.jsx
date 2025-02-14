import React, { useState, useEffect } from 'react';
import { Plus, Folder, X } from 'lucide-react';

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
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl text-black">
      <h2 className="text-2xl font-bold text-center mb-6">Medical Documents</h2>
      <div className="space-y-4">
        {documents.map((doc, index) => (
          <div key={index} className="flex justify-between items-center p-4 border rounded-lg shadow-sm hover:shadow-md">
            <div>
              <p className="text-sm text-gray-500">{doc.dateTime}</p>
              <p className="text-lg font-semibold text-purple-700">{doc.treatment}</p>
            </div>
            <button
              className={`p-2 rounded-lg ${doc.fileUrl ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-300 cursor-not-allowed'}`}
              onClick={() => handleViewFile(doc.fileUrl)}
              aria-label="View document"
            >
              <Folder className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      {showUploadForm && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">Upload Document</h3>
              <button onClick={() => setShowUploadForm(false)} className="text-gray-600 hover:text-black">
                <X />
              </button>
            </div>
            <form onSubmit={handleAddDocument} className="space-y-4">
              <input
                type="text"
                placeholder="Treatment"
                value={newTreatment}
                onChange={(e) => setNewTreatment(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-600"
                required
              />
              <div className="flex items-center space-x-3">
                <label className="bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-700">
                  Choose File
                  <input type="file" accept=".pdf,.docx" onChange={handleFileChange} className="hidden" required />
                </label>
                <span className="text-sm text-gray-500">{fileName}</span>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Upload</button>
                <button type="button" onClick={() => setShowUploadForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowUploadForm(true)}
        className="fixed bottom-10 right-10 bg-purple-600 text-white rounded-full h-12 w-12 flex items-center justify-center hover:bg-purple-700"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Documents;
