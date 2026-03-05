import React from "react";
import { useOutletContext } from "react-router-dom";

const SalonGallery = () => {
  const { saloonDetails } = useOutletContext();

  const images = saloonDetails?.galleryImages || [];

  return (
    <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt="Salon"
          className="rounded-lg object-cover h-40 w-full"
        />
      ))}
    </div>
  );
};

export default SalonGallery;
