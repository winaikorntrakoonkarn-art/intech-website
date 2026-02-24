"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Phone,
  Menu,
  X,
  ChevronDown,
  ShoppingCart,
  Search,
  User,
  Truck,
  Clock,
  FileText,
  Headphones,
  BookOpen,
  Heart,
  GitCompareArrows,
  LogOut,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCompare } from "@/contexts/CompareContext";
import { CATEGORIES, FLAT_CATEGORIES } from "@/lib/categories";

const resourceLinks = [
  { name: "สินค้าทั้งหมด", href: "/products", icon: BookOpen },
  { name: "บริการ", href: "/services", icon: Headphones },
  { name: "เกี่ยวกับเรา", href: "/about", icon: FileText },
  { name: "ติดต่อเรา", href: "/contact", icon: Phone },
  { name: "ขอใบเสนอราคา", href: "/quote", icon: FileText },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  const { itemCount, subtotal, setCartOpen } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const { count: compareCount } = useCompare();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Close search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node) &&
        (!mobileSearchRef.current || !mobileSearchRef.current.contains(e.target as Node))
      ) {
        setShowSearch(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch and filter products on search query change
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) return;
        const data = await res.json();
        const products = Array.isArray(data) ? data : data.products ?? [];
        const query = searchQuery.toLowerCase();
        const filtered = products
          .filter(
            (p: any) =>
              p.name?.toLowerCase().includes(query) ||
              p.category?.toLowerCase().includes(query) ||
              p.sku?.toLowerCase().includes(query)
          )
          .slice(0, 8);
        setSearchResults(filtered);
        setShowSearch(true);
      } catch {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResultClick = (productId: string) => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearch(false);
    setMobileOpen(false);
    router.push(`/products/${productId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearch(false);
      setMobileOpen(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const formatPrice = (price: number) =>
    price.toLocaleString("th-TH", { minimumFractionDigits: 0 });

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Tier 1: Utility Bar */}
      <div className="bg-primary-dark text-white text-xs">
        <div className="max-w-[1400px] mx-auto px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Truck size={13} />
              <span className="font-semibold">จัดส่งฟรี คำสั่งซื้อมากกว่า ฿5,000</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-white/70">
              <Phone size={12} />
              <span>02-952-5120-2</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-white/70">
              <Clock size={12} />
              <span>จ-ส 8:00-17:00</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isLoggedIn && user ? (
              <>
                <Link href="/account" className="hover:text-accent transition flex items-center gap-1">
                  <User size={13} />
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </Link>
                <span className="text-white/40">|</span>
                <Link href="/account/orders" className="hover:text-accent transition">
                  คำสั่งซื้อ
                </Link>
                <span className="text-white/40">|</span>
                <button onClick={logout} className="hover:text-accent transition flex items-center gap-1">
                  <LogOut size={12} />
                  <span>ออกจากระบบ</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hover:text-accent transition flex items-center gap-1">
                  <User size={13} />
                  <span>เข้าสู่ระบบ</span>
                </Link>
                <span className="text-white/40">|</span>
                <Link href="/auth/register" className="hover:text-accent transition">
                  สมัครสมาชิก
                </Link>
                <span className="text-white/40">|</span>
                <Link href="/account/orders" className="hover:text-accent transition">
                  ติดตามคำสั่งซื้อ
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tier 2: Main Header - Logo, Search, Cart */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2">
            <div className="bg-primary text-white px-3 py-1.5 rounded font-bold text-xl tracking-wider">
              INTECH
            </div>
            <div className="hidden sm:block">
              <p className="text-xs text-gray-500 leading-tight">Delta System</p>
              <p className="text-[10px] text-gray-400 leading-tight">Authorized Dealer</p>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="flex-1 max-w-2xl mx-auto hidden md:block" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="flex">
                <input
                  type="text"
                  placeholder="ค้นหาสินค้า, รุ่น, SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) setShowSearch(true);
                  }}
                  className="flex-1 border-2 border-primary rounded-l px-4 py-2.5 text-sm outline-none focus:border-accent transition"
                />
                <button
                  type="submit"
                  className="bg-accent hover:bg-accent-dark text-white px-5 rounded-r transition flex items-center"
                >
                  <Search size={20} />
                </button>
              </div>

              {/* Search Results Dropdown */}
              {showSearch && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-xl border border-gray-200 max-h-80 overflow-y-auto z-50">
                  {searchResults.map((product: any) => (
                    <button
                      key={product.id ?? product._id}
                      onClick={() => handleResultClick(product.id ?? product._id)}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition flex items-center gap-3 border-b border-gray-50"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center shrink-0">
                        <Search size={14} className="text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.sku || product.category}</p>
                      </div>
                      {product.price != null && (
                        <span className="text-sm font-bold text-primary whitespace-nowrap">
                          ฿{formatPrice(product.price)}
                        </span>
                      )}
                    </button>
                  ))}
                  <button
                    onClick={handleSearchSubmit as any}
                    className="w-full text-center py-2.5 text-sm text-primary font-semibold hover:bg-blue-50 transition"
                  >
                    ดูผลลัพธ์ทั้งหมดสำหรับ &quot;{searchQuery}&quot;
                  </button>
                </div>
              )}

              {showSearch && searchQuery.trim().length > 0 && searchResults.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-xl border border-gray-200 py-4 px-4 z-50">
                  <p className="text-sm text-gray-500 text-center">ไม่พบสินค้าที่ค้นหา</p>
                </div>
              )}
            </form>
          </div>

          {/* Right Actions: Wishlist, Compare, Account, Cart */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="hidden lg:flex flex-col items-center text-gray-500 hover:text-red-500 transition px-2 relative"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 right-0 bg-red-500 text-white text-[9px] font-bold min-w-[16px] h-[16px] flex items-center justify-center rounded-full px-0.5">
                  {wishlistCount}
                </span>
              )}
              <span className="text-[10px] mt-0.5">ถูกใจ</span>
            </Link>

            {/* Compare */}
            <Link
              href="/compare"
              className="hidden lg:flex flex-col items-center text-gray-500 hover:text-primary transition px-2 relative"
            >
              <GitCompareArrows size={20} />
              {compareCount > 0 && (
                <span className="absolute -top-1 right-0 bg-primary text-white text-[9px] font-bold min-w-[16px] h-[16px] flex items-center justify-center rounded-full px-0.5">
                  {compareCount}
                </span>
              )}
              <span className="text-[10px] mt-0.5">เปรียบเทียบ</span>
            </Link>

            {/* Account */}
            <Link
              href="/account"
              className="hidden lg:flex flex-col items-center text-gray-500 hover:text-primary transition px-2"
            >
              <User size={20} />
              <span className="text-[10px] mt-0.5">บัญชี</span>
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded transition ml-1"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
              <span className="hidden sm:inline text-sm font-semibold">
                ฿{formatPrice(subtotal)}
              </span>
            </button>

            {/* Mobile Toggle */}
            <button
              className="p-2 text-secondary md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Tier 3: Navigation Bar */}
      <nav className="bg-primary text-white">
        <div className="max-w-[1400px] mx-auto px-4 flex items-center">
          {/* Shopping Categories Dropdown Trigger */}
          <div className="relative" ref={categoryRef}>
            <button
              onClick={() => setCategoryDropdown(!categoryDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary-dark hover:bg-[#002a52] transition text-sm font-bold"
            >
              <Menu size={16} />
              <span>Shopping Categories</span>
              <ChevronDown size={14} className={`transition-transform ${categoryDropdown ? "rotate-180" : ""}`} />
            </button>

            {/* Mega Category Dropdown */}
            {categoryDropdown && (
              <div className="absolute top-full left-0 bg-white shadow-xl border border-gray-200 min-w-[280px] z-50">
                {CATEGORIES.map((cat) => {
                  if (cat.children) {
                    return (
                      <div key={cat.id} className="group relative">
                        <div className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-primary hover:text-white transition cursor-pointer">
                          <span className="font-medium">{cat.name}</span>
                          <ChevronDown size={14} className="-rotate-90" />
                        </div>
                        <div className="hidden group-hover:block absolute left-full top-0 bg-white shadow-xl border border-gray-200 min-w-[220px]">
                          {cat.children.map((child) => (
                            <Link
                              key={child.id}
                              href={`/products?category=${child.slug}`}
                              onClick={() => setCategoryDropdown(false)}
                              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary hover:text-white transition"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setCategoryDropdown(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary hover:text-white transition font-medium"
                    >
                      {cat.name}
                    </Link>
                  );
                })}
                <Link
                  href="/products"
                  onClick={() => setCategoryDropdown(false)}
                  className="block px-4 py-2.5 text-sm text-primary font-bold border-t border-gray-100 hover:bg-blue-50 transition"
                >
                  ดูสินค้าทั้งหมด &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center">
            {resourceLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2.5 text-sm font-medium hover:bg-white/10 transition"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side of nav */}
          <div className="ml-auto flex items-center">
            <a
              href="https://page.line.me/035qyhrg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-[#06C755] hover:bg-[#05a847] rounded text-sm font-semibold transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
              </svg>
              LINE
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          {/* Mobile Search */}
          <div className="p-3 border-b border-gray-100" ref={mobileSearchRef}>
            <form onSubmit={handleSearchSubmit} className="flex">
              <input
                type="text"
                placeholder="ค้นหาสินค้า..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowSearch(true);
                }}
                className="flex-1 border-2 border-primary rounded-l px-3 py-2 text-sm outline-none"
              />
              <button type="submit" className="bg-accent text-white px-4 rounded-r">
                <Search size={18} />
              </button>
            </form>

            {showSearch && searchResults.length > 0 && (
              <div className="mt-2 bg-gray-50 border border-gray-200 max-h-60 overflow-y-auto">
                {searchResults.map((product: any) => (
                  <button
                    key={product.id ?? product._id}
                    onClick={() => handleResultClick(product.id ?? product._id)}
                    className="w-full text-left px-3 py-2.5 hover:bg-blue-50 transition flex items-center gap-3 border-b border-gray-100"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.category}</p>
                    </div>
                    {product.price != null && (
                      <span className="text-sm font-bold text-primary whitespace-nowrap">
                        ฿{formatPrice(product.price)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Quick Links */}
          <div className="flex border-b border-gray-100">
            <Link href="/account/wishlist" className="flex-1 flex items-center justify-center gap-1 py-3 text-xs text-gray-600 hover:text-red-500" onClick={() => setMobileOpen(false)}>
              <Heart size={16} />
              ถูกใจ {wishlistCount > 0 && `(${wishlistCount})`}
            </Link>
            <Link href="/compare" className="flex-1 flex items-center justify-center gap-1 py-3 text-xs text-gray-600 hover:text-primary border-x border-gray-100" onClick={() => setMobileOpen(false)}>
              <GitCompareArrows size={16} />
              เปรียบเทียบ {compareCount > 0 && `(${compareCount})`}
            </Link>
            <Link href="/account" className="flex-1 flex items-center justify-center gap-1 py-3 text-xs text-gray-600 hover:text-primary" onClick={() => setMobileOpen(false)}>
              <User size={16} />
              บัญชี
            </Link>
          </div>

          {/* Mobile Nav Links */}
          <nav className="py-2">
            <Link href="/" className="block px-4 py-3 text-sm font-semibold text-primary border-b border-gray-50" onClick={() => setMobileOpen(false)}>
              หน้าแรก
            </Link>
            <Link href="/products" className="block px-4 py-3 text-sm font-semibold text-secondary hover:text-primary border-b border-gray-50" onClick={() => setMobileOpen(false)}>
              สินค้าทั้งหมด
            </Link>

            {/* Mobile Categories */}
            <div className="px-4 py-2">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">หมวดหมู่</p>
              {FLAT_CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="block py-2 text-sm text-gray-600 hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-2">
              {resourceLinks.filter(l => l.href !== "/products").map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block px-4 py-3 text-sm font-semibold text-secondary hover:text-primary border-b border-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="px-4 pt-3 pb-2 flex gap-2">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/account"
                    className="flex-1 text-center bg-primary text-white py-2 rounded text-sm font-semibold"
                    onClick={() => setMobileOpen(false)}
                  >
                    บัญชีของฉัน
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="flex-1 text-center bg-gray-200 text-gray-700 py-2 rounded text-sm font-semibold"
                  >
                    ออกจากระบบ
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="flex-1 text-center bg-primary text-white py-2 rounded text-sm font-semibold"
                    onClick={() => setMobileOpen(false)}
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <a
                    href="https://page.line.me/035qyhrg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-[#06C755] text-white py-2 rounded text-sm font-semibold"
                  >
                    LINE สอบถาม
                  </a>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
