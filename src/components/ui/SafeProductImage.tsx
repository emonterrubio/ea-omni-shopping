"use client";

import React, { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";
import {
  PRODUCT_IMAGE_PLACEHOLDER,
  resolveProductImage,
} from "@/lib/product-image";

type SafeProductImageProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt: string;
  model?: string;
};

export function SafeProductImage({
  src,
  alt,
  model,
  className,
  onError,
  ...rest
}: SafeProductImageProps) {
  const resolved = resolveProductImage(model || alt, src);
  const [currentSrc, setCurrentSrc] = useState(resolved);

  useEffect(() => {
    setCurrentSrc(resolveProductImage(model || alt, src));
  }, [model, alt, src]);

  return (
    <Image
      {...rest}
      src={currentSrc}
      alt={alt}
      className={className}
      unoptimized={currentSrc.endsWith(".svg") || rest.unoptimized}
      onError={(event) => {
        if (currentSrc !== PRODUCT_IMAGE_PLACEHOLDER) {
          setCurrentSrc(PRODUCT_IMAGE_PLACEHOLDER);
        }
        onError?.(event);
      }}
    />
  );
}
