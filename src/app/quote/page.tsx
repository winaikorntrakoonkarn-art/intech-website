"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import {
  ShoppingBag,
  ChevronRight,
  FileText,
  ArrowLeft,
  CheckCircle,
  MessageCircle,
  Phone,
  Home,
} from "lucide-react";

export default function QuotePage() {
  const { items, itemCount, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [quoteId, setQuoteId] = useState("");
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            productName: item.name,
            sku: item.sku,
            price: item.price,
            quantity: item.quantity,
          })),
          customer: {
            name: form.name,
            company: form.company || undefined,
            email: form.email,
            phone: form.phone,
            notes: form.notes || undefined,
          },
        }),
      });

      const quote = await res.json();
      setQuoteId(quote.id);
      setSubmitted(true);
      clearCart();
    } catch {
      alert("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  // Success State
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center py-12">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-secondary mb-2">
              ส่งคำขอใบเสนอราคาสำเร็จ!
            </h1>
            <p className="text-gray-500 mb-4">
              ทีมงานจะจัดทำใบเสนอราคาและติดต่อกลับภายใน 1 วันทำการ
            </p>

            <div className="bg-gray-light rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-500">
                หมายเลขใบเสนอราคา
              </p>
              <p className="text-2xl font-bold text-primary mt-1">
                {quoteId}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href="https://page.line.me/035qyhrg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#06C755] text-white py-3 rounded-xl font-bold hover:bg-[#05a847] transition"
              >
                <MessageCircle size={20} /> สอบถามทาง LINE
              </a>
              <a
                href="tel:029525120"
                className="flex items-center justify-center gap-2 w-full bg-secondary text-white py-3 rounded-xl font-bold hover:bg-dark transition"
              >
                <Phone size={20} /> โทร 02-952-5120
              </a>
              <div className="flex gap-3">
                <Link
                  href="/"
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-light text-secondary py-3 rounded-xl font-bold hover:bg-gray-200 transition text-sm"
                >
                  <Home size={16} /> หน้าแรก
                </Link>
                <Link
                  href="/products"
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition text-sm"
                >
                  <ShoppingBag size={16} /> ดูสินค้า
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-secondary mb-2">
            ไม่มีสินค้าในตะกร้า
          </h2>
          <p className="text-gray-500 mb-4">
            กรุณาเลือกสินค้าก่อนขอใบเสนอราคา
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition"
          >
            <ArrowLeft size={18} /> ไปหน้าสินค้า
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary to-dark py-6">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-2">
            <Link href="/" className="hover:text-primary transition">
              หน้าแรก
            </Link>
            <ChevronRight size={14} />
            <Link href="/products" className="hover:text-primary transition">
              สินค้า
            </Link>
            <ChevronRight size={14} />
            <span className="text-white">ขอใบเสนอราคา</span>
          </nav>
          <h1 className="text-2xl font-bold text-white">ขอใบเสนอราคา</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-primary" />
                  ข้อมูลสำหรับใบเสนอราคา
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      ชื่อ-นามสกุล *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
                      placeholder="ชื่อ นามสกุล"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      บริษัท
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) =>
                        setForm({ ...form, company: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
                      placeholder="ชื่อบริษัท (ถ้ามี)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      อีเมล *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      เบอร์โทรศัพท์ *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
                      placeholder="0xx-xxx-xxxx"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    หมายเหตุ / ความต้องการเพิ่มเติม
                  </label>
                  <textarea
                    rows={4}
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm resize-none"
                    placeholder="เช่น ต้องการจำนวนมาก, ต้องการส่วนลด, ต้องการใบกำกับภาษี ฯลฯ"
                  />
                </div>
              </div>
            </div>

            {/* Right: Summary */}
            <div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24">
                <h2 className="text-lg font-bold text-secondary mb-4">
                  รายการสินค้า
                </h2>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between items-start gap-2 text-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-secondary line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-gray-500">x{item.quantity}</p>
                      </div>
                      <span className="font-bold text-secondary whitespace-nowrap">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">
                      จำนวนสินค้า
                    </span>
                    <span className="font-semibold">{itemCount} ชิ้น</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>ยอดรวมโดยประมาณ</span>
                    <span className="text-primary">
                      ฿{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    * ราคาสุดท้ายจะระบุในใบเสนอราคา
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 bg-secondary text-white py-3 rounded-xl font-bold hover:bg-dark transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FileText size={20} />
                  {loading ? "กำลังดำเนินการ..." : "ส่งคำขอใบเสนอราคา"}
                </button>
                <Link
                  href="/products"
                  className="block text-center mt-3 text-sm text-primary hover:underline"
                >
                  เลือกสินค้าเพิ่มเติม
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
