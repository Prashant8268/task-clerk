'use client'
import { useState } from 'react';
import Navbar from '../_components/NavBar';
import Sidebar from '../_components/SideBar';

export default function Dashboard({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Initially sidebar is open

  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState);
  };

  const Newuser = {
    firstName: 'Prashat',
    lastName: '.',
    imageUrl: 'user.imageUrl'
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <Navbar user={Newuser} toggleSidebar={toggleSidebar} />
        {/* Children Content */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}
