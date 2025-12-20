import { ArrowSubmit, Mail } from '@/assets/icons';
import Button from '@/components/ui/button/Button';
import React from 'react';

export default function GetInTouch() {
  return (
    <div className=" flex flex-col font-montserrat montserrat items-center justify-center py-14 px-8">
      <div className="max-w-[700px]  w-full flex flex-col items-center md:py-24 ">
        <h3 className="text-green-200  text-[26px] leading-8 md:leading-14 md:text-5xl font-bold">
          Get in Touch
        </h3>
        <p className="text-green-100 montserrat px-4  text-center  md:text-2xl">
          Having questions? We’d love to hear from you. Fill out the form below
          and we’ll get back to you as soon as possible
        </p>
        <div className="mt-10 flex w-full flex-col items-start">
          <form className="w-full flex flex-col gap-6">
            <div className="w-full flex flex-col md:flex-row gap-6">
              <div className="flex gap-1 flex-col w-full">
                <label className="font-medium text-green-200">First Name</label>
                <input
                  placeholder="Type First Name"
                  className="border px-2  border-green-200 w-full focus:outline-none h-[56px] rounded-md"
                />
              </div>
              <div className="flex gap-1 flex-col w-full">
                <label className="font-medium text-green-200">Last Name</label>
                <input
                  placeholder="Type Last Name"
                  className="border px-2  border-green-200 w-full focus:outline-none h-[56px] rounded-md"
                />
              </div>
            </div>
            <div className="flex gap-1 flex-col w-full">
              <label className="font-medium text-green-200">
                Email address
              </label>
              <div className="border flex gap-2 items-center px-2  border-green-200 w-full  h-[56px] rounded-md">
                <input
                  placeholder="Type Email address"
                  type="Email address"
                  className=" w-full focus:outline-none h-full"
                />
                <Mail />
              </div>
            </div>
            <div className="flex gap-1 flex-col w-full">
              <label className="font-medium text-green-200">Message</label>
              <textarea
                placeholder="Type Message"
                className="border min-h-[126px] p-2  border-green-200 w-full focus:outline-none h-[56px] rounded-md"
              />
            </div>
            <div className="flex items-center justify-center">
              <Button
                variant="primary"
                type="submit"
                rightIcon={<ArrowSubmit />}
                className="px-8 py-4"
              >
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
