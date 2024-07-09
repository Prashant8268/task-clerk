import React, { useEffect, useRef, useState } from 'react';
import { BellIcon } from '@heroicons/react/outline';
import { io } from 'socket.io-client';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef(null);
  const SOCKET_SERVER_URL = 'https://task-clerk-backend.onrender.com';
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Set up event listener for notifications
    newSocket.on('btnclick', (newNotification) => {
      setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
    });

    // Clean up socket connection on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleClickOutside = (event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleBellIconClick = () => {
    setIsOpen((prev) => !prev); // Toggle isOpen state
    // Emit an event when the bell icon is clicked
    if (socket) {
      socket.emit('btnclick', { message: 'Bell icon clicked' });
    }
  };
  return (
    <div ref={notificationRef} className="relative">
      {/* Notification Bell Icon */}
      <button
        onClick={handleBellIconClick} // Handle click on bell icon
        className="relative z-20 text-gray-400 hover:text-white focus:outline-none"
      >
        <BellIcon className="h-6 w-6" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white shadow-lg rounded-lg w-64 left-[-120px]">
          <div className="py-2 px-3 bg-gray-900 text-white font-semibold">Notifications</div>
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div key={notification.id} className="py-2 px-3">
                {notification.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

Notification.displayName = 'Notification';
export default Notification;
