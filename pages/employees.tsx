import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';

interface Employee {
  id: number;
  name: string;
  email: string;
  job_position: string;
  role: string;
  birthday: string;
  date_hired: string;
}

export default function Employees() {
  const { user } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    job_position: '',
    birthday: '',
    date_hired: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchEmployees();
  }, [user, search]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/employees?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setEmployees(data.employees || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setShowForm(false);
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'employee',
          job_position: '',
          birthday: '',
          date_hired: ''
        });
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  if (!user) return null;

  return (
    <Layout showBackButton={true}>
      <div className="space-y-6">
        <div className="bg-white p-6 border-l-4 border-green-600 shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600 mt-1">Manage employee records and information</p>
        </div>
        
        <div className="flex justify-between items-center">
          {user.role === 'admin' && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-6 py-3 hover:bg-green-700 transition-colors font-medium border border-green-500"
            >
              + Add New Employee
            </button>
          )}
        </div>

        <div className="bg-white p-4 shadow-sm border border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search employees by name, email, or position..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add Employee</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <select
                  className="w-full p-2 border rounded"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
                <input
                  type="text"
                  placeholder="Job Position"
                  className="w-full p-2 border rounded"
                  value={formData.job_position}
                  onChange={(e) => setFormData({...formData, job_position: e.target.value})}
                />
                <input
                  type="date"
                  placeholder="Birthday"
                  className="w-full p-2 border rounded"
                  value={formData.birthday}
                  onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                />
                <input
                  type="date"
                  placeholder="Date Hired"
                  className="w-full p-2 border rounded"
                  value={formData.date_hired}
                  onChange={(e) => setFormData({...formData, date_hired: e.target.value})}
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Create
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
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Position</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Date Hired</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {employee.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.job_position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          employee.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {employee.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.date_hired ? new Date(employee.date_hired).toLocaleDateString() : '-'}
                      </td>
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