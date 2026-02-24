"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User, Package, Heart, MapPin, LogOut, ChevronRight, ShoppingCart } from "lucide-react";

export default function AccountPage() {
  const { user, isLoggedIn, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/auth/login");
    }
  }, [loading, isLoggedIn, router]);

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        กำลังโหลด...
      </div>
    );
  }

  const menuItems = [
    { icon: Package, label: "คำสั่งซื้อของฉัน", href: "/account/orders", desc: "ดูประวัติและติดตามสถานะคำสั่งซื้อ" },
    { icon: Heart, label: "สินค้าที่ถูกใจ", href: "/account/wishlist", desc: "รายการสินค้าที่บันทึกไว้" },
    { icon: MapPin, label: "ที่อยู่จัดส่ง", href: "/account/addresses", desc: "จัดการที่อยู่สำหรับจัดส่งสินค้า" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-4">
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
        <Link href="/" className="hover:text-primary transition">หน้าแรก</Link>
        <ChevronRight size={12} />
        <span className="text-gray-600 font-medium">บัญชีของฉัน</span>
      </nav>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded p-5 sticky top-[120px]">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <User size={28} className="text-white" />
              </div>
              <h2 className="font-bold text-secondary">{user.name}</h2>
              <p className="text-xs text-gray-400">{user.email}</p>
              {user.company && <p className="text-xs text-gray-400">{user.company}</p>}
            </div>

            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-primary rounded transition"
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </Link>
              ))}
              <button
                onClick={() => { logout(); router.push("/"); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded transition"
              >
                <LogOut size={16} />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-gray-200 rounded p-5">
            <h1 className="text-lg font-bold text-secondary mb-1">สวัสดี, {user.name}</h1>
            <p className="text-sm text-gray-500">ยินดีต้อนรับสู่บัญชีของคุณ</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white border border-gray-200 rounded p-5 hover:shadow-md hover:border-primary/30 transition group"
              >
                <item.icon size={28} className="text-primary mb-3" />
                <h3 className="font-bold text-secondary text-sm group-hover:text-primary transition">{item.label}</h3>
                <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded p-5">
            <h3 className="font-bold text-secondary text-sm mb-3">ลิงก์ด่วน</h3>
            <div className="flex flex-wrap gap-2">
              <Link href="/products" className="flex items-center gap-1.5 text-xs bg-primary text-white px-3 py-2 rounded hover:bg-primary-dark transition">
                <ShoppingCart size={14} /> เลือกซื้อสินค้า
              </Link>
              <Link href="/quote" className="flex items-center gap-1.5 text-xs bg-accent text-white px-3 py-2 rounded hover:bg-accent-dark transition">
                ขอใบเสนอราคา
              </Link>
              <Link href="/contact" className="flex items-center gap-1.5 text-xs border border-gray-200 text-gray-600 px-3 py-2 rounded hover:border-primary hover:text-primary transition">
                ติดต่อเรา
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
