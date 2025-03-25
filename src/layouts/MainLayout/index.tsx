// src/layouts/MainLayout/index.tsx
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toggleSidebar, toggleTheme } from '../../store/slices/uiSlice';
import { Sidebar } from '../../components/ui/Navigation';
import { Menu, Sun, Moon } from 'lucide-react';

const MainLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { theme, sidebarOpen } = useSelector((state: RootState) => state.ui);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Listen for window resize events to determine mobile state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      dispatch(toggleSidebar());
    }
  }, [location.pathname, isMobile]);
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-primary-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => dispatch(toggleSidebar())}
              className="mr-4 p-2 rounded hover:bg-primary-700 transition"
              aria-label="Toggle sidebar"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold">HydroWebApp</h1>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded hover:bg-primary-700 transition"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun size={24} />
              ) : (
                <Moon size={24} />
              )}
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 relative">
        {/* Mobile sidebar backdrop */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => dispatch(toggleSidebar())}
          />
        )}
        
        {/* Sidebar */}
        <div
          className={`
            fixed md:static left-0 top-0 h-full z-30 md:z-auto
            transition-all duration-300 ease-in-out
            pt-16 md:pt-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-16'}
          `}
        >
          <Sidebar
            userPermission="user"
            userFeaturePermissions={[
              'view:projects',
              'edit:projects',
              'view:hydraulics',
              'run:calculations',
              'view:results',
              'export:results'
            ]}
            isOpen={sidebarOpen}
            isMobile={isMobile}
            onClose={() => dispatch(toggleSidebar())}
          />
        </div>
        
        {/* Main content */}
        <main className={`
          flex-1 p-4 md:p-6 
          transition-all duration-300 ease-in-out
          ${!sidebarOpen ? 'md:ml-16' : ''}
        `}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;