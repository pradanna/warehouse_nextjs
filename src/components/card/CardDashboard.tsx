import React from "react";
import Link from "next/link";

type Item = {
  value: number;
  unit?: string;
  label: string;
  color?: string; // Tailwind color, contoh: "text-blue-500"
};

type CardDashboardProps = {
  title: string;
  items: Item[];
  icon: React.ReactNode;
  href?: string; // Opsional, jika ingin card bisa diklik
  loading?: boolean; // Tambahan props untuk loading
};

export default function CardDashboard({
  title,
  items,
  icon,
  href,
  loading = false,
}: CardDashboardProps) {
  const CardContent = (
    <div className="bg-white shadow shadow-gray-200 rounded-xl px-6 py-4 w-full hover:shadow-md transition-all cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        {loading ? (
          <div className="h-7 w-40 bg-gray-200 rounded animate-pulse" />
        ) : (
          <h3 className="font-semibold text-2xl text-gray-800">{title}</h3>
        )}
        <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
          {loading ? (
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
          ) : (
            icon
          )}
        </div>
      </div>
      <div className="flex justify-between gap-4 text-center">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col flex-1 justify-start items-start border-r last:border-none border-gray-200"
          >
            {loading ? (
              <>
                <div className="h-10 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </>
            ) : (
              <>
                <div
                  className={`text-4xl font-bold ${
                    item.color || "text-gray-800"
                  }`}
                >
                  {item.value}
                  {item.unit && (
                    <span
                      className={`text-sm font-medium ml-1 ${
                        item.color || "text-gray-500"
                      }`}
                    >
                      {item.unit}
                    </span>
                  )}
                </div>
                <div
                  className={`text-sm font-medium ml-1 opacity-75 ${
                    item.color || "text-gray-500"
                  }`}
                >
                  {item.label}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return href && !loading ? (
    <Link href={href} className="block w-full">
      {CardContent}
    </Link>
  ) : (
    CardContent
  );
}
