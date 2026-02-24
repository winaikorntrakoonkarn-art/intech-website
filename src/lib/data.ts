import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
});

async function readJSON<T>(filename: string, defaultData: T): Promise<T> {
  try {
    const data = await redis.get<T>(filename);
    if (data === null || data === undefined) {
      await redis.set(filename, defaultData);
      return defaultData;
    }
    return data;
  } catch {
    return defaultData;
  }
}

async function writeJSON<T>(filename: string, data: T): Promise<void> {
  await redis.set(filename, data);
}

// ==================== TYPES ====================

export interface Product {
  id: number;
  name: string;
  sku?: string;
  price: number;
  originalPrice?: number;
  category: string;
  inStock: boolean;
  stockQuantity?: number;
  description?: string;
  brand?: string;
  series?: string;
  images?: string[];
  specs?: Record<string, string>;
  weight?: string;
  warranty?: string;
  relatedProducts?: number[];
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AboutData {
  companyName: string;
  companyNameTh: string;
  foundedYear: string;
  description: string;
  descriptionExtra: string;
  deltaGroupInfo: string;
  teamMembers: { name: string; role: string }[];
  highlights: { label: string; desc: string }[];
}

export interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  features: string[];
}

export interface SiteSettings {
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

export interface OrderItem {
  productId: number;
  productName: string;
  sku?: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  customer: {
    name: string;
    company?: string;
    email: string;
    phone: string;
    address: string;
    taxId?: string;
    notes?: string;
  };
  type: "order" | "quote";
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod?: "transfer" | "cod" | "credit";
  createdAt: string;
  updatedAt: string;
}

export interface QuoteRequest {
  id: string;
  items: OrderItem[];
  customer: {
    name: string;
    company?: string;
    email: string;
    phone: string;
    notes?: string;
  };
  status: "pending" | "sent" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  password: string; // simple hash for demo
  name: string;
  company?: string;
  phone?: string;
  addresses: Address[];
  wishlist: number[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  address: string;
  phone: string;
  isDefault: boolean;
}

export interface Review {
  id: string;
  productId: number;
  userId?: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  createdAt: string;
}

// ==================== DEFAULT DATA ====================

const defaultProducts: Product[] = [
  { id: 1, name: "Delta MS300 Series Model: VFD17AMS43ANSAA", sku: "VFD17AMS43ANSAA", price: 15850, category: "ms300", inStock: true, stockQuantity: 12, brand: "Delta Electronics", series: "MS300", warranty: "1 ปี", description: "อินเวอร์เตอร์ Delta MS300 Series สำหรับควบคุมความเร็วมอเตอร์ไฟฟ้า 3 เฟส 380V" },
  { id: 2, name: "Delta MS300 Series Model: VFD4A8MS21ANSAA", sku: "VFD4A8MS21ANSAA", price: 5500, category: "ms300", inStock: true, stockQuantity: 25, brand: "Delta Electronics", series: "MS300", warranty: "1 ปี", description: "อินเวอร์เตอร์ Delta MS300 Series สำหรับมอเตอร์ 1 เฟส 220V" },
  { id: 3, name: "Delta MS300 Series Model: VFD5A5MS43ANSAA", sku: "VFD5A5MS43ANSAA", price: 9050, category: "ms300", inStock: true, stockQuantity: 8, brand: "Delta Electronics", series: "MS300", warranty: "1 ปี" },
  { id: 4, name: "Delta MS300 Series Model: VFD9A0MS43ANSAA", sku: "VFD9A0MS43ANSAA", price: 10600, category: "ms300", inStock: true, stockQuantity: 6, brand: "Delta Electronics", series: "MS300", warranty: "1 ปี" },
  { id: 5, name: "Delta MS300 Series Model: VFD11AMS21ANSAA", sku: "VFD11AMS21ANSAA", price: 7350, originalPrice: 8000, category: "ms300", inStock: true, stockQuantity: 15, brand: "Delta Electronics", series: "MS300", warranty: "1 ปี", featured: true },
  { id: 6, name: "Delta MS300 Series Model: VFD1A6MS11ANSAA", sku: "VFD1A6MS11ANSAA", price: 7550, category: "ms300", inStock: true, stockQuantity: 10, brand: "Delta Electronics", series: "MS300", warranty: "1 ปี" },
  { id: 7, name: "Delta MS300 Series Model: VFD1A6MS23ANSAA", sku: "VFD1A6MS23ANSAA", price: 5200, category: "ms300", inStock: true, stockQuantity: 18, brand: "Delta Electronics", series: "MS300", warranty: "1 ปี" },
  { id: 8, name: "Delta MS300 Series Model: VFD2A8MS23ANSAA", sku: "VFD2A8MS23ANSAA", price: 6100, category: "ms300", inStock: true, stockQuantity: 14, brand: "Delta Electronics", series: "MS300", warranty: "1 ปี" },
  { id: 9, name: "Delta MS300 Series Model: VFD25AMS43ANSAA 15HP", sku: "VFD25AMS43ANSAA", price: 18000, category: "ms300", inStock: true, stockQuantity: 3, brand: "Delta Electronics", series: "MS300", warranty: "1 ปี", featured: true },
  { id: 10, name: 'Delta HMI DOP-110WS-HMI Touch Screen 10.1"', sku: "DOP-110WS", price: 22400, category: "hmi", inStock: true, stockQuantity: 5, brand: "Delta Electronics", series: "DOP-100", warranty: "1 ปี", featured: true, description: "จอสัมผัส HMI ขนาด 10.1 นิ้ว ความละเอียดสูง สำหรับควบคุมเครื่องจักร" },
  { id: 11, name: 'Delta HMI DOP-103WQ-HMI Touch Screen 4.3"', sku: "DOP-103WQ", price: 7650, category: "hmi", inStock: true, stockQuantity: 20, brand: "Delta Electronics", series: "DOP-100", warranty: "1 ปี" },
  { id: 12, name: 'Delta HMI DOP-107BV Touch Screen 7"', sku: "DOP-107BV", price: 12500, category: "hmi", inStock: true, stockQuantity: 8, brand: "Delta Electronics", series: "DOP-100", warranty: "1 ปี", featured: true },
  { id: 13, name: "Servo Motor ECMA-C20604RS", sku: "ECMA-C20604RS", price: 8500, category: "servo", inStock: true, stockQuantity: 10, brand: "Delta Electronics", series: "ECMA", warranty: "1 ปี", description: "เซอร์โวมอเตอร์ Delta 400W พร้อมเอนโค้ดเดอร์ความละเอียดสูง" },
  { id: 14, name: "Servo Drive ASD-A2-0121-L 100W 220V", sku: "ASD-A2-0121-L", price: 11000, category: "servo", inStock: true, stockQuantity: 7, brand: "Delta Electronics", series: "ASD-A2", warranty: "1 ปี", featured: true },
  { id: 15, name: "DRL-24V120W1EN Delta Power Supply", sku: "DRL-24V120W1EN", price: 1120, category: "power-supply", inStock: true, stockQuantity: 50, brand: "Delta Electronics", series: "DRL", warranty: "1 ปี" },
  { id: 16, name: "DVPPS02 Delta Power Supply", sku: "DVPPS02", price: 1000, category: "power-supply", inStock: true, stockQuantity: 35, brand: "Delta Electronics", series: "DVP", warranty: "1 ปี" },
  { id: 17, name: "Delta Temperature Controller DTC1000L", sku: "DTC1000L", price: 1670, originalPrice: 2000, category: "dtk", inStock: true, stockQuantity: 30, brand: "Delta Electronics", series: "DTC", warranty: "1 ปี", featured: true },
  { id: 18, name: "Delta Temperature Controller DTK9696C12", sku: "DTK9696C12", price: 2700, category: "dtk", inStock: true, stockQuantity: 15, brand: "Delta Electronics", series: "DTK", warranty: "1 ปี" },
  { id: 19, name: "Delta PLC DVP08SN11T Extension NPN", sku: "DVP08SN11T", price: 1850, category: "plc", inStock: true, stockQuantity: 22, brand: "Delta Electronics", series: "DVP", warranty: "1 ปี" },
  { id: 20, name: "Delta PLC DVP16I AC Input Module", sku: "DVP16I", price: 3200, category: "plc", inStock: true, stockQuantity: 12, brand: "Delta Electronics", series: "DVP", warranty: "1 ปี" },
  { id: 21, name: "Delta Inverter VFD-EL Series: VFD007EL21A", sku: "VFD007EL21A", price: 5350, category: "vfd-el", inStock: true, stockQuantity: 18, brand: "Delta Electronics", series: "VFD-EL", warranty: "1 ปี" },
  { id: 22, name: "Delta Inverter VFD-E Series: VFD015E43A", sku: "VFD015E43A", price: 9500, category: "vfd-e", inStock: true, stockQuantity: 6, brand: "Delta Electronics", series: "VFD-E", warranty: "1 ปี", featured: true },
  { id: 23, name: "Delta Inverter VFD-E Series: VFD007E43A", sku: "VFD007E43A", price: 6800, category: "vfd-e", inStock: true, stockQuantity: 9, brand: "Delta Electronics", series: "VFD-E", warranty: "1 ปี" },
  { id: 24, name: "Delta ME300 Series: VFD2A7ME21ANSAA", sku: "VFD2A7ME21ANSAA", price: 4500, category: "me300", inStock: true, stockQuantity: 20, brand: "Delta Electronics", series: "ME300", warranty: "1 ปี" },
];

const defaultAbout: AboutData = {
  companyName: "Intech Delta System",
  companyNameTh: "บริษัทอินเทค เดลต้า ซิสเทม จำกัด",
  foundedYear: "พ.ศ. 2547",
  description: "บริษัทอินเทค เดลต้า ซิสเทม จำกัด ก่อตั้งขึ้นเมื่อปี พ.ศ. 2547 โดยทีมงานวิศวกรที่มีความรู้และเชี่ยวชาญระบบควบคุมเครื่องจักร มากว่า 20 ปี ทั้งด้านการติดตั้งปรับปรุง และการให้บริการระบบเครื่องจักรกลอัตโนมัติ บริษัทได้ทำการพัฒนา ในด้านเทคโนโลยี การฝึกอบรมอย่างต่อเนื่อง และพร้อมก้าวสู่ปีที่ 20 อย่างมั่นคง",
  descriptionExtra: "บริษัทจำหน่ายสินค้าอุตสาหกรรม อินเวอร์เตอร์ เซอร์โวมอเตอร์ ทัชสกรีน สำหรับงานออกแบบเครื่องจักร และเพื่อใช้ในงานปรับปรุงระบบไฟฟ้าควบคุมเครื่องจักรเดิม งานระบบ AUTOMATION SYSTEM INTEGRATOR โดยมุ่งเน้นเพื่อให้สะดวก ในการทำงานผลิต และเพิ่มประสิทธิภาพการทำงานของเครื่องจักร",
  deltaGroupInfo: "DELTA GROUP เป็นบริษัทชั้นนำ ที่มีการผลิต Switching Power Supply และ DC Brushless Fan มากเป็นอันดับหนึ่งของโลก เดลต้าได้ทำการผลิตสินค้าสำหรับงานเครื่องจักรอุตสาหกรรม โดยให้ความสำคัญทางด้านงานวิจัยและพัฒนาเป็นอย่างมาก",
  teamMembers: [
    { name: "คุณ วินัย กรตระกูลกาญจน์", role: "CEO & Co-Founder" },
    { name: "คุณ สุเมธ นิลอ่างทอง", role: "ผู้จัดการ" },
  ],
  highlights: [
    { label: "นำเข้า", desc: "นำเข้าและจัดจำหน่ายสินค้าอุตสาหกรรม อินเวอร์เตอร์ เซอร์โวมอเตอร์ ทัชสกรีน สำหรับงานออกแบบเครื่องจักร" },
    { label: "ตัวแทน", desc: "เป็นตัวแทนจำหน่ายผลิตภัณฑ์ Delta Electronics อย่างเป็นทางการ" },
    { label: "เชี่ยวชาญ", desc: "เรามีทีมวิศวกรผู้เชี่ยวชาญ และประสบการณ์ทำงานมากว่า 20 ปี" },
  ],
};

const defaultServices: ServiceItem[] = [
  {
    id: "automation",
    title: "Automation System Integrator",
    desc: "ออกแบบและติดตั้งระบบ Automation สำหรับเครื่องจักรอุตสาหกรรม โดยทีมวิศวกรผู้เชี่ยวชาญ",
    features: ["ออกแบบระบบควบคุมเครื่องจักร", "วางระบบ PLC Programming", "ติดตั้ง HMI Touch Screen Interface", "ทดสอบและ Commissioning"],
  },
  {
    id: "control-system",
    title: "ออกแบบระบบควบคุม",
    desc: "ออกแบบและประกอบตู้ควบคุม ตู้ไฟฟ้า จัดทำโปรแกรม PLC, HMI สำหรับระบบควบคุมเครื่องจักรอุตสาหกรรมทุกประเภท",
    features: ["ออกแบบระบบไฟฟ้าควบคุม", "ประกอบตู้ MCC / Control Panel", "เขียนโปรแกรม PLC & HMI", "ทดสอบระบบก่อนส่งมอบ"],
  },
  {
    id: "scada",
    title: "SCADA Monitoring System",
    desc: "จัดทำระบบตรวจสอบ Monitoring Scada งานระบบอุตสาหกรรม เพื่อติดตามและควบคุมกระบวนการผลิตแบบ Real-time",
    features: ["ติดตั้งระบบ SCADA/HMI", "Real-time Monitoring & Control", "Data Logging & Reporting", "Remote Access & Alarm Management"],
  },
  {
    id: "maintenance",
    title: "ซ่อมบำรุงเครื่องจักร",
    desc: "บริการซ่อมบำรุงเครื่องจักร งานเคลื่อนย้ายเครื่องจักร พร้อมทดสอบ ปรับปรุงระบบไฟฟ้าควบคุมเครื่องจักรเดิม",
    features: ["ซ่อมบำรุงระบบ Inverter / Servo", "เคลื่อนย้ายเครื่องจักร", "ปรับปรุงระบบไฟฟ้าเดิม", "ตรวจสอบและทดสอบระบบ"],
  },
  {
    id: "inverter",
    title: "ติดตั้งระบบ Inverter",
    desc: "บริการติดตั้งและตั้งค่า Inverter สำหรับควบคุมความเร็วมอเตอร์ไฟฟ้า ช่วยประหยัดพลังงาน",
    features: ["เลือก Inverter ให้เหมาะสมกับงาน", "ติดตั้งและตั้งค่า Parameter", "ทดสอบและปรับจูน", "อบรมการใช้งานเบื้องต้น"],
  },
  {
    id: "consulting",
    title: "ให้คำปรึกษาด้าน Automation",
    desc: "ทีมวิศวกรผู้เชี่ยวชาญพร้อมให้คำปรึกษาเกี่ยวกับงาน Automation ทุกรูปแบบ",
    features: ["วิเคราะห์ความต้องการ", "ออกแบบ Solution", "เสนอราคาและแผนงาน", "ติดตามผลและดูแลหลังการขาย"],
  },
];

const defaultSettings: SiteSettings = {
  phone: "0-2952-5120",
  phone2: "086-3057990",
  email: "info@intech.co.th",
  address: "64,66 ซอยงามวงศ์วาน 3 ถนนงามวงศ์วาน ตำบลบางกระสอ อำเภอเมือง จังหวัดนนทบุรี 11000",
  addressShort: "นนทบุรี 11000",
  workingHours: "จันทร์ - เสาร์ : 8:00 - 17:00",
  lineUrl: "https://page.line.me/035qyhrg",
  lineId: "@035qyhrg",
  facebookUrl: "https://www.facebook.com/IntechDeltaAutomation",
  messengerUrl: "https://m.me/IntechDeltaAutomation",
  youtubeUrl: "https://www.youtube.com",
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.567!2d100.5100!3d13.8600!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDUxJzM2LjAiTiAxMDDCsDMwJzM2LjAiRQ!5e0!3m2!1sth!2sth!4v1",
  heroTitle: "Intech Delta System",
  heroSubtitle: "Authorized Dealer - Delta Electronics",
  heroDescription: "ตัวแทนจำหน่ายผลิตภัณฑ์ Delta Electronics อย่างเป็นทางการ จำหน่ายสินค้าอุตสาหกรรม Inverter, Servo Motor, HMI, PLC พร้อมบริการ Automation System Integrator",
};

// ==================== CRUD FUNCTIONS ====================

export async function getProducts(): Promise<Product[]> {
  return await readJSON("products.json", defaultProducts);
}
export async function saveProducts(data: Product[]): Promise<void> {
  await writeJSON("products.json", data);
}

export async function getAbout(): Promise<AboutData> {
  return await readJSON("about.json", defaultAbout);
}
export async function saveAbout(data: AboutData): Promise<void> {
  await writeJSON("about.json", data);
}

export async function getServices(): Promise<ServiceItem[]> {
  return await readJSON("services.json", defaultServices);
}
export async function saveServices(data: ServiceItem[]): Promise<void> {
  await writeJSON("services.json", data);
}

export async function getSettings(): Promise<SiteSettings> {
  return await readJSON("settings.json", defaultSettings);
}
export async function saveSettings(data: SiteSettings): Promise<void> {
  await writeJSON("settings.json", data);
}

export async function getOrders(): Promise<Order[]> {
  return await readJSON("orders.json", [] as Order[]);
}
export async function saveOrders(data: Order[]): Promise<void> {
  await writeJSON("orders.json", data);
}

export async function getQuotes(): Promise<QuoteRequest[]> {
  return await readJSON("quotes.json", [] as QuoteRequest[]);
}
export async function saveQuotes(data: QuoteRequest[]): Promise<void> {
  await writeJSON("quotes.json", data);
}

export async function getUsers(): Promise<User[]> {
  return await readJSON("users.json", [] as User[]);
}
export async function saveUsers(data: User[]): Promise<void> {
  await writeJSON("users.json", data);
}
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((u) => u.email === email);
}

export async function getReviews(): Promise<Review[]> {
  return await readJSON("reviews.json", [] as Review[]);
}
export async function saveReviews(data: Review[]): Promise<void> {
  await writeJSON("reviews.json", data);
}
export async function getReviewsByProduct(productId: number): Promise<Review[]> {
  const reviews = await getReviews();
  return reviews.filter((r) => r.productId === productId);
}
