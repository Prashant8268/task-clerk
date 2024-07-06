"use client"
import { SignedIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { MenuIcon } from '@heroicons/react/outline';
import MenuSimple from './dropdown';
import { useUser } from '@clerk/nextjs';

const Navbar = () => {
  const user = useUser(); // Using useUser hook from Clerk to get user information
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); // State to manage mobile menu open/close
  const mobileMenuRef = useRef(null); // Ref to the mobile menu container
  const menuButtonRef = useRef(null); // Ref to the menu button

  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(prevState => !prevState); // Toggle the state
  };

  // Function to close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Effect to add event listener for clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!menuButtonRef.current.contains(event.target) &&
          mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        closeMobileMenu(); // Close menu if clicking outside menu button and menu itself
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);


  return (
    <nav className="bg-gray-900 p-4 shadow-md relative z-10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-white font-bold text-2xl">
          <span className="bg-purple-800 p-2 rounded">Task</span> Clerk
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-4">
          <div className="relative">
            <MenuSimple 
              menuName="Workspace" 
              menuItems={['Project 1', 'Project 2', 'Project 3']} 
            />
          </div>
          <div className="relative">
            <MenuSimple 
              menuName="Recent" 
              menuItems={['Task 1', 'Task 2', 'Task 3']} 
            />
          </div>
          <div className="relative">
            <MenuSimple 
              menuName="Starred" 
              menuItems={['Item 1', 'Item 2', 'Item 3']} 
            />
          </div>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center" ref={menuButtonRef}>
          <button 
            onClick={toggleMobileMenu} 
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          ref={mobileMenuRef}
          className={`md:hidden absolute top-16 left-0 right-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 z-20 p-4 shadow-md transition-all duration-300 ease-in-out transform ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 h-0 w-0 opacity-0 overflow-hidden'}`}
        >
          <div className="flex flex-row space-x-4">
            <MenuSimple 
              menuName="Workspace" 
              menuItems={['Project 1', 'Project 2', 'Project 3']} 
            />
            <MenuSimple 
              menuName="Recent" 
              menuItems={['Task 1', 'Task 2', 'Task 3']} 
            />
            <MenuSimple 
              menuName="Starred" 
              menuItems={['Item 1', 'Item 2', 'Item 3']} 
            />
          </div>
        </div>

        {/* User Profile */}
        <div className="flex text-white items-center space-x-2">
          {user ? (
            <SignedIn>
              <UserButton  />
            </SignedIn>
          ) : (
            <Link href="/sign-in" className="text-white hover:text-gray-200">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

Navbar.displayName = 'NavBar';
export default Navbar;
