import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import TitleWithSubtitle from "../etc/TitleandSubtitle";
import TableHeader from "../etc/TableHeader";

const categories = ["All", "Electronics", "Furniture", "Clothing"];

interface FilterProps {
  search: string;
  category: string;
  lowStock: boolean;
  hiStock: boolean;
}

interface InventoryFilterProps {
  onFilterChange: (filters: FilterProps) => void; // Fungsi yang menerima FilterProps
}

const InventoryFilter: React.FC<InventoryFilterProps> = ({
  onFilterChange,
}) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lowStock, setLowStock] = useState(false);
  const [hiStock, setHiStock] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilterChange({
      search: e.target.value,
      category: selectedCategory,
      lowStock,
      hiStock,
    });
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    onFilterChange({ search, category, lowStock, hiStock });
  };

  const handleLowStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLowStock(e.target.checked);
    setHiStock(false);
    onFilterChange({
      search,
      category: selectedCategory,
      lowStock: e.target.checked,
      hiStock: false,
    });
  };

  const handleHiStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHiStock(e.target.checked);
    setLowStock(false);
    onFilterChange({
      search,
      category: selectedCategory,
      hiStock: e.target.checked,
      lowStock: false,
    });
  };
  return (
    <div className=" w-72">
      {/* Field Search */}
      <TableHeader
        leftContent={
          <TitleWithSubtitle
            title="Pencarian Data"
            subtitle="Cari data inventory"
            count={undefined}
          />
        }
      />

      <div className="p-3">
        <div className="relative mt-3 ">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={handleSearchChange}
            className="px-4 py-2 pl-10 border rounded-lg w-full"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>

        {/* Pills Category */}
        <div className="flex items-center gap-2 border-b border-light2 pb-1 mt-6">
          <p className="text-xs font-bold">Kategori</p>
        </div>
        <div className="flex  flex-wrap space-y-1 mt-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-1 rounded-full text-sm me-2 ${
                selectedCategory === category
                  ? "bg-primary-light3 text-primary-color "
                  : "bg-light2 text-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Checkbox untuk filter stok rendah */}
        <div className="flex items-center gap-2 border-b border-light2 pb-1  mt-12">
          <p className="text-xs font-bold">Kondisi Khusus</p>
        </div>
        <label className="flex items-center space-x-2 cursor-pointer mt-3">
          <input
            type="checkbox"
            checked={lowStock}
            onChange={handleLowStockChange}
          />
          <span className="text-xs text-dark3">Qty Kurang dari 5</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer mt-3">
          <input
            type="checkbox"
            checked={hiStock}
            onChange={handleHiStockChange}
          />
          <span className="text-xs text-dark3">Qty Lebih dari 30</span>
        </label>
      </div>
    </div>
  );
};

export default InventoryFilter;
