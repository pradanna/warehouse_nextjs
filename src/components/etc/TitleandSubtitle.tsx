import React from "react";

interface TitleWithSubtitleProps {
  title?: string;
  subtitle?: string;
  count?: number; // Menambahkan tipe yang sesuai
}

const TitleWithSubtitle: React.FC<TitleWithSubtitleProps> = ({
  title = "",
  subtitle = "",
  count,
}) => {
  return (
    <div>
      {title && (
        <p className="text-xl font-semibold mb-1">
          {title}{" "}
          {count !== undefined && (
            <span className="px-2 py-1 text-xs font-medium bg-primary-light2 text-primary-color rounded-full">
              {count} Total
            </span>
          )}
        </p>
      )}
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </div>
  );
};

export default TitleWithSubtitle;
