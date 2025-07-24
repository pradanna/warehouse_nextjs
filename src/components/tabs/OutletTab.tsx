"use client";

import { useEffect, useState } from "react";
import { getOutlet } from "@/lib/api/outletApi"; // Sesuaikan path
import clsx from "clsx";

interface Outlet {
  id: string;
  name: string;
}

interface OutletTabsProps {
  onSelect: (outletId: string) => void;
}

export default function OutletTabs({ onSelect }: OutletTabsProps) {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        setLoading(true);
        const data = await getOutlet("", 1, 20);
        const outletList = data?.data || [];
        setOutlets(outletList);
        if (outletList.length > 0) {
          setActiveId(outletList[0].id);
          onSelect(outletList[0].id);
        }
      } catch (err) {
        console.error("Failed to load outlets", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOutlets();
  }, [onSelect]);

  const handleClick = (id: string) => {
    setActiveId(id);
    onSelect(id);
  };

  if (loading) {
    return (
      <div className="flex gap-3 mb-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-32 h-10 bg-gray-200 animate-pulse rounded-md"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 mb-4 rounded-xl">
      {outlets.map((outlet) => (
        <button
          key={outlet.id}
          onClick={() => handleClick(outlet.id)}
          className={clsx(
            "px-6 py-2 rounded-md font-semibold transition-all text-xs cursor-pointer",
            outlet.id === activeId
              ? "bg-primary-color text-white"
              : "bg-white border border-gray-300 text-gray-600 hover:bg-primary/10"
          )}
        >
          {outlet.name}
        </button>
      ))}
    </div>
  );
}
