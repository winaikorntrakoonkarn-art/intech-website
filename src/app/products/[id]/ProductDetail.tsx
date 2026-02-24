"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/lib/data";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCompare } from "@/contexts/CompareContext";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { getCategoryName } from "@/lib/categories";
import { useAuth } from "@/contexts/AuthContext";
import {
  ChevronRight,
  ShoppingCart,
  Plus,
  Minus,
  Package,
  Shield,
  Truck,
  MessageCircle,
  CheckCircle,
  XCircle,
  Heart,
  GitCompareArrows,
  Copy,
  Star,
  Send,
} from "lucide-react";

interface Review {
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

interface Props {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetail({ product, relatedProducts }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews" | "related">("desc");
  const [copied, setCopied] = useState(false);
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare, isFull } = useCompare();
  const { addViewed } = useRecentlyViewed();
  const { user } = useAuth();

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const wishlisted = isInWishlist(product.id);
  const compared = isInCompare(product.id);

  // Track recently viewed
  useEffect(() => {
    addViewed(product.id);
  }, [product.id, addViewed]);

  // Load reviews
  useEffect(() => {
    setReviewsLoading(true);
    fetch(`/api/reviews?productId=${product.id}`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(data);
        setReviewsLoading(false);
      })
      .catch(() => setReviewsLoading(false));
  }, [product.id]);

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const submitReview = async () => {
    if (!reviewForm.title || !reviewForm.comment) return;
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          userId: user?.id,
          userName: user?.name || "ผู้ใช้ทั่วไป",
          rating: reviewForm.rating,
          title: reviewForm.title,
          comment: reviewForm.comment,
        }),
      });
      if (res.ok) {
        const newReview = await res.json();
        setReviews((prev) => [...prev, newReview]);
        setReviewForm({ rating: 5, title: "", comment: "" });
        setShowReviewForm(false);
      }
    } catch {}
    setSubmittingReview(false);
  };

  const StarRating = ({ rating, size = 14, interactive = false, onChange }: { rating: number; size?: number; interactive?: boolean; onChange?: (r: number) => void }) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onChange?.(star)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
          disabled={!interactive}
        >
          <Star
            size={size}
            className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
          />
        </button>
      ))}
    </div>
  );

  const handleAddToCart = () => {
    addToCart(
      {
        productId: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        category: product.category,
      },
      quantity
    );
    setQuantity(1);
  };

  const copySku = () => {
    if (product.sku) {
      navigator.clipboard.writeText(product.sku);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const inCart = isInCart(product.id);
  const cartQty = getItemQuantity(product.id);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
        <Link href="/" className="hover:text-primary transition">หน้าแรก</Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-primary transition">สินค้า</Link>
        <ChevronRight size={12} />
        <Link href={`/products?category=${product.category}`} className="hover:text-primary transition">
          {getCategoryName(product.category)}
        </Link>
        <ChevronRight size={12} />
        <span className="text-gray-600 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Product Main Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Left: Product Image */}
        <div className="bg-white border border-gray-200 rounded p-8 flex items-center justify-center min-h-[350px]">
          <div className="text-center">
            <Package size={120} className="mx-auto text-primary/20 mb-4" />
            <p className="text-sm text-gray-400">{product.brand || "Delta Electronics"}</p>
            <p className="text-lg font-bold text-secondary mt-1">{product.name}</p>
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="space-y-4">
          {/* Brand + Category */}
          <div className="flex items-center gap-2 text-sm">
            <span className="bg-primary text-white px-2.5 py-0.5 rounded text-xs font-bold">
              {product.brand || "Delta Electronics"}
            </span>
            <span className="text-gray-400">|</span>
            <Link href={`/products?category=${product.category}`} className="text-primary text-xs font-semibold hover:underline">
              {getCategoryName(product.category)}
            </Link>
          </div>

          {/* Name */}
          <h1 className="text-xl lg:text-2xl font-bold text-secondary">{product.name}</h1>

          {/* SKU */}
          {product.sku && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>SKU: <span className="font-mono font-semibold text-gray-700">{product.sku}</span></span>
              <button onClick={copySku} className="text-primary hover:text-primary-dark" title="Copy SKU">
                <Copy size={14} />
              </button>
              {copied && <span className="text-xs text-success">คัดลอกแล้ว!</span>}
            </div>
          )}

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.inStock ? (
              <>
                <CheckCircle size={16} className="text-success" />
                <span className="text-success font-semibold text-sm">
                  มีสินค้า
                  {product.stockQuantity != null && (
                    <span className="text-gray-500 font-normal ml-1">({product.stockQuantity} ชิ้น)</span>
                  )}
                </span>
              </>
            ) : (
              <>
                <XCircle size={16} className="text-red-400" />
                <span className="text-red-500 font-semibold text-sm">สินค้าหมด - สั่งจองได้</span>
              </>
            )}
          </div>

          {/* Price Box */}
          <div className="bg-gray-light border border-gray-200 rounded p-4">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-primary">฿{product.price.toLocaleString()}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base text-gray-400 line-through">฿{product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">ราคายังไม่รวม VAT 7%</p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {product.warranty && (
              <div className="flex items-center gap-1 text-xs text-gray-600 bg-white border border-gray-200 rounded px-2.5 py-1.5">
                <Shield size={14} className="text-primary" />
                <span>รับประกัน {product.warranty}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-gray-600 bg-white border border-gray-200 rounded px-2.5 py-1.5">
              <Truck size={14} className="text-primary" />
              <span>จัดส่งฟรี (ออเดอร์ ฿5,000+)</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600 bg-white border border-gray-200 rounded px-2.5 py-1.5">
              <Package size={14} className="text-primary" />
              <span>ของแท้ 100%</span>
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center border border-gray-200 rounded">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-14 text-center font-bold text-sm outline-none border-x border-gray-200 h-9"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-accent text-white py-2.5 px-6 rounded font-bold hover:bg-accent-dark transition"
            >
              <ShoppingCart size={20} />
              เพิ่มลงตะกร้า
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`w-9 h-9 border rounded flex items-center justify-center transition ${
                wishlisted
                  ? "bg-red-50 border-red-300 text-red-500"
                  : "border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200"
              }`}
              title={wishlisted ? "ลบออกจากรายการถูกใจ" : "เพิ่มในรายการถูกใจ"}
            >
              <Heart size={18} className={wishlisted ? "fill-red-500" : ""} />
            </button>
            <button
              onClick={() => toggleCompare(product.id)}
              className={`w-9 h-9 border rounded flex items-center justify-center transition ${
                compared
                  ? "bg-blue-50 border-primary text-primary"
                  : isFull
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-200 text-gray-400 hover:text-primary hover:border-primary"
              }`}
              title={compared ? "ลบออกจากรายการเปรียบเทียบ" : isFull ? "เปรียบเทียบได้สูงสุด 4 รายการ" : "เพิ่มในรายการเปรียบเทียบ"}
              disabled={!compared && isFull}
            >
              <GitCompareArrows size={18} />
            </button>
          </div>

          {inCart && (
            <p className="text-sm text-primary font-semibold">มีในตะกร้าแล้ว {cartQty} ชิ้น</p>
          )}

          {/* LINE Contact */}
          <a
            href="https://page.line.me/035qyhrg"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#06C755] text-white py-2.5 rounded font-bold hover:bg-[#05a847] transition text-sm"
          >
            <MessageCircle size={18} />
            สอบถามรายละเอียดผ่าน LINE
          </a>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white border border-gray-200 rounded overflow-hidden mb-8">
        {/* Tab Headers */}
        <div className="flex border-b border-gray-200">
          {[
            { key: "desc", label: "รายละเอียด" },
            { key: "specs", label: "ข้อมูลจำเพาะ" },
            { key: "reviews", label: `รีวิว (${reviews.length})` },
            { key: "related", label: `สินค้าที่เกี่ยวข้อง (${relatedProducts.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-5 py-3 font-semibold text-sm transition border-b-2 ${
                activeTab === tab.key
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-gray-500 hover:text-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-5">
          {activeTab === "desc" && (
            <div className="prose max-w-none">
              {product.description ? (
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">{product.description}</p>
              ) : (
                <p className="text-gray-500 text-sm">
                  {product.name} - ผลิตภัณฑ์จาก {product.brand || "Delta Electronics"} คุณภาพสูง
                  รับประกันของแท้ พร้อมบริการหลังการขาย ติดต่อสอบถามรายละเอียดเพิ่มเติมได้ที่ LINE @035qyhrg หรือ โทร 02-952-5120
                </p>
              )}
            </div>
          )}

          {activeTab === "specs" && (
            <div>
              {product.specs && Object.keys(product.specs).length > 0 ? (
                <table className="w-full text-sm border border-gray-200">
                  <thead>
                    <tr className="bg-primary text-white">
                      <th className="px-4 py-2 text-left font-semibold w-1/3">คุณสมบัติ</th>
                      <th className="px-4 py-2 text-left font-semibold">ค่า</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(product.specs).map(([key, value], i) => (
                      <tr key={key} className={i % 2 === 0 ? "bg-blue-50/50" : "bg-white"}>
                        <td className="px-4 py-2.5 font-semibold text-secondary border-b border-gray-100">{key}</td>
                        <td className="px-4 py-2.5 text-gray-700 border-b border-gray-100">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-sm">ยังไม่มีข้อมูลจำเพาะ กรุณาสอบถามเพิ่มเติม</p>
              )}
              {product.weight && (
                <p className="mt-3 text-sm text-gray-600">
                  น้ำหนัก: <span className="font-semibold">{product.weight}</span>
                </p>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              {/* Review Summary */}
              <div className="flex items-center gap-6 mb-6 pb-4 border-b border-gray-100">
                <div className="text-center">
                  <p className="text-3xl font-bold text-secondary">{avgRating.toFixed(1)}</p>
                  <StarRating rating={Math.round(avgRating)} size={16} />
                  <p className="text-xs text-gray-400 mt-1">{reviews.length} รีวิว</p>
                </div>
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviews.filter((r) => r.rating === star).length;
                    const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs text-gray-500 w-8">{star} ดาว</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded">
                          <div className="h-full bg-yellow-400 rounded" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 w-8">{count}</span>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-primary text-white px-4 py-2 rounded text-sm font-semibold hover:bg-primary-dark transition"
                >
                  เขียนรีวิว
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="bg-gray-light border border-gray-200 rounded p-4 mb-6">
                  <h4 className="font-bold text-secondary text-sm mb-3">เขียนรีวิวสินค้า</h4>
                  <div className="mb-3">
                    <label className="text-xs text-gray-500 mb-1 block">คะแนน</label>
                    <StarRating rating={reviewForm.rating} size={24} interactive onChange={(r) => setReviewForm({ ...reviewForm, rating: r })} />
                  </div>
                  <input
                    type="text"
                    placeholder="หัวข้อรีวิว"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm mb-2 focus:outline-none focus:border-primary"
                  />
                  <textarea
                    placeholder="แสดงความคิดเห็นของคุณ..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm mb-3 focus:outline-none focus:border-primary resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={submitReview}
                      disabled={submittingReview || !reviewForm.title || !reviewForm.comment}
                      className="flex items-center gap-1 bg-accent text-white px-4 py-2 rounded text-sm font-semibold hover:bg-accent-dark transition disabled:opacity-50"
                    >
                      <Send size={14} /> {submittingReview ? "กำลังส่ง..." : "ส่งรีวิว"}
                    </button>
                    <button
                      onClick={() => setShowReviewForm(false)}
                      className="text-gray-500 px-4 py-2 text-sm hover:text-gray-700"
                    >
                      ยกเลิก
                    </button>
                  </div>
                  {!user && (
                    <p className="text-xs text-gray-400 mt-2">* เข้าสู่ระบบเพื่อรีวิวในฐานะสมาชิก</p>
                  )}
                </div>
              )}

              {/* Review List */}
              {reviewsLoading ? (
                <p className="text-sm text-gray-400">กำลังโหลดรีวิว...</p>
              ) : reviews.length === 0 ? (
                <p className="text-sm text-gray-500">ยังไม่มีรีวิว เป็นคนแรกที่รีวิวสินค้านี้!</p>
              ) : (
                <div className="space-y-4">
                  {reviews
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center gap-2 mb-1">
                        <StarRating rating={review.rating} size={13} />
                        <span className="text-sm font-bold text-secondary">{review.title}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="font-semibold text-gray-500">{review.userName}</span>
                        {review.verified && (
                          <span className="flex items-center gap-0.5 text-success">
                            <CheckCircle size={10} /> ยืนยันแล้ว
                          </span>
                        )}
                        <span>
                          {new Date(review.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "related" && (
            <div>
              {relatedProducts.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {relatedProducts.map((rp) => (
                    <Link
                      key={rp.id}
                      href={`/products/${rp.id}`}
                      className="block bg-gray-light rounded p-3 hover:shadow-md transition group border border-gray-100"
                    >
                      <div className="w-full h-20 flex items-center justify-center mb-2">
                        <Package size={36} className="text-primary/20 group-hover:text-primary/40 transition" />
                      </div>
                      <p className="text-sm font-semibold text-secondary line-clamp-2 group-hover:text-primary transition">
                        {rp.name}
                      </p>
                      {rp.sku && <p className="text-[10px] text-gray-400 mt-1">{rp.sku}</p>}
                      <p className="text-primary font-bold mt-1 text-sm">฿{rp.price.toLocaleString()}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">ไม่มีสินค้าที่เกี่ยวข้อง</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
