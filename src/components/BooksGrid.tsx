import { useState } from "react";
import BookCard from "./BookCard";
import type { Book } from "../data/books";

interface BooksGridProps {
  books: Book[];
  selectedCategory: string;
  searchQuery: string;
  currentUserId?: string;
  onBookDeleted?: () => void;
}

type SortOption = "default" | "price-asc" | "price-desc" | "rating";

export default function BooksGrid({ books, selectedCategory, searchQuery, currentUserId, onBookDeleted }: BooksGridProps) {
  const [sort, setSort] = useState<SortOption>("default");

  const sorted = [...books].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <section className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {searchQuery ? `Results for "${searchQuery}"` : selectedCategory === "All" ? "All Books" : selectedCategory}
            </h2>
            <p className="text-slate-500 text-sm mt-1">{sorted.length} book{sorted.length !== 1 ? "s" : ""} found</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 hidden sm:inline">Sort by:</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-slate-700 cursor-pointer transition-all duration-200">
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {sorted.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sorted.map((book) => (
              <BookCard key={book.id} book={book} currentUserId={currentUserId} onDeleted={onBookDeleted} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">📭</span>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Books Found</h3>
            <p className="text-slate-400 max-w-sm">
              {searchQuery ? `No books match "${searchQuery}". Try a different search term.` : "No books in this category yet. Be the first to list one!"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
