"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Home,
  ShoppingBag,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "N/A";

  return (
    <div className="min-h-screen bg-gray-light flex items-center justify-center py-12">
      <div className="max-w-lg mx-auto px-4 text-center">
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-secondary mb-2">
            สั่งซื้อสำเร็จ!
          </h1>
          <p className="text-gray-500 mb-4">ขอบคุณสำหรับคำสั่งซื้อ</p>

          <div className="bg-gray-light rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500">หมายเลขคำสั่งซื้อ</p>
            <p className="text-2xl font-bold text-primary mt-1">{orderId}</p>
          </div>

          <div className="text-left bg-blue-50 rounded-xl p-4 mb-6 text-sm">
            <p className="font-bold text-secondary mb-2">ขั้นตอนถัดไป:</p>
            <ul className="space-y-1.5 text-gray-600">
              <li>1. ทีมงานจะตรวจสอบและยืนยันคำสั่งซื้อ</li>
              <li>2. แจ้งหลักฐานการโอนเงินทาง LINE</li>
              <li>3. จัดส่งสินค้าภายใน 1-3 วันทำการ</li>
            </ul>
          </div>

          <div className="bg-gray-light rounded-xl p-4 mb-6 text-sm">
            <p className="font-bold text-secondary mb-2">
              บัญชีสำหรับโอนเงิน:
            </p>
            <p className="text-gray-600">ธนาคารกสิกรไทย</p>
            <p className="text-gray-600">
              ชื่อบัญชี: บจก. อินเทค เดลต้า ซิสเทม
            </p>
            <p className="text-gray-600 font-mono font-bold">xxx-x-xxxxx-x</p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href="https://page.line.me/035qyhrg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#06C755] text-white py-3 rounded-xl font-bold hover:bg-[#05a847] transition"
            >
              <MessageCircle size={20} /> แจ้งชำระเงินทาง LINE
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

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          กำลังโหลด...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
