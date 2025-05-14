import React from "react";
import clsx from "clsx";

type PaddingSize = "p-sm" | "p-md" | "p-lg";

type PanelProps = {
  title?: string;
  subtitle?: string;
  padding?: PaddingSize;
  children: React.ReactNode;
  actionChildren?: React.ReactNode;
  className?: string;
};

const paddingMap: Record<PaddingSize, string> = {
  "p-sm": "p-3",
  "p-md": "p-5",
  "p-lg": "p-8",
};

export default function GenosPanel({
  title,
  subtitle,
  padding = "p-md",
  children,
  actionChildren,
  className = "",
}: PanelProps) {
  const showHeader = title || subtitle;

  return (
    <div
      className={clsx(
        "bg-white rounded-lg shadow-sm  overflow-hidden ",

        className
      )}
    >
      {showHeader && (
        <div className="flex justify-between items-center  border-b border-gray-100 ">
          <div className={paddingMap[padding]}>
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {subtitle && (
              <p className="text-xs text-gray-400  font-light">{subtitle}</p>
            )}
          </div>

          {actionChildren}
        </div>
      )}

      <div className={paddingMap[padding]}>{children}</div>
    </div>
  );
}
