"use client";
import CategoriesPage from "./Categories";
import ItemsPage from "./Items";
import OutletPage from "./Outlet";
import SupplierPage from "./Supplier";

import {
  TagIcon,
  ShoppingBagIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import React, { useState } from "react";

const MasterDataLayout = ({ children }: { children: React.ReactNode }) => {
  const tabs = [
    {
      value: "categories",
      label: "Categories",
      icon: TagIcon,
      component: CategoriesPage,
    },
    {
      value: "items",
      label: "Items",
      icon: ShoppingBagIcon,
      component: ItemsPage,
    },
    {
      value: "outlet",
      label: "Outlet",
      icon: BuildingOffice2Icon,
      component: OutletPage,
    },
    {
      value: "supplier",
      label: "Supplier",
      icon: UserGroupIcon,
      component: SupplierPage,
    },
  ];

  const [activeTab, setActiveTab] = useState<string>(tabs[0].value);
  const ActiveComponent =
    tabs.find((tab) => tab.value === activeTab)?.component || null;

  return (
    <div className="">
      {/* TAB HEADERS */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(({ value, label, icon }) => (
          <div
            key={value}
            className={`p-3 border rounded-lg cursor-pointer transition-all duration-300 flex items-center gap-2 
            ${
              activeTab === value
                ? "bg-primary-light3 text-primary-color"
                : "bg-white hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab(value)}
          >
            {icon && React.createElement(icon, { className: "w-5 h-5" })}
            {label}
          </div>
        ))}
      </div>

      {/* TAB PANEL */}
      <div className="mt-3">{ActiveComponent && <ActiveComponent />}</div>
    </div>
  );
};

export default MasterDataLayout;
