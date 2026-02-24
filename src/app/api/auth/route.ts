import { NextRequest, NextResponse } from "next/server";
import { validateCredentials, generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (validateCredentials(username, password)) {
    const token = generateToken();
    return NextResponse.json({ success: true, token });
  }
  return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
}
