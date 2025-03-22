import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toggleSidebar, toggleTheme } from '../../store/slices/uiSlice';

const MainLayout = () => {
  const dispatch = useDispatch();
  const { theme, sidebarOpen } = useSelector((state: RootState) => state.ui);
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className="bg-primary-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => dispatch(toggleSidebar())}
              className="mr-4 p-2 rounded hover:bg-primary-700 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">HydroWebApp</h1>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded hover:bg-primary-700 transition"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-64 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <a href="/" className="block p-2 rounded hover:bg-primary-100 hover:text-primary-700 transition">Home</a>
              </li>
              <li>
                <a href="/projects" className="block p-2 rounded hover:bg-primary-100 hover:text-primary-700 transition">Projects</a>
              </li>
              <li>
                <a href="/calculator" className="block p-2 rounded hover:bg-primary-100 hover:text-primary-700 transition">Calculator</a>
              </li>
              <li>
                <a href="/results" className="block p-2 rounded hover:bg-primary-100 hover:text-primary-700 transition">Results</a>
              </li>
              <li>
                <a href="/documentation" className="block p-2 rounded hover:bg-primary-100 hover:text-primary-700 transition">Documentation</a>
              </li>
              <li>
                <a href="/settings" className="block p-2 rounded hover:bg-primary-100 hover:text-primary-700 transition">Settings</a>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
