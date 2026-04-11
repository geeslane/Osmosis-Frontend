'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '../../context/SidebarContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Image from 'next/image';

import {
  CallIcon,
  DashboardIcon,
  LiveSessionIcon,
  LogoutIcon,
  ModulesIcon,
  PendingRequestIcon,
  ScheduleIcon,
  UserManagementIcon,
  UserSettingsIcon,
} from '@/assets/icons';

import { useLogoutHandler } from '@/hooks/useLogout';

type UserRole = 'SUPERADMIN' | 'MENTOR' | 'TEENAGER' | 'ADMIN';
type NavItem = {
  name: string;
  icon?: React.ComponentType<{ className?: string; active?: boolean }>;
  path: string;
  roles?: UserRole[];
  children?: NavItem[];
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered } = useSidebar();
  const pathname = usePathname();
  const { handleLogout, isLoggingOut } = useLogoutHandler();
  const user = useSelector((state: RootState) => state.profile.user);
  /** Match pathname to link path (ignore `?role=` etc. so My calls stays active on all tabs). */
  const isActive = (path: string) => pathname === path.split(/[?#]/)[0];

  const navItems: NavItem[] = [
    {
      icon: DashboardIcon,
      name: 'Dashboard',
      path: '/dashboard',
      roles: ['SUPERADMIN', 'MENTOR', 'TEENAGER', 'ADMIN'],
    },
    {
      icon: UserManagementIcon,
      name: 'Mentees',
      path: '/dashboard/mentee',
      roles: ['MENTOR'],
    },
    {
      icon: CallIcon,
      name: 'Calls',
      path: '/dashboard/calls/mentor?role=upcoming',
      roles: ['MENTOR'],
    },
    {
      icon: ScheduleIcon,
      name: 'Availability Schedule',
      path: '/dashboard/availabilty-schedule/mentor',
      roles: ['MENTOR'],
    },
    {
      icon: CallIcon,
      name: 'Book a call',
      path: '/dashboard/book-a-call',
      roles: ['TEENAGER'],
    },
    {
      icon: CallIcon,
      name: 'My calls',
      path: '/dashboard/calls/mentee?role=upcoming',
      roles: ['TEENAGER'],
    },
    {
      icon: PendingRequestIcon,
      name: 'Pending Requests',
      path: '/dashboard/pending-requests',
      roles: ['SUPERADMIN', 'ADMIN'],
    },
    {
      icon: UserManagementIcon,
      name: 'Users',
      path: '/dashboard/users',
      roles: ['SUPERADMIN', 'ADMIN'],
    },
    {
      icon: ModulesIcon,
      name: 'Modules',
      path: '/dashboard/modules',
      roles: ['SUPERADMIN', 'ADMIN'],
    },
    {
      icon: ModulesIcon,
      name: 'Modules',
      path: '/dashboard/modules/mentee',
      roles: ['TEENAGER'],
    },
    {
      icon: LiveSessionIcon,
      name: 'Live Sessions',
      path: '/dashboard/live-sessions',
      roles: ['SUPERADMIN', 'MENTOR', 'TEENAGER', 'ADMIN'],
    },
    {
      icon: CallIcon,
      name: 'Mentorship Calls',
      path: '/dashboard/calls/admin',
      roles: ['SUPERADMIN', 'ADMIN'],
    },
    {
      icon: ScheduleIcon,
      name: 'Program Schedule',
      path: '/dashboard/program-schedule',
      roles: ['SUPERADMIN', 'ADMIN'],
    },
  ];

  const filterNavItemsByRole = (items: NavItem[]): NavItem[] => {
    return items
      .filter((item) => {
        if (!item.roles) return true;
        if (!user?.role) return false;

        return item.roles.includes(user.role as UserRole);
      })
      .map((item) => ({
        ...item,
        children: item.children
          ? filterNavItemsByRole(item.children)
          : undefined,
      }));
  };

  const filteredNavItems = filterNavItemsByRole(navItems);

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-2 mt-4">
      {items.map((item) => {
        const active = isActive(item.path);
        const Icon = item.icon;

        return (
          <li key={item.name}>
            <Link
              href={item.path}
              className={`group flex montserrat font-medium text-green-200 items-center gap-3 px-4 py-2 text-sm transition-colors ${active ? 'rounded-lg bg-green-100 text-white' : ''
                }`}
            >
              {Icon && (
                <Icon
                  className={`transition-colors ${active ? 'text-white' : 'text-green-100 '
                    }`}
                  active={active}
                />
              )}

              {(isExpanded || isMobileOpen) && <span>{item.name}</span>}
            </Link>

            {/* Render Children */}
            {item.children && renderMenuItems(item.children)}
          </li>
        );
      })}
    </ul>
  );

  if (!user) return null;

  return (
    <aside
      className={`fixed max-w-[1600px] bg-white font-montserrat mx-auto mt-16 flex flex-col lg:mt-0 top-0 left-0 text-gray-900 md:h-screen transition-all duration-300 ease-in-out z-50 
      ${isExpanded || isMobileOpen ? 'w-[290px] z-999' : 'w-[90px]'}
      ${isMobileOpen
          ? 'translate-x-0 bg-white h-full pb-10'
          : '-translate-x-full'
        } lg:translate-x-0`}
    >
      <div className="flex flex-col pb-4 justify-between h-full">
        {/* Top Section */}
        <div>
          <div
            className={`pt-[32.7px] pb-5 flex px-5 ${!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
              }`}
          >
            <Link href="/">
              {isExpanded || isMobileOpen ? (
                <Image
                  src="/image/logo.png"
                  alt="Osmosis Logo"
                  width={150}
                  height={28}
                />
              ) : (
                <Image
                  src="/image/logo1.png"
                  alt="Osmosis icon"
                  width={26}
                  height={10}
                />
              )}
            </Link>
          </div>

          <div className="flex px-5 gap-4 flex-col overflow-y-auto no-scrollbar">
            <nav className="mb-6">{renderMenuItems(filteredNavItems)}</nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex-col flex justify-between px-5">
          <Link
            href="/dashboard/account-settings"
            className="group flex montserrat border-b py-5 font-medium text-green-200 items-center gap-2 px-4 border-b-green-100 text-sm transition-colors"
          >
            <UserSettingsIcon />
            {(isExpanded || isMobileOpen) && <span>Manage Account</span>}
          </Link>

          <div className="flex justify-center items-center py-5">
            <div className="flex items-center justify-center w-full">
              {(isExpanded || isMobileOpen) && (
                <div className="flex w-full gap-3">
                  {/* Avatar */}
                  <div className="w-[36px] h-[36px] flex-shrink-0">
                    {user?.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.full_name || user.email || 'User'}
                        width={36}
                        height={36}
                        className="rounded-full w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {(user?.full_name || user?.email || 'U')
                            .split(' ')
                            .map((w) => w[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-green-200 truncate">
                      {user?.full_name || user?.email}
                    </h3>

                    {user?.email && (
                      <h2 className="text-green-200 text-[10px] truncate">
                        {user.email}
                      </h2>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="justify-center items-center flex hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              title="Logout"
            >
              <LogoutIcon />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
