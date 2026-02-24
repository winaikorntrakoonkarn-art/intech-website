import { NextResponse } from "next/server";
import { getReviews, saveReviews, getReviewsByProduct } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (productId) {
    const reviews = await getReviewsByProduct(Number(productId));
    return NextResponse.json(reviews);
  }

  return NextResponse.json(await getReviews());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, userId, userName, rating, title, comment } = body;

    if (!productId || !userName || !rating || !title || !comment) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบ" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "คะแนนต้องอยู่ระหว่าง 1-5" },
        { status: 400 }
      );
    }

    const reviews = await getReviews();
    const newReview = {
      id: `review_${Date.now()}`,
      productId: Number(productId),
      userId: userId || undefined,
      userName,
      rating: Number(rating),
      title,
      comment,
      verified: !!userId,
      createdAt: new Date().toISOString(),
    };

    reviews.push(newReview);
    await saveReviews(reviews);

    return NextResponse.json(newReview, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("id");

    if (!reviewId) {
      return NextResponse.json({ error: "ต้องระบุ review ID" }, { status: 400 });
    }

    const reviews = await getReviews();
    const filtered = reviews.filter((r) => r.id !== reviewId);
    await saveReviews(filtered);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
