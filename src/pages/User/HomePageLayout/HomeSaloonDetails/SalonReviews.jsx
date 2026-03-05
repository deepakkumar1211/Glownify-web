import React from "react";
import { useOutletContext } from "react-router-dom";
import { Star, ChevronRight } from "lucide-react";

/**
 * SalonReviews
 * ─────────────────────────────────────────────────────────────
 * Displays customer reviews for a salon.
 * - Uses real reviews from the API if available.
 * - Falls back to sample reviews when no API data exists.
 *
 * Receives `saloonDetails` via Outlet context from HomeSaloonsDetails.
 */
const SalonReviews = () => {
  const { saloonDetails } = useOutletContext();

  // Use real reviews from API; show sample reviews as fallback
  const reviews = saloonDetails?.reviews || [
    {
      name: "Pooja S",
      rating: 5,
      comment: "Great service and very clean!",
      avatar: null,
    },
    {
      name: "Amit K",
      rating: 4,
      comment: "Loved the facial, will book again!",
      avatar: null,
    },
  ];

  // Average rating: use API value if present, else calculate from reviews
  const avgRating =
    saloonDetails?.rating ||
    (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  // Rotating color palette for avatar initials
  const avatarColors = [
    "bg-pink-100 text-pink-600",
    "bg-blue-100 text-blue-600",
    "bg-emerald-100 text-emerald-600",
    "bg-amber-100 text-amber-600",
    "bg-purple-100 text-purple-600",
    "bg-cyan-100 text-cyan-600",
  ];

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* ── Overall Rating Card ── */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">
          Customer Reviews
        </h3>

        {/* ── Rating Summary Row ── */}
        <div className="flex items-center gap-3 mb-5">
          <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
          <span className="text-3xl font-black text-gray-900">{avgRating}</span>

          {/* Star icons (filled up to the rounded average) */}
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${star <= Math.round(Number(avgRating))
                  ? "text-amber-400 fill-amber-400"
                  : "text-gray-200 fill-gray-200"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* ── Individual Review Cards ── */}
        <div className="space-y-3">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
            >
              {/* Avatar: initials with rotating background color */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${avatarColors[index % avatarColors.length]
                  }`}
              >
                <span className="text-sm font-bold">
                  {review.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>

              {/* Reviewer name + comment */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 leading-tight">
                  {review.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  "{review.comment}"
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
            </div>
          ))}
        </div>

        {/* ── View All Reviews Button ── */}
        <div className="text-center mt-4">
          <button className="text-sm font-bold text-rose-400 hover:text-rose-600 transition-colors">
            View All Reviews
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalonReviews;
