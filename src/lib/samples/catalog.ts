/**
 * Products & catalog data are SEPARATE from the blueprint.
 *
 * The blueprint says "show featured products"; the product system supplies the
 * actual products. This mirrors the real architecture where products live in
 * their own table and are pulled by `storeId` at render time.
 */

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  category: string;
  featured?: boolean;
  bestseller?: boolean;
  rating?: number;
  reviews?: number;
  sold?: number;
  createdAt: string;
}

export interface Category {
  id: string;
  storeId: string;
  name: string;
  image: string;
}

export interface Testimonial {
  id: string;
  storeId: string;
  author: string;
  text: string;
  rating: number;
}

export interface FaqItem {
  id: string;
  storeId: string;
  question: string;
  answer: string;
}

export interface Stat {
  id: string;
  storeId: string;
  label: string;
  value: string;
}

export interface GalleryImage {
  id: string;
  storeId: string;
  image: string;
  caption?: string;
}

export interface Collection {
  id: string;
  storeId: string;
  name: string;
  description?: string;
  image: string;
  productCount: number;
}

export interface Catalog {
  storeId: string;
  products: Product[];
  categories: Category[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  stats: Stat[];
  gallery: GalleryImage[];
  collections: Collection[];
}

/** Deterministic SVG placeholder so the POC needs no image assets or network. */
export function placeholderImage(label: string, bg: string, fg: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="${bg}"/><text x="50%" y="50%" fill="${fg}" font-family="sans-serif" font-size="42" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/* ------------------------------------------------------------------ */
/* Deterministic sales/social stats so every product looks "lived in"  */
/* ------------------------------------------------------------------ */

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Derive realistic rating/reviews/sold from a stable id when not provided. */
export function productStats(id: string): { rating: number; reviews: number; sold: number } {
  const h = hashString(id);
  const rating = Math.round((4.2 + (h % 8) / 10) * 10) / 10;
  const reviews = 40 + (h % 4200);
  const sold = 120 + (h % 9400);
  return { rating, reviews, sold };
}

/* ------------------------------------------------------------------ */
/* Industry-specific starter data (used by the offline generator)      */
/* ------------------------------------------------------------------ */

const INDUSTRY_PRODUCT_NAMES: Record<string, string[]> = {
  fashion: ["Classic Tee", "Linen Shirt", "Tailored Trousers", "Denim Jacket", "Silk Scarf", "Oversized Hoodie", "Wrap Dress", "Pleated Skirt", "Knitted Cardigan", "Cargo Pants", "Chiffon Blouse", "Maxi Dress"],
  footwear: ["Leather Loafer", "Running Sneaker", "Chelsea Boot", "Slide Sandal", "Court Shoe", "High-top", "Espadrille", "Monk Strap", "Ankle Boot", "Mule", "Derby", "Trainer"],
  food: ["Jollof Rice Box", "Grilled Chicken", "Egusi Bowl", "Meat Pie", "Pepper Soup", "Suya Skewers", "Pounded Yam Combo", "Seafood Okra", "Fried Plantain", "Coleslaw", "Puff Puff", "Fresh Juice"],
  beauty: ["Matte Lipstick", "Foundation", "Eyeshadow Palette", "Mascara", "Blush", "Setting Spray", "Eyeliner", "Highlighter", "Concealer", "Lip Gloss", "Brow Gel", "Makeup Brushes"],
  skincare: ["Vitamin C Serum", "Hydrating Toner", "SPF 50 Lotion", "Cleansing Balm", "Retinol Cream", "Clay Mask", "Eye Cream", "Night Cream", "Exfoliating Scrub", "Face Oil", "Sheet Mask", "Moisturizer"],
  electronics: ["Wireless Earbuds", "Smart Watch", "Bluetooth Speaker", "Power Bank", "USB-C Hub", "Mechanical Keyboard", "Wireless Mouse", "Webcam", "Portable SSD", "Smart Bulb", "Charging Dock", "Noise-Cancelling Headphones"],
  furniture: ["Sofa Set", "Dining Table", "Office Chair", "Bookshelf", "Coffee Table", "Wardrobe", "Bed Frame", "Nightstand", "TV Stand", "Armchair", "Console Table", "Shoe Rack"],
  jewelry: ["Gold Chain", "Silver Ring", "Pearl Earrings", "Diamond Bracelet", "Pendant Necklace", "Hoop Earrings", "Cuff Bangle", "Tennis Bracelet", "Signet Ring", "Locket", "Anklet", "Statement Necklace"],
  accessories: ["Leather Wallet", "Canvas Tote", "Sunglasses", "Watch Strap", "Belt", "Beanie", "Backpack", "Card Holder", "Scarf", "Keychain", "Cap", "Tie"],
  fitness: ["Yoga Mat", "Resistance Bands", "Dumbbell Set", "Kettlebell", "Foam Roller", "Jump Rope", "Gym Gloves", "Water Bottle", "Workout Tee", "Leggings", "Ankle Weights", "Gym Bag"],
  "home-decor": ["Throw Pillow", "Wall Art", "Ceramic Vase", "Area Rug", "Table Lamp", "Candle Set", "Photo Frame", "Wall Clock", "Plant Pot", "Curtains", "Mirror", "Throw Blanket"],
  toys: ["Building Blocks", "Stuffed Bear", "Puzzle Set", "Toy Car", "Dollhouse", "Board Game", "Remote Car", "Action Figure", "Art Kit", "Lego Set", "Play Dough", "Scooter"],
  books: ["Bestseller Novel", "Cookbook", "Business Book", "Children's Book", "Sci-Fi Saga", "Poetry Collection", "Self-Help", "History Book", "Graphic Novel", "Memoir", "Mystery Thriller", "Notebook"],
  pets: ["Premium Dog Food", "Cat Litter", "Chew Toy", "Pet Bed", "Leash Set", "Cat Tower", "Grooming Kit", "Pet Carrier", "Treats", "Bird Cage", "Aquarium", "Collar"],
  wellness: ["Herbal Tea", "Vitamin D3", "Magnesium", "Omega-3", "Protein Powder", "Collagen", "Sleep Spray", "Stress Gummies", "Probiotics", "Ashwagandha", "Essential Oil", "Wellness Journal"],
  groceries: ["Rice (5kg)", "Cooking Oil", "Pasta Pack", "Tomato Paste", "Cereal", "Honey", "Oatmeal", "Spice Mix", "Canned Beans", "Bread", "Milk", "Snack Pack"],
  artisan: ["Handwoven Basket", "Clay Pot", "Beaded Necklace", "Carved Sculpture", "Tie-Dye Fabric", "Leather Pouch", "Wooden Bowl", "Brass Figurine", "Woven Mat", "Ceramic Mug", "Batik Wall Hanging", "Raffia Bag"],
  other: ["Signature Item 1", "Signature Item 2", "Signature Item 3", "Signature Item 4", "Signature Item 5", "Signature Item 6", "Signature Item 7", "Signature Item 8", "Signature Item 9", "Signature Item 10", "Signature Item 11", "Signature Item 12"],
};

/**
 * Builds a starter catalog for a freshly generated store. In production this
 * is replaced by real product data the user imports/adds; for the POC it gives
 * the generator something meaningful to render.
 */
export function makeStarterCatalog(storeId: string, industry: string): Catalog {
  const names = INDUSTRY_PRODUCT_NAMES[industry] ?? INDUSTRY_PRODUCT_NAMES.other;
  const label = industry.toUpperCase().slice(0, 6);

  const products: Product[] = names.slice(0, 12).map((name, i) => ({
    id: `${storeId}-p${i + 1}`,
    storeId,
    name,
    price: 15000 + ((i * 7000) % 90000),
    compareAtPrice: i % 3 === 0 ? 15000 + ((i * 7000) % 90000) + 8000 : undefined,
    image: placeholderImage(`${label} ${i + 1}`, palette(i), "#ffffff"),
    category: i % 2 === 0 ? "New Arrivals" : "Best Sellers",
    featured: i < 8,
    bestseller: i % 4 === 0,
    createdAt: `2026-09-${String((i % 28) + 1).padStart(2, "0")}`,
  }));

  return {
    storeId,
    products,
    categories: [
      { id: `${storeId}-c1`, storeId, name: "New Arrivals", image: placeholderImage("NEW", palette(0), "#fff") },
      { id: `${storeId}-c2`, storeId, name: "Best Sellers", image: placeholderImage("BEST", palette(2), "#fff") },
      { id: `${storeId}-c3`, storeId, name: "Limited", image: placeholderImage("LIMITED", palette(4), "#fff") },
      { id: `${storeId}-c4`, storeId, name: "Sale", image: placeholderImage("SALE", palette(6), "#fff") },
    ],
    testimonials: [
      { id: `${storeId}-t1`, storeId, author: "Amara C.", text: "Fast delivery and the quality exceeded my expectations.", rating: 5 },
      { id: `${storeId}-t2`, storeId, author: "Tunde B.", text: "Exactly what I was looking for. Will order again.", rating: 5 },
      { id: `${storeId}-t3`, storeId, author: "Ngozi A.", text: "Great value for money. Customer service was helpful.", rating: 4 },
      { id: `${storeId}-t4`, storeId, author: "Segun F.", text: "The packaging was beautiful and the product is top-notch.", rating: 5 },
    ],
    faqs: [
      { id: `${storeId}-f1`, storeId, question: "How long does delivery take?", answer: "Orders are delivered within 2–4 business days within Lagos, and 3–7 days nationwide." },
      { id: `${storeId}-f2`, storeId, question: "What is your return policy?", answer: "You have 7 days from delivery to return unused items in their original packaging for a full refund." },
      { id: `${storeId}-f3`, storeId, question: "Do you offer international shipping?", answer: "Currently we ship within Nigeria. International shipping is coming soon." },
      { id: `${storeId}-f4`, storeId, question: "How do I track my order?", answer: "You'll receive a tracking link by email as soon as your order is dispatched." },
    ],
    stats: [
      { id: `${storeId}-s1`, storeId, label: "Happy Customers", value: "10,000+" },
      { id: `${storeId}-s2`, storeId, label: "Products Sold", value: "45,000+" },
      { id: `${storeId}-s3`, storeId, label: "Average Rating", value: "4.8/5" },
      { id: `${storeId}-s4`, storeId, label: "Years in Business", value: "5+" },
    ],
    gallery: Array.from({ length: 6 }, (_, i) => ({
      id: `${storeId}-g${i + 1}`,
      storeId,
      image: placeholderImage(`GALLERY ${i + 1}`, palette(i + 1), "#fff"),
      caption: i === 0 ? "Behind the scenes" : undefined,
    })),
    collections: [
      { id: `${storeId}-cl1`, storeId, name: "New Arrivals", description: "Fresh drops this week", image: placeholderImage("NEW", palette(0), "#fff"), productCount: 24 },
      { id: `${storeId}-cl2`, storeId, name: "Best Sellers", description: "Customer favourites", image: placeholderImage("BEST", palette(3), "#fff"), productCount: 18 },
      { id: `${storeId}-cl3`, storeId, name: "Limited Edition", description: "While stock lasts", image: placeholderImage("LIMITED", palette(6), "#fff"), productCount: 12 },
    ],
  };
}

function palette(i: number): string {
  const colors = ["#334155", "#7C2D12", "#1E3A8A", "#4A3B2A", "#3B2F23", "#0F766E", "#6D28D9", "#9A3412"];
  return colors[i % colors.length];
}
