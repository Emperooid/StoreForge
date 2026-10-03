/**
 * Sample stores — six templates demonstrating that the SAME renderer produces
 * completely different storefronts from different blueprints + catalogs.
 *
 * Each store exercises a different industry, visual style, and mix of section
 * types (including the newer sections: announcement-bar, text-image,
 * brand-story, faq, social-proof, image-gallery, collection-grid).
 */

import type { StoreBlueprint } from "../blueprint/schema";
import type { Catalog } from "./catalog";
import { placeholderImage } from "./catalog";

const img = (label: string, bg: string) => placeholderImage(label, bg, "#ffffff");

/* ------------------------------------------------------------------ */
/* 1. Kairo — premium leather footwear                                  */
/* ------------------------------------------------------------------ */

export const kairoBlueprint: StoreBlueprint = {
  version: 1,
  store: { name: "Kairo", description: "Premium Nigerian leather footwear", industry: "footwear", slug: "kairo" },
  branding: { primaryColor: "#111111", secondaryColor: "#F5F1E8", accentColor: "#8A5A32" },
  theme: {
    headingFont: "Georgia, 'Times New Roman', serif",
    bodyFont: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    spacing: "large", borderRadius: "none", buttonStyle: "square", cardStyle: "minimal",
  },
  navigation: {
    logoPosition: "left",
    links: [
      { label: "Home", href: "/" }, { label: "Shop", href: "/shop" },
      { label: "Men", href: "/men" }, { label: "Women", href: "/women" },
      { label: "About", href: "/about" },
    ],
    showSearch: true, showCart: true, showAccount: true,
  },
  pages: [
    {
      type: "home", slug: "/", title: "Home",
      sections: [
        { type: "announcement-bar", variant: "static", content: { message: "Free shipping on orders over ₦100,000", ctaLabel: "Shop now", ctaLink: "/shop" } },
        {
          type: "hero", variant: "large-image",
          content: { heading: "Crafted for Every Step", subheading: "Premium Nigerian leather footwear, handmade to last.", buttonText: "Shop Collection", buttonLink: "/shop", image: img("KAIRO", "#0B0B0B") },
        },
        { type: "category-grid", variant: "three-column", settings: { title: "Shop by Category" } },
        { type: "featured-products", variant: "four-column", settings: { limit: 8, sort: "featured", title: "Best Sellers" } },
        {
          type: "text-image", variant: "image-left",
          content: { eyebrow: "Our Craft", heading: "Hand-stitched in Lagos", body: "Every pair begins with full-grain leather sourced from local tanneries, cut and stitched by artisans who have perfected the craft over generations.", buttonText: "Our Story", buttonLink: "/about", image: img("CRAFT", "#2A2118") },
        },
        { type: "social-proof", variant: "stats", settings: { title: "Trusted by thousands" } },
        { type: "testimonials", variant: "cards", settings: { title: "What Customers Say" } },
        { type: "faq", variant: "default", settings: { title: "Frequently Asked Questions" } },
        { type: "newsletter", variant: "default", content: { heading: "Join the Kairo Circle", subheading: "Early access to drops and members-only pricing." } },
      ],
    },
  ],
  ecommerce: { currency: "NGN", country: "NG", taxEnabled: true, inventoryEnabled: true, guestCheckout: true },
};

