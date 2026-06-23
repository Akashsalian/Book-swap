import { useState } from "react";
import type { Book } from "../data/books";
import BookDetailModal from "./BookDetailModal";

interface BookCardProps {
  book: Book;
  currentUserId?: string;
  onDeleted?: () => void;
}

const conditionColors: Record<string, string> = {
  New: "bg-green-100 text-green-700 border-green-200",
  "Like New": "bg-blue-100 text-blue-700 border-blue-200",
  Good: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Used: "bg-orange-100 text-orange-700 border-orange-200",
};

export default function BookCard({ book, currentUserId, onDeleted }: BookCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [imgError, setImgError] = useState(false);

  const discount = Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100);
  const isOwner = currentUserId && book.sellerId && currentUserId === book.sellerId;

  return (
    <>
      <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 h-48">
          {!imgError && book.image ? (
            <img src={book.image} alt={book.title} onError={() => setImgError(true)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">📚</div>
          )}
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md">{discount}% OFF</div>
          )}
          <div className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-lg border ${conditionColors[book.condition]}`}>{book.condition}</div>
          {isOwner && (
            <div className="absolute bottom-3 left-3 bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">Your Listing</div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md w-fit mb-2">{book.category}</span>
          <h3 className="font-bold text-slate-800 text-base leading-snug mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors duration-200">{book.title}</h3>
          <p className="text-slate-500 text-xs mb-3">{book.author}</p>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-extrabold text-blue-700">₹{book.price}</span>
            <span className="text-sm text-slate-400 line-through">₹{book.originalPrice}</span>
          </div>
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.floor(book.rating) ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-slate-400 ml-1">{book.rating}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-4">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span>{book.location}</span>
            <span className="mx-1 text-slate-300">•</span>
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span>{book.sellerName}</span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="mt-auto w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl active:scale-95 transition-all duration-200 shadow-md shadow-blue-200 flex items-center justify-center gap-2"
          >
            {isOwner ? "Manage Listing" : "View Details"}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      {showModal && (
        <BookDetailModal
          book={book}
          onClose={() => setShowModal(false)}
          currentUserId={currentUserId}
          onDeleted={onDeleted}
        />
      )}
    </>
  );
}
