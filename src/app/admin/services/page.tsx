"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../layout";
import { Save, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";

interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  features: string[];
}

export default function ServicesAdmin() {
  const { token } = useAuth();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then((d) => { setServices(d); setLoading(false); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/services", {
      method: "PUT",
      headers: { "Content-Type": "application/json", authorization: token },
      body: JSON.stringify(services),
    });
    if (res.ok) {
      setMsg("บันทึกสำเร็จ!");
      setTimeout(() => setMsg(""), 3000);
    }
    setSaving(false);
  };

  const updateService = (idx: number, field: keyof ServiceItem, value: string) => {
    const arr = [...services];
    arr[idx] = { ...arr[idx], [field]: value };
    setServices(arr);
  };

  const updateFeature = (sIdx: number, fIdx: number, value: string) => {
    const arr = [...services];
    arr[sIdx].features[fIdx] = value;
    setServices(arr);
  };

  const addFeature = (sIdx: number) => {
    const arr = [...services];
    arr[sIdx].features.push("");
    setServices(arr);
  };

  const removeFeature = (sIdx: number, fIdx: number) => {
    const arr = [...services];
    arr[sIdx].features = arr[sIdx].features.filter((_, i) => i !== fIdx);
    setServices(arr);
  };

  const addService = () => {
    const newId = `service-${Date.now()}`;
    setServices([...services, { id: newId, title: "", desc: "", features: [""] }]);
    setExpanded(newId);
  };

  const removeService = (idx: number) => {
    if (!confirm("ต้องการลบบริการนี้?")) return;
    setServices(services.filter((_, i) => i !== idx));
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">กำลังโหลด...</div>;
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">จัดการบริการ</h1>
          <p className="text-sm text-gray-500">ทั้งหมด {services.length} บริการ</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addService}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-200 transition text-sm"
          >
            <Plus size={16} /> เพิ่มบริการ
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-dark transition text-sm disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </div>

      {msg && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-medium border border-green-200">
          {msg}
        </div>
      )}

      {/* Services List */}
      <div className="space-y-3">
        {services.map((service, sIdx) => (
          <div key={service.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpanded(expanded === service.id ? null : service.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 font-mono">{sIdx + 1}</span>
                <span className="font-semibold text-gray-800">
                  {service.title || "(ยังไม่ได้ตั้งชื่อ)"}
                </span>
                <span className="text-xs text-gray-400">{service.features.length} features</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); removeService(sIdx); }}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
                {expanded === service.id ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
              </div>
            </div>

            {/* Expanded Content */}
            {expanded === service.id && (
              <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">ชื่อบริการ</label>
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => updateService(sIdx, "title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                    placeholder="ชื่อบริการ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">คำอธิบาย</label>
                  <RichTextEditor
                    content={service.desc}
                    onChange={(html) => updateService(sIdx, "desc", html)}
                    placeholder="คำอธิบายบริการ"
                    token={token}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-gray-600">รายการบริการ (Features)</label>
                    <button
                      onClick={() => addFeature(sIdx)}
                      className="text-primary text-xs font-semibold flex items-center gap-1 hover:underline"
                    >
                      <Plus size={14} /> เพิ่ม
                    </button>
                  </div>
                  <div className="space-y-2">
                    {service.features.map((f, fIdx) => (
                      <div key={fIdx} className="flex gap-2">
                        <input
                          type="text"
                          value={f}
                          onChange={(e) => updateFeature(sIdx, fIdx, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                          placeholder={`Feature ${fIdx + 1}`}
                        />
                        <button
                          onClick={() => removeFeature(sIdx, fIdx)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