export const kairoCatalog: Catalog = {
  storeId: "kairo",
  products: [
    { id: "k1", storeId: "kairo", name: "Adire Leather Loafer", price: 95000, compareAtPrice: 120000, image: img("LOAFER", "#2A2118"), category: "Men", featured: true, bestseller: true, createdAt: "2026-09-01" },
    { id: "k2", storeId: "kairo", name: "Lagos Derby", price: 110000, image: img("DERBY", "#3B2F23"), category: "Men", featured: true, createdAt: "2026-09-03" },
    { id: "k3", storeId: "kairo", name: "Sahara Sandal", price: 65000, image: img("SANDAL", "#4A3B2A"), category: "Men", featured: true, createdAt: "2026-09-05" },
    { id: "k4", storeId: "kairo", name: "Eko Chelsea Boot", price: 135000, image: img("BOOT", "#1F1A15"), category: "Men", featured: true, bestseller: true, createdAt: "2026-09-07" },
    { id: "k5", storeId: "kairo", name: "Nile Heel", price: 88000, image: img("HEEL", "#2A2118"), category: "Women", featured: true, createdAt: "2026-09-09" },
    { id: "k6", storeId: "kairo", name: "Calabar Flat", price: 72000, image: img("FLAT", "#3B2F23"), category: "Women", featured: true, createdAt: "2026-09-11" },
    { id: "k7", storeId: "kairo", name: "Zaria Ankle Boot", price: 125000, image: img("ANKLE", "#4A3B2A"), category: "Women", featured: true, createdAt: "2026-09-13" },
    { id: "k8", storeId: "kairo", name: "Asaba Mule", price: 78000, image: img("MULE", "#1F1A15"), category: "Women", featured: true, createdAt: "2026-09-15" },
  ],
  categories: [
    { id: "c1", storeId: "kairo", name: "Men", image: img("MEN", "#2A2118") },
    { id: "c2", storeId: "kairo", name: "Women", image: img("WOMEN", "#3B2F23") },
    { id: "c3", storeId: "kairo", name: "Accessories", image: img("ACC", "#4A3B2A") },
  ],
  testimonials: [
    { id: "t1", storeId: "kairo", author: "Adaeze O.", text: "The quality is unmatched — better than imported brands I've worn for years.", rating: 5 },
    { id: "t2", storeId: "kairo", author: "Tunde A.", text: "Handmade in Lagos and it shows. My loafers get compliments everywhere.", rating: 5 },
    { id: "t3", storeId: "kairo", author: "Ngozi E.", text: "Worth every naira. Delivered in two days, beautifully packaged.", rating: 4 },
  ],
  faqs: [
    { id: "f1", storeId: "kairo", question: "What leather do you use?", answer: "Full-grain and top-grain leather sourced from certified Nigerian tanneries." },
    { id: "f2", storeId: "kairo", question: "Do you offer resizing?", answer: "Yes, we offer complimentary resizing within 14 days of delivery." },
    { id: "f3", storeId: "kairo", question: "How should I care for my shoes?", answer: "Wipe with a dry cloth and apply leather conditioner monthly. Avoid prolonged water exposure." },
  ],
  stats: [
    { id: "s1", storeId: "kairo", label: "Pairs Sold", value: "25,000+" },
    { id: "s2", storeId: "kairo", label: "Customer Rating", value: "4.9/5" },
    { id: "s3", storeId: "kairo", label: "Artisans", value: "40+" },
    { id: "s4", storeId: "kairo", label: "Years Crafting", value: "12" },
  ],
  gallery: [
    { id: "g1", storeId: "kairo", image: img("CRAFT 1", "#2A2118"), caption: "The workshop" },
    { id: "g2", storeId: "kairo", image: img("CRAFT 2", "#3B2F23") },
    { id: "g3", storeId: "kairo", image: img("CRAFT 3", "#4A3B2A") },
    { id: "g4", storeId: "kairo", image: img("CRAFT 4", "#1F1A15") },
  ],
  collections: [
    { id: "cl1", storeId: "kairo", name: "The Classic Line", description: "Timeless everyday styles", image: img("CLASSIC", "#2A2118"), productCount: 14 },
    { id: "cl2", storeId: "kairo", name: "The Signature Series", description: "Limited hand-stitched drops", image: img("SIGNATURE", "#3B2F23"), productCount: 8 },
    { id: "cl3", storeId: "kairo", name: "Women's Collection", description: "Elegance in every step", image: img("WOMENS", "#4A3B2A"), productCount: 20 },
  ],
};

/* ------------------------------------------------------------------ */
/* 2. Mama's Kitchen — cozy food                                        */
/* ------------------------------------------------------------------ */

export const mamasKitchenBlueprint: StoreBlueprint = {
  version: 1,
  store: { name: "Mama's Kitchen", description: "Home-cooked Nigerian meals, delivered fresh", industry: "food", slug: "mamas-kitchen" },
  branding: { primaryColor: "#7C2D12", secondaryColor: "#FFF7ED", accentColor: "#D97706" },
  theme: {
    headingFont: "Georgia, 'Times New Roman', serif",
    bodyFont: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    spacing: "medium", borderRadius: "medium", buttonStyle: "rounded", cardStyle: "bordered",
  },
  navigation: {
    logoPosition: "center",
    links: [
      { label: "Home", href: "/" }, { label: "Menu", href: "/menu" },
      { label: "Meal Plans", href: "/plans" }, { label: "Contact", href: "/contact" },
    ],
    showSearch: false, showCart: true, showAccount: true,
  },
  pages: [
    {
      type: "home", slug: "/", title: "Home",
      sections: [
        { type: "announcement-bar", variant: "rotating", content: { message: "Order before 4pm for same-day delivery in Lagos" } },
        {
          type: "hero", variant: "minimal",
          content: { heading: "Taste of Home, Every Day", subheading: "Home-cooked Nigerian meals delivered fresh to your door.", buttonText: "Order Now", buttonLink: "/menu" },
        },
        { type: "featured-products", variant: "three-column", settings: { limit: 6, sort: "featured", title: "This Week's Specials" } },
        {
          type: "promo-banner", variant: "full-width",
          content: { heading: "Buy 5 meals, get the 6th free", subheading: "Available on all weekly meal plans.", buttonText: "See Plans", buttonLink: "/plans" },
        },
        { type: "social-proof", variant: "stats", settings: { title: "Serving Lagos since 2019" } },
        { type: "testimonials", variant: "cards", settings: { title: "Happy Bellies" } },
        { type: "faq", variant: "default", settings: { title: "Ordering Questions" } },
        { type: "newsletter", variant: "default", content: { heading: "Get the weekly menu first" } },
      ],
    },
  ],
  ecommerce: { currency: "NGN", country: "NG", taxEnabled: false, inventoryEnabled: true, guestCheckout: true },
};

