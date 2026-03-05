import React from "react";

const SalonReviews = () => {
  const reviews = [
    { name: "Rahul", rating: 5, comment: "Amazing service!" },
    { name: "Anita", rating: 4, comment: "Very professional staff" },
  ];

  return (
    <div className="p-4 space-y-4">
      {reviews.map((review, index) => (
        <div key={index} className="border p-3 rounded-lg">
          <h4 className="font-medium">{review.name}</h4>
          <p className="text-sm text-gray-600">
            ⭐ {review.rating}/5
          </p>
          <p className="text-sm mt-1">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default SalonReviews;
