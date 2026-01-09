'use client';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from '@/assets/icons';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <div className="bg-[#000000]">
      <footer className="text-white px-8 md:px-20 pt-20 pb-6 text-sm relative z-0 max-w-[1512px] mx-auto">
        <div className="grid md:grid-cols-3 md:justify-center  mx-auto md:items-center gap-10">
          <div className="mb-4 flex items-start flex-col w-full text-center mx-auto md:text-left md:mx-0">
            <Link href="/">
              <Image
                src="/image/logo1.png"
                alt="Osmosis Logo"
                width={90}
                height={40}
                className="object-contain mx-auto md:mx-0"
              />
            </Link>
            <p className="max-w-[151px] text-start text-white font-montserrat montserrat font-medium mt-4">
              Mentorship for the next generation.
            </p>
          </div>

          <div className="">
            <ul className="space-y-2 font-montserrat montserrat font-medium text-[16px]">
              <h3 className="font-bold ">Company</h3>
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/mentors">Mentors</Link>
              </li>
            </ul>
          </div>
          <div>
            {' '}
            <ul className="space-y-2 ffont-montserrat montserrat text-[14px] lg:text-[16px]">
              <h3 className="font-bold ">Resources</h3>
              <li>
                <Link href="/FAQ">FAQ</Link>
              </li>
              <li>
                <Link href="contact">Contact</Link>
              </li>
              <div className='flex items-center  gap-2'>
                <YoutubeIcon />
                <FacebookIcon />
                <LinkedinIcon />
                <InstagramIcon />
              </div>
            </ul>
          </div>
        </div>
        <div className="text-sm w-full text-center font-montserrat montserrat text-white pt-8">
          © {year} Osmosis. All rights reserved..
        </div>
      </footer>
    </div>
  );
};

export default Footer;
