'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownIcon, CloseIcon, Hamburger } from '@/assets/icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { mobileMenuVariants, navbarVariants } from '@/animation';
import { NAV_LINKS } from '@/utils/data';
import { useLogoutHandler } from '@/hooks/useLogout';

const Navbar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const user = useSelector((state: RootState) => state.profile.user);
  const [visible, setVisible] = useState(true);
  const [accountOpen, setAccountOpen] = useState(false);
  const isLoggedIn = useSelector(
    (state: RootState) => state.profile.isLoggedIn
  );
  const { handleLogout, isLoggingOut } = useLogoutHandler();

  useEffect(() => {
    const handleScroll = () => {
      const current = window.pageYOffset;
      const down = prevScrollPos < current;
      const threshold =
        (document.documentElement.scrollHeight - window.innerHeight) * 0.15;
      setScrolled(current > 20);
      setVisible(!(down && current > threshold));
      setPrevScrollPos(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  return (
    <AnimatePresence>
      <motion.header
        className={`fixed top-0 left-0 montserrat  right-0 z-9999 w-full transition-all ${
          scrolled ? 'bg-[#F2F2F2] shadow-lg' : 'bg-[#F2F2F2]'
        }`}
        initial="visible"
        animate={visible ? 'visible' : 'hidden'}
        variants={navbarVariants}
      >
        <nav className="flex items-center justify-between px-6 lg:px-16 py-6 lg:py-6 font-montserrat montserrat  max-w-[1440px] mx-auto text-black-100">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/image/logo.png"
              alt="Osmosis Logo"
              width={140}
              height={32}
              className="object-contain cursor-pointer"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden ml-0 lg:ml-20   lg:flex items-center  gap-12">
            <ul className="flex items-center gap-7">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`text-base  font-normal transition-colors duration-200 ${
                      pathname === link.href
                        ? 'text-black-100 font-semibold'
                        : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden montserrat  lg:flex items-center  gap-12">
            {isLoggedIn ? (
              <li className="relative group list-none">
                <div className="flex justify-center   items-center   ">
                  <div className="flex items-center  justify-center w-full">
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
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium cursor-pointer text-white transition-colors duration-200 group-hover:text-gray-300">
                    <span className="transition-transform duration-300 group-hover:rotate-180">
                      <ArrowDownIcon />
                    </span>
                  </span>
                </div>
                <ul className="absolute  right-0 mt-2  w-44  text-black rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform transition-all duration-200 translate-y-1 z-10">
                  <li className="flex items-center  gap-2 mt-2 hover:bg-green-100 px-3 py-2 rounded-lg">
                    <Link
                      href="/dashboard"
                      className="block  text-sm  h-full w-full"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li className="flex items-center gap-2 mt-2  hover:bg-green-100 px-3 py-2 rounded-lg">
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="block  text-sm text-start w-full h-full"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <div className="flex  items-center gap-3">
                <Link
                  href="/signin"
                  className="px-6 py-2 montserrat   rounded-lg  text-black-100 font-medium transition-colors  hover:bg-green-100"
                >
                  Sign in
                </Link>
                <Link
                  href="/teenagers/signup"
                  className=" px-6 py-2 border rounded-lg text-white font-medium transition-colors bg-green-200 hover:bg-green-100"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-black-100 focus:outline-none"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <Hamburger />
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="lg:hidden fixed top-0 right-0 w-full h-[500px] bg-[#F2F2F2] bg-opacity-90 px-6 py-6 overflow-y-auto"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
            >
              <div className="flex justify-between text-black items-center mb-8">
                <Link href="/">
                  <Image
                    src="/image/logo.png"
                    alt="Osmosis Logo"
                    width={171}
                    height={40}
                    className="object-contain cursor-pointer"
                  />
                </Link>
                <button
                  className="text-black text-2xl"
                  onClick={() => setMenuOpen(false)}
                >
                  <CloseIcon />
                </button>
              </div>

              <ul className="space-y-4">
                {NAV_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="block text-base text-black-100 font-medium transition-colors duration-200"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Mobile Auth Dropdown */}
              <div className="mt-8 flex flex-col gap-3">
                {isLoggedIn ? (
                  <div>
                    <div
                      className="flex items-center justify-between  font-medium cursor-pointer"
                      onClick={() => setAccountOpen((prev) => !prev)}
                    >
                      <div className="flex justify-between w-full   items-center   ">
                        <div className="flex items-center  justify-between w-full">
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
                        </div>
                        <span className="flex items-center gap-1 text-sm font-medium cursor-pointer text-white transition-colors duration-200 group-hover:text-gray-300">
                          <span className="transition-transform duration-300 group-hover:rotate-180">
                            <ArrowDownIcon />
                          </span>
                        </span>
                      </div>
                      <span
                        className={`transition-transform duration-300 ${
                          accountOpen ? 'rotate-180' : ''
                        }`}
                      ></span>
                    </div>
                    {accountOpen && (
                      <ul className="mt-2 w-full bg-white text-black rounded-lg shadow-lg py-2 px-4 space-y-2">
                        <li className="flex items-center  gap-2  mt-2 hover:bg-green-100 px-3 py-2 rounded-lg">
                          <Link
                            href="/dashboard"
                            className="block  text-sm  h-full w-full"
                          >
                            Dashboard
                          </Link>
                        </li>
                        <li className="flex items-center gap-2   hover:bg-green-100 px-3 py-2 rounded-lg">
                          <button
                            type="button"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="block text-start  text-sm w-full h-full"
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                ) : (
                  <>
                    <Link
                      href="/signin"
                      className="block text-center text-sm border border-green-100 text-black-100 px-6 py-2 rounded-lg font-medium hover:bg-white hover:text-black transition-colors duration-200"
                      onClick={() => setMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/teenagers/signup"
                      className="block text-center text-sm border bg-green-100 px-6 py-2 rounded-lg text-white font-medium hover:bg-white hover:text-black transition-colors duration-200"
                      onClick={() => setMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </AnimatePresence>
  );
};

export default Navbar;
