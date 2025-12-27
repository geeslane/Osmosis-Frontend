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
      <header className="sticky bg-white  font-montserrat montserrat top-0 h-[92px] font-sans flex w-full  z-999  ">
        <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-3">
          <div className="flex items-center justify-between w-full  px-3 py-3 lg:justify-normal  lg:px-0 lg:py-4">
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
            <button
              onClick={toggleApplicationMenu}
              className="flex items-center justify-center w-10 h-10    lg:hidden"
            >
              <MenuIcon />
            </button>
          </div>
          <div
            className={`${
              isApplicationMenuOpen ? 'flex bg-white  justify-between' : 'hidden'
            }
               items-center justify-between w-full gap-4 px-5 py-4 
               lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none
               `}
          >
            <NotificationDropdown />
          </div>
        </div>

        <Profile />
      </header>
    </>
  );
};

export default AppHeader;
