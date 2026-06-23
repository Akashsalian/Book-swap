import { categories, type Category } from "../data/books";

interface CategoryFilterProps {
  selected: Category | "All";
  onSelect: (cat: Category | "All") => void;
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const all = { label: "All" as const, icon: "✨", color: "text-slate-700", bg: "bg-slate-50" };
  const allItems = [all, ...categories];

  return (
    <section className="py-10 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Browse Categories</h2>
            <p className="text-slate-500 text-sm mt-1">Find books by category</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {allItems.map((cat) => {
            const isActive = selected === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => onSelect(cat.label as Category | "All")}
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold
                  transition-all duration-200 hover:scale-105 active:scale-95
                  ${isActive
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
                    : `${cat.bg} border-transparent ${cat.color} hover:border-current`
                  }
                `}
              >
                <span className="text-base">{cat.icon}</span>
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
