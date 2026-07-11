"use client";

import React, { useState } from "react";
import Image from "next/image";

interface SafeImageProps {
  src?: string;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
  /** next/image `sizes` ipucu; responsive srcset için. Varsayılan tüm genişlik. */
  sizes?: string;
}

/**
 * Konumlandırılmış (relative/absolute) bir kapsayıcı içinde `fill` ile çalışan,
 * yükleme hatasında yedek görsele düşen optimize görsel bileşeni.
 * Kullanırken üst kapsayıcının `position: relative` olması gerekir.
 */
export default function SafeImage({
  src,
  alt = "",
  className,
  fallbackSrc = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
  sizes = "100vw",
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      onError={() => {
        if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc);
      }}
    />
  );
}
