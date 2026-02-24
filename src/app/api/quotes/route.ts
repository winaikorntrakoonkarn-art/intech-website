import { NextRequest, NextResponse } from "next/server";
import { getQuotes, saveQuotes, QuoteRequest } from "@/lib/data";
import { validateToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization");
  if (!token || !validateToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getQuotes());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const quotes = await getQuotes();

  const year = new Date().getFullYear();
  const yearQuotes = quotes.filter((q) => q.id.includes(String(year)));
  const seq = String(yearQuotes.length + 1).padStart(4, "0");
  const quoteId = `QUO-${year}${seq}`;

  const newQuote: QuoteRequest = {
    id: quoteId,
    items: body.items,
    customer: body.customer,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  quotes.push(newQuote);
  await saveQuotes(quotes);
  return NextResponse.json(newQuote, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get("authorization");
  if (!token || !validateToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const quotes = await getQuotes();
  const idx = quotes.findIndex((q) => q.id === body.id);
  if (idx === -1)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  quotes[idx] = {
    ...quotes[idx],
    ...body,
    updatedAt: new Date().toISOString(),
  };
  await saveQuotes(quotes);
  return NextResponse.json(quotes[idx]);
}
