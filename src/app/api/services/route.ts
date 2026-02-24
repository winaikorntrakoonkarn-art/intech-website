import { NextRequest, NextResponse } from "next/server";
import { getServices, saveServices } from "@/lib/data";
import { validateToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getServices());
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get("authorization");
  if (!validateToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  await saveServices(body);
  return NextResponse.json(body);
}
