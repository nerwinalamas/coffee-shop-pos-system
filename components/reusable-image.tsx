"use client";

import Image from "next/image";
import { useState } from "react";

interface ReusableImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fallbackText?: string;
  showLoadingState?: boolean;
  loadingClassName?: string;
  fallbackClassName?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

const ReusableImage = ({
  src,
  alt,
  width = 300,
  height = 300,
  className = "",
  priority = false,
  fallbackText,
  showLoadingState = true,
  loadingClassName = "",
  fallbackClassName = "",
  objectFit = "cover",
}: ReusableImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Generate fallback image with custom text or use alt text
  const fallbackImage = `https://via.placeholder.com/${width}x${height}/e2e8f0/64748b?text=${encodeURIComponent(
    fallbackText || alt
  )}`;

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const objectFitClass = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
    "scale-down": "object-scale-down",
  }[objectFit];

  return (
    <div className={`relative ${className}`}>
      {/* Loading state */}
      {imageLoading && showLoadingState && (
        <div
          className={`absolute inset-0 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center ${loadingClassName}`}
        >
          <div className="text-gray-400 text-xs">Loading...</div>
        </div>
      )}

      {/* Main image */}
      <Image
        src={imageError ? fallbackImage : src}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-full ${objectFitClass} rounded-lg ${
          imageError ? fallbackClassName : ""
        }`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        priority={priority}
      />
    </div>
  );
};

export default ReusableImage;
