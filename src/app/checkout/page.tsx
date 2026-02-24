"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import {
  ShoppingBag,
  ChevronRight,
  CreditCard,
  Truck,
  Building,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Package,
} from "lucide-react";

const steps = [
  { key: "shipping", label: "ข้อมูลจัดส่ง", icon: Building },
  { key: "payment", label: "ชำระเงิน", icon: CreditCard },
  { key: "review", label: "ตรวจสอบ", icon: CheckCircle },
];

export default function CheckoutPage() {
  const { items, itemCount, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    taxId: "",
    notes: "",
    paymentMethod: "transfer" as "transfer" | "cod",
  });

  const shippingCost = subtotal >= 5000 ? 0 : 150;
  const total = subtotal + shippingCost;
  const formatPrice = (price: number) => price.toLocaleString("th-TH");

  const validateStep = () => {
    if (currentStep === 0) {
      return form.name && form.email && form.phone && form.address;
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) {
      alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }
    setCurrentStep(Math.min(2, currentStep + 1));
  };

  const prevStep = () => setCurrentStep(Math.max(0, currentStep - 1));

  const handleSubmit = async () => {
    if (items.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
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
          subtotal,
          shippingCost,
          total,
          customer: {
            name: form.name,
            company: form.company || undefined,
            email: form.email,
            phone: form.phone,
            address: form.address,
            taxId: form.taxId || undefined,
            notes: form.notes || undefined,
          },
          type: "order",
          paymentMethod: form.paymentMethod,
        }),
      });

      const order = await res.json();
      clearCart();
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch {
      alert("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-200 mb-4" />
          <h2 className="text-xl font-bold text-secondary mb-2">ไม่มีสินค้าในตะกร้า</h2>
          <p className="text-gray-500 mb-4">กรุณาเลือกสินค้าก่อนทำการสั่งซื้อ</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded font-bold hover:bg-primary-dark transition"
          >
            <ArrowLeft size={18} /> ไปหน้าสินค้า
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
        <Link href="/" className="hover:text-primary transition">หน้าแรก</Link>
        <ChevronRight size={12} />
        <Link href="/cart" className="hover:text-primary transition">ตะกร้าสินค้า</Link>
        <ChevronRight size={12} />
        <span className="text-gray-600 font-medium">สั่งซื้อสินค้า</span>
      </nav>

      {/* Step Progress */}
      <div className="bg-white border border-gray-200 rounded p-4 mb-6">
        <div className="flex items-center justify-center gap-2">
          {steps.map((step, i) => (
            <div key={step.key} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-semibold transition ${
                  i === currentStep
                    ? "bg-primary text-white"
                    : i < currentStep
                    ? "bg-success text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {i < currentStep ? (
                  <CheckCircle size={16} />
                ) : (
                  <step.icon size={16} />
                )}
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{i + 1}</span>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight size={16} className="text-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Step Content */}
        <div className="flex-1">
          {/* Step 1: Shipping Info */}
          {currentStep === 0 && (
            <div className="bg-white border border-gray-200 rounded p-5">
              <h2 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                <Building size={20} className="text-primary" />
                ข้อมูลผู้สั่งซื้อ
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">ชื่อ-นามสกุล *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded focus:outline-none focus:border-primary text-sm"
                    placeholder="ชื่อ นามสกุล"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">บริษัท</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded focus:outline-none focus:border-primary text-sm"
                    placeholder="ชื่อบริษัท (ถ้ามี)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">อีเมล *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded focus:outline-none focus:border-primary text-sm"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">เบอร์โทรศัพท์ *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded focus:outline-none focus:border-primary text-sm"
                    placeholder="0xx-xxx-xxxx"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-600 mb-1">ที่อยู่จัดส่ง *</label>
                <textarea
                  required
                  rows={3}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded focus:outline-none focus:border-primary text-sm resize-none"
                  placeholder="ที่อยู่สำหรับจัดส่งสินค้า"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">เลขประจำตัวผู้เสียภาษี</label>
                  <input
                    type="text"
                    value={form.taxId}
                    onChange={(e) => setForm({ ...form, taxId: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded focus:outline-none focus:border-primary text-sm"
                    placeholder="สำหรับออกใบกำกับภาษี"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">หมายเหตุ</label>
                  <input
                    type="text"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded focus:outline-none focus:border-primary text-sm"
                    placeholder="ข้อมูลเพิ่มเติม"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {currentStep === 1 && (
            <div className="bg-white border border-gray-200 rounded p-5">
              <h2 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-primary" />
                วิธีชำระเงิน
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                <label
                  className={`flex items-center gap-3 p-4 rounded border-2 cursor-pointer transition ${
                    form.paymentMethod === "transfer"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="transfer"
                    checked={form.paymentMethod === "transfer"}
                    onChange={() => setForm({ ...form, paymentMethod: "transfer" })}
                    className="accent-primary"
                  />
                  <div>
                    <p className="font-semibold text-secondary text-sm">โอนเงินผ่านธนาคาร</p>
                    <p className="text-xs text-gray-500">แจ้งหลักฐานการโอนทาง LINE</p>
                  </div>
                </label>
                <label
                  className={`flex items-center gap-3 p-4 rounded border-2 cursor-pointer transition ${
                    form.paymentMethod === "cod"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={form.paymentMethod === "cod"}
                    onChange={() => setForm({ ...form, paymentMethod: "cod" })}
                    className="accent-primary"
                  />
                  <div>
                    <p className="font-semibold text-secondary text-sm">เก็บเงินปลายทาง (COD)</p>
                    <p className="text-xs text-gray-500">ชำระเงินเมื่อได้รับสินค้า</p>
                  </div>
                </label>
              </div>
              {form.paymentMethod === "transfer" && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-4 text-sm">
                  <p className="font-bold text-secondary mb-2">ข้อมูลการโอนเงิน:</p>
                  <p className="text-gray-600">ธนาคาร: กสิกรไทย (KBANK)</p>
                  <p className="text-gray-600">ชื่อบัญชี: บจก. อินเทค เดลต้า ซิสเทม</p>
                  <p className="text-gray-600">เลขที่บัญชี: xxx-x-xxxxx-x</p>
                  <p className="text-xs text-gray-500 mt-2">* กรุณาแจ้งหลักฐานการโอนผ่าน LINE หลังจากชำระเงิน</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {/* Shipping Info Summary */}
              <div className="bg-white border border-gray-200 rounded p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-secondary text-sm flex items-center gap-2">
                    <Building size={16} className="text-primary" />
                    ข้อมูลจัดส่ง
                  </h3>
                  <button onClick={() => setCurrentStep(0)} className="text-xs text-primary hover:underline">แก้ไข</button>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>{form.name}</strong> {form.company && `(${form.company})`}</p>
                  <p>{form.address}</p>
                  <p>โทร: {form.phone} | อีเมล: {form.email}</p>
                  {form.taxId && <p>Tax ID: {form.taxId}</p>}
                  {form.notes && <p>หมายเหตุ: {form.notes}</p>}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-white border border-gray-200 rounded p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-secondary text-sm flex items-center gap-2">
                    <CreditCard size={16} className="text-primary" />
                    วิธีชำระเงิน
                  </h3>
                  <button onClick={() => setCurrentStep(1)} className="text-xs text-primary hover:underline">แก้ไข</button>
                </div>
                <p className="text-sm text-gray-600">
                  {form.paymentMethod === "transfer" ? "โอนเงินผ่านธนาคาร" : "เก็บเงินปลายทาง (COD)"}
                </p>
              </div>

              {/* Items Summary */}
              <div className="bg-white border border-gray-200 rounded p-5">
                <h3 className="font-bold text-secondary text-sm flex items-center gap-2 mb-3">
                  <Package size={16} className="text-primary" />
                  รายการสินค้า ({itemCount} ชิ้น)
                </h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-b-0">
                      <div>
                        <p className="font-semibold text-secondary">{item.name}</p>
                        <p className="text-xs text-gray-400">x{item.quantity} @ ฿{formatPrice(item.price)}</p>
                      </div>
                      <span className="font-bold text-primary">฿{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step Navigation */}
          <div className="flex items-center justify-between mt-6">
            {currentStep > 0 ? (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition font-semibold"
              >
                <ArrowLeft size={16} /> ย้อนกลับ
              </button>
            ) : (
              <Link href="/cart" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition font-semibold">
                <ArrowLeft size={16} /> กลับไปตะกร้า
              </Link>
            )}

            {currentStep < 2 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded font-bold hover:bg-primary-dark transition text-sm"
              >
                ถัดไป <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 bg-accent text-white px-6 py-2.5 rounded font-bold hover:bg-accent-dark transition disabled:opacity-50 text-sm"
              >
                <Truck size={18} />
                {loading ? "กำลังดำเนินการ..." : "ยืนยันคำสั่งซื้อ"}
              </button>
            )}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="w-full lg:w-[340px] shrink-0">
          <div className="bg-white border border-gray-200 rounded p-5 sticky top-[120px]">
            <h3 className="font-bold text-secondary text-sm mb-4 uppercase tracking-wider">สรุปคำสั่งซื้อ</h3>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between items-start gap-2 text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-secondary line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-400">x{item.quantity}</p>
                  </div>
                  <span className="font-bold text-sm whitespace-nowrap">฿{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">ยอดรวมสินค้า</span>
                <span className="font-semibold">฿{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ค่าจัดส่ง</span>
                <span className={`font-semibold ${shippingCost === 0 ? "text-success" : ""}`}>
                  {shippingCost === 0 ? "ฟรี" : `฿${formatPrice(shippingCost)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold border-t pt-3 mt-2">
                <span>ยอดรวมทั้งสิ้น</span>
                <span className="text-primary">฿{formatPrice(total)}</span>
              </div>
              <p className="text-[10px] text-gray-400 text-right">ยังไม่รวม VAT 7%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
