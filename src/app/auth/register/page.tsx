"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, User, Building, Phone, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", company: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }
    if (form.password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setLoading(true);
    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      company: form.company || undefined,
      phone: form.phone || undefined,
    });

    if (result.success) {
      router.push("/account");
    } else {
      setError(result.error || "สมัครสมาชิกไม่สำเร็จ");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <div className="bg-primary p-5 text-center text-white">
            <UserPlus size={32} className="mx-auto mb-2" />
            <h1 className="text-xl font-bold">สมัครสมาชิก</h1>
            <p className="text-sm text-white/70 mt-1">สร้างบัญชีเพื่อสั่งซื้อและติดตามคำสั่งซื้อ</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-3">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded p-3">{error}</div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">ชื่อ-นามสกุล *</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded focus:outline-none focus:border-primary text-sm" placeholder="ชื่อ นามสกุล" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">อีเมล *</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded focus:outline-none focus:border-primary text-sm" placeholder="email@example.com" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">รหัสผ่าน *</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded focus:outline-none focus:border-primary text-sm" placeholder="อย่างน้อย 6 ตัว" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">ยืนยันรหัสผ่าน *</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded focus:outline-none focus:border-primary text-sm" placeholder="ยืนยันรหัสผ่าน" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">บริษัท</label>
              <div className="relative">
                <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded focus:outline-none focus:border-primary text-sm" placeholder="ชื่อบริษัท (ถ้ามี)" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">เบอร์โทรศัพท์</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded focus:outline-none focus:border-primary text-sm" placeholder="0xx-xxx-xxxx" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-accent text-white py-2.5 rounded font-bold hover:bg-accent-dark transition disabled:opacity-50">
              {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
            </button>

            <p className="text-center text-sm text-gray-500">
              มีบัญชีแล้ว? <Link href="/auth/login" className="text-primary font-semibold hover:underline">เข้าสู่ระบบ</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
