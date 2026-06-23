import { useEffect, useState } from "react";
import type { Book } from "../data/books";
import { supabase } from "../lib/supabase";

interface BookDetailModalProps {
  book: Book;
  onClose: () => void;
  currentUserId?: string;
  onDeleted?: () => void;
}

const conditionColors: Record<string, string> = {
  New: "bg-green-100 text-green-700",
  "Like New": "bg-blue-100 text-blue-700",
  Good: "bg-yellow-100 text-yellow-700",
  Used: "bg-orange-100 text-orange-700",
};

export default function BookDetailModal({ book, onClose, currentUserId, onDeleted }: BookDetailModalProps) {
  const [imgError, setImgError] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwner = currentUserId && book.sellerId && currentUserId === book.sellerId;
  const discount = Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await supabase.from("books").delete().eq("id", book.id);
    setDeleting(false);
    if (!error) {
      onClose();
      onDeleted?.();
    } else {
      alert("Failed to delete book. Please try again.");
    }
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Hi! I'm interested in buying "${book.title}" listed on BookSwap for ₹${book.price}. Is it still available?`);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Interested in: ${book.title} - BookSwap`);
    const body = encodeURIComponent(`Hi ${book.sellerName},\n\nI found your book "${book.title}" on BookSwap listed for ₹${book.price}.\n\nIs it still available? I'd like to buy it.\n\nLocation: ${book.location}\n\nThanks!`);
    window.open(`mailto:${book.sellerEmail || ""}?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-modal-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="font-bold text-slate-800 text-lg">Book Details</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Image */}
            <div className="sm:w-48 flex-shrink-0">
              <div className="w-full sm:w-48 h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shadow-md">
                {!imgError && book.image ? (
                  <img src={book.image} alt={book.title} onError={() => setImgError(true)} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">📚</div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">{book.category}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${conditionColors[book.condition]}`}>{book.condition}</span>
                {isOwner && <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">Your Listing</span>}
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-1 leading-snug">{book.title}</h3>
              <p className="text-slate-500 text-sm mb-4">by {book.author}</p>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-extrabold text-blue-700">₹{book.price}</span>
                <div>
                  <span className="text-sm text-slate-400 line-through block">₹{book.originalPrice}</span>
                  <span className="text-xs font-semibold text-green-600">{discount}% savings</span>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className={`w-4 h-4 ${star <= Math.floor(book.rating) ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-sm text-slate-500 ml-1">{book.rating} / 5.0</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { icon: "📍", label: "Location", value: book.location },
                  { icon: "👤", label: "Seller", value: book.sellerName },
                  { icon: "📅", label: "Posted", value: new Date(book.postedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                  { icon: "📦", label: "Condition", value: book.condition },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                    <div className="text-xs text-slate-400 mb-0.5">{item.icon} {item.label}</div>
                    <div className="text-sm font-semibold text-slate-700">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-5 p-4 bg-slate-50 rounded-2xl">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Description</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{book.description}</p>
          </div>

          {/* Contact Seller Panel */}
          {showContact && !isOwner && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <h4 className="text-sm font-bold text-blue-700 mb-3">Contact {book.sellerName}</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleWhatsApp}
                  className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.849L.057 23.5l5.797-1.522A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.651-.519-5.16-1.42l-.37-.22-3.44.903.92-3.352-.24-.386A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                  WhatsApp
                </button>
                <button
                  onClick={handleEmail}
                  className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Email
                </button>
              </div>
              <p className="text-xs text-blue-600 mt-2 text-center">Mention you found this on BookSwap 📚</p>
            </div>
          )}

          {/* Delete Confirm */}
          {showDeleteConfirm && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-sm font-semibold text-red-700 mb-3">Are you sure you want to delete this listing?</p>
              <div className="flex gap-2">
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-bold rounded-xl text-sm transition-all active:scale-95">
                  {deleting ? "Deleting..." : "Yes, Delete"}
                </button>
                <button onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-all">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            {isOwner ? (
              <>
                <button
                  onClick={() => { setShowDeleteConfirm(true); setShowContact(false); }}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Listing
                </button>
                <button onClick={onClose} className="flex-1 sm:flex-none sm:px-6 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-200 active:scale-95">
                  Close
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setShowContact(!showContact); setShowDeleteConfirm(false); }}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {showContact ? "Hide Contact" : "Contact Seller"}
                </button>
                <button onClick={onClose} className="flex-1 sm:flex-none sm:px-6 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-200 active:scale-95">
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
