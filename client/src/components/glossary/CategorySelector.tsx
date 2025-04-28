interface Category {
  id: number;
  value: string;
  label: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (value: string) => void;
}

const CategorySelector = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategorySelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-custom ${
          selectedCategory === "all"
            ? "bg-lavender text-primary"
            : "bg-secondary hover:bg-lavender hover:bg-opacity-50 text-dark"
        }`}
        onClick={() => onSelectCategory("all")}
      >
        All Categories
      </button>
      
      {categories.map(category => (
        <button
          key={category.id}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-custom ${
            selectedCategory === category.value
              ? "bg-lavender text-primary"
              : "bg-secondary hover:bg-lavender hover:bg-opacity-50 text-dark"
          }`}
          onClick={() => onSelectCategory(category.value)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;
