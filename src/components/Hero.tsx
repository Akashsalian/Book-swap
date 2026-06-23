interface HeroProps {
  onSell: () => void;
  onBrowse: () => void;
}

export default function Hero({ onSell, onBrowse }: HeroProps) {
  const stats = [
    { value: "2,400+", label: "Books Listed" },
    { value: "1,200+", label: "Happy Readers" },
    { value: "6", label: "Categories" },
    { value: "40%", label: "Avg. Savings" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400 rounded-full blur-2xl" />
      </div>

      {/* Floating book decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {["📚", "📖", "📕", "📗", "📘"].map((emoji, i) => (
          <span
            key={i}
            className="absolute text-3xl opacity-20 animate-float"
            style={{
              top: `${[15, 60, 25, 70, 40][i]}%`,
              left: `${[5, 88, 75, 10, 92][i]}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i}s`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/90 text-sm font-medium">India's #1 Student Book Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
            Buy &amp; Sell Books
            <span className="block text-blue-200">Easily</span>
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl max-w-xl mb-8 leading-relaxed">
            Find affordable books or give your old books a new reader. Save money, share knowledge — it's that simple.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onBrowse}
              className="px-7 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 active:scale-95 transition-all duration-200 shadow-xl shadow-blue-900/20 text-base"
            >
              Browse Books
            </button>
            <button
              onClick={onSell}
              className="px-7 py-3.5 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold rounded-xl hover:bg-white/20 active:scale-95 transition-all duration-200 text-base flex items-center gap-2 justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              List Your Book
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 text-center">
              <div className="text-2xl font-extrabold text-white">{s.value}</div>
              <div className="text-blue-200 text-xs mt-0.5 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
