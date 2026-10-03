"use client";

import type { StoreBlueprint } from "@/lib/blueprint/schema";
import { storePath } from "@/lib/store-links";

export function Footer({ blueprint }: { blueprint: StoreBlueprint }) {
  const { store, navigation, ecommerce } = blueprint;
  return (
    <footer className="sf-footer">
      <div className="sf-container">
        <div className="sf-footer__grid">
          <div>
            <h4>{store.name}</h4>
            <p>{store.description}</p>
          </div>
          <div>
            <h4>Shop</h4>
            {navigation.links.map((l) => (
              <a key={l.href + l.label} href={storePath(store.slug, l.href)}>
                {l.label}
              </a>
            ))}
          </div>
          <div>
            <h4>Help</h4>
            <a href="#">Shipping &amp; Returns</a>
            <a href="#">Track Order</a>
            <a href="#">Contact Us</a>
            <a href="#">FAQ</a>
          </div>
          <div>
            <h4>We Accept</h4>
            <div className="sf-pay">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>Verve</span>
              <span>Flutterwave</span>
              <span>Paystack</span>
              <span>Bank Transfer</span>
            </div>
          </div>
        </div>
        <div className="sf-footer__bottom">
          © {new Date().getFullYear()} {store.name}. All prices in {ecommerce.currency}.
        </div>
      </div>
    </footer>
  );
}
