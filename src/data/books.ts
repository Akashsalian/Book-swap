export type Condition = "New" | "Like New" | "Good" | "Used";
export type Category =
  | "Academic"
  | "Novels"
  | "Comics"
  | "Competitive Exams"
  | "Technology"
  | "School Books";

export interface Book {
  id: number | string;
  title: string;
  author: string;
  price: number;
  originalPrice: number;
  category: Category;
  condition: Condition;
  location: string;
  sellerName: string;
  sellerEmail?: string;
  sellerId?: string;
  image: string;
  description: string;
  postedDate: string;
  rating: number;
}

export const books: Book[] = [
  {
    id: 1,
    title: "Organic Chemistry",
    author: "Paula Y. Bruice",
    price: 320,
    originalPrice: 850,
    category: "Academic",
    condition: "Good",
    location: "Delhi, IN",
    sellerName: "Arjun Sharma",
    image: "/images/book1.jpg",
    description: "Comprehensive organic chemistry textbook covering all university-level topics. Minor highlights inside, cover intact.",
    postedDate: "2024-12-01",
    rating: 4.5,
  },
  {
    id: 2,
    title: "The Midnight Garden",
    author: "Elena Hartwell",
    price: 150,
    originalPrice: 399,
    category: "Novels",
    condition: "Like New",
    location: "Mumbai, IN",
    sellerName: "Priya Menon",
    image: "/images/book2.jpg",
    description: "A captivating mystery novel set in Victorian England. Read once, excellent condition, no markings.",
    postedDate: "2024-11-28",
    rating: 4.8,
  },
  {
    id: 3,
    title: "Galaxy Heroes Vol. 1",
    author: "Stan Reeves",
    price: 90,
    originalPrice: 250,
    category: "Comics",
    condition: "Used",
    location: "Pune, IN",
    sellerName: "Rohit Kadam",
    image: "/images/book3.jpg",
    description: "Classic superhero comic book. Some wear on corners but all pages complete and readable.",
    postedDate: "2024-11-20",
    rating: 4.2,
  },
  {
    id: 4,
    title: "UPSC Complete Guide 2024",
    author: "Disha Publications",
    price: 480,
    originalPrice: 1200,
    category: "Competitive Exams",
    condition: "Good",
    location: "Hyderabad, IN",
    sellerName: "Sneha Reddy",
    image: "/images/book4.jpg",
    description: "All-in-one UPSC preparation guide with previous year papers. Light pencil marks erased.",
    postedDate: "2024-12-05",
    rating: 4.6,
  },
  {
    id: 5,
    title: "JavaScript Mastery",
    author: "Kyle Simpson",
    price: 290,
    originalPrice: 699,
    category: "Technology",
    condition: "Like New",
    location: "Bangalore, IN",
    sellerName: "Dev Patel",
    image: "/images/book5.jpg",
    description: "Deep dive into modern JavaScript. Barely used, perfect for web developers.",
    postedDate: "2024-12-10",
    rating: 4.9,
  },
  {
    id: 6,
    title: "Class 10 Physics",
    author: "NCERT",
    price: 80,
    originalPrice: 195,
    category: "School Books",
    condition: "Used",
    location: "Chennai, IN",
    sellerName: "Ananya Krishnan",
    image: "/images/book6.jpg",
    description: "NCERT Class 10 Physics textbook, board exam edition. Some underlines and notes.",
    postedDate: "2024-11-15",
    rating: 4.0,
  },
  {
    id: 7,
    title: "Principles of Economics",
    author: "N. Gregory Mankiw",
    price: 410,
    originalPrice: 980,
    category: "Academic",
    condition: "Good",
    location: "Kolkata, IN",
    sellerName: "Sourav Das",
    image: "/images/book7.jpg",
    description: "Standard economics textbook used in top universities. Great condition with minor highlights.",
    postedDate: "2024-12-03",
    rating: 4.4,
  },
  {
    id: 8,
    title: "Realm of Dragons",
    author: "Marcus Vale",
    price: 175,
    originalPrice: 450,
    category: "Novels",
    condition: "New",
    location: "Jaipur, IN",
    sellerName: "Kavya Singh",
    image: "/images/book8.jpg",
    description: "Epic fantasy novel, never been read. Purchased as gift but already have a copy.",
    postedDate: "2024-12-12",
    rating: 4.7,
  },
];

export const categories: { label: Category; icon: string; color: string; bg: string }[] = [
  { label: "Academic", icon: "🎓", color: "text-blue-700", bg: "bg-blue-50" },
  { label: "Novels", icon: "📖", color: "text-purple-700", bg: "bg-purple-50" },
  { label: "Comics", icon: "💥", color: "text-orange-700", bg: "bg-orange-50" },
  { label: "Competitive Exams", icon: "🏆", color: "text-green-700", bg: "bg-green-50" },
  { label: "Technology", icon: "💻", color: "text-indigo-700", bg: "bg-indigo-50" },
  { label: "School Books", icon: "🏫", color: "text-pink-700", bg: "bg-pink-50" },
];
