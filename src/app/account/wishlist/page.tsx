"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useCompare } from "@/contexts/CompareContext";
import { useRouter } from "next/navigation";
import { Heart, ChevronRight, Package, ShoppingCart, Trash2, GitCompareArrows } from "lucide-react";

interface Product {
  id: number;
  name: string;
  sku?: string;
  price: number;
  category: string;
  inStock: boolean;
}

export default function WishlistPage() {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const { wishlistIds, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toggleCompare, isInCompare } = useCompare();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/auth/login");
      return;
    }
  }, [authLoading, isLoggedIn, router]);

  useEffect(() => {
    if (wishlistIds.length > 0) {
      fetch("/api/products")
        .then((r) => r.json())
        .then((allProducts) => {
          const filtered = allProducts.filter((p: Product) => wishlistIds.includes(p.id));
          setProducts(filtered);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [wishlistIds]);

  if (authLoading || !user) return <div className="min-h-[60vh] flex items-center justify-center text-gray-400">กำลังโหลด...</div>;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-4">
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
        <Link href="/" className="hover:text-primary transition">หน้าแรก</Link>
        <ChevronRight size={12} />
        <Link href="/account" className="hover:text-primary transition">บัญชี</Link>
        <ChevronRight size={12} />
        <span className="text-gray-600 font-medium">สินค้าที่ถูกใจ</span>
      </nav>

      <h1 className="text-xl font-bold text-secondary mb-4">สินค้าที่ถูกใจ ({products.length})</h1>

      {loading ? (
        <div className="text-center py-12 text-gray-400">กำลังโหลด...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded">
          <Heart size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-semibold">ยังไม่มีสินค้าที่ถูกใจ</p>
          <Link href="/products" className="inline-block mt-3 text-primary font-semibold hover:underline text-sm">
            เลือกดูสินค้า &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {products.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded overflow-hidden group">
              <Link href={`/products/${product.id}`}>
                <div className="bg-gray-50 p-4 flex items-center justify-center h-32">
                  <Package size={40} className="text-gray-300 group-hover:text-primary transition" />
                </div>
              </Link>
              <div className="p-3">
                <Link href={`/products/${product.id}`}>
                  <h3 className="text-sm font-semibold text-secondary line-clamp-2 hover:text-primary transition">{product.name}</h3>
                </Link>
                <p className="text-primary font-bold mt-1">฿{product.price.toLocaleString()}</p>
                <div className="flex gap-2 mt-2">
                  {product.inStock && (
                    <button
                      onClick={() => addToCart({ productId: product.id, name: product.name, sku: product.sku, price: product.price, category: product.category }, 1)}
                      className="flex-1 flex items-center justify-center gap-1 bg-accent text-white py-1.5 rounded text-xs font-semibold hover:bg-accent-dark transition"
                    >
                      <ShoppingCart size={12} /> ซื้อ
                    </button>
                  )}
                  <button
                    onClick={() => toggleCompare(product.id)}
                    className={`w-8 h-8 border rounded flex items-center justify-center transition ${
                      isInCompare(product.id) ? "border-primary bg-blue-50 text-primary" : "border-gray-200 hover:border-primary hover:text-primary text-gray-400"
                    }`}
                    title="เปรียบเทียบ"
                  >
                    <GitCompareArrows size={14} />
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="w-8 h-8 border border-red-200 rounded flex items-center justify-center hover:bg-red-50 transition"
                    title="ลบออกจากรายการถูกใจ"
                  >
                    <Trash2 size={14} className="text-red-400" />
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
