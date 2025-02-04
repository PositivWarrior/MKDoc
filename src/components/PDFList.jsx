import React, { useState, useEffect } from 'react';
import { listAllPDFs } from '../firebase/firebaseConfig';

const PDFList = () => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPDFs();
  }, []);

  const loadPDFs = async () => {
    try {
      const files = await listAllPDFs();
      setPdfs(files);
    } catch (error) {
      console.error('Error loading PDFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(parseInt(timestamp)).toLocaleString('no-NO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="w-full">Loading...</div>;
  }

  return (
    <div className="w-full">
      <h2 className="text-blue-600 mb-4 text-xl font-semibold">
        Tidligere verdivurderinger
      </h2>
      <div className="flex flex-col gap-4">
        {pdfs.map((pdf) => (
          <div 
            key={pdf.fullPath} 
            className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm"
          >
            <div className="flex-1">
              <h3 className="m-0 text-gray-700 text-base font-medium">
                {pdf.name.split('-')[1]}
              </h3>
              <p className="mt-1 text-gray-500 text-sm">
                {formatDate(pdf.createdAt)}
              </p>
            </div>
            <a 
              href={pdf.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
            >
              Åpne PDF
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PDFList; 