interface CategorySummary {
  name: string;
  total: number;
}

interface CardCategoryProps {
  categories: CategorySummary[];
  onClick?: (category: string) => void; // opsional: untuk filter
  selectedCategory?: string;
}

export const CardCategory = ({
  categories,
  onClick,
  selectedCategory,
}: CardCategoryProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 mb-4">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.name;
        return (
          <div
            key={cat.name}
            onClick={() => onClick?.(cat.name)}
            className={`cursor-pointer rounded-xl px-3 py-2 border border-sm transition text-xs ${
              isSelected
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white hover:bg-blue-100 text-gray-800 border-gray-200"
            }`}
          >
            <div className="font-medium text-left truncate">{cat.name}</div>
            <div className="text-sm font-bold text-left">{cat.total}</div>
          </div>
        );
      })}
    </div>
  );
};
