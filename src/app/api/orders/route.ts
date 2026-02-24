import { NextRequest, NextResponse } from "next/server";
import { getOrders, saveOrders, Order } from "@/lib/data";
import { validateToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization");
  if (!token || !validateToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getOrders());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const orders = await getOrders();

  const year = new Date().getFullYear();
  const yearOrders = orders.filter((o) => o.id.includes(String(year)));
  const seq = String(yearOrders.length + 1).padStart(4, "0");
  const orderId = `INV-${year}${seq}`;

  const newOrder: Order = {
    id: orderId,
    items: body.items,
    subtotal: body.subtotal,
    shippingCost: body.shippingCost || 0,
    total: body.total,
    customer: body.customer,
    type: body.type || "order",
    status: "pending",
    paymentMethod: body.paymentMethod || "transfer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  orders.push(newOrder);
  await saveOrders(orders);
  return NextResponse.json(newOrder, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get("authorization");
  if (!token || !validateToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const orders = await getOrders();
  const idx = orders.findIndex((o) => o.id === body.id);
  if (idx === -1)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  orders[idx] = {
    ...orders[idx],
    ...body,
    updatedAt: new Date().toISOString(),
  };
  await saveOrders(orders);
  return NextResponse.json(orders[idx]);
}
