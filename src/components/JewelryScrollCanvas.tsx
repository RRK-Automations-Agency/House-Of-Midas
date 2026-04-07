import React, { useEffect, useRef, useState } from "react";
import { useTransform, MotionValue } from "motion/react";
import { getAssetUrl } from "@/lib/utils";

interface JewelryScrollCanvasProps {
  scrollYProgress: MotionValue<number>;
}

const JewelryScrollCanvas: React.FC<JewelryScrollCanvasProps> = ({ scrollYProgress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const totalFrames = 240;
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    const isShopify = !!(window as any).ShopifyAssetUrl;

    const checkReady = () => {
      loadedCount++;
      // If we have at least 20% of frames, we can start showing something, 
      // but we wait for 100% for full smooth experience
      if (loadedCount >= totalFrames * 0.2 && !isLoaded) {
        // Optional: show early
      }
      if (loadedCount === totalFrames) {
        setIsLoaded(true);
      }
    };

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      // Our flattening script uses 1-based naming from the original files
      const frameNum = i + 1;
      const path = isShopify ? `ring-${frameNum}.jpg` : `/images/ring-sequence/${frameNum}.jpg`;
      img.src = getAssetUrl(path);
      
      img.onload = checkReady;
      img.onerror = () => {
        console.warn(`[JewelryScrollCanvas] Error loading frame ${frameNum}`);
        checkReady();
      };
      loadedImages[i] = img;
    }
    setImages(loadedImages);
  }, []);

  useEffect(() => {
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas || images.length === 0) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rawIndex = frameIndex.get();

      const index = Math.max(0, Math.min(totalFrames - 1, Math.floor(rawIndex)));
      const img = images[index];

      if (img && img.complete && img.naturalWidth > 0) {
        const dpr = window.devicePixelRatio || 1;
        // Use offsetWidth/Height for more reliable measurement
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;

        if (width === 0 || height === 0) {
          return;
        }

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = width / height;
        let drawWidth, drawHeight, x, y;

        if (imgRatio > canvasRatio) {
          drawHeight = height;
          drawWidth = height * imgRatio;
          x = (width - drawWidth) / 2;
          y = 0;
        } else {
          drawWidth = width;
          drawHeight = width / imgRatio;
          x = 0;
          y = (height - drawHeight) / 2;
        }

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
      }
    };

    const unsubscribe = frameIndex.on("change", draw);
    setTimeout(draw, 100);

    return () => unsubscribe();
  }, [images, frameIndex, isLoaded, scrollYProgress]);

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_20%_20%,hsla(var(--primary),0.65)_0%,hsl(var(--foreground))_45%,hsl(var(--foreground))_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_15%,hsla(var(--primary),0.2)_55%,transparent_100%)] pointer-events-none" />
      {!isLoaded && (
        <div className="absolute z-30 text-secondary text-xs tracking-widest uppercase animate-pulse">
          Crafting Experience...
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full object-cover"
        style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 1s ease-in-out" }}
      />
    </div>
  );
};

export default JewelryScrollCanvas;
