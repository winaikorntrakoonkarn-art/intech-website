"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { MapPin, ChevronRight, Plus, Trash2, Star } from "lucide-react";

interface Address {
  id: string;
  label: string;
  fullName: string;
  address: string;
  phone: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "", fullName: "", address: "", phone: "" });

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/auth/login");
      return;
    }
    try {
      const saved = localStorage.getItem("intech_addresses");
      if (saved) setAddresses(JSON.parse(saved));
    } catch {}
  }, [authLoading, isLoggedIn, router]);

  const saveAddresses = (updated: Address[]) => {
    setAddresses(updated);
    localStorage.setItem("intech_addresses", JSON.stringify(updated));
  };

  const addAddress = () => {
    if (!form.label || !form.fullName || !form.address || !form.phone) return;
    const newAddr: Address = {
      id: `addr_${Date.now()}`,
      ...form,
      isDefault: addresses.length === 0,
    };
    saveAddresses([...addresses, newAddr]);
    setForm({ label: "", fullName: "", address: "", phone: "" });
    setShowForm(false);
  };

  const removeAddress = (id: string) => {
    saveAddresses(addresses.filter((a) => a.id !== id));
  };

  const setDefault = (id: string) => {
    saveAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  if (authLoading || !user) return <div className="min-h-[60vh] flex items-center justify-center text-gray-400">กำลังโหลด...</div>;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-4">
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
        <Link href="/" className="hover:text-primary transition">หน้าแรก</Link>
        <ChevronRight size={12} />
        <Link href="/account" className="hover:text-primary transition">บัญชี</Link>
        <ChevronRight size={12} />
        <span className="text-gray-600 font-medium">ที่อยู่จัดส่ง</span>
      </nav>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-secondary">ที่อยู่จัดส่ง</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 bg-primary text-white px-3 py-2 rounded text-sm font-semibold hover:bg-primary-dark transition"
        >
          <Plus size={16} /> เพิ่มที่อยู่
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded p-5 mb-4">
          <h3 className="font-bold text-secondary text-sm mb-3">เพิ่มที่อยู่ใหม่</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <input type="text" placeholder="ชื่อที่อยู่ (เช่น บ้าน, ออฟฟิศ)" value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary" />
            <input type="text" placeholder="ชื่อ-นามสกุล" value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary" />
            <input type="text" placeholder="ที่อยู่" value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary sm:col-span-2" />
            <input type="tel" placeholder="เบอร์โทรศัพท์" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-primary" />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={addAddress} className="bg-accent text-white px-4 py-2 rounded text-sm font-semibold hover:bg-accent-dark transition">บันทึก</button>
            <button onClick={() => setShowForm(false)} className="text-gray-500 px-4 py-2 text-sm hover:text-gray-700">ยกเลิก</button>
          </div>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded">
          <MapPin size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-semibold">ยังไม่มีที่อยู่จัดส่ง</p>
          <p className="text-sm text-gray-400 mt-1">เพิ่มที่อยู่เพื่อใช้ตอนสั่งซื้อ</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {addresses.map((addr) => (
            <div key={addr.id} className={`bg-white border rounded p-4 ${addr.isDefault ? "border-primary" : "border-gray-200"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-secondary text-sm flex items-center gap-1">
                  {addr.isDefault && <Star size={12} className="text-accent fill-accent" />}
                  {addr.label}
                </span>
                <div className="flex gap-1">
                  {!addr.isDefault && (
                    <button onClick={() => setDefault(addr.id)} className="text-[10px] text-primary hover:underline">ตั้งเป็นค่าเริ่มต้น</button>
                  )}
                  <button onClick={() => removeAddress(addr.id)} className="text-red-400 hover:text-red-500 ml-2">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">{addr.fullName}</p>
              <p className="text-sm text-gray-500">{addr.address}</p>
              <p className="text-sm text-gray-500">โทร: {addr.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
