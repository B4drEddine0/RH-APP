import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';

interface TimeOffRequest {
  id: number;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_note: string;
  user_name: string;
  user_email: string;
  created_at: string;
}

export default function TimeOff() {
  const { user } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    reason: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/timeoff', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/timeoff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setShowForm(false);
        setFormData({ start_date: '', end_date: '', reason: '' });
        fetchRequests();
      }
    } catch (error) {
      console.error('Error creating request:', error);
    }
  };

  const handleApproval = async (id: number, status: 'approved' | 'rejected', note: string = '') => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/timeoff/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, admin_note: note })
      });

      if (res.ok) {
        fetchRequests();
      }
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  if (!user) return null;

  return (
    <Layout showBackButton={true}>
      <div className="space-y-6">
        <div className="bg-white p-6 border-l-4 border-green-600 shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {user.role === 'admin' ? 'Time Off Management' : 'My Time Off Requests'}
          </h1>
          <p className="text-gray-600 mt-1">
            {user.role === 'admin' ? 'Review and manage employee time off requests' : 'Submit and track your time off requests'}
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          {user.role === 'employee' && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-6 py-3 hover:bg-green-700 transition-colors font-medium border border-green-500"
            >
              + New Time Off Request
            </button>
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Request Time Off</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="date"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                />
                <input
                  type="date"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                />
                <textarea
                  placeholder="Reason (optional)"
                  className="w-full p-2 border rounded"
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Submit Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white shadow-sm overflow-hidden border border-gray-200">
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-green-600 text-white">
                  <tr>
                    {user.role === 'admin' && (
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Employee</th>
                    )}
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Start Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">End Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                    {user.role === 'admin' && (
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request.id}>
                      {user.role === 'admin' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {request.user_name}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.start_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.end_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {request.reason || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      {user.role === 'admin' && request.status === 'pending' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproval(request.id, 'approved')}
                              className="bg-green-700 text-white px-4 py-2 text-xs hover:bg-green-800 transition-colors mr-2 font-medium border border-green-600"
                            >
                              APPROVE
                            </button>
                            <button
                              onClick={() => handleApproval(request.id, 'rejected')}
                              className="bg-red-700 text-white px-4 py-2 text-xs hover:bg-red-800 transition-colors font-medium border border-red-600"
                            >
                              REJECT
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}