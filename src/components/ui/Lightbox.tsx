import React, { useEffect, useCallback, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

type MediaItem = { type: 'image' | 'video'; src: string; thumbnail?: string; alt?: string };
type VideoSource = { url: string; mime_type?: string; format?: string; height?: number; width?: number };
type MediaItemFull = { type: 'image' | 'video'; src: string; thumbnail?: string; alt?: string; sources?: VideoSource[] };

interface LightboxProps {
  media: MediaItemFull[];
  initialIndex?: number;
  onClose?: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ media, initialIndex = 0, onClose }) => {
  const [index, setIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const current = media[index] as MediaItemFull;

  const close = useCallback(() => {
    onClose && onClose();
  }, [onClose]);

  const prev = useCallback(() => setIndex(i => (i - 1 + media.length) % media.length), [media.length]);
  const next = useCallback(() => setIndex(i => (i + 1) % media.length), [media.length]);

  const zoomIn = () => setScale(s => Math.min(4, +(s + 0.25).toFixed(2)));
  const zoomOut = () => {
    setScale(s => Math.max(1, +(s - 0.25).toFixed(2)));
    setTranslate({ x: 0, y: 0 });
  };
  const reset = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [close, prev, next]);

  if (!media || media.length === 0) return null;

  return createPortal(
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-[1200px] h-[80vh] bg-transparent flex items-center">
        <button aria-label="Previous" onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full">
          <ChevronLeft />
        </button>
        <div ref={containerRef} className="mx-auto w-full h-full flex items-center justify-center overflow-hidden rounded-lg bg-black relative">
          {current.type === 'video' ? (
            <video controls playsInline className="w-full h-full object-contain" crossOrigin="anonymous">
              {current.sources && current.sources.length ? (
                current.sources.map((s, i) => (
                  <source key={i} src={s.url} type={s.mime_type || (s.format ? `video/${s.format}` : 'video/mp4')} />
                ))
              ) : (
                <source src={current.src} />
              )}
              Your browser does not support HTML5 video.
            </video>
          ) : (
            <div
              onPointerDown={(e) => {
                if (scale <= 1) return;
                dragging.current = true;
                lastPos.current = { x: e.clientX, y: e.clientY };
                try { (e.target as Element).setPointerCapture((e as any).pointerId); } catch (_) {}
              }}
              onPointerMove={(e) => {
                if (!dragging.current) return;
                const dx = e.clientX - lastPos.current.x;
                const dy = e.clientY - lastPos.current.y;
                lastPos.current = { x: e.clientX, y: e.clientY };
                setTranslate(t => ({ x: t.x + dx, y: t.y + dy }));
              }}
              onPointerUp={(e) => {
                dragging.current = false;
                try { (e.target as Element).releasePointerCapture((e as any).pointerId); } catch (_) {}
              }}
              onWheel={(e) => {
                e.preventDefault();
                const delta = -Math.sign(e.deltaY) * 0.1;
                setScale(s => Math.max(1, Math.min(4, +(s + delta).toFixed(2))));
              }}
              style={{ touchAction: 'none' }}
              className="w-full h-full flex items-center justify-center"
            >
              <img
                src={current.src}
                alt={current.alt || ''}
                style={{ transform: `scale(${scale}) translate(${translate.x / Math.max(1, scale)}px, ${translate.y / Math.max(1, scale)}px)` }}
                className="max-w-none max-h-full object-contain transition-transform duration-75"
              />
            </div>
          )}
        </div>
        <button aria-label="Next" onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full">
          <ChevronRight />
        </button>

        <button aria-label="Close" onClick={close} className="absolute top-4 right-4 p-2 rounded-full bg-white/80">
          <X />
        </button>
        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 rounded-full p-2">
          <button onClick={zoomOut} aria-label="Zoom out" className="p-2 bg-white/90 rounded-full"><ZoomOut /></button>
          <button onClick={reset} aria-label="Reset" className="p-2 bg-white/90 rounded-full"><RefreshCw /></button>
          <button onClick={zoomIn} aria-label="Zoom in" className="p-2 bg-white/90 rounded-full"><ZoomIn /></button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Lightbox;
