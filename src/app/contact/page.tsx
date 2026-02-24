"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Facebook } from "lucide-react";

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
}

export default function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => { setSettings(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        กำลังโหลด...
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-secondary to-dark py-16">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-white">Contact Us</span>
          </nav>
          <h1 className="text-4xl font-bold text-white">ติดต่อเรา</h1>
          <p className="text-gray-300 mt-2">พร้อมให้บริการและคำปรึกษา</p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-light rounded-2xl p-6 text-center hover:shadow-lg transition">
              <div className="w-14 h-14 bg-primary-light rounded-xl flex items-center justify-center mx-auto mb-3">
                <MapPin size={28} className="text-primary" />
              </div>
              <h3 className="font-bold text-secondary mb-2">ที่อยู่</h3>
              <p className="text-gray-500 text-sm whitespace-pre-line">{settings.address}</p>
            </div>
            <div className="bg-gray-light rounded-2xl p-6 text-center hover:shadow-lg transition">
              <div className="w-14 h-14 bg-primary-light rounded-xl flex items-center justify-center mx-auto mb-3">
                <Phone size={28} className="text-primary" />
              </div>
              <h3 className="font-bold text-secondary mb-2">โทรศัพท์</h3>
              <p className="text-gray-500 text-sm">
                <a href={`tel:${settings.phone.replace(/[^0-9]/g, "")}`} className="hover:text-primary transition">{settings.phone}</a>
                {settings.phone2 && (
                  <>
                    <br />
                    <a href={`tel:${settings.phone2.replace(/[^0-9]/g, "")}`} className="hover:text-primary transition">{settings.phone2}</a>
                  </>
                )}
              </p>
            </div>
            <div className="bg-gray-light rounded-2xl p-6 text-center hover:shadow-lg transition">
              <div className="w-14 h-14 bg-primary-light rounded-xl flex items-center justify-center mx-auto mb-3">
                <Mail size={28} className="text-primary" />
              </div>
              <h3 className="font-bold text-secondary mb-2">อีเมล</h3>
              <p className="text-gray-500 text-sm">
                <a href={`mailto:${settings.email}`} className="hover:text-primary transition">{settings.email}</a>
              </p>
            </div>
            <div className="bg-gray-light rounded-2xl p-6 text-center hover:shadow-lg transition">
              <div className="w-14 h-14 bg-primary-light rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock size={28} className="text-primary" />
              </div>
              <h3 className="font-bold text-secondary mb-2">เวลาทำการ</h3>
              <p className="text-gray-500 text-sm">{settings.workingHours}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map + Form */}
      <section className="py-12 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Map */}
            <div>
              <h2 className="text-2xl font-bold text-secondary mb-4">แผนที่</h2>
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 h-[400px]">
                <iframe
                  src={settings.googleMapsEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Intech Delta System Location"
                />
              </div>

              {/* Social Links */}
              <div className="mt-6">
                <h3 className="font-bold text-secondary mb-3">ช่องทางติดต่อเพิ่มเติม</h3>
                <div className="flex gap-3">
                  {settings.lineUrl && (
                    <a
                      href={settings.lineUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-[#06C755] text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#05a847] transition"
                    >
                      <MessageCircle size={18} />
                      LINE Official
                    </a>
                  )}
                  {settings.messengerUrl && (
                    <a
                      href={settings.messengerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-[#0084FF] text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0073e6] transition"
                    >
                      <Facebook size={18} />
                      Messenger
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold text-secondary mb-4">ส่งข้อความถึงเรา</h2>
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send size={28} className="text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-secondary mb-2">ส่งข้อความสำเร็จ!</h3>
                    <p className="text-gray-500">ทีมงานจะติดต่อกลับหาท่านโดยเร็วที่สุด</p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
                      }}
                      className="mt-4 text-primary font-semibold hover:underline"
                    >
                      ส่งข้อความอีกครั้ง
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-secondary mb-1">ชื่อ-นามสกุล *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
                          placeholder="ชื่อ นามสกุล"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-secondary mb-1">เบอร์โทร *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
                          placeholder="0xx-xxx-xxxx"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-secondary mb-1">อีเมล</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-secondary mb-1">เรื่อง *</label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
                      >
                        <option value="">-- เลือกหัวข้อ --</option>
                        <option value="product">สอบถามสินค้า</option>
                        <option value="price">ขอใบเสนอราคา</option>
                        <option value="service">สอบถามบริการ</option>
                        <option value="support">แจ้งปัญหา / ขอความช่วยเหลือ</option>
                        <option value="other">อื่นๆ</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-secondary mb-1">ข้อความ *</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm resize-none"
                        placeholder="รายละเอียดที่ต้องการสอบถาม..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition flex items-center justify-center gap-2"
                    >
                      <Send size={18} />
                      ส่งข้อความ
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">ต้องการคำปรึกษาด่วน?</h2>
          <p className="text-white/80 mb-6">โทรหาเราได้ทันที ทีมงานพร้อมให้บริการ</p>
          <a href={`tel:${settings.phone.replace(/[^0-9]/g, "")}`} className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition text-lg">
            <Phone size={22} />
            {settings.phone}
          </a>
        </div>
      </section>
    </>
  );
}
