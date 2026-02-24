import { NextResponse } from "next/server";
import { getUsers } from "@/lib/data";

export async function GET() {
  const users = await getUsers();
  // Return users without passwords
  const safeUsers = users.map(({ password, ...rest }) => rest);
  return NextResponse.json(safeUsers);
}