export const mamasKitchenCatalog: Catalog = {
  storeId: "mamas-kitchen",
  products: [
    { id: "m1", storeId: "mamas-kitchen", name: "Jollof Rice & Chicken", price: 4500, image: img("JOLLOF", "#B45309"), category: "Specials", featured: true, bestseller: true, createdAt: "2026-09-01" },
    { id: "m2", storeId: "mamas-kitchen", name: "Egusi & Pounded Yam", price: 5200, image: img("EGUSI", "#9A3412"), category: "Specials", featured: true, createdAt: "2026-09-02" },
    { id: "m3", storeId: "mamas-kitchen", name: "Peppered Goat Meat", price: 6800, image: img("GOAT", "#7C2D12"), category: "Specials", featured: true, bestseller: true, createdAt: "2026-09-03" },
    { id: "m4", storeId: "mamas-kitchen", name: "Ofada Rice & Sauce", price: 4800, image: img("OFADA", "#C2410C"), category: "Specials", featured: true, createdAt: "2026-09-04" },
    { id: "m5", storeId: "mamas-kitchen", name: "Moi Moi (Party Size)", price: 3200, image: img("MOIMOI", "#EA580C"), category: "Specials", featured: true, createdAt: "2026-09-05" },
    { id: "m6", storeId: "mamas-kitchen", name: "Fresh Chapman (1L)", price: 2500, image: img("CHAPMAN", "#F59E0B"), category: "Specials", featured: true, createdAt: "2026-09-06" },
  ],
  categories: [
    { id: "m1c", storeId: "mamas-kitchen", name: "Specials", image: img("SPECIALS", "#B45309") },
    { id: "m2c", storeId: "mamas-kitchen", name: "Meal Plans", image: img("PLANS", "#9A3412") },
    { id: "m3c", storeId: "mamas-kitchen", name: "Drinks", image: img("DRINKS", "#7C2D12") },
  ],
  testimonials: [
    { id: "t1", storeId: "mamas-kitchen", author: "Kemi B.", text: "Tastes exactly like my mother's cooking. The jollof is perfection.", rating: 5 },
    { id: "t2", storeId: "mamas-kitchen", author: "Segun F.", text: "Fast delivery and generous portions. New weekly regular.", rating: 5 },
    { id: "t3", storeId: "mamas-kitchen", author: "Amara C.", text: "The egusi is authentic. Saves me hours of cooking every week.", rating: 4 },
  ],
  faqs: [
    { id: "f1", storeId: "mamas-kitchen", question: "How fresh is the food?", answer: "Meals are cooked the same morning and delivered in insulated packaging." },
    { id: "f2", storeId: "mamas-kitchen", question: "Do you cater events?", answer: "Yes — we cater corporate and private events from 20 to 500 guests." },
    { id: "f3", storeId: "mamas-kitchen", question: "Can I freeze the meals?", answer: "Most meals freeze well for up to 2 weeks. Reheat instructions included." },
  ],
  stats: [
    { id: "s1", storeId: "mamas-kitchen", label: "Meals Delivered", value: "60,000+" },
    { id: "s2", storeId: "mamas-kitchen", label: "Avg. Rating", value: "4.8/5" },
    { id: "s3", storeId: "mamas-kitchen", label: "Weekly Plans", value: "1,200+" },
  ],
  gallery: [
    { id: "g1", storeId: "mamas-kitchen", image: img("DISH 1", "#B45309") },
    { id: "g2", storeId: "mamas-kitchen", image: img("DISH 2", "#9A3412") },
    { id: "g3", storeId: "mamas-kitchen", image: img("DISH 3", "#7C2D12") },
    { id: "g4", storeId: "mamas-kitchen", image: img("DISH 4", "#C2410C") },
  ],
  collections: [
    { id: "cl1", storeId: "mamas-kitchen", name: "Weekly Specials", description: "Fresh every Monday", image: img("WEEKLY", "#B45309"), productCount: 12 },
    { id: "cl2", storeId: "mamas-kitchen", name: "Party Trays", description: "Feeds a crowd", image: img("PARTY", "#9A3412"), productCount: 9 },
    { id: "cl3", storeId: "mamas-kitchen", name: "Small Chops", description: "Snacks & sides", image: img("CHOPS", "#7C2D12"), productCount: 15 },
  ],
};

/* ------------------------------------------------------------------ */
/* 3. Lumen — luxury jewelry                                            */
/* ------------------------------------------------------------------ */

