'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '../../context/SidebarContext';
import {
  CourseIcon,
  EventsIcon,
  ExploreIcon,
  HomeIcon,
  AdminIcon,
} from '@/assets/icons';
import Image from 'next/image';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ChevronDown } from 'lucide-react';

type NavItem = {
  name: string;
  icon?: React.ReactNode;
  path: string;
  children?: NavItem[];
};

const AppSidebar: React.FC = () => {
  const user = useSelector((state: RootState) => state.profile.user);
  const { isExpanded, isMobileOpen, isHovered } = useSidebar();
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isActive = (path: string) => pathname === path;

  const navItems: NavItem[] = [
    {
      icon: <HomeIcon width={16} height={18} />,
      name: 'Dashboard',
      path: '/dashboard',
    },
    {
      icon: <CourseIcon width={16} height={17} />,
      name: 'My Courses',
      path: '/dashboard/my-courses',
    },
    {
      icon: <ExploreIcon width={18} height={18} />,
      name: 'Explore Courses',
      path: '/dashboard/explore-courses',
    },
    {
      icon: <EventsIcon width={20} height={20} />,
      name: 'Events',
      path: '/dashboard/events',
    },
  ];

  // ✅ Add Admin only if role is admin
  if (user?.role === 'admin') {
    navItems.push({
      icon: (
        <AdminIcon
          width={20}
          height={20}
          className="text-black dark:text-gray-300"
        />
      ),
      name: 'Admin',
      path: '/dashboard/admin',
      children: [
        {
          icon: <EventsIcon width={20} height={20} />,
          name: 'Events',
          path: '/dashboard/admin/events',
        },
        {
          icon: <CourseIcon width={16} height={17} />,
          name: 'My Courses',
          path: '/dashboard/admin/courses',
        },
      ],
    });
  }

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex  flex-col font-open-sans gap-2">
      {items.map((item) => {
        const active = isActive(item.path);
        const isDropdownOpen = openDropdown === item.name;

        return (
          <li key={item.name}>
            {item.children ? (
              <>
                <button
                  type={'button'}
                  onClick={() =>
                    setOpenDropdown(isDropdownOpen ? null : item.name)
                  }
                  className={`w-full dark:text-white  flex cursor-pointer items-center justify-between gap-3 rounded-md px-4 py-4 transition-colors ${
                    active || isDropdownOpen
                      ? ' font-medium text-black dark:text-gray-300 hover:text-black'
                      : 'hover:bg-gray-50  text-gray-600 dark:text-gray-300 '
                  }`}
                >
                  <div className="flex items-center dark:text-gray-300 gap-3 text-gray-600 font-bold">
                    <span className="dark:text-gray-300">{item.icon}</span>
                    {(isExpanded || isMobileOpen) && (
                      <span className="text-black-100  dark:text-gray-300 font-semibold text-sm">
                        {item.name}
                      </span>
                    )}
                  </div>
                  {(isExpanded || isMobileOpen) && (
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {/* Dropdown Children */}
                {isDropdownOpen && (
                  <ul className="ml-8 mt-2 flex flex-col gap-2">
                    {item.children.map((child) => {
                      const childActive = isActive(child.path);
                      return (
                        <li key={child.name}>
                          <Link
                            href={child.path}
                            className={`menu-item  group flex items-center gap-3 rounded-md px-4 py-4 transition-colors ${
                              childActive
                                ? 'font-semibold text-sm bg-gray-25 border border-gray-200 text-black'
                                : 'hover:bg-gray-25 border-gray-200 text-black-100 dark:text-white hover:text-black'
                            }`}
                          >
                            {child.icon}
                            {child.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            ) : (
              <Link
                href={item.path}
                className={`menu-item group flex items-center gap-3 rounded-md px-4 py-4 transition-colors ${
                  active
                    ? 'font-semibold text-sm bg-gray-25 border border-gray-200 text-black'
                    : 'hover:bg-gray-25 border-gray-200 text-black-100 dark:text-white hover:text-black'
                }`}
              >
                <span>{item.icon}</span>
                {(isExpanded || isMobileOpen) && <span>{item.name}</span>}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed max-w-[1600px] mx-auto mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
    ${isExpanded || isMobileOpen ? 'w-[290px]' : 'w-[90px]'}
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
    >
      {/* Logo */}
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
        }`}
      >
        <Link href="/">
          {isExpanded || isMobileOpen ? (
            <>
              <Image
                src={'/image/logo.png'}
                alt="Osmosis Logo"
                className="dark:hidden object-cover"
              />
              <Image
                src={'/image/logo.png'}
                alt="Osmosis Logo Dark"
                className="hidden dark:block object-cover py-2"
              />
            </>
          ) : (
            <>
              <Image
                src={'/image/logo.png'}
                alt="Osmosis icon"
                className="dark:hidden object-cover"
              />
              <Image
                src={'/image/logo.png'}
                alt="Osmosis Logo Dark"
                className="hidden dark:block object-cover py-2"
              />
            </>
          )}
        </Link>
      </div>

      {/* Menu */}
      <div className="flex flex-col overflow-y-auto no-scrollbar">
        <nav className="mb-6">{renderMenuItems(navItems)}</nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
