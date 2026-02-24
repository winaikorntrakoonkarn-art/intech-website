"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../layout";
import {
  ShoppingBag,
  Search,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  Truck,
  Package,
  XCircle,
  Eye,
  X,
} from "lucide-react";

interface OrderItem {
  productId: number;
  productName: string;
  sku?: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  customer: {
    name: string;
    company?: string;
    email: string;
    phone: string;
    address: string;
    taxId?: string;
    notes?: string;
  };
  type: string;
  status: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  pending: "รอดำเนินการ",
  confirmed: "ยืนยันแล้ว",
  processing: "กำลังจัดเตรียม",
  shipped: "จัดส่งแล้ว",
  delivered: "ส่งถึงแล้ว",
  cancelled: "ยกเลิก",
};

const statusIcons: Record<string, any> = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch("/api/orders", { headers: { authorization: token } })
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setOrders(d.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    if (!token) return;
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, ...updated } : o))
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, ...updated });
        }
      }
    } catch {}
  };

  const filtered = orders
    .filter((o) => filterStatus === "all" || o.status === filterStatus)
    .filter(
      (o) =>
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.phone.includes(search)
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingBag size={24} className="text-primary" />
          คำสั่งซื้อทั้งหมด ({orders.length})
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="ค้นหาด้วย ID, ชื่อ, เบอร์โทร..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
        >
          <option value="all">สถานะทั้งหมด</option>
          <option value="pending">รอดำเนินการ</option>
          <option value="confirmed">ยืนยันแล้ว</option>
          <option value="processing">กำลังจัดเตรียม</option>
          <option value="shipped">จัดส่งแล้ว</option>
          <option value="delivered">ส่งถึงแล้ว</option>
          <option value="cancelled">ยกเลิก</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">
                  หมายเลข
                </th>
                <th className="text-left px-4 py-3 font-semibold">ลูกค้า</th>
                <th className="text-left px-4 py-3 font-semibold">ยอดรวม</th>
                <th className="text-left px-4 py-3 font-semibold">สถานะ</th>
                <th className="text-left px-4 py-3 font-semibold">วันที่</th>
                <th className="text-left px-4 py-3 font-semibold">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((order) => {
                const StatusIcon = statusIcons[order.status] || Clock;
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-primary">
                        {order.id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">
                        {order.customer.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.customer.phone}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-bold">
                      ฿{order.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          statusColors[order.status] || "bg-gray-100"
                        }`}
                      >
                        <StatusIcon size={12} />
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-lg hover:bg-primary-light text-gray-500 hover:text-primary transition"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <ShoppingBag size={40} className="mx-auto text-gray-300 mb-3" />
            <p>ยังไม่มีคำสั่งซื้อ</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">
                  คำสั่งซื้อ {selectedOrder.id}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 rounded-lg hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Status Update */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  เปลี่ยนสถานะ
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    updateStatus(selectedOrder.id, e.target.value)
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="pending">รอดำเนินการ</option>
                  <option value="confirmed">ยืนยันแล้ว</option>
                  <option value="processing">กำลังจัดเตรียม</option>
                  <option value="shipped">จัดส่งแล้ว</option>
                  <option value="delivered">ส่งถึงแล้ว</option>
                  <option value="cancelled">ยกเลิก</option>
                </select>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h3 className="font-semibold text-gray-700 mb-2 text-sm">
                  ข้อมูลลูกค้า
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>ชื่อ:</strong> {selectedOrder.customer.name}
                  </p>
                  {selectedOrder.customer.company && (
                    <p>
                      <strong>บริษัท:</strong>{" "}
                      {selectedOrder.customer.company}
                    </p>
                  )}
                  <p>
                    <strong>อีเมล:</strong> {selectedOrder.customer.email}
                  </p>
                  <p>
                    <strong>โทร:</strong> {selectedOrder.customer.phone}
                  </p>
                  <p>
                    <strong>ที่อยู่:</strong> {selectedOrder.customer.address}
                  </p>
                  {selectedOrder.customer.taxId && (
                    <p>
                      <strong>เลขผู้เสียภาษี:</strong>{" "}
                      {selectedOrder.customer.taxId}
                    </p>
                  )}
                  {selectedOrder.customer.notes && (
                    <p>
                      <strong>หมายเหตุ:</strong>{" "}
                      {selectedOrder.customer.notes}
                    </p>
                  )}
                  {selectedOrder.paymentMethod && (
                    <p>
                      <strong>ชำระเงิน:</strong>{" "}
                      {selectedOrder.paymentMethod === "transfer"
                        ? "โอนเงิน"
                        : selectedOrder.paymentMethod === "cod"
                        ? "เก็บปลายทาง"
                        : selectedOrder.paymentMethod}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h3 className="font-semibold text-gray-700 mb-2 text-sm">
                  รายการสินค้า
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-sm"
                    >
                      <div>
                        <p className="font-semibold">{item.productName}</p>
                        {item.sku && (
                          <p className="text-xs text-gray-400">
                            SKU: {item.sku}
                          </p>
                        )}
                        <p className="text-gray-500">
                          x{item.quantity} @ ฿{item.price.toLocaleString()}
                        </p>
                      </div>
                      <span className="font-bold">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-primary/5 rounded-xl p-4">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">ยอดรวมสินค้า</span>
                    <span>฿{selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">ค่าจัดส่ง</span>
                    <span>
                      {selectedOrder.shippingCost === 0
                        ? "ฟรี"
                        : `฿${selectedOrder.shippingCost}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                    <span>ยอดรวมทั้งสิ้น</span>
                    <span className="text-primary">
                      ฿{selectedOrder.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
