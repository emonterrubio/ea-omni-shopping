import React from 'react';

interface ProductImageGalleryProps {
  mainImage: string;
  thumbnails?: string[];
  alt?: string;
}

export function ProductImageGallery({
  mainImage,
  thumbnails = [],
  alt = 'Product image',
}: ProductImageGalleryProps) {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-4 w-full aspect-video rounded-lg flex items-center justify-center">
        {mainImage ? (
          <img src={mainImage} alt={alt} className="object-contain max-h-80 mx-auto" />
        ) : (
          <span className="text-gray-400">Main Product Image</span>
        )}
      </div>
      <div className="flex gap-2">
        {thumbnails.length > 0 ? (
          thumbnails.map((thumb, idx) => (
            <button
              key={idx}
              type="button"
              className="w-16 h-16 rounded hover:border-2 border-blue-600 cursor-pointer flex items-center justify-center bg-transparent"
              aria-label={`View image ${idx + 1}`}
            >
              <img src={thumb} alt="" className="object-contain max-h-12 max-w-12" />
            </button>
          ))
        ) : (
          [
            { src: mainImage, alt: alt },
            { src: "", alt: "Thumb 2" },
            { src: "", alt: "Thumb 3" },
          ].map((thumb, idx) => (
            <div
              key={idx}
              className="w-16 h-16 rounded border border-transparent flex items-center justify-center"
            >
              {thumb.src ? (
                <img src={thumb.src} alt={thumb.alt} className="object-contain max-h-12 max-w-12" />
              ) : (
                <span className="text-gray-400 text-xs">{thumb.alt}</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
