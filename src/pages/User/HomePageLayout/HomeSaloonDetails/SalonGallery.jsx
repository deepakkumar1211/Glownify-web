import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { X, ZoomIn } from "lucide-react";

const SalonGallery = () => {
  const { saloonDetails } = useOutletContext();
  const [selectedImage, setSelectedImage] = useState(null);

  const images = saloonDetails?.galleryImages || [];

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <ZoomIn className="w-12 h-12 mb-3 text-gray-300" />
        <p className="text-sm font-medium">No gallery images yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((img, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(img)}
            className="relative group cursor-pointer rounded-2xl overflow-hidden aspect-square shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <img
              src={img}
              alt={`Gallery ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <img
            src={selectedImage}
            alt="Gallery full view"
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default SalonGallery;
