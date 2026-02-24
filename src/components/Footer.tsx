import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Truck, Shield, Award, Headphones } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-gray-300">
      {/* Trust Badges Bar */}
      <div className="bg-primary-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: "จัดส่งฟรี", desc: "คำสั่งซื้อ ฿5,000 ขึ้นไป" },
            { icon: Shield, title: "สินค้าแท้ 100%", desc: "รับประกันจาก Delta" },
            { icon: Award, title: "ตัวแทนจำหน่ายอย่างเป็นทางการ", desc: "Authorized Dealer" },
            { icon: Headphones, title: "ทีมงานผู้เชี่ยวชาญ", desc: "พร้อมให้คำปรึกษา" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3 text-white">
              <item.icon size={28} className="shrink-0 text-accent" />
              <div>
                <p className="text-sm font-bold leading-tight">{item.title}</p>
                <p className="text-xs text-white/60 leading-tight">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-white px-3 py-1 rounded font-bold text-lg">INTECH</div>
              <span className="text-white text-sm">Delta System</span>
            </div>
            <p className="text-sm leading-relaxed mb-4 text-gray-400">
              บริษัทอินเทค เดลต้า ซิสเทม จำกัด ตัวแทนจำหน่ายผลิตภัณฑ์ Delta Electronics
              อย่างเป็นทางการ จำหน่ายสินค้าอุตสาหกรรม อินเวอร์เตอร์ เซอร์โวมอเตอร์ ทัชสกรีน PLC
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/IntechDeltaAutomation"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center hover:bg-[#1877F2] transition text-white"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href="https://page.line.me/035qyhrg"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center hover:bg-[#06C755] transition text-white"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center hover:bg-red-600 transition text-white"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">สินค้า</h4>
            <ul className="space-y-2 text-sm">
              {[
                { name: "Inverter / VFD", slug: "ms300" },
                { name: "HMI Touch Screen", slug: "hmi" },
                { name: "PLC Controller", slug: "plc" },
                { name: "Servo Motor & Drive", slug: "servo" },
                { name: "Temperature Controller", slug: "dtk" },
                { name: "Power Supply", slug: "power-supply" },
              ].map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/products?category=${cat.slug}`} className="text-gray-400 hover:text-accent transition">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">ลิงก์</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-accent transition">หน้าแรก</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-accent transition">สินค้าทั้งหมด</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-accent transition">เกี่ยวกับเรา</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-accent transition">บริการ</Link></li>
              <li><Link href="/quote" className="text-gray-400 hover:text-accent transition">ขอใบเสนอราคา</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-accent transition">ติดต่อเรา</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">ติดต่อ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-1 shrink-0 text-accent" />
                <span className="text-gray-400">64,66 ซอยงามวงศ์วาน 3 ถนนงามวงศ์วาน ตำบลบางกระสอ อำเภอเมือง จังหวัดนนทบุรี 11000</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-accent" />
                <span className="text-gray-400">0-2952-5120 / 086-3057990</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-accent" />
                <a href="mailto:info@intech.co.th" className="text-gray-400 hover:text-accent transition">info@intech.co.th</a>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="shrink-0 text-accent" />
                <span className="text-gray-400">จ-ส 8:00 - 17:00</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-wrap items-center justify-between text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Intech Delta System Co., Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Authorized Dealer of Delta Electronics</span>
            <Link href="/about" className="hover:text-accent transition">นโยบายความเป็นส่วนตัว</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
