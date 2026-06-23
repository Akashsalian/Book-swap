import { useState, useRef, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategoryFilter from "./components/CategoryFilter";
import BooksGrid from "./components/BooksGrid";
import SellBookPage from "./components/SellBookPage";
import Footer from "./components/Footer";
import AuthPage from "./components/AuthPage";
import { supabase } from "./lib/supabase";
import { books as staticBooks, type Category } from "./data/books";
import type { Book } from "./data/books";
import type { User } from "@supabase/supabase-js";

type Page = "home" | "sell";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [dbBooks, setDbBooks] = useState<Book[]>([]);
  const browseSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoadingAuth(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    const { data, error } = await supabase.from("books").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      const mapped: Book[] = data.map((b) => ({
        id: b.id,
        title: b.title,
        author: b.author || "",
        price: b.price,
        originalPrice: b.original_price || b.price,
        category: b.category as Category,
        condition: b.condition,
        location: b.location,
        sellerName: b.seller_name || "Anonymous",
        sellerEmail: b.seller_email || "",
        sellerId: b.seller_id || "",
        image: b.image_url || "",
        description: b.description || "",
        postedDate: b.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
        rating: 4.5,
      }));
      setDbBooks(mapped);
    }
  };

  const allBooks = [...dbBooks, ...staticBooks];

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBrowse = () => {
    browseSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleBookListed = () => {
    fetchBooks();
    handleNavigate("home");
  };

  const filteredBooks = allBooks.filter((book) => {
    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q) || book.category.toLowerCase().includes(q) || book.location.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <svg className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-slate-500 text-sm">Loading BookSwap...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onLogin={() => {}} />;
  }

  if (currentPage === "sell") {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar currentPage={currentPage} onNavigate={handleNavigate} searchQuery={searchQuery} onSearchChange={setSearchQuery} user={user} onLogout={handleLogout} />
        <main className="flex-1">
          <SellBookPage onBack={() => handleNavigate("home")} onBookListed={handleBookListed} user={user} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} searchQuery={searchQuery} onSearchChange={(q) => { setSearchQuery(q); if (q) browseSectionRef.current?.scrollIntoView({ behavior: "smooth" }); }} user={user} onLogout={handleLogout} />
      <main className="flex-1">
        <Hero onSell={() => handleNavigate("sell")} onBrowse={handleBrowse} />
        <div ref={browseSectionRef}>
          <CategoryFilter selected={selectedCategory} onSelect={(cat) => { setSelectedCategory(cat); setSearchQuery(""); }} />
          <BooksGrid books={filteredBooks} selectedCategory={selectedCategory} searchQuery={searchQuery} currentUserId={user.id} onBookDeleted={fetchBooks} />
        </div>
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Have books collecting dust? 📚</h2>
            <p className="text-blue-100 text-lg mb-7">Turn your old textbooks into cash. List your book in under 2 minutes.</p>
            <button onClick={() => handleNavigate("sell")} className="px-8 py-4 bg-white text-blue-700 font-bold rounded-xl text-base hover:bg-blue-50 active:scale-95 transition-all duration-200 shadow-xl shadow-blue-900/20 inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Start Selling Now
            </button>
          </div>
        </section>
        <section className="py-16 bg-white px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">How BookSwap Works</h2>
              <p className="text-slate-500 mt-2">Simple, fast, and student-friendly</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[{ step: "01", icon: "🔍", title: "Browse & Search", desc: "Search through thousands of books by category, title, or location." }, { step: "02", icon: "💬", title: "Contact Seller", desc: "Found what you need? Tap 'Contact Seller' to reach out directly." }, { step: "03", icon: "🤝", title: "Swap & Save", desc: "Meet, exchange, and save big. No middlemen, no commissions." }].map((item) => (
                <div key={item.step} className="relative bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <div className="absolute top-4 right-4 text-4xl font-extrabold text-blue-200 leading-none">{item.step}</div>
                  <h3 className="font-bold text-slate-800 text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-16 bg-slate-50 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">What Students Say</h2>
              <p className="text-slate-500 mt-2">Join 1,200+ happy readers and sellers</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[{ name: "Meera Joshi", role: "B.Tech, IIT Delhi", text: "Found my entire semester's worth of textbooks at 60% off. BookSwap is a lifesaver!", avatar: "MJ", rating: 5 }, { name: "Rahul Verma", role: "UPSC Aspirant, Patna", text: "Sold 12 books in one week! Super easy to list and buyers reached out instantly.", avatar: "RV", rating: 5 }, { name: "Ananya Patel", role: "Class 12, CBSE, Surat", text: "Got all my NCERT books here for almost nothing. Great condition too!", avatar: "AP", rating: 4 }].map((t) => (
                <div key={t.name} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-1 mb-4">
                    {[1,2,3,4,5].map((s) => (<svg key={s} className={`w-4 h-4 ${s <= t.rating ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{t.avatar}</div>
                    <div><div className="font-semibold text-slate-800 text-sm">{t.name}</div><div className="text-xs text-slate-400">{t.role}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
