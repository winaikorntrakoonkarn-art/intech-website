"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../layout";
import { Save, Plus, Trash2 } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";

interface AboutData {
  companyName: string;
  companyNameTh: string;
  foundedYear: string;
  description: string;
  descriptionExtra: string;
  deltaGroupInfo: string;
  teamMembers: { name: string; role: string }[];
  highlights: { label: string; desc: string }[];
}

export default function AboutAdmin() {
  const { token } = useAuth();
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/about").then((r) => r.json()).then((d) => { setData(d); setLoading(false); });
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    const res = await fetch("/api/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json", authorization: token },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setMsg("บันทึกสำเร็จ!");
      setTimeout(() => setMsg(""), 3000);
    }
    setSaving(false);
  };

  if (loading || !data) {
    return <div className="text-center py-12 text-gray-500">กำลังโหลด...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">แก้ไขข้อมูลบริษัท</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-dark transition text-sm disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "กำลังบันทึก..." : "บันทึก"}
        </button>
      </div>

      {msg && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-medium border border-green-200">
          {msg}
        </div>
      )}

      {/* Company Info */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 space-y-4">
        <h2 className="font-bold text-gray-700 border-b pb-2">ข้อมูลทั่วไป</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">ชื่อบริษัท (EN)</label>
            <input
              type="text"
              value={data.companyName}
              onChange={(e) => setData({ ...data, companyName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">ชื่อบริษัท (TH)</label>
            <input
              type="text"
              value={data.companyNameTh}
              onChange={(e) => setData({ ...data, companyNameTh: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">ปีก่อตั้ง</label>
          <input
            type="text"
            value={data.foundedYear}
            onChange={(e) => setData({ ...data, foundedYear: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary max-w-xs"
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 space-y-4">
        <h2 className="font-bold text-gray-700 border-b pb-2">รายละเอียดบริษัท</h2>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">คำอธิบายหลัก</label>
          <RichTextEditor
            content={data.description}
            onChange={(html) => setData({ ...data, description: html })}
            placeholder="คำอธิบายหลัก"
            token={token}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">คำอธิบายเพิ่มเติม</label>
          <RichTextEditor
            content={data.descriptionExtra}
            onChange={(html) => setData({ ...data, descriptionExtra: html })}
            placeholder="คำอธิบายเพิ่มเติม"
            token={token}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">ข้อมูล Delta Group</label>
          <RichTextEditor
            content={data.deltaGroupInfo}
            onChange={(html) => setData({ ...data, deltaGroupInfo: html })}
            placeholder="ข้อมูล Delta Group"
            token={token}
          />
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="font-bold text-gray-700">ทีมผู้บริหาร</h2>
          <button
            onClick={() => setData({ ...data, teamMembers: [...data.teamMembers, { name: "", role: "" }] })}
            className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline"
          >
            <Plus size={16} /> เพิ่ม
          </button>
        </div>
        {data.teamMembers.map((m, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="flex-1 grid grid-cols-2 gap-3">
              <input
                type="text"
                value={m.name}
                onChange={(e) => {
                  const arr = [...data.teamMembers];
                  arr[i] = { ...arr[i], name: e.target.value };
                  setData({ ...data, teamMembers: arr });
                }}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                placeholder="ชื่อ-นามสกุล"
              />
              <input
                type="text"
                value={m.role}
                onChange={(e) => {
                  const arr = [...data.teamMembers];
                  arr[i] = { ...arr[i], role: e.target.value };
                  setData({ ...data, teamMembers: arr });
                }}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                placeholder="ตำแหน่ง"
              />
            </div>
            <button
              onClick={() => setData({ ...data, teamMembers: data.teamMembers.filter((_, j) => j !== i) })}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Highlights */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="font-bold text-gray-700">จุดเด่น</h2>
          <button
            onClick={() => setData({ ...data, highlights: [...data.highlights, { label: "", desc: "" }] })}
            className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline"
          >
            <Plus size={16} /> เพิ่ม
          </button>
        </div>
        {data.highlights.map((h, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={h.label}
                onChange={(e) => {
                  const arr = [...data.highlights];
                  arr[i] = { ...arr[i], label: e.target.value };
                  setData({ ...data, highlights: arr });
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                placeholder="หัวข้อ"
              />
              <textarea
                value={h.desc}
                onChange={(e) => {
                  const arr = [...data.highlights];
                  arr[i] = { ...arr[i], desc: e.target.value };
                  setData({ ...data, highlights: arr });
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
                rows={2}
                placeholder="คำอธิบาย"
              />
            </div>
            <button
              onClick={() => setData({ ...data, highlights: data.highlights.filter((_, j) => j !== i) })}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Save button bottom */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-dark transition disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "กำลังบันทึก..." : "บันทึกทั้งหมด"}
        </button>
      </div>
    </div>
  );
}