export const lumenBlueprint: StoreBlueprint = {
  version: 1,
  store: { name: "Lumen", description: "Fine jewelry, ethically sourced", industry: "jewelry", slug: "lumen" },
  branding: { primaryColor: "#0D0D0D", secondaryColor: "#F7F4EF", accentColor: "#C6A15B" },
  theme: {
    headingFont: "Georgia, 'Times New Roman', serif",
    bodyFont: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    spacing: "large", borderRadius: "none", buttonStyle: "square", cardStyle: "minimal",
  },
  navigation: {
    logoPosition: "left",
    links: [
      { label: "Home", href: "/" }, { label: "Collections", href: "/collections" },
      { label: "Rings", href: "/rings" }, { label: "Necklaces", href: "/necklaces" },
      { label: "About", href: "/about" },
    ],
    showSearch: true, showCart: true, showAccount: true,
  },
  pages: [
    {
      type: "home", slug: "/", title: "Home",
      sections: [
        { type: "announcement-bar", variant: "static", content: { message: "Complimentary engraving on all orders this month" } },
        {
          type: "hero", variant: "editorial",
          content: { heading: "Timeless Elegance", subheading: "Fine jewelry, ethically sourced and hand-finished.", buttonText: "Explore Collections", buttonLink: "/collections", image: img("LUMEN", "#0D0D0D") },
        },
        { type: "collection-grid", variant: "three-column", settings: { title: "The Collections" } },
        { type: "featured-products", variant: "three-column", settings: { limit: 6, sort: "featured", title: "Featured Pieces" } },
        {
          type: "text-image", variant: "image-right",
          content: { eyebrow: "Our Promise", heading: "Sourced with Integrity", body: "Every gemstone is conflict-free and traceable to origin. Our gold is recycled, and our artisans are paid fair, living wages.", buttonText: "Learn More", buttonLink: "/about", image: img("INTEGRITY", "#5C4A2A") },
        },
        { type: "testimonials", variant: "cards", settings: { title: "In Their Words" } },
        { type: "newsletter", variant: "default", content: { heading: "Join the Inner Circle", subheading: "Private previews of new collections." } },
      ],
    },
  ],
  ecommerce: { currency: "NGN", country: "NG", taxEnabled: true, inventoryEnabled: true, guestCheckout: true },
};

export const lumenCatalog: Catalog = {
  storeId: "lumen",
  products: [
    { id: "l1", storeId: "lumen", name: "Solitaire Gold Ring", price: 420000, image: img("RING", "#5C4A2A"), category: "Rings", featured: true, bestseller: true, createdAt: "2026-09-01" },
    { id: "l2", storeId: "lumen", name: "Pearl Drop Earrings", price: 185000, image: img("PEARL", "#7A6A4A"), category: "Earrings", featured: true, createdAt: "2026-09-03" },
    { id: "l3", storeId: "lumen", name: "Diamond Tennis Bracelet", price: 650000, image: img("BRACELET", "#3E3322"), category: "Bracelets", featured: true, bestseller: true, createdAt: "2026-09-05" },
    { id: "l4", storeId: "lumen", name: "Pendant Necklace", price: 240000, image: img("NECKLACE", "#5C4A2A"), category: "Necklaces", featured: true, createdAt: "2026-09-07" },
    { id: "l5", storeId: "lumen", name: "Hoop Earrings", price: 150000, image: img("HOOPS", "#7A6A4A"), category: "Earrings", featured: true, createdAt: "2026-09-09" },
    { id: "l6", storeId: "lumen", name: "Signet Ring", price: 280000, image: img("SIGNET", "#3E3322"), category: "Rings", featured: true, createdAt: "2026-09-11" },
  ],
  categories: [
    { id: "c1", storeId: "lumen", name: "Rings", image: img("RINGS", "#5C4A2A") },
    { id: "c2", storeId: "lumen", name: "Necklaces", image: img("NECKLACES", "#7A6A4A") },
    { id: "c3", storeId: "lumen", name: "Earrings", image: img("EARRINGS", "#3E3322") },
  ],
  testimonials: [
    { id: "t1", storeId: "lumen", author: "Chiamaka N.", text: "The craftsmanship is extraordinary. My ring is the centerpiece of every outfit.", rating: 5 },
    { id: "t2", storeId: "lumen", author: "Bola S.", text: "Knowing the stones are ethically sourced made the purchase even more special.", rating: 5 },
    { id: "t3", storeId: "lumen", author: "Damilola K.", text: "Beautifully packaged and delivered securely. Highly recommend.", rating: 5 },
  ],
  faqs: [
    { id: "f1", storeId: "lumen", question: "Are your stones certified?", answer: "Yes, all gemstones over 0.5 carats come with independent certification." },
    { id: "f2", storeId: "lumen", question: "Do you offer custom designs?", answer: "Yes, our bespoke service lets you design a one-of-a-kind piece with our artisans." },
    { id: "f3", storeId: "lumen", question: "What is your warranty?", answer: "All pieces carry a lifetime warranty on craftsmanship." },
  ],
  stats: [
    { id: "s1", storeId: "lumen", label: "Pieces Crafted", value: "8,000+" },
    { id: "s2", storeId: "lumen", label: "Ethical Stones", value: "100%" },
    { id: "s3", storeId: "lumen", label: "Artisan Partners", value: "25" },
  ],
  gallery: [
    { id: "g1", storeId: "lumen", image: img("ATELIER 1", "#5C4A2A") },
    { id: "g2", storeId: "lumen", image: img("ATELIER 2", "#7A6A4A") },
    { id: "g3", storeId: "lumen", image: img("ATELIER 3", "#3E3322") },
  ],
  collections: [
    { id: "cl1", storeId: "lumen", name: "Heritage", description: "Timeless classics", image: img("HERITAGE", "#5C4A2A"), productCount: 18 },
    { id: "cl2", storeId: "lumen", name: "Modern", description: "Contemporary minimalism", image: img("MODERN", "#7A6A4A"), productCount: 22 },
    { id: "cl3", storeId: "lumen", name: "Bridal", description: "For your forever", image: img("BRIDAL", "#3E3322"), productCount: 10 },
  ],
};

/* ------------------------------------------------------------------ */
/* 4. Volt — electronics, tech style                                    */
/* ------------------------------------------------------------------ */

export const voltBlueprint: StoreBlueprint = {
  version: 1,
  store: { name: "Volt", description: "Everyday tech that just works", industry: "electronics", slug: "volt" },
  branding: { primaryColor: "#0B1220", secondaryColor: "#F8FAFC", accentColor: "#22D3EE" },
  theme: {
    headingFont: "ui-monospace, 'SF Mono', Menlo, monospace",
    bodyFont: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    spacing: "compact", borderRadius: "small", buttonStyle: "rounded", cardStyle: "bordered",
  },
  navigation: {
    logoPosition: "left",
    links: [
      { label: "Home", href: "/" }, { label: "Shop", href: "/shop" },
      { label: "Audio", href: "/audio" }, { label: "Accessories", href: "/accessories" },
    ],
    showSearch: true, showCart: true, showAccount: true,
  },
  pages: [
    {
      type: "home", slug: "/", title: "Home",
      sections: [
        {
          type: "hero", variant: "minimal",
          content: { heading: "Power Up Your Day", subheading: "Everyday tech, engineered to just work.", buttonText: "Shop Now", buttonLink: "/shop" },
        },
        { type: "category-grid", variant: "four-column", settings: { title: "Categories" } },
        { type: "featured-products", variant: "carousel", settings: { limit: 8, sort: "newest", title: "New In" } },
        { type: "social-proof", variant: "logos", settings: { title: "As featured in" } },
        { type: "faq", variant: "default", settings: { title: "Tech Questions" } },
        { type: "newsletter", variant: "default", content: { heading: "Get product drops first", subheading: "No spam, just new gear." } },
      ],
    },
  ],
  ecommerce: { currency: "NGN", country: "NG", taxEnabled: true, inventoryEnabled: true, guestCheckout: true },
};

export const voltCatalog: Catalog = {
  storeId: "volt",
  products: [
    { id: "v1", storeId: "volt", name: "Wireless Earbuds Pro", price: 45000, compareAtPrice: 55000, image: img("EARBUDS", "#0F172A"), category: "Audio", featured: true, bestseller: true, createdAt: "2026-09-20" },
    { id: "v2", storeId: "volt", name: "Smart Watch S2", price: 85000, image: img("WATCH", "#1E293B"), category: "Wearables", featured: true, createdAt: "2026-09-18" },
    { id: "v3", storeId: "volt", name: "Bluetooth Speaker Mini", price: 30000, image: img("SPEAKER", "#334155"), category: "Audio", featured: true, createdAt: "2026-09-16" },
    { id: "v4", storeId: "volt", name: "20,000mAh Power Bank", price: 28000, image: img("POWER", "#0F172A"), category: "Accessories", featured: true, bestseller: true, createdAt: "2026-09-14" },
    { id: "v5", storeId: "volt", name: "USB-C 8-in-1 Hub", price: 35000, image: img("HUB", "#1E293B"), category: "Accessories", featured: true, createdAt: "2026-09-12" },
    { id: "v6", storeId: "volt", name: "Mechanical Keyboard", price: 65000, image: img("KEYBOARD", "#334155"), category: "Desk", featured: true, createdAt: "2026-09-10" },
  ],
  categories: [
    { id: "c1", storeId: "volt", name: "Audio", image: img("AUDIO", "#0F172A") },
    { id: "c2", storeId: "volt", name: "Wearables", image: img("WEAR", "#1E293B") },
    { id: "c3", storeId: "volt", name: "Accessories", image: img("ACC", "#334155") },
    { id: "c4", storeId: "volt", name: "Desk", image: img("DESK", "#0B1220") },
  ],
  testimonials: [
    { id: "t1", storeId: "volt", author: "Yemi D.", text: "Genuine products with warranty. The earbuds punch way above their price.", rating: 5 },
    { id: "t2", storeId: "volt", author: "Chioma O.", text: "Fast shipping and great customer support when I had a question.", rating: 5 },
    { id: "t3", storeId: "volt", author: "Emeka T.", text: "Solid build quality. This is now my go-to for tech.", rating: 4 },
  ],
  faqs: [
    { id: "f1", storeId: "volt", question: "Do products come with a warranty?", answer: "Yes, all products carry a minimum 12-month manufacturer warranty." },
    { id: "f2", storeId: "volt", question: "Are these authentic products?", answer: "We source directly from authorized distributors — 100% genuine." },
    { id: "f3", storeId: "volt", question: "What payment methods do you accept?", answer: "Cards, bank transfer, and USSD via our secure payment partners." },
  ],
  stats: [
    { id: "s1", storeId: "volt", label: "Devices Shipped", value: "30,000+" },
    { id: "s2", storeId: "volt", label: "Avg. Rating", value: "4.7/5" },
    { id: "s3", storeId: "volt", label: "Support Response", value: "< 2 hrs" },
  ],
  gallery: [
    { id: "g1", storeId: "volt", image: img("LAB 1", "#0F172A") },
    { id: "g2", storeId: "volt", image: img("LAB 2", "#1E293B") },
    { id: "g3", storeId: "volt", image: img("LAB 3", "#334155") },
  ],
  collections: [
    { id: "cl1", storeId: "volt", name: "Audio", description: "Earbuds, speakers & more", image: img("AUDIO C", "#0F172A"), productCount: 16 },
    { id: "cl2", storeId: "volt", name: "Wearables", description: "Watches & trackers", image: img("WEAR C", "#1E293B"), productCount: 10 },
    { id: "cl3", storeId: "volt", name: "Desk Setup", description: "Productivity essentials", image: img("DESK C", "#334155"), productCount: 14 },
  ],
};

/* ------------------------------------------------------------------ */
/* 5. Terra — furniture, earthy style                                   */
/* ------------------------------------------------------------------ */

export const terraBlueprint: StoreBlueprint = {
  version: 1,
  store: { name: "Terra", description: "Sustainable, handcrafted furniture", industry: "furniture", slug: "terra" },
  branding: { primaryColor: "#2F4F2F", secondaryColor: "#F7F3EC", accentColor: "#B07D4F" },
  theme: {
    headingFont: "Georgia, 'Times New Roman', serif",
    bodyFont: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    spacing: "medium", borderRadius: "medium", buttonStyle: "rounded", cardStyle: "bordered",
  },
  navigation: {
    logoPosition: "left",
    links: [
      { label: "Home", href: "/" }, { label: "Shop", href: "/shop" },
      { label: "Living", href: "/living" }, { label: "Bedroom", href: "/bedroom" },
      { label: "Our Story", href: "/story" },
    ],
    showSearch: true, showCart: true, showAccount: true,
  },
  pages: [
    {
      type: "home", slug: "/", title: "Home",
      sections: [
        {
          type: "hero", variant: "editorial",
          content: { heading: "Furniture That Lives", subheading: "Sustainable, handcrafted pieces built to last generations.", buttonText: "Shop the Collection", buttonLink: "/shop", image: img("TERRA", "#2F4F2F") },
        },
        { type: "image-gallery", variant: "grid", settings: { title: "From Our Workshop", columns: 3 } },
        {
          type: "brand-story", variant: "centered",
          content: { eyebrow: "Our Philosophy", heading: "Made Slowly, Made Well", body: "We use reclaimed and sustainably harvested timber, finished with natural oils. No shortcuts, no landfill furniture.", values: ["Sustainable materials", "Built to last", "Fair to makers", "Timeless design"] },
        },
        { type: "featured-products", variant: "three-column", settings: { limit: 6, sort: "featured", title: "Signature Pieces" } },
        { type: "text-image", variant: "image-left", content: { eyebrow: "Materials", heading: "The Beauty of Real Wood", body: "Each piece celebrates the natural grain of sustainably sourced timber, so no two are ever identical.", image: img("WOOD", "#4A5A3A") } },
        { type: "testimonials", variant: "cards", settings: { title: "From Our Customers" } },
        { type: "newsletter", variant: "default", content: { heading: "New pieces, first access" } },
      ],
    },
  ],
  ecommerce: { currency: "NGN", country: "NG", taxEnabled: true, inventoryEnabled: true, guestCheckout: true },
};

export const terraCatalog: Catalog = {
  storeId: "terra",
  products: [
    { id: "e1", storeId: "terra", name: "Oak Dining Table", price: 480000, image: img("TABLE", "#2F4F2F"), category: "Dining", featured: true, bestseller: true, createdAt: "2026-09-02" },
    { id: "e2", storeId: "terra", name: "Linen Sofa", price: 620000, image: img("SOFA", "#3D5A3D"), category: "Living", featured: true, createdAt: "2026-09-04" },
    { id: "e3", storeId: "terra", name: "Walnut Bookshelf", price: 260000, image: img("SHELF", "#4A6B4A"), category: "Living", featured: true, createdAt: "2026-09-06" },
    { id: "e4", storeId: "terra", name: "Rattan Armchair", price: 180000, image: img("CHAIR", "#5A7B5A"), category: "Living", featured: true, bestseller: true, createdAt: "2026-09-08" },
    { id: "e5", storeId: "terra", name: "Platform Bed Frame", price: 520000, image: img("BED", "#2F4F2F"), category: "Bedroom", featured: true, createdAt: "2026-09-10" },
    { id: "e6", storeId: "terra", name: "Cedar Nightstand", price: 95000, image: img("NIGHTSTAND", "#3D5A3D"), category: "Bedroom", featured: true, createdAt: "2026-09-12" },
  ],
  categories: [
    { id: "c1", storeId: "terra", name: "Living", image: img("LIVING", "#2F4F2F") },
    { id: "c2", storeId: "terra", name: "Dining", image: img("DINING", "#3D5A3D") },
    { id: "c3", storeId: "terra", name: "Bedroom", image: img("BEDROOM", "#4A6B4A") },
  ],
  testimonials: [
    { id: "t1", storeId: "terra", author: "Folake A.", text: "The dining table is a work of art. Solid, beautiful, and clearly built to last.", rating: 5 },
    { id: "t2", storeId: "terra", author: "Ibrahim M.", text: "Love that it's sustainable. The craftsmanship is exceptional.", rating: 5 },
    { id: "t3", storeId: "terra", author: "Sade O.", text: "Delivery was careful and the team helped with setup. Wonderful experience.", rating: 5 },
  ],
  faqs: [
    { id: "f1", storeId: "terra", question: "What wood do you use?", answer: "Sustainably harvested oak, walnut, cedar, and reclaimed timber." },
    { id: "f2", storeId: "terra", question: "Do you deliver nationwide?", answer: "Yes, with white-glove delivery and assembly in major cities." },
    { id: "f3", storeId: "terra", question: "Can I customise dimensions?", answer: "Absolutely — most pieces can be made to your exact measurements." },
  ],
  stats: [
    { id: "s1", storeId: "terra", label: "Pieces Delivered", value: "4,500+" },
    { id: "s2", storeId: "terra", label: "Trees Replanted", value: "10,000" },
    { id: "s3", storeId: "terra", label: "Master Makers", value: "18" },
  ],
  gallery: [
    { id: "g1", storeId: "terra", image: img("WOOD 1", "#2F4F2F") },
    { id: "g2", storeId: "terra", image: img("WOOD 2", "#3D5A3D") },
    { id: "g3", storeId: "terra", image: img("WOOD 3", "#4A6B4A") },
    { id: "g4", storeId: "terra", image: img("WOOD 4", "#5A7B5A") },
    { id: "g5", storeId: "terra", image: img("WOOD 5", "#2F4F2F") },
    { id: "g6", storeId: "terra", image: img("WOOD 6", "#3D5A3D") },
  ],
  collections: [
    { id: "cl1", storeId: "terra", name: "Living Room", description: "Gather in style", image: img("LIVING C", "#2F4F2F"), productCount: 20 },
    { id: "cl2", storeId: "terra", name: "Dining", description: "Made for meals", image: img("DINING C", "#3D5A3D"), productCount: 12 },
    { id: "cl3", storeId: "terra", name: "Bedroom", description: "Rest well", image: img("BED C", "#4A6B4A"), productCount: 15 },
  ],
};

/* ------------------------------------------------------------------ */
/* 6. Glow — skincare, pastel style                                     */
/* ------------------------------------------------------------------ */

export const glowBlueprint: StoreBlueprint = {
  version: 1,
  store: { name: "Glow", description: "Clean skincare for melanin-rich skin", industry: "skincare", slug: "glow" },
  branding: { primaryColor: "#9D4EDD", secondaryColor: "#FFF7FB", accentColor: "#F9A8D4" },
  theme: {
    headingFont: "'Trebuchet MS', 'Segoe UI', sans-serif",
    bodyFont: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    spacing: "medium", borderRadius: "large", buttonStyle: "pill", cardStyle: "minimal",
  },
  navigation: {
    logoPosition: "left",
    links: [
      { label: "Home", href: "/" }, { label: "Shop", href: "/shop" },
      { label: "Routine", href: "/routine" }, { label: "Ingredients", href: "/ingredients" },
    ],
    showSearch: true, showCart: true, showAccount: true,
  },
  pages: [
    {
      type: "home", slug: "/", title: "Home",
      sections: [
        { type: "announcement-bar", variant: "static", content: { message: "Free gift with every order over ₦50,000", ctaLabel: "Shop", ctaLink: "/shop" } },
        {
          type: "hero", variant: "split",
          content: { heading: "Glow, Naturally", subheading: "Clean, science-backed skincare formulated for melanin-rich skin.", buttonText: "Build Your Routine", buttonLink: "/routine", image: img("GLOW", "#9D4EDD") },
        },
        { type: "brand-story", variant: "centered", content: { eyebrow: "Why Glow", heading: "Skincare That Sees You", body: "Most skincare ignores darker skin tones. We formulate specifically for melanin-rich skin — from hyperpigmentation to daily glow.", values: ["Clean ingredients", "Dermatologist-tested", "Cruelty-free", "Made for you"] } },
        { type: "featured-products", variant: "four-column", settings: { limit: 8, sort: "featured", title: "Bestsellers" } },
        { type: "social-proof", variant: "stats", settings: { title: "Loved by thousands" } },
        { type: "testimonials", variant: "cards", settings: { title: "Real Results" } },
        { type: "faq", variant: "default", settings: { title: "Skincare Questions" } },
        { type: "newsletter", variant: "default", content: { heading: "Glow tips, weekly", subheading: "Skincare advice + early access to drops." } },
      ],
    },
  ],
  ecommerce: { currency: "NGN", country: "NG", taxEnabled: true, inventoryEnabled: true, guestCheckout: true },
};

