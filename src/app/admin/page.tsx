"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Building,
  Wrench,
  Settings,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  Users,
  FileText,
  Clock,
  MessageSquare,
  Star,
  DollarSign,
} from "lucide-react";
import { useAuth } from "./layout";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  customer: { name: string; email: string };
}

interface Review {
  id: string;
  rating: number;
  userName: string;
  title: string;
  createdAt: string;
  productId: number;
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [quoteCount, setQuoteCount] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [pendingQuotes, setPendingQuotes] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setProductCount(Array.isArray(d) ? d.length : 0));

    fetch("/api/reviews")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) {
          setReviewCount(d.length);
          if (d.length > 0) {
            setAvgRating(d.reduce((sum: number, r: Review) => sum + r.rating, 0) / d.length);
          }
          setRecentReviews(
            d.sort((a: Review, b: Review) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)
          );
        }
      })
      .catch(() => {});

    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => setUserCount(Array.isArray(d) ? d.length : 0))
      .catch(() => {});

    if (token) {
      fetch("/api/orders", { headers: { authorization: token } })
        .then((r) => r.json())
        .then((d) => {
          if (Array.isArray(d)) {
            setOrderCount(d.length);
            setPendingOrders(d.filter((o: Order) => o.status === "pending").length);
            setTotalRevenue(
              d.filter((o: Order) => o.status !== "cancelled")
                .reduce((sum: number, o: Order) => sum + (o.total || 0), 0)
            );
            setRecentOrders(
              d.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)
            );
          }
        })
        .catch(() => {});

      fetch("/api/quotes", { headers: { authorization: token } })
        .then((r) => r.json())
        .then((d) => {
          if (Array.isArray(d)) {
            setQuoteCount(d.length);
            setPendingQuotes(d.filter((q: any) => q.status === "pending").length);
          }
        })
        .catch(() => {});
    }
  }, [token]);

  const cards = [
    {
      title: "คำสั่งซื้อ",
      value: orderCount,
      sub: `${pendingOrders} รอดำเนินการ`,
      icon: ShoppingBag,
      color: "bg-blue-500",
      href: "/admin/orders",
    },
    {
      title: "ใบเสนอราคา",
      value: quoteCount,
      sub: `${pendingQuotes} รอตอบกลับ`,
      icon: FileText,
      color: "bg-green-500",
      href: "/admin/quotes",
    },
    {
      title: "สินค้าทั้งหมด",
      value: productCount,
      sub: "9 หมวดหมู่",
      icon: Package,
      color: "bg-purple-500",
      href: "/admin/products",
    },
    {
      title: "สมาชิก",
      value: userCount,
      sub: "ผู้ใช้ลงทะเบียน",
      icon: Users,
      color: "bg-orange-500",
      href: "/admin/users",
    },
  ];

  const secondaryCards = [
    {
      title: "รีวิวสินค้า",
      value: reviewCount,
      sub: `คะแนนเฉลี่ย ${avgRating.toFixed(1)}/5`,
      icon: MessageSquare,
      color: "bg-yellow-500",
      href: "/admin/reviews",
    },
    {
      title: "รายได้รวม",
      value: `฿${totalRevenue.toLocaleString()}`,
      sub: "จากคำสั่งซื้อทั้งหมด",
      icon: DollarSign,
      color: "bg-emerald-500",
      href: "/admin/orders",
    },
  ];

  const quickLinks = [
    { title: "คำสั่งซื้อ", desc: "ดู/จัดการคำสั่งซื้อทั้งหมด", icon: ShoppingBag, href: "/admin/orders" },
    { title: "ใบเสนอราคา", desc: "ดู/ตอบกลับใบเสนอราคา", icon: FileText, href: "/admin/quotes" },
    { title: "จัดการสินค้า", desc: "เพิ่ม แก้ไข ลบสินค้า", icon: Package, href: "/admin/products" },
    { title: "ผู้ใช้งาน", desc: "จัดการบัญชีสมาชิก", icon: Users, href: "/admin/users" },
    { title: "รีวิวสินค้า", desc: "จัดการรีวิวจากลูกค้า", icon: MessageSquare, href: "/admin/reviews" },
    { title: "แก้ไขข้อมูลบริษัท", desc: "ข้อมูลเกี่ยวกับเรา", icon: Building, href: "/admin/about" },
    { title: "แก้ไขบริการ", desc: "รายละเอียดบริการทั้งหมด", icon: Wrench, href: "/admin/services" },
    { title: "ตั้งค่าเว็บไซต์", desc: "เบอร์โทร อีเมล ที่อยู่", icon: Settings, href: "/admin/settings" },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    processing: "bg-purple-100 text-purple-700",
    shipped: "bg-indigo-100 text-indigo-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const statusLabels: Record<string, string> = {
    pending: "รอดำเนินการ",
    confirmed: "ยืนยันแล้ว",
    processing: "กำลังจัดเตรียม",
    shipped: "จัดส่งแล้ว",
    delivered: "ส่งสำเร็จ",
    cancelled: "ยกเลิก",
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">ยินดีต้อนรับ Admin</h1>
        <p className="text-white/80 mt-1">
          จัดการเนื้อหาเว็บไซต์ INTECH Delta System
        </p>
      </div>

      {/* Pending Alerts */}
      {(pendingOrders > 0 || pendingQuotes > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <Clock size={20} className="text-yellow-600 shrink-0" />
          <div className="text-sm">
            {pendingOrders > 0 && (
              <span className="font-semibold text-yellow-800">
                มี {pendingOrders} คำสั่งซื้อรอดำเนินการ
              </span>
            )}
            {pendingOrders > 0 && pendingQuotes > 0 && (
              <span className="text-yellow-600"> | </span>
            )}
            {pendingQuotes > 0 && (
              <span className="font-semibold text-yellow-800">
                มี {pendingQuotes} ใบเสนอราคารอตอบกลับ
              </span>
            )}
          </div>
        </div>
      )}

      {/* Primary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-white rounded-xl p-4 hover:shadow-lg transition border border-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon size={20} className="text-white" />
              </div>
              <TrendingUp size={16} className="text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            <p className="text-sm text-gray-500">{card.title}</p>
            {card.sub && <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>}
          </Link>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 gap-4">
        {secondaryCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-white rounded-xl p-4 hover:shadow-lg transition border border-gray-100 flex items-center gap-4"
          >
            <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center shrink-0`}>
              <card.icon size={24} className="text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{card.value}</p>
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-xs text-gray-400">{card.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <ShoppingBag size={18} className="text-primary" />
              คำสั่งซื้อล่าสุด
            </h3>
            <Link href="/admin/orders" className="text-xs text-primary hover:underline">ดูทั้งหมด</Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">ยังไม่มีคำสั่งซื้อ</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-3 px-4 flex items-center gap-3 hover:bg-blue-50/30">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{order.customer?.name || "-"}</p>
                    <p className="text-xs text-gray-400">{order.id}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                  <span className="text-sm font-bold text-primary whitespace-nowrap">
                    ฿{(order.total || 0).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <MessageSquare size={18} className="text-primary" />
              รีวิวล่าสุด
            </h3>
            <Link href="/admin/reviews" className="text-xs text-primary hover:underline">ดูทั้งหมด</Link>
          </div>
          {recentReviews.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">ยังไม่มีรีวิว</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentReviews.map((review) => (
                <div key={review.id} className="p-3 px-4 hover:bg-blue-50/30">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={10}
                          className={star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-800 truncate">{review.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{review.userName}</span>
                    <span>
                      {new Date(review.createdAt).toLocaleDateString("th-TH", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-bold text-gray-700 mb-3">จัดการเนื้อหา</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="bg-white rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition border border-gray-100 group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary transition">
                <link.icon size={24} className="text-primary group-hover:text-white transition" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{link.title}</h3>
                <p className="text-sm text-gray-500">{link.desc}</p>
              </div>
              <ArrowRight size={18} className="text-gray-400 group-hover:text-primary transition" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
