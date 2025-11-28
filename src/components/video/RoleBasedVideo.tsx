/**
 * RoleBasedVideo Component
 * 
 * Displays a tutorial video based on the environment variable VITE_APP_ENV_ROL.
 * - If VITE_APP_ENV_ROL === 'ESTUDIANTE': shows student video
 * - Otherwise: shows employee video
 */
export const RoleBasedVideo = () => {
  // Get role from environment variable
  const envRol = import.meta.env.VITE_APP_ENV_ROL || '';
  const isStudent = envRol === 'ESTUDIANTE';
  
  // Determine video URL and title based on role
  const videoUrl = isStudent
    ? 'https://www.youtube.com/embed/j-Lq2d3j3aY?si=aC1ZTw95PcqXv3Xf' // Students
    : 'https://www.youtube.com/embed/IL3VXuQGhoQ'; // Employees
  
  const videoTitle = isStudent
    ? 'Tutorial para estudiantes - Eligetumenudea.com'
    : 'Tutorial para empleados - Eligetumenudea.com';

  return (
    <div className="bg-white w-full py-10">
      <div className="max-w-2xl mx-auto rounded-lg shadow-md overflow-hidden w-full">
        <div className="p-4 sm:p-6">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe 
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src={videoUrl}
              title={videoTitle}
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

