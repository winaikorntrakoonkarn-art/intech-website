"use client";

import { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Building,
  Wrench,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShoppingBag,
  FileText,
  Users,
  MessageSquare,
} from "lucide-react";

interface AuthCtx {
  token: string;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx>({ token: "", logout: () => {} });
export const useAuth = () => useContext(AuthContext);

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "คำสั่งซื้อ", icon: ShoppingBag },
  { href: "/admin/quotes", label: "ใบเสนอราคา", icon: FileText },
  { href: "/admin/products", label: "จัดการสินค้า", icon: Package },
  { href: "/admin/users", label: "ผู้ใช้งาน", icon: Users },
  { href: "/admin/reviews", label: "รีวิวสินค้า", icon: MessageSquare },
  { href: "/admin/about", label: "เกี่ยวกับเรา", icon: Building },
  { href: "/admin/services", label: "บริการ", icon: Wrench },
  { href: "/admin/settings", label: "ตั้งค่าเว็บไซต์", icon: Settings },
];

function LoginPage({ onLogin }: { onLogin: (token: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("admin_token", data.token);
        onLogin(data.token);
      } else {
        setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">INTECH</h1>
          <p className="text-gray-500 mt-1">Admin Dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ชื่อผู้ใช้</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
              placeholder="admin"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition disabled:opacity-50"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
        <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-500">
          <p className="font-semibold mb-1">ข้อมูลเข้าสู่ระบบ:</p>
          <p>User: <code className="bg-gray-200 px-1 rounded">admin</code></p>
          <p>Pass: <code className="bg-gray-200 px-1 rounded">intech2024</code></p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("admin_token");
    if (saved) setToken(saved);
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 mt-2">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <LoginPage onLogin={setToken} />;
  }

  return (
    <AuthContext.Provider value={{ token, logout }}>
      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar Overlay (mobile) */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark text-white transform transition-transform lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">INTECH</span>
              <span className="text-xs text-gray-400">Admin</span>
            </Link>
            <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                  {isActive && <ChevronRight size={16} className="ml-auto" />}
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-700">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white transition"
            >
              ดูเว็บไซต์
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 transition w-full"
            >
              <LogOut size={18} />
              ออกจากระบบ
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Bar */}
          <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between lg:px-6">
            <button className="lg:hidden p-2 text-gray-600" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <h2 className="text-lg font-semibold text-gray-700">
              {navItems.find((n) => n.href === pathname)?.label || "Admin"}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs">
                A
              </div>
              <span className="hidden sm:block">Admin</span>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </AuthContext.Provider>
  );
}
