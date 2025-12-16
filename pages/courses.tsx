import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';

interface Course {
  id: number;
  title: string;
  description: string;
  image_url: string;
  enrolled_count: number;
  enrolled_users: string;
}

export default function Courses() {
  const { user } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchCourses();
    if (user.role === 'employee') {
      fetchEnrollments();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/courses/enrollments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setEnrolledCourses(data.enrollments || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setShowForm(false);
        setFormData({ title: '', description: '', image_url: '' });
        fetchCourses();
      }
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleEnroll = async (courseId: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ course_id: courseId })
      });

      if (res.ok) {
        setEnrolledCourses([...enrolledCourses, courseId]);
        fetchCourses();
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const handleUnenroll = async (courseId: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/courses/unenroll', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ course_id: courseId })
      });

      if (res.ok) {
        setEnrolledCourses(enrolledCourses.filter(id => id !== courseId));
        fetchCourses();
      }
    } catch (error) {
      console.error('Error unenrolling from course:', error);
    }
  };

  const isEnrolled = (courseId: number) => {
    return enrolledCourses.includes(courseId);
  };

  if (!user) return null;

  return (
    <Layout showBackButton={true}>
      <div className="space-y-6">
        <div className="bg-white p-6 border-l-4 border-green-600 shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Training & Development</h1>
          <p className="text-gray-600 mt-1">Professional development courses and training programs</p>
        </div>
        
        <div className="flex justify-between items-center">
          {user.role === 'admin' && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-6 py-3 hover:bg-green-700 transition-colors font-medium border border-green-500"
            >
              + Create New Course
            </button>
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md z-50">
              <h2 className="text-xl font-bold mb-4">Add Course</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Course Title"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
                <textarea
                  placeholder="Description"
                  className="w-full p-2 border rounded"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
                <input
                  type="url"
                  placeholder="Image URL (optional)"
                  className="w-full p-2 border rounded"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Create Course
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center">Loading...</div>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="bg-white shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-full h-32 bg-green-600 flex items-center justify-center relative">
                  {course.image_url ? (
                    <>
                      <img 
                        src={course.image_url} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            const svg = parent.querySelector('svg');
                            if (svg) svg.classList.remove('hidden');
                          }
                        }}
                      />
                      <svg className="w-12 h-12 text-white absolute hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </>
                  ) : (
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2 text-gray-900">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{course.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-2">
                        {course.enrolled_users && course.enrolled_users.split(', ').slice(0, 3).map((name, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                          >
                            {name.charAt(0)}
                          </div>
                        ))}
                      </div>
                      {course.enrolled_count > 3 && (
                        <span className="text-sm text-gray-500">+{course.enrolled_count - 3}</span>
                      )}
                    </div>
                  </div>
                  
                  {user.role === 'employee' && (
                    <div className="space-y-2">
                      {isEnrolled(course.id) ? (
                        <button
                          onClick={() => handleUnenroll(course.id)}
                          className="bg-red-600 text-white px-4 py-2 text-sm hover:bg-red-700 transition-colors font-medium border border-red-500 w-full"
                        >
                          UNENROLL
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEnroll(course.id)}
                          className="bg-green-600 text-white px-4 py-2 text-sm hover:bg-green-700 transition-colors font-medium border border-green-500 w-full"
                        >
                          ENROLL NOW
                        </button>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-2 text-xs text-gray-500">
                    {course.enrolled_count} enrolled
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}