import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

function ResponsePage() {
  const location = useLocation();
  const { responseData: initialResponseData } = location.state || {};
  const [responseData, setResponseData] = useState(initialResponseData);

  const getCategoryColor = (category) => {
    const colorMap = {
      'Red': 'text-red-700 bg-red-50 border-red-200',
      'Green': 'text-green-700 bg-green-50 border-green-200',
      'Yellow': 'text-yellow-700 bg-yellow-50 border-yellow-200'
    };
    return colorMap[category] || 'text-gray-700 bg-gray-50 border-gray-200';
  };

  useEffect(() => {
    if (!initialResponseData) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
      fetch(`${backendUrl}/api/upload`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch response data');
          }
          return res.json();
        })
        .then((data) => setResponseData(data))
        .catch((error) => console.error('Error fetching response data:', error));
    }
  }, [initialResponseData]);

  if (!responseData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading analysis results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Analysis Results</h1>
          <Link
            to="/"
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
          >
            ← New Analysis
          </Link>
        </div>
        
        {/* File Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Analyzed Files
          </h2>
          <ul className="divide-y divide-gray-100">
            {responseData.files?.map((file, index) => (
              <li key={index} className="py-3 flex items-center gap-3 text-gray-600">
                <svg className="w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="flex-1">{file.filename}</span>
                <span className="text-sm text-gray-400">({(file.size / 1024).toFixed(2)} KB)</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Life Threatening Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Medical Status
          </h2>
          <div className={`rounded-lg p-6 ${
            responseData.isLifeThreatening 
              ? 'bg-red-50 border-2 border-red-200' 
              : 'bg-green-50 border-2 border-green-200'
          }`}>
            <div className={`text-lg font-bold flex items-center gap-2 ${
              responseData.isLifeThreatening 
                ? 'text-red-700' 
                : 'text-green-700'
            }`}>
              {responseData.isLifeThreatening ? (
                <>
                  <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  LIFE-THREATENING CONDITION DETECTED
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  No Life-Threatening Conditions Detected
                </>
              )}
            </div>
            <p className={`mt-2 ${
              responseData.isLifeThreatening 
                ? 'text-red-600' 
                : 'text-green-600'
            }`}>
              {responseData.isLifeThreatening 
                ? 'Immediate medical attention may be required.' 
                : 'Patient condition appears stable.'}
            </p>
          </div>
        </div>

        {/* Analysis Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Detailed Analysis
          </h2>
          <div className="grid gap-4">
            {responseData.keyValuePairs && Object.entries(responseData.keyValuePairs).map(([category, items]) => (
              <div 
                key={category} 
                className={`p-4 rounded-lg border ${getCategoryColor(category)} transition-all duration-200 hover:shadow-md`}
              >
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    category === 'Red' ? 'bg-red-500' :
                    category === 'Green' ? 'bg-green-500' :
                    category === 'Yellow' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></span>
                  {category}
                </h3>
                <ul className="space-y-2 pl-4">
                  {items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <svg className="w-4 h-4 mt-1 flex-shrink-0 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResponsePage;