"use client";

import { formatMoney, formatCompact } from "@/lib/money";
import { productStats, type Product } from "@/lib/samples/catalog";
import Link from "next/link";
import { addToCart } from "@/lib/cart-storage";

/**
 * Rich marketplace product card: discount badge, rating, review count, sold
 * count, compare-at price, and a quick "Add to Cart". Shared by the grid,
 * carousel, and flash-sale sections.
 */
export function ProductCard({ product, currency, storeSlug }: { product: Product; currency: string; storeSlug?: string }) {
  const stats = productStats(product.id);
  const rating = product.rating ?? stats.rating;
  const reviews = product.reviews ?? stats.reviews;
  const sold = product.sold ?? stats.sold;
  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;
  const badge = discount > 0 ? `-${discount}%` : product.bestseller ? "Best Seller" : null;

  return (
    <div className="product-card">
      <div className="product-card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.name} loading="lazy" />
        {badge && (
          <span className={`product-card__badge${discount === 0 ? " product-card__badge--accent" : ""}`}>
            {badge}
          </span>
        )}
      </div>
      <div className="product-card__body">
        {storeSlug ? (
          <Link href={`/store/${storeSlug}/product/${product.id}`} className="product-card__title">{product.name}</Link>
        ) : <div className="product-card__title">{product.name}</div>}
        <div className="product-card__rating">
          <span className="stars" aria-hidden>
            {"★".repeat(Math.max(1, Math.round(rating)))}
            <span style={{ opacity: 0.35 }}>{"★".repeat(5 - Math.max(1, Math.round(rating)))}</span>
          </span>
          <span>{rating.toFixed(1)}</span>
          <span>({formatCompact(reviews)})</span>
        </div>
        <div className="product-card__price-row">
          <span className="product-card__price">{formatMoney(product.price, currency)}</span>
          {product.compareAtPrice && (
            <span className="product-card__compare">{formatMoney(product.compareAtPrice, currency)}</span>
          )}
        </div>
        <div className="product-card__sold">{formatCompact(sold)}+ sold</div>
        <button className="product-card__add" onClick={() => storeSlug && addToCart(storeSlug, product)}>Add to Cart</button>
      </div>
    </div>
  );
}
