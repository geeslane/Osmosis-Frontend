'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '../../context/SidebarContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

import Image from 'next/image';
import {
  DashboardIcon,
  LiveSessionIcon,
  LogoutIcon,
  ModulesIcon,
  PendingRequestIcon,
  UserManagementIcon,
  UserSettingsIcon,
} from '@/assets/icons';
import { useLogoutHandler } from '@/hooks/useLogout';

type NavItem = {
  name: string;
  icon?: React.ComponentType<{ className?: string; active?: boolean }>;
  path: string;
  children?: NavItem[];
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered } = useSidebar();
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.profile.user);
  const isActive = (path: string) => pathname === path;

  const { handleLogout, isLoggingOut } = useLogoutHandler();

  const navItems: NavItem[] = [
    {
      icon: DashboardIcon,
      name: 'Dashboard',
      path: '#',
    },
    {
      icon: PendingRequestIcon,
      name: 'Pending Requests',
      path: '/dashboard/pending-requests',
    },
    {
      icon: UserManagementIcon,
      name: 'Users',
      path: '/dashboard/users',
    },
    {
      icon: ModulesIcon,
      name: 'Modules',
      path: '/dashboard/modules',
    },
    {
      icon: LiveSessionIcon,
      name: 'Live Sessions',
      path: '/dashboard/live-sessions',
    },
  ];

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-2 mt-4">
      {items.map((item) => {
        const active = isActive(item.path);
        const Icon = item.icon;

        return (
          <li key={item.name}>
            <Link
              href={item.path}
              className={`group flex montserrat  font-medium text-green-200  items-center gap-3 px-4 py-2 text-sm transition-colors ${
                active ? ' rounded-lg bg-green-100 text-white' : ''
              }`}
            >
              {Icon && (
                <Icon
                  className={`transition-colors ${
                    active
                      ? 'text-white '
                      : 'text-white-300 text-green-100 group-hover:text-white-100'
                  }`}
                  active={active}
                />
              )}

              {(isExpanded || isMobileOpen) && <span>{item.name}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed max-w-[1600px] bg-white font-montserrat montserrat  mx-auto mt-16 flex flex-col lg:mt-0 top-0  left-0   text-gray-900 md:h-screen transition-all duration-300 ease-in-out z-50 
    ${isExpanded || isMobileOpen ? 'w-[290px] z-999' : 'w-[90px]'}
    ${
      isMobileOpen ? 'translate-x-0 bg-white h-full pb-10' : '-translate-x-full'
    } lg:translate-x-0`}
    >
      <div className="flex flex-col pb-4 justify-between   h-full">
        <div>
          <div
            className={`pt-[32.7px] pb-5   flex px-5    ${
              !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
            }`}
          >
            <Link href="/">
              {isExpanded || isMobileOpen ? (
                <>
                  <Image
                    src="/image/logo.png"
                    alt="Osmosis Logo"
                    className=" object-cover"
                    width={150}
                    height={28}
                  />
                </>
              ) : (
                <>
                  <Image
                    src="/image/logo1.png"
                    alt="Osmosis icon"
                    className=" object-cover"
                    width={26}
                    height={10}
                  />
                </>
              )}
            </Link>
          </div>

          <div className="flex px-5  gap-4 flex-col overflow-y-auto no-scrollbar">
            <nav className="mb-6">{renderMenuItems(navItems)}</nav>
          </div>
        </div>
        <div className="flex-col flex justify-between  px-5">
          <Link
            href="/dashboard/account-settings"
            className={`group flex montserrat border-b py-5 font-medium text-green-200  items-center gap-2 px-4 border-b-green-100 text-sm transition-colors `}
          >
            <UserSettingsIcon />

            {(isExpanded || isMobileOpen) && <span>Manage Account</span>}
          </Link>
          <div className="flex justify-center   items-center  py-5 ">
            <div className="flex items-center  justify-center w-full">
              {(isExpanded || isMobileOpen) && (
                <div className="flex w-full gap-3">
                  <div className="w-[36px] h-[36px] flex-shrink-0">
                    {user?.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.full_name || user?.email || 'User'}
                        width={36}
                        height={36}
                        className="rounded-full w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {(user?.full_name || user?.email || 'U')
                            .split(' ')
                            .map((word) => word[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-green-200 truncate">
                      {user?.full_name || user?.email || 'User'}
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
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`${
                !isExpanded && !isHovered ? ' ' : ''
              }  justify-center items-center flex hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
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
