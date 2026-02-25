"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../layout";
import { Plus, Edit2, Trash2, X, Save, Search } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  inStock: boolean;
  description?: string;
}

const categories = [
  { value: "ms300", label: "MS300 Inverter" },
  { value: "me300", label: "ME300 Inverter" },
  { value: "vfd-e", label: "VFD-E Inverter" },
  { value: "vfd-el", label: "VFD-EL Inverter" },
  { value: "hmi", label: "HMI Touch Screen" },
  { value: "plc", label: "PLC Controller" },
  { value: "servo", label: "Servo Motor & Drive" },
  { value: "dtk", label: "Temperature Controller" },
  { value: "power-supply", label: "Power Supply" },
];

const emptyProduct: Product = {
  id: 0,
  name: "",
  price: 0,
  category: "ms300",
  inStock: true,
};

export default function ProductsAdmin() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showMsg = (text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 3000);
  };

  const handleSave = async () => {
    if (!editing || !editing.name || editing.price <= 0) return;
    setSaving(true);
    try {
      if (isNew) {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json", authorization: token },
          body: JSON.stringify({
            name: editing.name,
            price: editing.price,
            originalPrice: editing.originalPrice || undefined,
            category: editing.category,
            inStock: editing.inStock,
            description: editing.description,
          }),
        });
        if (res.ok) {
          showMsg("เพิ่มสินค้าสำเร็จ!");
          fetchProducts();
          setEditing(null);
        }
      } else {
        const res = await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json", authorization: token },
          body: JSON.stringify(editing),
        });
        if (res.ok) {
          showMsg("บันทึกสำเร็จ!");
          fetchProducts();
          setEditing(null);
        }
      }
    } catch {
      showMsg("เกิดข้อผิดพลาด");
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("ต้องการลบสินค้านี้?")) return;
    const res = await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", authorization: token },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      showMsg("ลบสินค้าสำเร็จ!");
      fetchProducts();
    }
  };

  const filtered = products
    .filter((p) => filterCat === "all" || p.category === filterCat)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return <div className="text-center py-12 text-gray-500">กำลังโหลด...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">จัดการสินค้า</h1>
          <p className="text-sm text-gray-500">ทั้งหมด {products.length} รายการ</p>
        </div>
        <button
          onClick={() => {
            setEditing({ ...emptyProduct });
            setIsNew(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-dark transition text-sm"
        >
          <Plus size={18} />
          เพิ่มสินค้า
        </button>
      </div>

      {/* Success Message */}
      {msg && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-medium border border-green-200">
          {msg}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
        >
          <option value="all">ทุกหมวดหมู่</option>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">ID</th>
                <th className="text-left px-4 py-3 font-semibold">ชื่อสินค้า</th>
                <th className="text-left px-4 py-3 font-semibold">หมวดหมู่</th>
                <th className="text-right px-4 py-3 font-semibold">ราคา (฿)</th>
                <th className="text-center px-4 py-3 font-semibold">สถานะ</th>
                <th className="text-center px-4 py-3 font-semibold">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">#{p.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">{p.name}</td>
                  <td className="px-4 py-3">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-semibold uppercase">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {p.price.toLocaleString()}
                    {p.originalPrice && (
                      <span className="text-gray-400 line-through ml-2 font-normal">
                        {p.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      p.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {p.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => { setEditing({ ...p }); setIsNew(false); }}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                        title="แก้ไข"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="ลบ"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-400">ไม่พบสินค้า</div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold text-gray-800">
                {isNew ? "เพิ่มสินค้าใหม่" : "แก้ไขสินค้า"}
              </h2>
              <button onClick={() => setEditing(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">ชื่อสินค้า *</label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  placeholder="ชื่อสินค้า"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ราคา (฿) *</label>
                  <input
                    type="number"
                    value={editing.price}
                    onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ราคาเดิม (ถ้ามี)</label>
                  <input
                    type="number"
                    value={editing.originalPrice || ""}
                    onChange={(e) => setEditing({ ...editing, originalPrice: Number(e.target.value) || undefined })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                    placeholder="ราคาเดิม"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">หมวดหมู่</label>
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">รายละเอียด</label>
                <RichTextEditor
                  content={editing.description || ""}
                  onChange={(html) => setEditing({ ...editing, description: html })}
                  placeholder="รายละเอียดสินค้า (ไม่บังคับ)"
                  token={token}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={editing.inStock}
                  onChange={(e) => setEditing({ ...editing, inStock: e.target.checked })}
                  className="w-4 h-4 text-primary rounded"
                />
                <label htmlFor="inStock" className="text-sm text-gray-700">มีสินค้าพร้อมส่ง (In Stock)</label>
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !editing.name || editing.price <= 0}
                className="flex-1 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save size={16} />
                {saving ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
