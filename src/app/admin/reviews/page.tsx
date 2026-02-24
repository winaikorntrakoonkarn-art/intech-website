"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../layout";
import { MessageSquare, Star, Trash2, CheckCircle, Search, AlertCircle } from "lucide-react";

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

interface Product {
  id: number;
  name: string;
}

export default function AdminReviewsPage() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/reviews").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ])
      .then(([reviewsData, productsData]) => {
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getProductName = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    return product?.name || `สินค้า #${productId}`;
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm("ต้องการลบรีวิวนี้?")) return;
    try {
      const res = await fetch(`/api/reviews?id=${reviewId}`, { method: "DELETE" });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      }
    } catch {}
  };

  const filteredReviews = reviews
    .filter((r) => {
      if (search) {
        const q = search.toLowerCase();
        return (
          r.userName.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q) ||
          getProductName(r.productId).toLowerCase().includes(q)
        );
      }
      return true;
    })
    .filter((r) => (filterRating ? r.rating === filterRating : true))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare size={24} className="text-primary" />
            รีวิวสินค้า ({reviews.length})
          </h1>
          <p className="text-sm text-gray-500 mt-1">จัดการรีวิวจากลูกค้า</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-500">รีวิวทั้งหมด</p>
          <p className="text-2xl font-bold text-secondary">{reviews.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-500">คะแนนเฉลี่ย</p>
          <div className="flex items-center gap-1">
            <p className="text-2xl font-bold text-secondary">{avgRating.toFixed(1)}</p>
            <Star size={18} className="text-yellow-400 fill-yellow-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-500">5 ดาว</p>
          <p className="text-2xl font-bold text-green-600">{reviews.filter((r) => r.rating === 5).length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-500">1-2 ดาว</p>
          <p className="text-2xl font-bold text-red-500">{reviews.filter((r) => r.rating <= 2).length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหารีวิว..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setFilterRating(null)}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
              !filterRating ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            ทั้งหมด
          </button>
          {[5, 4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRating(filterRating === r ? null : r)}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition flex items-center gap-1 ${
                filterRating === r ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {r} <Star size={10} className={filterRating === r ? "fill-white" : "fill-yellow-400 text-yellow-400"} />
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <MessageSquare size={48} className="mx-auto mb-3 text-gray-200" />
            <p className="font-semibold">{search || filterRating ? "ไม่พบรีวิวที่ค้นหา" : "ยังไม่มีรีวิว"}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredReviews.map((review) => (
              <div key={review.id} className="p-4 hover:bg-blue-50/30 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={13}
                            className={star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-secondary">{review.title}</span>
                      {review.verified && (
                        <span className="flex items-center gap-0.5 text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                          <CheckCircle size={10} /> ยืนยันแล้ว
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="font-semibold text-gray-500">{review.userName}</span>
                      <span>สินค้า: <span className="text-primary">{getProductName(review.productId)}</span></span>
                      <span>
                        {new Date(review.createdAt).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="text-red-400 hover:text-red-500 hover:bg-red-50 p-2 rounded transition"
                    title="ลบรีวิว"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
