"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCompare } from "@/contexts/CompareContext";
import { useCart } from "@/contexts/CartContext";
import {
  ChevronRight,
  Package,
  X,
  ShoppingCart,
  GitCompareArrows,
  Plus,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  sku?: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand?: string;
  series?: string;
  inStock: boolean;
  stockQuantity?: number;
  warranty?: string;
  weight?: string;
  specs?: Record<string, string>;
}

export default function ComparePage() {
  const { compareIds, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (compareIds.length > 0) {
      fetch("/api/products")
        .then((r) => r.json())
        .then((allProducts) => {
          const filtered = allProducts.filter((p: Product) =>
            compareIds.includes(p.id)
          );
          // Maintain order from compareIds
          const ordered = compareIds
            .map((id) => filtered.find((p: Product) => p.id === id))
            .filter(Boolean) as Product[];
          setProducts(ordered);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [compareIds]);

  // Collect all unique spec keys from all products
  const allSpecKeys = Array.from(
    new Set(products.flatMap((p) => Object.keys(p.specs || {})))
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-4">
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
        <Link href="/" className="hover:text-primary transition">
          หน้าแรก
        </Link>
        <ChevronRight size={12} />
        <span className="text-gray-600 font-medium">เปรียบเทียบสินค้า</span>
      </nav>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-secondary flex items-center gap-2">
          <GitCompareArrows size={24} className="text-primary" />
          เปรียบเทียบสินค้า ({products.length})
        </h1>
        {products.length > 0 && (
          <button
            onClick={clearCompare}
            className="text-sm text-red-500 hover:text-red-600 font-semibold"
          >
            ล้างทั้งหมด
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">กำลังโหลด...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded">
          <GitCompareArrows
            size={48}
            className="mx-auto text-gray-200 mb-4"
          />
          <p className="text-gray-500 font-semibold">
            ยังไม่มีสินค้าที่ต้องการเปรียบเทียบ
          </p>
          <p className="text-sm text-gray-400 mt-1">
            เลือกสินค้าสูงสุด 4 รายการเพื่อเปรียบเทียบ
          </p>
          <Link
            href="/products"
            className="inline-block mt-4 bg-primary text-white px-6 py-2 rounded font-semibold text-sm hover:bg-primary-dark transition"
          >
            เลือกดูสินค้า
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            {/* Product Images / Names Row */}
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-4 py-3 w-[160px] bg-gray-50 text-xs text-gray-500 font-semibold align-top">
                  สินค้า
                </th>
                {products.map((product) => (
                  <th
                    key={product.id}
                    className="px-4 py-3 text-center align-top relative"
                    style={{ minWidth: 200 }}
                  >
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-50 rounded-full flex items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-500 transition"
                    >
                      <X size={14} />
                    </button>
                    <Link href={`/products/${product.id}`} className="block group">
                      <div className="w-20 h-20 mx-auto bg-gray-50 rounded flex items-center justify-center mb-2">
                        <Package
                          size={36}
                          className="text-gray-300 group-hover:text-primary transition"
                        />
                      </div>
                      <p className="text-sm font-semibold text-secondary group-hover:text-primary transition line-clamp-2">
                        {product.name}
                      </p>
                    </Link>
                  </th>
                ))}
                {products.length < 4 && (
                  <th className="px-4 py-3 text-center align-top" style={{ minWidth: 200 }}>
                    <Link
                      href="/products"
                      className="block w-20 h-20 mx-auto bg-gray-50 rounded border-2 border-dashed border-gray-300 flex items-center justify-center mb-2 hover:border-primary hover:bg-blue-50 transition"
                    >
                      <Plus size={24} className="text-gray-400" />
                    </Link>
                    <p className="text-xs text-gray-400">เพิ่มสินค้า</p>
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {/* Price */}
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-600">
                  ราคา
                </td>
                {products.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-center">
                    <span className="text-lg font-bold text-primary">
                      ฿{p.price.toLocaleString()}
                    </span>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <span className="block text-xs text-gray-400 line-through">
                        ฿{p.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </td>
                ))}
                {products.length < 4 && <td />}
              </tr>

              {/* SKU */}
              <tr className="border-b border-gray-100 bg-blue-50/30">
                <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-600">
                  SKU
                </td>
                {products.map((p) => (
                  <td
                    key={p.id}
                    className="px-4 py-3 text-center font-mono text-xs text-gray-700"
                  >
                    {p.sku || "-"}
                  </td>
                ))}
                {products.length < 4 && <td />}
              </tr>

              {/* Brand */}
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-600">
                  แบรนด์
                </td>
                {products.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-center text-gray-700">
                    {p.brand || "-"}
                  </td>
                ))}
                {products.length < 4 && <td />}
              </tr>

              {/* Series */}
              <tr className="border-b border-gray-100 bg-blue-50/30">
                <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-600">
                  ซีรีส์
                </td>
                {products.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-center text-gray-700">
                    {p.series || "-"}
                  </td>
                ))}
                {products.length < 4 && <td />}
              </tr>

              {/* Stock */}
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-600">
                  สถานะสินค้า
                </td>
                {products.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-center">
                    {p.inStock ? (
                      <span className="text-success font-semibold text-xs">
                        มีสินค้า
                        {p.stockQuantity != null && ` (${p.stockQuantity})`}
                      </span>
                    ) : (
                      <span className="text-red-500 font-semibold text-xs">
                        สินค้าหมด
                      </span>
                    )}
                  </td>
                ))}
                {products.length < 4 && <td />}
              </tr>

              {/* Warranty */}
              <tr className="border-b border-gray-100 bg-blue-50/30">
                <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-600">
                  รับประกัน
                </td>
                {products.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-center text-gray-700">
                    {p.warranty || "-"}
                  </td>
                ))}
                {products.length < 4 && <td />}
              </tr>

              {/* Weight */}
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-600">
                  น้ำหนัก
                </td>
                {products.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-center text-gray-700">
                    {p.weight || "-"}
                  </td>
                ))}
                {products.length < 4 && <td />}
              </tr>

              {/* Dynamic Spec Rows */}
              {allSpecKeys.map((key, i) => (
                <tr
                  key={key}
                  className={`border-b border-gray-100 ${
                    i % 2 === 0 ? "bg-blue-50/30" : ""
                  }`}
                >
                  <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-600">
                    {key}
                  </td>
                  {products.map((p) => (
                    <td
                      key={p.id}
                      className="px-4 py-3 text-center text-gray-700 text-xs"
                    >
                      {p.specs?.[key] || "-"}
                    </td>
                  ))}
                  {products.length < 4 && <td />}
                </tr>
              ))}

              {/* Add to Cart Row */}
              <tr>
                <td className="px-4 py-4 bg-gray-50 font-semibold text-gray-600">
                  สั่งซื้อ
                </td>
                {products.map((p) => (
                  <td key={p.id} className="px-4 py-4 text-center">
                    {p.inStock ? (
                      <button
                        onClick={() =>
                          addToCart(
                            {
                              productId: p.id,
                              name: p.name,
                              sku: p.sku,
                              price: p.price,
                              category: p.category,
                            },
                            1
                          )
                        }
                        className="inline-flex items-center gap-1 bg-accent text-white px-4 py-2 rounded text-xs font-semibold hover:bg-accent-dark transition"
                      >
                        <ShoppingCart size={14} /> เพิ่มลงตะกร้า
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">สินค้าหมด</span>
                    )}
                  </td>
                ))}
                {products.length < 4 && <td />}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
