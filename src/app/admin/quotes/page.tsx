"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../layout";
import {
  FileText,
  Search,
  Clock,
  CheckCircle,
  Send,
  XCircle,
  Eye,
  X,
} from "lucide-react";

interface QuoteItem {
  productId: number;
  productName: string;
  sku?: string;
  price: number;
  quantity: number;
}

interface Quote {
  id: string;
  items: QuoteItem[];
  customer: {
    name: string;
    company?: string;
    email: string;
    phone: string;
    notes?: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  sent: "bg-blue-100 text-blue-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  pending: "รอจัดทำ",
  sent: "ส่งแล้ว",
  accepted: "ลูกค้ายอมรับ",
  rejected: "ยกเลิก",
};

const statusIcons: Record<string, any> = {
  pending: Clock,
  sent: Send,
  accepted: CheckCircle,
  rejected: XCircle,
};

export default function AdminQuotesPage() {
  const { token } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch("/api/quotes", { headers: { authorization: token } })
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d))
          setQuotes(
            d.sort(
              (a: Quote, b: Quote) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
          );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const updateStatus = async (quoteId: string, newStatus: string) => {
    if (!token) return;
    try {
      const res = await fetch("/api/quotes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify({ id: quoteId, status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setQuotes((prev) =>
          prev.map((q) => (q.id === quoteId ? { ...q, ...updated } : q))
        );
        if (selectedQuote?.id === quoteId) {
          setSelectedQuote({ ...selectedQuote, ...updated });
        }
      }
    } catch {}
  };

  const filtered = quotes
    .filter((q) => filterStatus === "all" || q.status === filterStatus)
    .filter(
      (q) =>
        q.id.toLowerCase().includes(search.toLowerCase()) ||
        q.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        q.customer.phone.includes(search)
    );

  const estimateTotal = (items: QuoteItem[]) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
          <FileText size={24} className="text-primary" />
          ใบเสนอราคาทั้งหมด ({quotes.length})
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
          <option value="pending">รอจัดทำ</option>
          <option value="sent">ส่งแล้ว</option>
          <option value="accepted">ลูกค้ายอมรับ</option>
          <option value="rejected">ยกเลิก</option>
        </select>
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">
                  หมายเลข
                </th>
                <th className="text-left px-4 py-3 font-semibold">ลูกค้า</th>
                <th className="text-left px-4 py-3 font-semibold">
                  จำนวนสินค้า
                </th>
                <th className="text-left px-4 py-3 font-semibold">
                  ยอดประมาณ
                </th>
                <th className="text-left px-4 py-3 font-semibold">สถานะ</th>
                <th className="text-left px-4 py-3 font-semibold">วันที่</th>
                <th className="text-left px-4 py-3 font-semibold">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((quote) => {
                const StatusIcon = statusIcons[quote.status] || Clock;
                return (
                  <tr key={quote.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-primary">
                        {quote.id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">
                        {quote.customer.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {quote.customer.company || quote.customer.phone}
                      </p>
                    </td>
                    <td className="px-4 py-3">{quote.items.length} รายการ</td>
                    <td className="px-4 py-3 font-bold">
                      ฿{estimateTotal(quote.items).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          statusColors[quote.status] || "bg-gray-100"
                        }`}
                      >
                        <StatusIcon size={12} />
                        {statusLabels[quote.status] || quote.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(quote.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedQuote(quote)}
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
            <FileText size={40} className="mx-auto text-gray-300 mb-3" />
            <p>ยังไม่มีใบเสนอราคา</p>
          </div>
        )}
      </div>

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setSelectedQuote(null)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">
                  ใบเสนอราคา {selectedQuote.id}
                </h2>
                <button
                  onClick={() => setSelectedQuote(null)}
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
                  value={selectedQuote.status}
                  onChange={(e) =>
                    updateStatus(selectedQuote.id, e.target.value)
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="pending">รอจัดทำ</option>
                  <option value="sent">ส่งแล้ว</option>
                  <option value="accepted">ลูกค้ายอมรับ</option>
                  <option value="rejected">ยกเลิก</option>
                </select>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h3 className="font-semibold text-gray-700 mb-2 text-sm">
                  ข้อมูลลูกค้า
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>ชื่อ:</strong> {selectedQuote.customer.name}
                  </p>
                  {selectedQuote.customer.company && (
                    <p>
                      <strong>บริษัท:</strong>{" "}
                      {selectedQuote.customer.company}
                    </p>
                  )}
                  <p>
                    <strong>อีเมล:</strong> {selectedQuote.customer.email}
                  </p>
                  <p>
                    <strong>โทร:</strong> {selectedQuote.customer.phone}
                  </p>
                  {selectedQuote.customer.notes && (
                    <p>
                      <strong>หมายเหตุ:</strong>{" "}
                      {selectedQuote.customer.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h3 className="font-semibold text-gray-700 mb-2 text-sm">
                  รายการสินค้า
                </h3>
                <div className="space-y-2">
                  {selectedQuote.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
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

              {/* Total */}
              <div className="bg-primary/5 rounded-xl p-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>ยอดรวมโดยประมาณ</span>
                  <span className="text-primary">
                    ฿{estimateTotal(selectedQuote.items).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  * ราคาสุดท้ายระบุในใบเสนอราคา
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
