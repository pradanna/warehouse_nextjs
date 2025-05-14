"use client";
import React, { useState } from "react";
import {
  BellIcon,
  ArrowRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

type NavbarProps = {
  onToggleSidebar: () => void;
  currentPage: string;
  profileName: string;
  profileImage?: string;
  isSidebarOpen: boolean;
};

export default function NavbarAdmin({
  isSidebarOpen,
  onToggleSidebar,
  currentPage,
  profileName,
  profileImage = "/images/default-avatar.jpg",
}: NavbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white  relative z-40">
      {/* Left - Sidebar Toggle + Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-black hover:text-gray-600 transition-all duration-300 cursor-pointer"
        >
          {isSidebarOpen ? (
            <XMarkIcon className="h-5 w-5 rotate-180 text-dark3" />
          ) : (
            <ArrowRightIcon className="h-5 w-5 text-dark3" />
          )}
        </button>
        <h1 className="text-lg font-semibold capitalize text-gray-800">
          {currentPage}
        </h1>
      </div>

      {/* Right - Notification & Profile */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            className="p-1 cursor-pointer hover:bg-gray-100 rounded-full transition "
          >
            <BellIcon className="h-6 w-6 text-gray-700" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-md border z-50">
              <div className="px-4 py-2 border-b">
                <span className="text-sm font-semibold text-gray-700">
                  Notifikasi
                </span>
              </div>
              <div
                onClick={() => setNotifOpen(false)}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
              >
                🔔 Notifikasi 1
              </div>
              <div
                onClick={() => setNotifOpen(false)}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
              >
                📦 Pesanan baru
              </div>
              <div
                onClick={() => setNotifOpen(false)}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
              >
                💬 Chat masuk
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="p-0 focus:outline-none cursor-pointer"
          >
            <Image
              src={profileImage}
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full border border-gray-300"
            />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-md border z-50">
              <div className="p-4 border-b">
                <p className="font-semibold text-gray-800">{profileName}</p>
                <p className="text-sm text-gray-500">Admin</p>
              </div>
              <div
                onClick={() => setProfileOpen(false)}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
              >
                Profil Saya
              </div>
              <div
                onClick={() => setProfileOpen(false)}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
              >
                Akun
              </div>
              <div
                onClick={() => setProfileOpen(false)}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
