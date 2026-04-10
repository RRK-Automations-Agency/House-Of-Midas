import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Quote, ChevronLeft, ChevronRight, X } from "lucide-react";
import { getAssetUrl } from "@/lib/utils";

interface Review {
  id: string;
  name: string;
  role: string;
  text: string;
  images: string[];
}

const reviews: Review[] = [
  {
    id: 'lisette',
    name: 'Lisette',
    role: 'Customer • USA',
    text: 'They have arrived! And I love them so much!! The ring came and it was way toooooo pretty. It fits perfectly! Thank you so much!!',
    images: [
      getAssetUrl('/images/testimonials/lisette-1.png'),
      getAssetUrl('/images/testimonials/lisette-2.png'),
      getAssetUrl('/images/testimonials/lisette-3.png'),
    ],
  },
  {
    id: 'mehrmano',
    name: 'Mehrmano',
    role: 'Customer • UK',
    text: "Hello, I didn't get a chance to message you I was incredibly busy today, but wanted to update you that I received my Athena ring today and it is a showstopper. The unboxing is a whole experience in itself. Thank you very much.",
    images: [
        getAssetUrl('/images/testimonials/mehrmano-1.png'),
    ],
  },
  {
    id: 'masha',
    name: 'Masha Parani',
    role: 'Customer',
    text: 'Thank you so much for your wonderful piece and for the present! I am extremely happy with the result!',
    images: [getAssetUrl('/images/testimonials/masha-parani-1.png')],
  },
  {
    id: 'donia',
    name: 'Donia',
    role: 'Customer',
    text: 'It is so beautiful and I\'m so happy with it. It fits perfectly! Thank you so much!!',
    images: [
      getAssetUrl('/images/testimonials/donia-1.png'),
      getAssetUrl('/images/testimonials/donia-2.png'),
    ],
  },
]

const ReviewCard: React.FC<{ review: Review; index: number; onImageClick: (reviewId: string, imgIndex: number) => void }> = ({ review, index, onImageClick }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const imgs = review.images || [];

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex((i) => (i + 1) % imgs.length);
  };
  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex((i) => (i - 1 + imgs.length) % imgs.length);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="bg-[#fcf8f3] border border-secondary/20 shadow-[0_8px_40px_rgba(61,7,16,0.04)] sm:p-10 p-6 rounded-3xl relative group hover:shadow-[0_20px_60px_rgba(61,7,16,0.08)] transition-all duration-700 flex flex-col h-full"
    >
      {/* Quote Icon Watermark */}
      <Quote className="text-[#3d0710]/5 absolute top-8 right-10 w-16 h-16 pointer-events-none group-hover:text-[#3d0710]/10 transition-colors duration-500" />
      
      {/* Header with Stars */}
      <div className="flex items-center justify-center sm:justify-start gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
        ))}
      </div>

      {/* Testimonial Text */}
      <div className="flex-1 relative">
        <p className="text-stone-800 leading-[1.8] font-inter text-[1.05rem] mb-10 italic opacity-90 group-hover:opacity-100 transition-opacity text-center sm:text-left">
          "{review.text}"
        </p>
      </div>

      {/* Bottom Section: Author & Image */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-6 pt-8 border-t border-[#d4a843]/10">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <strong className="font-playfair-display font-semibold text-[#3d0710] text-xl mb-1 group-hover:text-secondary transition-colors duration-300">
            {review.name}
          </strong>
          <span className="text-[10px] uppercase tracking-[0.2em] text-secondary font-inter font-bold opacity-80">
            {review.role}
          </span>
        </div>

        {imgs.length > 0 && (
          <div className="relative group/gallery w-32 h-32 flex-shrink-0">
            <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-white shadow-xl shadow-stone-200 transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
                 onClick={() => onImageClick(review.id, imgIndex)}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={imgIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                  src={imgs[imgIndex]}
                  alt={`${review.name} story`}
                />
              </AnimatePresence>
            </div>

            {imgs.length > 1 && (
              <div className="absolute -bottom-2 -right-2 flex gap-1 items-center bg-white/90 backdrop-blur-sm p-1 rounded-full border border-secondary/30 shadow-lg opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 scale-90 group-hover/gallery:scale-100">
                <button 
                  onClick={prev} 
                  className="p-1 hover:bg-[#3d0710] hover:text-white rounded-full transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <span className="text-[9px] font-bold px-1 text-[#3d0710] tabular-nums">
                  {imgIndex + 1}/{imgs.length}
                </span>
                <button 
                  onClick={next} 
                  className="p-1 hover:bg-[#3d0710] hover:text-white rounded-full transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
};

const Testimonials: React.FC = () => {
  const [selectedImg, setSelectedImg] = useState<{ id: string; index: number } | null>(null);

  const selectedReview = selectedImg ? reviews.find(r => r.id === selectedImg.id) : null;
  const hasMultipleImages = selectedReview ? selectedReview.images.length > 1 : false;

  const nextLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedReview && selectedImg) {
      setSelectedImg({
        ...selectedImg,
        index: (selectedImg.index + 1) % selectedReview.images.length
      });
    }
  };

  const prevLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedReview && selectedImg) {
      setSelectedImg({
        ...selectedImg,
        index: (selectedImg.index - 1 + selectedReview.images.length) % selectedReview.images.length
      });
    }
  };

  return (
    <section className="bg-[#fdf8f2] py-24 md:py-40 overflow-hidden relative">
      {/* Luxury background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(212,168,67,0.08)_0%,transparent_70%)] pointer-events-none -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(61,7,16,0.05)_0%,transparent_70%)] pointer-events-none translate-y-1/2 -translate-x-1/4" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <h2 className="m-0 flex flex-col items-center leading-none gap-0">
              <span className="font-great-vibes text-[clamp(28px,4vw,54px)] font-normal text-secondary block mb-2 opacity-90 leading-none">
                Stories of
              </span>

              <div className="flex items-baseline gap-4 md:gap-6 mt-[-5px]">
                <span
                  className="font-playfair-display text-[clamp(44px,7vw,92px)] font-bold italic block leading-[0.9]"
                    style={{
                      background:
                        "linear-gradient(135deg, #1a0509 0%, #BF9340 42%, #5c0d1a 72%, #c97b5a 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                >
                  True Love
                </span>
              </div>
            </h2>
            <div className="flex items-center gap-4 mt-8">
               <span className="h-px w-12 bg-secondary/40" />
               <Star className="w-4 h-4 fill-secondary text-secondary" />
               <span className="h-px w-12 bg-secondary/40" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-10 max-w-7xl mx-auto items-stretch">
          {reviews.map((r, i) => (
            <ReviewCard key={r.id} review={r} index={i} onImageClick={(id, imgIdx) => setSelectedImg({ id, index: imgIdx })} />
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm cursor-pointer"
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[110]"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImg(null);
              }}
            >
              <X className="w-8 h-8" />
            </motion.button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center pointer-events-none"
            >
              {hasMultipleImages && (
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-10 z-[120] pointer-events-auto">
                  <button
                    onClick={prevLightbox}
                    className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md border border-white/10 group"
                  >
                    <ChevronLeft className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={nextLightbox}
                    className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md border border-white/10 group"
                  >
                    <ChevronRight className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              )}

              {selectedReview && (
                <img
                  src={selectedReview.images[selectedImg!.index]}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl pointer-events-auto"
                  alt="Selected testimonial story"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Testimonials;

