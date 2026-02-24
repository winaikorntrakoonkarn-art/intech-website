"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ChevronRight, Package, Truck } from "lucide-react";

export default function CartPage() {
  const { items, itemCount, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();

  const shippingCost = subtotal >= 5000 ? 0 : 150;
  const total = subtotal + shippingCost;

  const formatPrice = (price: number) => price.toLocaleString("th-TH");

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
        <Link href="/" className="hover:text-primary transition">หน้าแรก</Link>
        <ChevronRight size={12} />
        <span className="text-gray-600 font-medium">ตะกร้าสินค้า</span>
      </nav>

      <h1 className="text-xl font-bold text-secondary mb-4">ตะกร้าสินค้า ({itemCount} รายการ)</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200 rounded">
          <ShoppingBag size={64} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 text-lg font-semibold">ยังไม่มีสินค้าในตะกร้า</p>
          <p className="text-gray-400 text-sm mt-1">เลือกดูสินค้าของเราได้เลย</p>
          <Link href="/products" className="inline-flex items-center gap-2 mt-4 bg-primary text-white px-6 py-2.5 rounded font-semibold hover:bg-primary-dark transition">
            เลือกซื้อสินค้า <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items Table */}
          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 bg-primary text-white text-xs font-bold px-4 py-3">
                <div className="col-span-6">สินค้า</div>
                <div className="col-span-2 text-center">ราคาต่อชิ้น</div>
                <div className="col-span-2 text-center">จำนวน</div>
                <div className="col-span-2 text-right">รวม</div>
              </div>

              {/* Items */}
              {items.map((item) => (
                <div key={item.productId} className="grid grid-cols-12 gap-4 items-center px-4 py-3 border-b border-gray-100 last:border-b-0">
                  {/* Product Info */}
                  <div className="col-span-12 md:col-span-6 flex items-center gap-3">
                    <div className="w-14 h-14 bg-gray-50 rounded border border-gray-100 flex items-center justify-center shrink-0">
                      <Package size={24} className="text-gray-300" />
                    </div>
                    <div className="min-w-0">
                      <Link href={`/products/${item.productId}`} className="text-sm font-semibold text-secondary hover:text-primary transition line-clamp-1">
                        {item.name}
                      </Link>
                      {item.sku && <p className="text-[10px] text-gray-400">SKU: {item.sku}</p>}
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-[10px] text-red-400 hover:text-red-500 flex items-center gap-1 mt-1"
                      >
                        <Trash2 size={10} /> ลบ
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-4 md:col-span-2 text-center">
                    <span className="md:hidden text-[10px] text-gray-400 block">ราคา</span>
                    <span className="text-sm font-semibold">฿{formatPrice(item.price)}</span>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-4 md:col-span-2 flex justify-center">
                    <div className="flex items-center border border-gray-200 rounded">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="col-span-4 md:col-span-2 text-right">
                    <span className="md:hidden text-[10px] text-gray-400 block">รวม</span>
                    <span className="text-sm font-bold text-primary">฿{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4">
              <Link href="/products" className="text-sm text-primary font-semibold hover:underline">
                &larr; เลือกซื้อสินค้าต่อ
              </Link>
              <button
                onClick={clearCart}
                className="text-sm text-red-400 hover:text-red-500 font-semibold"
              >
                ล้างตะกร้า
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[340px] shrink-0">
            <div className="bg-white border border-gray-200 rounded p-5 sticky top-[120px]">
              <h3 className="font-bold text-secondary text-sm mb-4 uppercase tracking-wider">สรุปคำสั่งซื้อ</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">ยอดรวมสินค้า ({itemCount} ชิ้น)</span>
                  <span className="font-semibold">฿{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ค่าจัดส่ง</span>
                  {shippingCost === 0 ? (
                    <span className="font-semibold text-success">ฟรี</span>
                  ) : (
                    <span className="font-semibold">฿{formatPrice(shippingCost)}</span>
                  )}
                </div>
                {subtotal < 5000 && (
                  <div className="flex items-center gap-1.5 text-xs text-accent bg-orange-50 rounded p-2">
                    <Truck size={14} />
                    <span>ซื้อเพิ่มอีก ฿{formatPrice(5000 - subtotal)} เพื่อรับจัดส่งฟรี!</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                <span className="font-bold text-secondary">ยอดรวมทั้งหมด</span>
                <span className="text-xl font-bold text-primary">฿{formatPrice(total)}</span>
              </div>
              <p className="text-[10px] text-gray-400 text-right mt-1">ยังไม่รวม VAT 7%</p>

              <Link
                href="/checkout"
                className="block w-full bg-accent text-white text-center py-3 rounded font-bold hover:bg-accent-dark transition mt-4"
              >
                ดำเนินการสั่งซื้อ
              </Link>
              <Link
                href="/quote"
                className="block w-full bg-primary text-white text-center py-3 rounded font-bold hover:bg-primary-dark transition mt-2"
              >
                ขอใบเสนอราคา
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
