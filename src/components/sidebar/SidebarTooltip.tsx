import React from "react";

type SidebarTooltipProps = {
  isSidebarOpen: boolean;
  children: React.ReactNode;
  content: string;
};

export default function SidebarTooltip({
  isSidebarOpen,
  children,
  content,
}: SidebarTooltipProps) {
  return (
    <div className={`relative group ${isSidebarOpen ? "" : "block"}`}>
      {children}

      {/* Tooltip muncul jika sidebar tertutup */}
      {!isSidebarOpen && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
          <div className="bg-primary-light3 text-black font-bold text-sm px-3 py-2 rounded-r-full  whitespace-nowrap -ms-3">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
