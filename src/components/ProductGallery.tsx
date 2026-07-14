'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [mainImage, setMainImage] = useState(images[0] || '/placeholder.svg');

  return (
    <div>
      <div className="aspect-square bg-white rounded-xl overflow-hidden mb-4 flex items-center justify-center border border-gray-100">
        <Image
          src={mainImage}
          alt={title}
          width={600}
          height={600}
          className="max-w-full max-h-full object-contain p-4"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-6 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setMainImage(img)}
              className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                mainImage === img ? 'border-primary' : 'border-transparent hover:border-primary/50'
              }`}
            >
              <Image src={img} alt={`${title} foto ${i + 1}`} width={100} height={100} className="w-full h-full object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
