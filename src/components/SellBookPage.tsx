import { useState, useRef, type ChangeEvent } from "react";
import { categories } from "../data/books";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

interface SellBookPageProps {
  onBack: () => void;
  onBookListed: () => void;
  user: User;
}

interface FormData {
  title: string;
  author: string;
  price: string;
  originalPrice: string;
  category: string;
  condition: string;
  location: string;
  description: string;
}

const initialForm: FormData = { title: "", author: "", price: "", originalPrice: "", category: "", condition: "", location: "", description: "" };

export default function SellBookPage({ onBack, onBookListed, user }: SellBookPageProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.title.trim()) newErrors.title = "Book title is required";
    if (!form.price.trim() || isNaN(Number(form.price))) newErrors.price = "Valid price is required";
    if (!form.category) newErrors.category = "Please select a category";
    if (!form.condition) newErrors.condition = "Please select condition";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSubmitError("");

    const sellerName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Anonymous";

    const { error } = await supabase.from("books").insert([{
      title: form.title,
      author: form.author,
      price: Number(form.price),
      original_price: form.originalPrice ? Number(form.originalPrice) : Number(form.price),
      category: form.category,
      condition: form.condition,
      location: form.location,
      description: form.description,
      seller_name: sellerName,
      seller_id: user.id,
      seller_email: user.email,
      image_url: imagePreview || "",
    }]);

    setLoading(false);

    if (error) {
      setSubmitError("Failed to list book. Please try again. Error: " + error.message);
    } else {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setImagePreview(null);
    setErrors({});
    setSubmitted(false);
    setSubmitError("");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-slate-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Book Listed! 🎉</h2>
          <p className="text-slate-500 mb-6 text-sm leading-relaxed">
            Your book <span className="font-semibold text-slate-700">"{form.title}"</span> has been listed successfully. Buyers in <span className="font-semibold text-slate-700">{form.location}</span> can now see it.
          </p>
          <div className="bg-blue-50 rounded-2xl p-4 mb-6 text-left">
            <div className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Listing Summary</div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm"><span className="text-slate-500">Category</span><span className="font-semibold text-slate-700">{form.category}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Condition</span><span className="font-semibold text-slate-700">{form.condition}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Listed Price</span><span className="font-extrabold text-blue-700">₹{form.price}</span></div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={handleReset} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-200 active:scale-95 shadow-md shadow-blue-200">List Another Book</button>
            <button onClick={onBookListed} className="w-full py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-200 active:scale-95">View All Books</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium mb-4 transition-colors group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back to Home
          </button>
          <h1 className="text-3xl font-extrabold text-slate-800">List Your Book</h1>
          <p className="text-slate-500 mt-1">Fill in the details below to reach thousands of readers.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">1</span>
              Book Cover Image
            </h2>
            <div
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${dragOver ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-400 hover:bg-slate-50"} ${imagePreview ? "border-blue-400 bg-blue-50/30" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              {imagePreview ? (
                <div className="flex flex-col items-center gap-3">
                  <img src={imagePreview} alt="Preview" className="w-40 h-52 object-cover rounded-xl shadow-lg border-4 border-white" />
                  <p className="text-sm text-blue-600 font-medium">Click or drag to change image</p>
                </div>
              ) : (
                <div className="py-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                  </div>
                  <p className="text-sm font-semibold text-slate-600">Drag & drop your image here</p>
                  <p className="text-xs text-slate-400 mt-1">or click to browse — PNG, JPG, WebP</p>
                </div>
              )}
            </div>
          </div>

          {/* Book Details */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">2</span>
              Book Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Book Title <span className="text-red-500">*</span></label>
                <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Organic Chemistry by Bruice"
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 ${errors.title ? "border-red-400 bg-red-50" : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-slate-50 focus:bg-white"}`} />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Author Name</label>
                <input type="text" name="author" value={form.author} onChange={handleChange} placeholder="e.g. Paula Y. Bruice"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm outline-none transition-all duration-200" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Selling Price (₹) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">₹</span>
                  <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="250" min="1"
                    className={`w-full pl-8 pr-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 ${errors.price ? "border-red-400 bg-red-50" : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-slate-50 focus:bg-white"}`} />
                </div>
                {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Original MRP (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">₹</span>
                  <input type="number" name="originalPrice" value={form.originalPrice} onChange={handleChange} placeholder="600" min="1"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm outline-none transition-all duration-200" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                <select name="category" value={form.category} onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 cursor-pointer ${errors.category ? "border-red-400 bg-red-50" : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-slate-50 focus:bg-white"} ${!form.category ? "text-slate-400" : "text-slate-800"}`}>
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => (<option key={cat.label} value={cat.label}>{cat.icon} {cat.label}</option>))}
                </select>
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Condition <span className="text-red-500">*</span></label>
                <select name="condition" value={form.condition} onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 cursor-pointer ${errors.condition ? "border-red-400 bg-red-50" : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-slate-50 focus:bg-white"} ${!form.condition ? "text-slate-400" : "text-slate-800"}`}>
                  <option value="" disabled>Select condition</option>
                  <option value="New">🟢 New</option>
                  <option value="Like New">🔵 Like New</option>
                  <option value="Good">🟡 Good</option>
                  <option value="Used">🟠 Used</option>
                </select>
                {errors.condition && <p className="text-xs text-red-500 mt-1">{errors.condition}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Location <span className="text-red-500">*</span></label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Delhi, IN"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 ${errors.location ? "border-red-400 bg-red-50" : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-slate-50 focus:bg-white"}`} />
                </div>
                {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description <span className="text-red-500">*</span></label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe the book condition, any highlights, missing pages, etc."
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 resize-none ${errors.description ? "border-red-400 bg-red-50" : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-slate-50 focus:bg-white"}`} />
                <div className="flex justify-between mt-1">
                  {errors.description ? <p className="text-xs text-red-500">{errors.description}</p> : <span />}
                  <span className="text-xs text-slate-400">{form.description.length} chars</span>
                </div>
              </div>
            </div>
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-600">⚠️ {submitError}</div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pb-6">
            <button type="submit" disabled={loading}
              className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl text-base transition-all duration-200 active:scale-95 shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Publishing...</>
              ) : (
                <><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>Publish Listing</>
              )}
            </button>
            <button type="button" onClick={handleReset} className="sm:w-36 py-4 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-200 active:scale-95">Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
}
