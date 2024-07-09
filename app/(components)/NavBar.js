"use client"
import { SignedIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';


const Navbar = () => {
  const user = useUser(); 
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); 
  const mobileMenuRef = useRef(null); 
  const menuButtonRef = useRef(null); 

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prevState => !prevState); 
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
        closeMobileMenu(); 
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
