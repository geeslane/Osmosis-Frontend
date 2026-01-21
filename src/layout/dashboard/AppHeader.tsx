'use client';
import { MenuIcon } from '@/assets/icons';
//import { ThemeToggleButton } from '@/components/common/ThemeToggleButton';
import NotificationDropdown from '@/components/header/NotificationDropdown';
import Profile from '@/components/user-profile/profile';
import { useSidebar } from '@/context/SidebarContext';

import React, { useState, useEffect, useRef } from 'react';
import { useNavbarTitle } from '@/context/NavbarTitleContsxt';

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { title } = useNavbarTitle();

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <header className="sticky bg-white  font-montserrat montserrat shadow-xs top-0 h-[70px] md:h-[92px] font-sans flex w-full  z-999  ">
        <div className="flex  items-center justify-between w-full px-3  md:px-6 ">
          <div className="flex items-center justify-between w-full h-full  px-3  lg:justify-normal  lg:px-0 lg:py-4">
            <button
              className="items-center justify-center w-10 h-10 z-10 "
              onClick={handleToggle}
              aria-label="Toggle Sidebar"
            >
              {isMobileOpen ? <MenuIcon /> : <MenuIcon />}
            </button>

            <div className="block text-2xl font-semibold text-green-200   w-full max-w-full sm:max-w-sm md:max-w-sm">
              {title}
            </div>
          </div>
          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10   "
          >
            <NotificationDropdown />
          </button>
        </div>
        <Profile />
      </header>
    </>
  );
};

export default AppHeader;
