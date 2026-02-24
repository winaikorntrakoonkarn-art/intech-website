import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { CompareProvider } from "@/contexts/CompareContext";
import CartDrawer from "@/components/CartDrawer";
import CompareBar from "@/components/CompareBar";

export const metadata: Metadata = {
  title: "INTECH - Intech Delta System | ตัวแทนจำหน่าย Delta Electronics",
  description:
    "บริษัทอินเทค เดลต้า ซิสเทม จำกัด ตัวแทนจำหน่ายผลิตภัณฑ์ Delta Electronics อย่างเป็นทางการ จำหน่าย Inverter, Servo Motor, HMI, PLC, Power Supply",
  keywords:
    "Delta Electronics, Inverter, Servo Motor, HMI, PLC, Automation, อินเวอร์เตอร์, เซอร์โว",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased bg-gray-light">
        <AuthProvider>
        <WishlistProvider>
        <CompareProvider>
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <CompareBar />
          <main className="min-h-screen">{children}</main>
          <Footer />

          {/* Floating LINE & Messenger buttons */}
          <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
            <a
              href="https://page.line.me/035qyhrg"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-[#06C755] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
              </svg>
            </a>
            <a
              href="https://m.me/IntechDeltaAutomation"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-[#0084FF] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.193 14.963l-3.056-3.259-5.963 3.259L10.732 8.2l3.131 3.259L19.752 8.2l-6.559 6.763z" />
              </svg>
            </a>
          </div>
        </CartProvider>
        </CompareProvider>
        </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
