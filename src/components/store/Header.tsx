"use client";

import { useState } from "react";
import type { Navigation, Branding } from "@/lib/blueprint/schema";
import { SearchIcon, CartIcon, UserIcon, HeartIcon, MenuIcon } from "./icons";
import { storePath } from "@/lib/store-links";

export function Header({
  navigation,
  branding,
  storeName,
  storeSlug,
  cartCount = 2,
}: {
  navigation: Navigation;
  branding: Branding;
  storeName: string;
  storeSlug: string;
  cartCount?: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sf-header">
      <div className="sf-container">
        <div className="sf-header__main">
          <button
            className="sf-hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <MenuIcon />
          </button>

          <a href={storePath(storeSlug, "/")} className="sf-logo">
            {branding.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={branding.logo} alt={storeName} style={{ height: 28 }} />
            ) : (
              storeName
            )}
          </a>

          <form className="sf-search" onSubmit={(e) => e.preventDefault()}>
            <input type="search" placeholder={`Search products in ${storeName}…`} />
            <button type="submit" aria-label="Search">
              <SearchIcon />
            </button>
          </form>

          <div className="sf-header__actions">
            <button className="sf-iconbtn" aria-label="Account">
              <UserIcon />
              <span className="label">Account</span>
            </button>
            <button className="sf-iconbtn" aria-label="Wishlist">
              <HeartIcon />
            </button>
            <a className="sf-iconbtn" aria-label="Cart" href={storePath(storeSlug, "/cart")}>
              <CartIcon />
              <span className="sf-badge">{cartCount}</span>
            </a>
          </div>
        </div>

        <nav className={`sf-nav${menuOpen ? " sf-nav--open" : ""}`}>
          {navigation.links.map((link) => (
            <a key={link.href + link.label} href={storePath(storeSlug, link.href)}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
