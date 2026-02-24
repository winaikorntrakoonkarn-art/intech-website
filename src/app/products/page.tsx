"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, ShoppingCart, Package, ChevronRight, Grid3X3, List, SlidersHorizontal, Heart, GitCompareArrows } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCompare } from "@/contexts/CompareContext";
import { FLAT_CATEGORIES } from "@/lib/categories";
import Sidebar from "@/components/Sidebar";
import { Suspense } from "react";

interface Product {
  id: number;
  name: string;
  sku?: string;
  price: number;
  originalPrice?: number;
  category: string;
  inStock: boolean;
  stockQuantity?: number;
  brand?: string;
  featured?: boolean;
  description?: string;
}

const ITEMS_PER_PAGE = 12;

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [inStockOnly, setInStockOnly] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare, isFull } = useCompare();

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setAllProducts(data));
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
    const s = searchParams.get("search");
    if (s) setSearchQuery(s);
  }, [searchParams]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy, inStockOnly]);

  const categoryCounts = [
    { id: "all", name: "ทั้งหมด", slug: "all" },
    ...FLAT_CATEGORIES,
  ].map((cat) => ({
    ...cat,
    count:
      cat.id === "all"
        ? allProducts.length
        : allProducts.filter((p) => p.category === cat.id).length,
  }));

  const filtered = allProducts
    .filter((p) => selectedCategory === "all" || p.category === selectedCategory)
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((p) => !inStockOnly || p.inStock)
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return b.id - a.id;
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      category: product.category,
    });
  };

  const formatPrice = (price: number) => price.toLocaleString("th-TH");

  const selectedCatName = categoryCounts.find((c) => c.id === selectedCategory)?.name || "ทั้งหมด";

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
        <Link href="/" className="hover:text-primary transition">หน้าแรก</Link>
        <ChevronRight size={12} />
        <span className="text-gray-600 font-medium">สินค้าทั้งหมด</span>
        {selectedCategory !== "all" && (
          <>
            <ChevronRight size={12} />
            <span className="text-primary font-medium">{selectedCatName}</span>
          </>
        )}
      </nav>

      <div className="flex gap-4">
        {/* Left Sidebar */}
        <div className="w-[220px] shrink-0 hidden lg:block">
          <div className="sticky top-[120px] space-y-4">
            {/* Search */}
            <div className="bg-white border border-gray-200 rounded p-3">
              <div className="relative">
                <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหาสินค้า..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <div className="section-header-bar rounded-t flex items-center gap-2">
                <SlidersHorizontal size={14} />
                <span className="font-bold text-sm">หมวดหมู่สินค้า</span>
              </div>
              <div className="bg-white border border-t-0 border-gray-200 rounded-b">
                {categoryCounts.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 text-sm transition flex justify-between items-center border-b border-gray-50 last:border-b-0 ${
                      selectedCategory === cat.id
                        ? "bg-primary text-white font-semibold"
                        : "text-gray-600 hover:bg-blue-50 hover:text-primary"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      selectedCategory === cat.id ? "bg-white/20" : "bg-gray-100 text-gray-500"
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Filter */}
            <div className="bg-white border border-gray-200 rounded p-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-primary"
                />
                <span className="text-gray-700">เฉพาะสินค้าที่มีในสต็อก</span>
              </label>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="bg-white border border-gray-200 rounded p-3 mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              แสดง <strong className="text-gray-800">{filtered.length}</strong> รายการ
              {searchQuery && (
                <span className="ml-1">สำหรับ &quot;{searchQuery}&quot;</span>
              )}
            </p>
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex border border-gray-200 rounded overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 ${viewMode === "grid" ? "bg-primary text-white" : "text-gray-400 hover:text-primary"}`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 ${viewMode === "list" ? "bg-primary text-white" : "text-gray-400 hover:text-primary"}`}
                >
                  <List size={16} />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
              >
                <option value="latest">ล่าสุด</option>
                <option value="price-low">ราคา: ต่ำ - สูง</option>
                <option value="price-high">ราคา: สูง - ต่ำ</option>
                <option value="name">ชื่อ A-Z</option>
              </select>
            </div>
          </div>

          {/* Products Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded overflow-hidden hover:shadow-lg transition group"
                >
                  <Link href={`/products/${product.id}`}>
                    <div className="relative bg-gray-50 p-4 flex items-center justify-center h-40">
                      {product.inStock ? (
                        <span className="absolute top-2 left-2 bg-success text-white text-[10px] px-2 py-0.5 rounded font-semibold">
                          มีสินค้า
                        </span>
                      ) : (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-semibold">
                          สินค้าหมด
                        </span>
                      )}
                      {product.featured && (
                        <span className="absolute top-2 right-2 bg-accent text-white text-[10px] px-2 py-0.5 rounded font-semibold">
                          แนะนำ
                        </span>
                      )}
                      <Package size={48} className="text-gray-300 group-hover:text-primary transition" />
                    </div>
                  </Link>
                  <div className="p-3">
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                      {product.category}
                    </span>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold text-secondary text-sm mt-0.5 line-clamp-2 min-h-[2.5rem] hover:text-primary transition">
                        {product.name}
                      </h3>
                    </Link>
                    {product.sku && (
                      <p className="text-[10px] text-gray-400 mt-0.5">SKU: {product.sku}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-primary font-bold text-base">฿{formatPrice(product.price)}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-gray-400 text-xs line-through">฿{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-2">
                      {product.inStock && (
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 bg-accent text-white py-2 rounded font-semibold hover:bg-accent-dark transition text-sm flex items-center justify-center gap-1.5"
                        >
                          <ShoppingCart size={14} />
                          เพิ่มลงตะกร้า
                        </button>
                      )}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`w-8 h-8 border rounded flex items-center justify-center transition shrink-0 ${
                          isInWishlist(product.id)
                            ? "bg-red-50 border-red-300 text-red-500"
                            : "border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200"
                        }`}
                        title="ถูกใจ"
                      >
                        <Heart size={14} className={isInWishlist(product.id) ? "fill-red-500" : ""} />
                      </button>
                      <button
                        onClick={() => toggleCompare(product.id)}
                        className={`w-8 h-8 border rounded flex items-center justify-center transition shrink-0 ${
                          isInCompare(product.id)
                            ? "bg-blue-50 border-primary text-primary"
                            : isFull
                            ? "border-gray-200 text-gray-300 cursor-not-allowed"
                            : "border-gray-200 text-gray-400 hover:text-primary hover:border-primary"
                        }`}
                        title="เปรียบเทียบ"
                        disabled={!isInCompare(product.id) && isFull}
                      >
                        <GitCompareArrows size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded p-3 flex gap-4 items-center hover:shadow-md transition group"
                >
                  <Link href={`/products/${product.id}`} className="shrink-0">
                    <div className="w-20 h-20 bg-gray-50 rounded flex items-center justify-center border border-gray-100">
                      <Package size={32} className="text-gray-300 group-hover:text-primary transition" />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-primary font-bold uppercase">{product.category}</span>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold text-secondary text-sm hover:text-primary transition truncate">
                        {product.name}
                      </h3>
                    </Link>
                    {product.sku && <p className="text-[10px] text-gray-400">SKU: {product.sku}</p>}
                    {product.inStock ? (
                      <span className="text-[10px] text-success font-semibold">มีสินค้า</span>
                    ) : (
                      <span className="text-[10px] text-red-500 font-semibold">สินค้าหมด</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`w-8 h-8 border rounded flex items-center justify-center transition ${
                        isInWishlist(product.id)
                          ? "bg-red-50 border-red-300 text-red-500"
                          : "border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200"
                      }`}
                    >
                      <Heart size={14} className={isInWishlist(product.id) ? "fill-red-500" : ""} />
                    </button>
                    <button
                      onClick={() => toggleCompare(product.id)}
                      className={`w-8 h-8 border rounded flex items-center justify-center transition ${
                        isInCompare(product.id)
                          ? "bg-blue-50 border-primary text-primary"
                          : isFull
                          ? "border-gray-200 text-gray-300 cursor-not-allowed"
                          : "border-gray-200 text-gray-400 hover:text-primary hover:border-primary"
                      }`}
                      disabled={!isInCompare(product.id) && isFull}
                    >
                      <GitCompareArrows size={14} />
                    </button>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-primary font-bold text-base">฿{formatPrice(product.price)}</p>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <p className="text-gray-400 text-xs line-through">฿{formatPrice(product.originalPrice)}</p>
                    )}
                    {product.inStock && (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="mt-1 bg-accent text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-accent-dark transition flex items-center gap-1"
                      >
                        <ShoppingCart size={12} />
                        เพิ่มลงตะกร้า
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded border border-gray-200">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">ไม่พบสินค้าที่ค้นหา</p>
              <button
                onClick={() => { setSelectedCategory("all"); setSearchQuery(""); setInStockOnly(false); }}
                className="text-primary font-semibold mt-2 hover:underline"
              >
                ล้างตัวกรอง
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-6">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded hover:bg-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                &laquo; ก่อนหน้า
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 text-sm rounded transition ${
                    currentPage === page
                      ? "bg-primary text-white font-bold"
                      : "border border-gray-200 hover:bg-blue-50 text-gray-600"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded hover:bg-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ถัดไป &raquo;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-400">
          กำลังโหลด...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
