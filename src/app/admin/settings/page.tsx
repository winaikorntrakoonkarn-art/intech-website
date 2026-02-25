"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../layout";
import { Save, Phone, Mail, MapPin, Clock, Globe, MessageCircle } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";

interface SiteSettings {
  phone: string;
  phone2: string;
  email: string;
  address: string;
  addressShort: string;
  workingHours: string;
  lineUrl: string;
  lineId: string;
  facebookUrl: string;
  messengerUrl: string;
  youtubeUrl: string;
  googleMapsEmbed: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
}

const sections = [
  {
    title: "ข้อมูลติดต่อ",
    icon: Phone,
    fields: [
      { key: "phone", label: "เบอร์โทรศัพท์หลัก", placeholder: "0-2952-5120" },
      { key: "phone2", label: "เบอร์โทรศัพท์สำรอง", placeholder: "086-3057990" },
      { key: "email", label: "อีเมล", placeholder: "info@intech.co.th" },
    ],
  },
  {
    title: "ที่อยู่",
    icon: MapPin,
    fields: [
      { key: "address", label: "ที่อยู่เต็ม", placeholder: "64,66 ซอย...", type: "textarea" },
      { key: "addressShort", label: "ที่อยู่ย่อ", placeholder: "นนทบุรี 11000" },
    ],
  },
  {
    title: "เวลาทำการ",
    icon: Clock,
    fields: [
      { key: "workingHours", label: "เวลาทำการ", placeholder: "จันทร์ - เสาร์ : 8:00 - 17:00" },
    ],
  },
  {
    title: "โซเชียลมีเดีย",
    icon: MessageCircle,
    fields: [
      { key: "lineUrl", label: "LINE URL", placeholder: "https://page.line.me/..." },
      { key: "lineId", label: "LINE ID", placeholder: "@035qyhrg" },
      { key: "facebookUrl", label: "Facebook URL", placeholder: "https://www.facebook.com/..." },
      { key: "messengerUrl", label: "Messenger URL", placeholder: "https://m.me/..." },
      { key: "youtubeUrl", label: "YouTube URL", placeholder: "https://www.youtube.com/..." },
    ],
  },
  {
    title: "แผนที่",
    icon: Globe,
    fields: [
      { key: "googleMapsEmbed", label: "Google Maps Embed URL", placeholder: "https://www.google.com/maps/embed?...", type: "textarea" },
    ],
  },
  {
    title: "Hero Section (หน้าแรก)",
    icon: Globe,
    fields: [
      { key: "heroTitle", label: "หัวข้อหลัก", placeholder: "Intech Delta System" },
      { key: "heroSubtitle", label: "หัวข้อย่อย", placeholder: "Authorized Dealer..." },
      { key: "heroDescription", label: "คำอธิบาย", placeholder: "ตัวแทนจำหน่าย...", type: "richtext" },
    ],
  },
];

export default function SettingsAdmin() {
  const { token } = useAuth();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((d) => { setSettings(d); setLoading(false); });
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json", authorization: token },
      body: JSON.stringify(settings),
    });
    if (res.ok) {
      setMsg("บันทึกสำเร็จ!");
      setTimeout(() => setMsg(""), 3000);
    }
    setSaving(false);
  };

  const update = (key: string, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  if (loading || !settings) {
    return <div className="text-center py-12 text-gray-500">กำลังโหลด...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">ตั้งค่าเว็บไซต์</h1>
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

      {sections.map((section) => (
        <div key={section.title} className="bg-white rounded-xl p-5 border border-gray-100 space-y-4">
          <h2 className="font-bold text-gray-700 border-b pb-2 flex items-center gap-2">
            <section.icon size={18} className="text-primary" />
            {section.title}
          </h2>
          <div className="space-y-3">
            {section.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-gray-600 mb-1">{field.label}</label>
                {field.type === "richtext" ? (
                  <RichTextEditor
                    content={settings[field.key as keyof SiteSettings] || ""}
                    onChange={(html) => update(field.key, html)}
                    placeholder={field.placeholder}
                    token={token}
                  />
                ) : field.type === "textarea" ? (
                  <textarea
                    value={settings[field.key as keyof SiteSettings] || ""}
                    onChange={(e) => update(field.key, e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
                    placeholder={field.placeholder}
                  />
                ) : (
                  <input
                    type="text"
                    value={settings[field.key as keyof SiteSettings] || ""}
                    onChange={(e) => update(field.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

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
