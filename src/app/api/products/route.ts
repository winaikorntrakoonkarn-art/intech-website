import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts, Product } from "@/lib/data";
import { validateToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  let products = await getProducts();

  if (search) {
    const q = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q))
    );
  }

  if (category) {
    products = products.filter((p) => p.category === category);
  }

  if (featured === "true") {
    products = products.filter((p) => p.featured);
  }

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization");
  if (!validateToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const products = await getProducts();
  const newId =
    products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
  const newProduct: Product = {
    id: newId,
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  products.push(newProduct);
  await saveProducts(products);
  return NextResponse.json(newProduct, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get("authorization");
  if (!validateToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const products = await getProducts();
  const idx = products.findIndex((p) => p.id === body.id);
  if (idx === -1)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  products[idx] = { ...body, updatedAt: new Date().toISOString() };
  await saveProducts(products);
  return NextResponse.json(products[idx]);
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get("authorization");
  if (!validateToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  let products = await getProducts();
  products = products.filter((p) => p.id !== id);
  await saveProducts(products);
  return NextResponse.json({ success: true });
}
