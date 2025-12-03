"use client";

import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { notifications as allNotifications } from "../../utils/data";
import { RefreshIcon, NotificationIcon } from '../../assets/icons'

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const filteredNotifications = allNotifications.filter((n) =>
    activeTab === "all" ? true : activeTab === "read" ? n.read : !n.read
  );

  const handleClick = () => {
    setIsOpen(!isOpen);
    setNotifying(false);
  };

  return (
    <div className="relative">
      <button
        className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full  h-11 w-11  dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100"
        onClick={handleClick}
      >
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${!notifying ? "hidden" : "flex"
            }`}
        >
          <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
        </span>
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="absolute mt-4 w-[380px] max-h-[396px] overflow-y-auto rounded-3xl border border-gray-200 bg-white p-4 shadow-lg
        sm:left-1/2 -translate-x-1/2
        lg:left-auto lg:right-0 lg:translate-x-0"
      >
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-md font-open-sans font-semibold text-black uppercase">Notifications</h2>
          <button className="flex items-center text-sm text-gray-500 hover:text-black">
           <RefreshIcon width={24} height={24}/>
            Refresh
          </button>
        </div>

        <div className="flex items-center gap-6 justify-between border-b border-gray-200 px-6 mt-4 mb-3 relative">
          {["all", "read", "unread"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative text-sm font-semibold capitalize font-open-sans pb-2 ${
                activeTab === tab
                  ? "text-black after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:h-[3px] after:w-full after:bg-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <ul className="flex flex-col gap-3">
          {filteredNotifications.length === 0 ? (
            <li className="text-center text-gray-500 text-sm">No notifications</li>
          ) : (
            filteredNotifications.map((item, idx) => {
              const isOld = item.time.includes("day") || item.time.includes("week");

              return (
                <li
                  key={idx}
                  className={`flex justify-between items-start p-3 rounded-xl transition ${
                    isOld ? "bg-gray-50 text-gray-400" : "bg-white text-gray-800"
                  }`}
                >
                  <div className={`p-2 rounded-full bg-gray-300`}>
                    <NotificationIcon width={24} height={24} />
                  </div>

                  <div className="ml-3 flex-1">
                    <h3
                      className={`font-semibold text-[14px] font-open-sans ${
                        isOld ? "text-gray-500" : "text-gray-800"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`text-[12px] font-open-sans ${
                        isOld ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>

                  <span className={`text-xs whitespace-nowrap ${isOld ? "text-gray-400" : "text-gray-700"}`}>
                    {item.time}
                  </span>
                </li>
              );
            })
          )}
        </ul>
        <button className="mt-4 w-full text-center text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg py-2 hover:bg-gray-100">
          View All Notifications
        </button>
      </Dropdown>
    </div>
  );
}