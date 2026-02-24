import { NextResponse } from "next/server";
import { getUsers, saveUsers, getUserByEmail } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const { name, email, password, company, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบ" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }, { status: 400 });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "อีเมลนี้ถูกใช้งานแล้ว" }, { status: 400 });
    }

    const users = await getUsers();
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      password, // Simple storage for demo - use bcrypt in production
      name,
      company: company || undefined,
      phone: phone || undefined,
      addresses: [],
      wishlist: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    await saveUsers(users);

    return NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        company: newUser.company,
        phone: newUser.phone,
      },
    });
  } catch {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
