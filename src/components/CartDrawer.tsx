"use client";

import { useCart } from "@/contexts/CartContext";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CartDrawer() {
  const { items, itemCount, subtotal, updateQuantity, removeFromCart, cartOpen, setCartOpen } = useCart();

  if (!cartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-primary text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag size={22} />
            <h2 className="text-lg font-bold">ตะกร้าสินค้า</h2>
            <span className="bg-accent text-white text-xs px-2 py-0.5 rounded font-bold">
              {itemCount}
            </span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-1 hover:bg-white/10 rounded transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag size={64} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500 font-semibold">ยังไม่มีสินค้าในตะกร้า</p>
              <p className="text-gray-400 text-sm mt-1">เลือกดูสินค้าของเราได้เลย</p>
              <Link
                href="/products"
                onClick={() => setCartOpen(false)}
                className="inline-flex items-center gap-2 mt-4 text-primary font-semibold hover:underline"
              >
                ดูสินค้าทั้งหมด <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-gray-light rounded p-3 flex gap-3"
                >
                  <div className="w-14 h-14 bg-white rounded flex items-center justify-center shrink-0 border border-gray-200">
                    <ShoppingBag size={20} className="text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.productId}`}
                      onClick={() => setCartOpen(false)}
                      className="text-sm font-semibold text-secondary line-clamp-2 hover:text-primary transition"
                    >
                      {item.name}
                    </Link>
                    {item.sku && (
                      <p className="text-xs text-gray-400 mt-0.5">SKU: {item.sku}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-primary font-bold text-sm">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-7 h-7 rounded bg-white border border-gray-200 flex items-center justify-center hover:border-primary transition"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-7 h-7 rounded bg-white border border-gray-200 flex items-center justify-center hover:border-primary transition"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="w-7 h-7 rounded bg-white border border-red-200 flex items-center justify-center hover:bg-red-50 transition ml-1"
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">ยอดรวม ({itemCount} ชิ้น)</span>
              <span className="text-xl font-bold text-secondary">
                ฿{subtotal.toLocaleString()}
              </span>
            </div>
            <Link
              href="/cart"
              onClick={() => setCartOpen(false)}
              className="block w-full bg-primary text-white text-center py-3 rounded font-bold hover:bg-primary-dark transition"
            >
              ดูตะกร้าสินค้า
            </Link>
            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="block w-full bg-accent text-white text-center py-3 rounded font-bold hover:bg-accent-dark transition"
            >
              ดำเนินการสั่งซื้อ
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