export const glowCatalog: Catalog = {
  storeId: "glow",
  products: [
    { id: "g1", storeId: "glow", name: "Vitamin C Serum", price: 18000, compareAtPrice: 22000, image: img("SERUM", "#9D4EDD"), category: "Serums", featured: true, bestseller: true, createdAt: "2026-09-03" },
    { id: "g2", storeId: "glow", name: "Hydrating Toner", price: 12000, image: img("TONER", "#C77DFF"), category: "Toner", featured: true, createdAt: "2026-09-05" },
    { id: "g3", storeId: "glow", name: "SPF 50 Sunscreen", price: 15000, image: img("SPF", "#F9A8D4"), category: "SPF", featured: true, bestseller: true, createdAt: "2026-09-07" },
    { id: "g4", storeId: "glow", name: "Niacinamide Serum", price: 16000, image: img("NIACIN", "#9D4EDD"), category: "Serums", featured: true, createdAt: "2026-09-09" },
    { id: "g5", storeId: "glow", name: "Gentle Cleanser", price: 10000, image: img("CLEANSER", "#C77DFF"), category: "Cleanser", featured: true, createdAt: "2026-09-11" },
    { id: "g6", storeId: "glow", name: "Night Cream", price: 20000, image: img("NIGHT", "#F9A8D4"), category: "Moisturiser", featured: true, createdAt: "2026-09-13" },
  ],
  categories: [
    { id: "c1", storeId: "glow", name: "Serums", image: img("SERUMS", "#9D4EDD") },
    { id: "c2", storeId: "glow", name: "Cleanser", image: img("CLEANSE", "#C77DFF") },
    { id: "c3", storeId: "glow", name: "SPF", image: img("SPF C", "#F9A8D4") },
  ],
  testimonials: [
    { id: "t1", storeId: "glow", author: "Zainab H.", text: "Finally, skincare that understands my skin. My hyperpigmentation has visibly faded.", rating: 5 },
    { id: "t2", storeId: "glow", author: "Chidinma E.", text: "The Vitamin C serum is a game changer. Lightweight and non-greasy.", rating: 5 },
    { id: "t3", storeId: "glow", author: "Blessing A.", text: "Clean ingredients I can actually trust. My skin has never looked better.", rating: 5 },
  ],
  faqs: [
    { id: "f1", storeId: "glow", question: "Is your skincare suitable for sensitive skin?", answer: "Yes, all formulas are fragrance-free and dermatologist-tested for sensitive skin." },
    { id: "f2", storeId: "glow", question: "Are your products cruelty-free?", answer: "100% cruelty-free and never tested on animals." },
    { id: "f3", storeId: "glow", question: "How long before I see results?", answer: "Most customers notice a difference within 2–4 weeks of consistent use." },
  ],
  stats: [
    { id: "s1", storeId: "glow", label: "Happy Customers", value: "18,000+" },
    { id: "s2", storeId: "glow", label: "Avg. Rating", value: "4.9/5" },
    { id: "s3", storeId: "glow", label: "Products Sold", value: "50,000+" },
  ],
  gallery: [
    { id: "g1", storeId: "glow", image: img("LAB 1", "#9D4EDD") },
    { id: "g2", storeId: "glow", image: img("LAB 2", "#C77DFF") },
    { id: "g3", storeId: "glow", image: img("LAB 3", "#F9A8D4") },
  ],
  collections: [
    { id: "cl1", storeId: "glow", name: "The Glow Routine", description: "Your daily 3-step", image: img("ROUTINE", "#9D4EDD"), productCount: 6 },
    { id: "cl2", storeId: "glow", name: "Brightening", description: "Target dark spots", image: img("BRIGHT", "#C77DFF"), productCount: 8 },
    { id: "cl3", storeId: "glow", name: "Hydration", description: "Deep moisture", image: img("HYDRATE", "#F9A8D4"), productCount: 7 },
  ],
};

export const samples: { blueprint: StoreBlueprint; catalog: Catalog }[] = [
  { blueprint: kairoBlueprint, catalog: kairoCatalog },
  { blueprint: mamasKitchenBlueprint, catalog: mamasKitchenCatalog },
  { blueprint: lumenBlueprint, catalog: lumenCatalog },
  { blueprint: voltBlueprint, catalog: voltCatalog },
  { blueprint: terraBlueprint, catalog: terraCatalog },
  { blueprint: glowBlueprint, catalog: glowCatalog },
];
