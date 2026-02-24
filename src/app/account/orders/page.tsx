"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle } from "lucide-react";

interface Order {
  id: string;
  items: { productName: string; quantity: number; price: number }[];
  total: number;
  status: string;
  paymentMethod?: string;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "รอยืนยัน", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  confirmed: { label: "ยืนยันแล้ว", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  processing: { label: "กำลังเตรียมจัดส่ง", color: "bg-purple-100 text-purple-700", icon: Package },
  shipped: { label: "จัดส่งแล้ว", color: "bg-green-100 text-green-700", icon: Truck },
  delivered: { label: "ส่งถึงแล้ว", color: "bg-green-100 text-green-700", icon: CheckCircle },
  cancelled: { label: "ยกเลิก", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function OrdersPage() {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/auth/login");
      return;
    }
    if (user) {
      fetch("/api/orders")
        .then((r) => r.json())
        .then((data) => {
          const userOrders = (data as Order[]).filter(
            (o: any) => o.customer?.email === user.email
          );
          setOrders(userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user, isLoggedIn, authLoading, router]);

  if (authLoading || !user) return <div className="min-h-[60vh] flex items-center justify-center text-gray-400">กำลังโหลด...</div>;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-4">
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
        <Link href="/" className="hover:text-primary transition">หน้าแรก</Link>
        <ChevronRight size={12} />
        <Link href="/account" className="hover:text-primary transition">บัญชี</Link>
        <ChevronRight size={12} />
        <span className="text-gray-600 font-medium">คำสั่งซื้อ</span>
      </nav>

      <h1 className="text-xl font-bold text-secondary mb-4">คำสั่งซื้อของฉัน</h1>

      {loading ? (
        <div className="text-center py-12 text-gray-400">กำลังโหลด...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded">
          <Package size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-semibold">ยังไม่มีคำสั่งซื้อ</p>
          <Link href="/products" className="inline-block mt-3 text-primary font-semibold hover:underline text-sm">
            เลือกซื้อสินค้า &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            return (
              <div key={order.id} className="bg-white border border-gray-200 rounded p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-bold text-secondary">คำสั่งซื้อ #{order.id}</span>
                    <span className="text-xs text-gray-400 ml-2">
                      {new Date(order.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded ${status.color}`}>
                    <StatusIcon size={12} /> {status.label}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  {order.items.slice(0, 3).map((item, i) => (
                    <p key={i} className="text-gray-600">
                      {item.productName} x{item.quantity} - ฿{(item.price * item.quantity).toLocaleString()}
                    </p>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-gray-400 text-xs">...และอีก {order.items.length - 3} รายการ</p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="text-sm font-bold text-primary">รวม ฿{order.total.toLocaleString()}</span>
                  <span className="text-xs text-gray-400">
                    {order.paymentMethod === "transfer" ? "โอนเงิน" : "เก็บเงินปลายทาง"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
