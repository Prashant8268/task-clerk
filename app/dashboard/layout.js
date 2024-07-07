'use client'
import React from 'react';
import { useState, useEffect } from 'react';
import Navbar from '../(components)/NavBar';
import Sidebar from '../(components)/SideBar';
import axios from 'axios';


export default function Dashboard({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if(currentUser) return ; 
        const response = await axios.post('/api/user');
        setCurrentUser(response.data.newUser);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData(); 
  }, []); 

  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState);
  };
  const renderChildrenWithProps = () => {
    return React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { currentUser });
      }
      return child;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-1">
        <Navbar user={currentUser} toggleSidebar={toggleSidebar} />
        <div>{renderChildrenWithProps(children)}</div>
      </div>
    </div>
  );
}
