import Image from "next/image";
import { FC } from "react";

interface ImageComponentProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  layout?: "intrinsic" | "responsive" | "fixed" | "fill";
  quality?: number;
  className?: string;
  priority?: boolean; // Pour images qui doivent être priorisées (e.g., pour le hero image)
}

const ImageComponent: FC<ImageComponentProps> = ({
  src,
  alt,
  width = 800,
  height = 600,
  layout = "intrinsic",
  quality = 75,
  className = "",
  priority = false,
}) => {
  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        layout={layout}
        quality={quality}
        priority={priority}
        className="object-cover" // Peut être changé selon tes besoins (e.g. 'object-contain' si tu veux que l'image soit contenue)
      />
    </div>
  );
};

export default ImageComponent;
