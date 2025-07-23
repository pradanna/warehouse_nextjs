"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import SidebarTooltip from "./SidebarTooltip";

export type SidebarItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  children?: SidebarItem[];
};

export type FinanceItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  children?: SidebarItem[];
};

type SidebarProps = {
  menuItems: SidebarItem[];
  financeItems: FinanceItem[];
  isSidebarOpen: boolean;
  logoExtended: string;
  logoSimple: string;
  path_active: string;
};

export default function Sidebar({
  menuItems,
  financeItems,
  isSidebarOpen,
  logoExtended,
  logoSimple,
  path_active,
}: SidebarProps) {
  const [open, setOpen] = useState<string | null>(null);

  const handleToggle = (name: string) => {
    setOpen(open === name ? null : name);
  };

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <div
      className={`h-screen bg-white transition-all duration-300 z-20 shadow-sm shadow-light2 ${
        isSidebarOpen ? "w-56" : "w-16"
      }`}
    >
      <div className="p-4">
        {isHydrated && (
          <Image
            src={isSidebarOpen ? logoExtended : logoSimple}
            alt="Logo"
            width={isSidebarOpen ? 200 : 50}
            height={50}
            className="object-contain"
          />
        )}
      </div>

      <ul className="space-y-1 ps-3 pt-5">
        <p className="text-gray-500 text-sm font-medium">
          Warehouse Management
        </p>
        <hr className="border-gray-300" />

        {menuItems.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = open === item.name;
          const isActive =
            path_active === item.href ||
            path_active.startsWith(`${item.href}/`);

          return (
            <li key={item.name}>
              {hasChildren ? (
                <>
                  <SidebarTooltip
                    isSidebarOpen={isSidebarOpen}
                    content={item.name}
                  >
                    <button
                      onClick={() => handleToggle(item.name)}
                      className={`flex items-center justify-between w-full text-sm font-medium rounded-l-full rounded-r-none px-3 py-2 transition-colors duration-200 ${
                        isOpen
                          ? "bg-primary-light2 text-black"
                          : "hover:bg-primary-light3"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        {isSidebarOpen && <span>{item.name}</span>}
                      </div>
                      {isSidebarOpen && (
                        <ChevronDownIcon
                          className={`h-4 w-4 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>
                  </SidebarTooltip>

                  {/* Submenu Collapse */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <ul className=" py-1">
                      {item.children?.map((child) => (
                        <li key={child.name}>
                          <Link href={child.href}>
                            <SidebarTooltip
                              isSidebarOpen={isSidebarOpen}
                              content={child.name}
                            >
                              <div
                                className={`flex items-center gap-3 text-sm rounded-l-full rounded-r-none px-3 py-2 transition-colors duration-200 ${
                                  isActive
                                    ? "bg-primary-color text-white"
                                    : "hover:bg-primary-light3"
                                }`}
                              >
                                <ChevronRightIcon className="h-4 w-4" />
                                {isSidebarOpen && <span>{child.name}</span>}
                              </div>
                            </SidebarTooltip>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <Link href={item.href}>
                  <SidebarTooltip
                    isSidebarOpen={isSidebarOpen}
                    content={item.name}
                  >
                    <div
                      className={`flex items-center gap-3 text-sm rounded-l-full rounded-r-none px-3 py-2 transition-colors duration-200 ${
                        isActive
                          ? "bg-primary-color text-white"
                          : "hover:bg-primary-light3"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      {isSidebarOpen && <span>{item.name}</span>}
                    </div>
                  </SidebarTooltip>
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      <ul className="space-y-1 ps-3 pt-5">
        <p className="text-gray-500 text-sm font-medium">Finance</p>
        <hr className="border-gray-300" />

        {financeItems.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = open === item.name;
          const isActive =
            path_active === item.href ||
            path_active.startsWith(`${item.href}/`);

          return (
            <li key={item.name}>
              {hasChildren ? (
                <>
                  <SidebarTooltip
                    isSidebarOpen={isSidebarOpen}
                    content={item.name}
                  >
                    <button
                      onClick={() => handleToggle(item.name)}
                      className={`flex items-center justify-between w-full text-sm font-medium rounded-l-full rounded-r-none px-3 py-2 transition-colors duration-200 ${
                        isOpen
                          ? "bg-primary-light2 text-black"
                          : "hover:bg-primary-light3"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        {isSidebarOpen && <span>{item.name}</span>}
                      </div>
                      {isSidebarOpen && (
                        <ChevronDownIcon
                          className={`h-4 w-4 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>
                  </SidebarTooltip>

                  {/* Submenu Collapse */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <ul className=" py-1">
                      {item.children?.map((child) => (
                        <li key={child.name}>
                          <Link href={child.href}>
                            <SidebarTooltip
                              isSidebarOpen={isSidebarOpen}
                              content={child.name}
                            >
                              <div
                                className={`flex items-center gap-3 text-sm rounded-l-full rounded-r-none px-3 py-2 transition-colors duration-200 ${
                                  isActive
                                    ? "bg-primary-color text-white"
                                    : "hover:bg-primary-light3"
                                }`}
                              >
                                <ChevronRightIcon className="h-4 w-4" />
                                {isSidebarOpen && <span>{child.name}</span>}
                              </div>
                            </SidebarTooltip>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <Link href={item.href}>
                  <SidebarTooltip
                    isSidebarOpen={isSidebarOpen}
                    content={item.name}
                  >
                    <div
                      className={`flex items-center gap-3 text-sm rounded-l-full rounded-r-none px-3 py-2 transition-colors duration-200 ${
                        isActive
                          ? "bg-primary-color text-white"
                          : "hover:bg-primary-light3"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      {isSidebarOpen && <span>{item.name}</span>}
                    </div>
                  </SidebarTooltip>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
