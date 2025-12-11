import Footer from '@/layout/home/Footer';
import Navbar from '@/layout/home/Navbar';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <div className="relative flex flex-col items-center justify-center mt-8 p-6 overflow-hidden z-1">
        <Navbar />
        <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
          <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
            We can`t seem to find the page you are looking for!
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Back to Home Page
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
