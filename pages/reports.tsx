import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Reports() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [user, router]);

  const handleExport = async (type: 'employees' | 'timeoff') => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/export/${type}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <Layout showBackButton={true}>
      <div className="space-y-6">
        <div className="bg-white p-6 border-l-4 border-green-600 shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Business Intelligence & Reports</h1>
          <p className="text-gray-600 mt-1">Data export and analytical reporting tools</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Employee Database Export</h3>
              <p className="text-gray-600 text-sm mt-1">
                Complete employee records with personal and professional information
              </p>
            </div>
            <button
              onClick={() => handleExport('employees')}
              className="bg-green-600 text-white px-6 py-3 hover:bg-green-700 transition-colors font-medium border border-green-500 w-full"
            >
              EXPORT EMPLOYEE DATA
            </button>
          </div>

          <div className="bg-white shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Time Off Records Export</h3>
              <p className="text-gray-600 text-sm mt-1">
                All time off requests with approval status and administrative notes
              </p>
            </div>
            <button
              onClick={() => handleExport('timeoff')}
              className="bg-green-600 text-white px-6 py-3 hover:bg-green-700 transition-colors font-medium border border-green-500 w-full"
            >
              EXPORT TIME OFF DATA
            </button>
          </div>
        </div>

        <div className="bg-white shadow-sm p-6 border border-gray-200">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h3 className="text-lg font-bold text-gray-900">System Navigation</h3>
            <p className="text-gray-600 text-sm mt-1">Quick access to main system modules</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/employees')}
              className="p-4 text-center border border-gray-300 hover:border-green-600 hover:bg-green-50 transition-all"
            >
              <div className="w-8 h-8 bg-green-600 flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Employees</div>
            </button>
            <button
              onClick={() => router.push('/timeoff')}
              className="p-4 text-center border border-gray-300 hover:border-green-600 hover:bg-green-50 transition-all"
            >
              <div className="w-8 h-8 bg-green-600 flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm6 0a2 2 0 100-4 2 2 0 000 4zm-6 4a2 2 0 100-4 2 2 0 000 4zm6 0a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </div>
              <div className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Time Off</div>
            </button>
            <button
              onClick={() => router.push('/evaluations')}
              className="p-4 text-center border border-gray-300 hover:border-green-600 hover:bg-green-50 transition-all"
            >
              <div className="w-8 h-8 bg-green-600 flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Performance</div>
            </button>
            <button
              onClick={() => router.push('/courses')}
              className="p-4 text-center border border-gray-300 hover:border-green-600 hover:bg-green-50 transition-all"
            >
              <div className="w-8 h-8 bg-green-600 flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Training</div>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}