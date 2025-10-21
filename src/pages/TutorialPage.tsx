import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Footer } from '../components/layout/Footer';
import { useAuthStore } from '../stores/authStore';

export const TutorialPage = () => {
  const { user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Determine which video to show based on user role
  // Students (ESTUDIANTE) see one video, teachers/employees (DOCENTE, WEBUSER) see another
  const isStudent = user?.rol === 'ESTUDIANTE';
  
  const videoUrl = isStudent
    ? 'https://www.youtube.com/embed/j-Lq2d3j3aY' // Students
    : 'https://www.youtube.com/embed/IL3VXuQGhoQ'; // Teachers/Employees
  
  const title = isStudent
    ? 'Tutorial para Estudiantes'
    : 'Tutorial para Usuarios';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      
      <div className="max-w-[1600px] mx-auto">
        <div className="flex">
          <Sidebar 
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
          
          <main className="flex-1 p-8">
          <div className="bg-white rounded-lg shadow p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Videos y Tutoriales
              </h1>
              <p className="text-gray-600">
                {title}
              </p>
            </div>

            {/* Video Container */}
            <div className="w-full max-w-4xl mx-auto">
              <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={videoUrl}
                  title={title}
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

