"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Truck, Award, Tag, Zap } from "lucide-react";

const banners = [
  {
    id: 1,
    title: "ตัวแทนจำหน่าย Delta Electronics อย่างเป็นทางการ",
    subtitle: "สินค้าแท้ รับประกันจากผู้ผลิต พร้อมบริการหลังการขาย",
    cta: "ดูสินค้าทั้งหมด",
    href: "/products",
    bg: "from-primary-dark to-primary",
    icon: Award,
  },
  {
    id: 2,
    title: "จัดส่งฟรี! คำสั่งซื้อมากกว่า ฿5,000",
    subtitle: "จัดส่งรวดเร็ว 1-3 วันทำการ ครอบคลุมทั่วประเทศไทย",
    cta: "เริ่มช้อปเลย",
    href: "/products",
    bg: "from-[#2e7d32] to-[#1b5e20]",
    icon: Truck,
  },
  {
    id: 3,
    title: "Inverter Delta MS300 Series ราคาพิเศษ",
    subtitle: "อินเวอร์เตอร์คุณภาพสูง สำหรับงานอุตสาหกรรมทุกประเภท",
    cta: "ดูสินค้า MS300",
    href: "/products?category=ms300",
    bg: "from-accent-dark to-accent",
    icon: Tag,
  },
  {
    id: 4,
    title: "บริการออกแบบระบบ Automation ครบวงจร",
    subtitle: "ทีมวิศวกรผู้เชี่ยวชาญพร้อมให้คำปรึกษา ออกแบบ และติดตั้ง",
    cta: "ดูบริการของเรา",
    href: "/services",
    bg: "from-[#1565c0] to-[#0d47a1]",
    icon: Zap,
  },
];

export default function PromoBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + banners.length) % banners.length);
  const next = () => setCurrent((c) => (c + 1) % banners.length);

  const banner = banners[current];
  const Icon = banner.icon;

  return (
    <div className="relative overflow-hidden rounded mb-6">
      <div className={`bg-gradient-to-r ${banner.bg} text-white px-6 md:px-12 py-8 md:py-12 transition-all duration-500`}>
        <div className="flex items-center gap-6">
          <Icon size={56} className="hidden md:block shrink-0 opacity-80" />
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold mb-2">{banner.title}</h2>
            <p className="text-sm md:text-base text-white/80 mb-4">{banner.subtitle}</p>
            <Link
              href={banner.href}
              className="inline-block bg-white text-gray-800 px-6 py-2.5 rounded font-bold text-sm hover:bg-gray-100 transition"
            >
              {banner.cta}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition ${
              i === current ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
