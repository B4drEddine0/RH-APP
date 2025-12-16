import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  job_position: string;
  birthday: string;
  date_hired: string;
  created_at: string;
}

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.user) {
        setProfile(data.user);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) return null;

  return (
    <Layout showBackButton={true}>
      <div className="space-y-8">
        <div className="bg-white shadow-sm overflow-hidden border border-gray-200">
          <div className="bg-green-600 px-8 py-12">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-white flex items-center justify-center mr-6">
                <span className="text-2xl font-bold text-gray-700">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-green-100 text-lg capitalize">{user.role}</p>
                <p className="text-green-200">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="p-3 bg-gray-50 border">
                    {profile?.name || user.name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="p-3 bg-gray-50 border">
                    {profile?.email || user.email}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <div className="p-3 bg-gray-50 border">
                    <span className={`px-3 py-1 text-sm font-medium ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Position</label>
                  <div className="p-3 bg-gray-50 border">
                    {profile?.job_position || 'Not specified'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Hired</label>
                  <div className="p-3 bg-gray-50 border">
                    {profile?.date_hired ? new Date(profile.date_hired).toLocaleDateString() : 'Not specified'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birthday</label>
                  <div className="p-3 bg-gray-50 border">
                    {profile?.birthday ? new Date(profile.birthday).toLocaleDateString() : 'Not specified'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}