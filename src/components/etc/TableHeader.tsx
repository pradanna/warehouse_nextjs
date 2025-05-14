import React, { ReactNode } from "react";

interface TableHeaderProps {
  leftContent?: ReactNode;
  rightContent?: ReactNode;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  leftContent,
  rightContent,
}) => {
  return (
    <div className="p-3 flex justify-between items-center border-b border-gray-100">
      {/* Bagian Kiri */}
      <div>{leftContent}</div>

      {/* Bagian Kanan */}
      <div className="flex space-x-2">{rightContent}</div>
    </div>
  );
};

export default TableHeader;
