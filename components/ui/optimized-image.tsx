/**
 * Optimized Image Component
 * Wrapper para otimizar imagens com lazy loading, WEBP, e responsive design
 */

import Image from "next/image";
import { CSSProperties } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  loading?: "lazy" | "eager";
  className?: string;
  style?: CSSProperties;
  fill?: boolean;
  sizes?: string;
  quality?: number;
}

export function OptimizedImage({
  src,
  alt,
  title,
  width,
  height,
  priority = false,
  loading = "lazy",
  className = "",
  style,
  fill = false,
  sizes,
  quality = 75,
}: OptimizedImageProps) {
  // Validar que alt text é descritivo
  if (!alt || alt.length < 3) {
    console.warn(`Alt text muito curto para imagem: ${src}`);
  }

  return (
    <Image
      src={src}
      alt={alt}
      title={title || alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      priority={priority}
      loading={loading}
      className={className}
      style={style}
      sizes={sizes}
      quality={quality}
      placeholder="blur"
      blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 2'%3E%3Cfilter id='b'%3E%3CfeGaussianBlur stdDeviation='12'/%3E%3C/filter%3E%3Cimage preserveAspectRatio='none' filter='url(%23b)' x='0' y='0' width='100%25' height='100%25' href='data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 xmlns:xlink=%22http://www.w3.org/1999/xlink%22 viewBox=%220 0 1200 630%22%3E%3Cdefs%3E%3ClinearGradient id=%22g%22%3E%3Cstop offset=%220%25%22 stop-color=%22%2323201f%22/%3E%3Cstop offset=%22100%25%22 stop-color=%22%23d12026%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%221200%22 height=%22630%22 fill=%22url(%23g)%22/%3E%3C/svg%3E'/%3E%3C/filter%3E%3C/svg%3E"
    />
  );
}

export default OptimizedImage;
