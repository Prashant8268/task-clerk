import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { MenuIcon } from '@heroicons/react/outline';

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const sidebarRef = useRef(null); 

  // Function to handle clicks outside sidebar
  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      toggleSidebar(); 
    }
  };

  // Effect to add event listener for clicks outside
  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <>
      {/* Sidebar Toggle Button (Mobile View) */}
      <button 
        onClick={toggleSidebar} 
        className={`md:hidden fixed bottom-10 right-4 z-50 bg-gray-800 text-white rounded-full p-3 shadow-md hover:bg-gray-700 focus:outline-none ${isSidebarOpen ? 'hidden' : ''}`}
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`fixed md:relative top-0 left-0 h-screen w-64 bg-gray-900 text-white p-4 
                    ${isSidebarOpen ? 'translate-x-0 ' : '-translate-x-full md:translate-x-0'}
                    transition-transform duration-300 ease-in-out z-40`}
      >
        {/* TaskClerk Logo and Branding */}
        <div className="mb-8 flex items-center justify-center">
          <Link href="/" className="flex items-center space-x-2 text-white text-xl font-bold">
            <span className="bg-purple-600 px-3 py-1 rounded">Task</span>
            <span className="px-3 py-1 rounded">Clerk</span>
          </Link>
        </div>

        {/* Sidebar Menu Items */}
        <div className="space-y-4">
          <ul className="bg-white shadow-md rounded-lg p-4 space-y-2 text-gray-800">
            <li className="py-2 px-4 border-b border-gray-200">
              <Link className="flex items-center space-x-2" href="/dashboard">
                <span className="text-lg">Workspaces</span>
              </Link>
            </li>
            {/* Add more menu items as needed */}
          </ul>
        </div>
      </aside>
    </>
  );
}
