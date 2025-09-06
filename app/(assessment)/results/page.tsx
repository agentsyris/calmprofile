"use client";

import { useEffect, useState } from 'react';
import { getAssessmentResults } from '@/lib/assessment';

export default function ResultsPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getAssessmentResults();
        setResults(data);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">No Results Found</h1>
          <p className="mb-6">There are no assessment results available at this time.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Your Assessment Results</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold text-lg">Recommended Learning Path</h2>
            <p className="mt-2">{results.recommendation}</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h2 className="font-semibold text-lg">Suggested Resources</h2>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {results.resources.map((resource: string, index: number) => (
                <li key={index}>{resource}</li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h2 className="font-semibold text-lg">Next Steps</h2>
            <p className="mt-2">{results.nextSteps}</p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Start New Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
