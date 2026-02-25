"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RichHtml from "@/components/RichHtml";
import {
  Settings,
  Cpu,
  Monitor,
  Wrench,
  Zap,
  CheckCircle,
  ArrowRight,
  Bot,
  Cable,
  Gauge,
  HardDrive,
  Cog,
} from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  features: string[];
}

const iconMap: Record<string, typeof Bot> = {
  automation: Bot,
  "control-system": Cpu,
  scada: Monitor,
  maintenance: Wrench,
  inverter: Zap,
  consulting: Settings,
};

const processSteps = [
  { icon: Gauge, title: "วิเคราะห์", desc: "สำรวจหน้างานและวิเคราะห์ความต้องการ" },
  { icon: Cog, title: "ออกแบบ", desc: "ออกแบบระบบและเสนอ Solution ที่เหมาะสม" },
  { icon: HardDrive, title: "ติดตั้ง", desc: "ติดตั้งและทดสอบระบบอย่างครบถ้วน" },
  { icon: Cable, title: "ส่งมอบ", desc: "ส่งมอบงานพร้อมอบรมการใช้งาน" },
];

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => { setServices(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-secondary to-dark py-16">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-white">Services</span>
          </nav>
          <h1 className="text-4xl font-bold text-white">บริการและการสนับสนุน</h1>
          <p className="text-gray-300 mt-2">บริการ Automation System Integrator ครบวงจร</p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <div key={step.title} className="text-center relative">
                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                  {i + 1}
                </div>
                <h3 className="font-bold text-secondary">{step.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{step.desc}</p>
                {i < processSteps.length - 1 && (
                  <ArrowRight size={20} className="text-gray-300 absolute right-0 top-5 hidden lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-3">บริการของเรา</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              INTECH Delta System ให้บริการด้าน Automation ครบวงจร
              โดยทีมวิศวกรผู้มีประสบการณ์มากกว่า 20 ปี
            </p>
          </div>
          {loading ? (
            <div className="text-center py-12 text-gray-500">กำลังโหลด...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const IconComp = iconMap[service.id] || Settings;
                return (
                  <div
                    key={service.id}
                    id={service.id}
                    className="bg-white rounded-2xl p-6 hover:shadow-xl transition border border-gray-100 group"
                  >
                    <div className="w-14 h-14 bg-primary-light rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition">
                      <IconComp size={28} className="text-primary group-hover:text-white transition" />
                    </div>
                    <h3 className="font-bold text-secondary text-lg mb-2">{service.title}</h3>
                    <RichHtml html={service.desc} className="text-gray-500 text-sm mb-4" />
                    <ul className="space-y-2">
                      {service.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle size={16} className="text-primary shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Delta Automation Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Delta Automation</h2>
          <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
            DELTA AUTOMATION มีความสามารถด้านการผลิตสินค้าคุณภาพ สำหรับผู้ใช้ราคาประหยัด
            มีความทนทานในการใช้งาน และมีทีมงานออกแบบด้าน Hardware และ Software
            ดูแลการออกแบบอย่างใกล้ชิดในการพัฒนาการผลิตสินค้าใหม่ เข้าสู่ตลาดอย่างรวดเร็ว
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <Bot size={36} className="mx-auto text-primary mb-3" />
              <h3 className="text-white font-bold">Cobot & Robot</h3>
              <p className="text-gray-400 text-sm mt-2">หุ่นยนต์อุตสาหกรรมและ Collaborative Robot</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <Cpu size={36} className="mx-auto text-primary mb-3" />
              <h3 className="text-white font-bold">PLC & HMI</h3>
              <p className="text-gray-400 text-sm mt-2">ระบบควบคุมอัตโนมัติ PLC และ HMI</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <Zap size={36} className="mx-auto text-primary mb-3" />
              <h3 className="text-white font-bold">Inverter & Servo</h3>
              <p className="text-gray-400 text-sm mt-2">ระบบขับเคลื่อนมอเตอร์ประสิทธิภาพสูง</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            สนใจบริการของเรา? ติดต่อทีมวิศวกรวันนี้
          </h2>
          <p className="text-white/80 mb-6">รับคำปรึกษาฟรี พร้อมเสนอราคา</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="bg-white text-primary px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
              ติดต่อเรา
            </Link>
            <a href="https://page.line.me/035qyhrg" target="_blank" rel="noopener noreferrer" className="bg-[#06C755] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#05a847] transition">
              สอบถามผ่าน LINE
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
