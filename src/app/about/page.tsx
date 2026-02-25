"use client";

import { useEffect, useState } from "react";
import { Award, Users, Building, Wrench, Target, TrendingUp, Globe, Cpu } from "lucide-react";
import Link from "next/link";
import RichHtml from "@/components/RichHtml";

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

const whatWeProvide = [
  { icon: Award, title: "Best Prices & Offers", desc: "สินค้าคุณภาพในราคาที่คุ้มค่า พร้อมโปรโมชั่นพิเศษตลอดทั้งปี" },
  { icon: Globe, title: "Wide Assortment", desc: "สินค้าหลากหลายครบทุกความต้องการงาน Automation" },
  { icon: TrendingUp, title: "Free Delivery", desc: "บริการจัดส่งฟรี กรุงเทพและปริมณฑล" },
  { icon: Wrench, title: "Easy Returns", desc: "นโยบายเปลี่ยน-คืนสินค้าง่ายดาย มั่นใจทุกการสั่งซื้อ" },
  { icon: Target, title: "100% Satisfaction", desc: "รับประกันความพึงพอใจ สินค้าคุณภาพจากโรงงาน" },
  { icon: Cpu, title: "Great Daily Deal", desc: "ดีลพิเศษทุกวัน สินค้าอุตสาหกรรมราคาโปรโมชั่น" },
];

const highlightIcons = [Building, Award, Users];

export default function AboutPage() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/about")
      .then((r) => r.json())
      .then((d) => { setAbout(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !about) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        กำลังโหลด...
      </div>
    );
  }

  return (
    <>
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-secondary to-dark py-16">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-white">About Us</span>
          </nav>
          <h1 className="text-4xl font-bold text-white">เกี่ยวกับเรา</h1>
          <p className="text-gray-300 mt-2">{about.companyName}</p>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="bg-gradient-to-br from-primary-light to-blue-50 rounded-3xl p-8 flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Building size={80} className="mx-auto text-primary mb-4" />
                <p className="text-primary font-bold text-xl">INTECH Delta System</p>
                <p className="text-gray-500 mt-2">ก่อตั้งปี พ.ศ. {about.foundedYear}</p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-secondary mb-6">{about.companyName}</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <RichHtml html={about.description} />
                {about.descriptionExtra && <RichHtml html={about.descriptionExtra} />}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delta Group */}
      <section className="py-16 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <Award size={16} />
              Authorized Dealer
            </div>
            <h2 className="text-3xl font-bold text-secondary mb-6">DELTA GROUP</h2>
            <RichHtml html={about.deltaGroupInfo} className="text-gray-600 leading-relaxed" />
          </div>
        </div>
      </section>

      {/* What We Provide */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-secondary text-center mb-12">What We Provide?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatWeProvide.map((item) => (
              <div key={item.title} className="border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition group">
                <div className="w-14 h-14 bg-primary-light rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition">
                  <item.icon size={28} className="text-primary group-hover:text-white transition" />
                </div>
                <h3 className="font-bold text-secondary text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Delta Automation */}
      <section className="py-16 bg-gradient-to-r from-secondary to-dark">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Work Delta Automation</h2>
            <p className="text-primary font-semibold">งานด้าน Automation</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-300 leading-relaxed text-center mb-8">
              DELTA AUTOMATION มีความสามารถด้านการผลิตสินค้าคุณภาพ สำหรับผู้ใช้ราคาประหยัด
              มีความทนทานในการใช้งาน ประสบการณ์ในการทำงานด้านเครื่องจักรช่วยให้สินค้ามีคุณภาพที่ดีมากขึ้น
              ในราคาที่คุ้มค่า แต่ได้ประสิทธิภาพการทำงานสูงสุด
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {about.highlights.map((h, i) => {
                const Icon = highlightIcons[i % highlightIcons.length];
                return (
                  <div key={h.label} className="text-center bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                    <Icon size={36} className="mx-auto text-primary mb-3" />
                    <h3 className="text-white font-bold text-lg mb-2">{h.label}</h3>
                    <p className="text-gray-400 text-sm">{h.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-2">ทีมผู้บริหาร</h2>
            <p className="text-gray-500">Meet Our Expert Team</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {about.teamMembers.map((member) => (
              <div key={member.name} className="text-center bg-gray-light rounded-2xl p-8">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={40} className="text-white" />
                </div>
                <h3 className="font-bold text-secondary text-lg">{member.name}</h3>
                <p className="text-primary text-sm mt-1">{member.role}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 mt-8 max-w-2xl mx-auto">
            {about.companyNameTh} ก่อตั้งขึ้นเมื่อปี พ.ศ. {about.foundedYear}{" "}
            โดยทีมงานวิศวกรที่มีความรู้และเชี่ยวชาญระบบควบคุมเครื่องจักร มากว่า 20 ปี
            ทั้งด้านการติดตั้งปรับปรุง และการให้บริการระบบเครื่องจักรกลอัตโนมัติ
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">สนใจสินค้าหรือบริการ?</h2>
          <p className="text-white/80 mb-6">ติดต่อเราวันนี้เพื่อรับคำปรึกษาฟรี</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
            ติดต่อเรา
          </Link>
        </div>
      </section>
    </>
  );
}
