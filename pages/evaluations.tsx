import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';

interface Evaluation {
  id?: number;
  name: string;
  description: string;
  score?: number;
  total_scores?: number;
  bucket_0_30?: number;
  bucket_31_50?: number;
  bucket_51_70?: number;
  bucket_71_100?: number;
}

export default function Evaluations() {
  const { user } = useAuth();
  const router = useRouter();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchEvaluations();
  }, [user]);

  const fetchEvaluations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/evaluations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setEvaluations(data.evaluations || []);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Layout showBackButton={true}>
      <div className="space-y-6">
        <div className="bg-white p-6 border-l-4 border-green-600 shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {user.role === 'admin' ? 'Performance Analytics' : 'My Performance Evaluations'}
          </h1>
          <p className="text-gray-600 mt-1">
            {user.role === 'admin' ? 'Employee performance metrics and evaluation reports' : 'View your performance scores and evaluations'}
          </p>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="space-y-6">
            {user.role === 'admin' ? (
              // Admin view with score buckets
              evaluations.map((evaluation) => (
                <div key={evaluation.id} className="bg-white shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-600 flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{evaluation.name}</h3>
                      <p className="text-gray-600 text-sm">{evaluation.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-red-50 p-4 text-center border border-red-200">
                      <div className="text-2xl font-bold text-red-700 mb-1">
                        {evaluation.bucket_0_30 || 0}
                      </div>
                      <div className="text-xs font-semibold text-red-600 uppercase tracking-wide">0-30 Points</div>
                      <div className="text-xs text-red-600 mt-1">Needs Improvement</div>
                    </div>
                    <div className="bg-yellow-50 p-4 text-center border border-yellow-200">
                      <div className="text-2xl font-bold text-yellow-700 mb-1">
                        {evaluation.bucket_31_50 || 0}
                      </div>
                      <div className="text-xs font-semibold text-yellow-600 uppercase tracking-wide">31-50 Points</div>
                      <div className="text-xs text-yellow-600 mt-1">Below Average</div>
                    </div>
                    <div className="bg-blue-50 p-4 text-center border border-blue-200">
                      <div className="text-2xl font-bold text-blue-700 mb-1">
                        {evaluation.bucket_51_70 || 0}
                      </div>
                      <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide">51-70 Points</div>
                      <div className="text-xs text-blue-600 mt-1">Satisfactory</div>
                    </div>
                    <div className="bg-green-50 p-4 text-center border border-green-200">
                      <div className="text-2xl font-bold text-green-700 mb-1">
                        {evaluation.bucket_71_100 || 0}
                      </div>
                      <div className="text-xs font-semibold text-green-600 uppercase tracking-wide">71-100 Points</div>
                      <div className="text-xs text-green-600 mt-1">Excellent</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    Total evaluations: {evaluation.total_scores || 0}
                  </div>
                </div>
              ))
            ) : (
              // Employee view with their scores
              <div className="bg-white shadow-sm overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-green-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                        Evaluation
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                        Performance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {evaluations.map((evaluation, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {evaluation.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {evaluation.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {evaluation.score !== null ? `${evaluation.score}/100` : 'Not evaluated'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {evaluation.score !== null && (
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              evaluation.score >= 71 ? 'bg-green-100 text-green-800' :
                              evaluation.score >= 51 ? 'bg-blue-100 text-blue-800' :
                              evaluation.score >= 31 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {evaluation.score >= 71 ? 'Excellent' :
                               evaluation.score >= 51 ? 'Good' :
                               evaluation.score >= 31 ? 'Fair' : 'Needs Improvement'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}