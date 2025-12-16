import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  const adminMenuItems = [
    { title: 'Employees', href: '/employees', description: 'Manage employee records' },
    { title: 'Time Off Requests', href: '/timeoff', description: 'Review and approve requests' },
    { title: 'Evaluations', href: '/evaluations', description: 'Manage employee evaluations' },
    { title: 'Courses', href: '/courses', description: 'Manage training courses' },
    { title: 'Reports', href: '/reports', description: 'View analytics and reports' },
  ];

  const employeeMenuItems = [
    { title: 'My Profile', href: '/profile', description: 'View and edit your profile' },
    { title: 'Time Off', href: '/timeoff', description: 'Request time off' },
    { title: 'Courses', href: '/courses', description: 'Browse available courses' },
    { title: 'My Evaluations', href: '/evaluations', description: 'View your evaluations' },
  ];

  const menuItems = user.role === 'admin' ? adminMenuItems : employeeMenuItems;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white p-8 border-l-4 border-green-600 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user.name}
          </h1>
          <p className="text-gray-600 text-lg">
            {user.role === 'admin' ? 'Administrative Dashboard' : 'Employee Portal'}
          </p>
          <div className="mt-4 text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item, index) => {
            const icons = [
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>,
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm6 0a2 2 0 100-4 2 2 0 000 4zm-6 4a2 2 0 100-4 2 2 0 000 4zm6 0a2 2 0 100-4 2 2 0 000 4z" /></svg>,
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            ];
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group block p-6 bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-gray-800"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-600 flex items-center justify-center text-white">
                    {icons[index]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <span className="text-green-600 text-sm font-medium border-b border-transparent group-hover:border-green-600 transition-colors">
                    Access →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}