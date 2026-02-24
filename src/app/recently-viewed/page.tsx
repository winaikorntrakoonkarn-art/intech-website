"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import {
  ChevronRight,
  Package,
  ShoppingCart,
  Heart,
  Clock,
  Trash2,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  sku?: string;
  price: number;
  category: string;
  inStock: boolean;
}

export default function RecentlyViewedPage() {
  const { recentIds, clearRecent } = useRecentlyViewed();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (recentIds.length > 0) {
      fetch("/api/products")
        .then((r) => r.json())
        .then((allProducts) => {
          // Maintain order from recentIds (most recent first)
          const ordered = recentIds
            .map((id) => allProducts.find((p: Product) => p.id === id))
            .filter(Boolean) as Product[];
          setProducts(ordered);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [recentIds]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-4">
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
        <Link href="/" className="hover:text-primary transition">
          หน้าแรก
        </Link>
        <ChevronRight size={12} />
        <span className="text-gray-600 font-medium">สินค้าที่ดูล่าสุด</span>
      </nav>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-secondary flex items-center gap-2">
          <Clock size={24} className="text-primary" />
          สินค้าที่ดูล่าสุด ({products.length})
        </h1>
        {products.length > 0 && (
          <button
            onClick={clearRecent}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 font-semibold"
          >
            <Trash2 size={14} /> ล้างประวัติ
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">กำลังโหลด...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded">
          <Clock size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-semibold">ยังไม่มีสินค้าที่ดูล่าสุด</p>
          <Link
            href="/products"
            className="inline-block mt-3 text-primary font-semibold hover:underline text-sm"
          >
            เลือกดูสินค้า &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded overflow-hidden group"
            >
              <Link href={`/products/${product.id}`}>
                <div className="bg-gray-50 p-4 flex items-center justify-center h-28">
                  <Package
                    size={36}
                    className="text-gray-300 group-hover:text-primary transition"
                  />
                </div>
              </Link>
              <div className="p-3">
                <Link href={`/products/${product.id}`}>
                  <h3 className="text-xs font-semibold text-secondary line-clamp-2 hover:text-primary transition">
                    {product.name}
                  </h3>
                </Link>
                {product.sku && (
                  <p className="text-[10px] text-gray-400 mt-0.5">{product.sku}</p>
                )}
                <p className="text-primary font-bold mt-1 text-sm">
                  ฿{product.price.toLocaleString()}
                </p>
                <div className="flex gap-1.5 mt-2">
                  {product.inStock && (
                    <button
                      onClick={() =>
                        addToCart(
                          {
                            productId: product.id,
                            name: product.name,
                            sku: product.sku,
                            price: product.price,
                            category: product.category,
                          },
                          1
                        )
                      }
                      className="flex-1 flex items-center justify-center gap-1 bg-accent text-white py-1.5 rounded text-[10px] font-semibold hover:bg-accent-dark transition"
                    >
                      <ShoppingCart size={11} /> ซื้อ
                    </button>
                  )}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`w-7 h-7 border rounded flex items-center justify-center transition ${
                      isInWishlist(product.id)
                        ? "bg-red-50 border-red-300 text-red-500"
                        : "border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200"
                    }`}
                  >
                    <Heart
                      size={12}
                      className={isInWishlist(product.id) ? "fill-red-500" : ""}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
