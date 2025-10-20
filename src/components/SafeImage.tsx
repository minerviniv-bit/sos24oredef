"use client";
import Image, { ImageProps } from "next/image";

type Props = Omit<ImageProps, "src"> & { src: string };

/**
 * Wrapper di Image:
 * - accetta src pubblico (/logos/logo.webp) o URL remoto whitelisted
 * - garantisce attributi stabili tra SSR/CSR (no loading null, priority opzionale boolean)
 */
export default function SafeImage({ src, alt, width, height, priority = false, ...rest }: Props) {
  // next/image accetta string assoluta https://... o path pubblico /...
  // Non passiamo mai loading={null} per evitare hydration mismatch
  return (
    <Image
      src={src}
      alt={alt}
      width={Number(width)}
      height={Number(height)}
      priority={Boolean(priority)}
      {...rest}
    />
  );
}
