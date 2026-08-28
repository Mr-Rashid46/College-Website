import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import API from '../../api/axios';

const HeroSlider = () => {
  const [sliders, setSliders] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await API.get('/sliders');
        if (res.data.success && res.data.data.length > 0) {
          setSliders(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch sliders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSliders();
  }, []);

  useEffect(() => {
    if (sliders.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliders.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [sliders]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? sliders.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % sliders.length);
  };

  if (loading) {
    return (
      <div className="w-full h-[480px] sm:h-[550px] bg-slate-900 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-gold-500 border-t-transparent animate-spin"></div>
        <span className="text-xs text-gold-400 uppercase tracking-widest font-semibold">Loading Campus Showcase...</span>
      </div>
    );
  }

  if (sliders.length === 0) {
    return (
      <div className="w-full h-[480px] sm:h-[550px] bg-gradient-to-r from-navy-950 via-navy-900 to-maroon-900 text-white flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
        <div className="absolute w-96 h-96 bg-gold-500/10 rounded-full blur-3xl -top-20 -left-20 animate-blob"></div>
        <div className="absolute w-96 h-96 bg-maroon-500/10 rounded-full blur-3xl -bottom-20 -right-20 animate-blob animation-delay-2000"></div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-5xl font-bold font-serif text-gold-400 drop-shadow-md"
        >
          Dr. Babasaheb Ambedkar Technological University (DBATU)
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-3 text-sm sm:text-base text-slate-200 max-w-xl font-medium"
        >
          Empowering Minds Through Academic Excellence, Quality Standards & Innovation
        </motion.p>
      </div>
    );
  }

  const current = sliders[currentIndex];

  return (
    <div className="relative w-full h-[480px] sm:h-[580px] overflow-hidden bg-navy-950 group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0"
        >
          {/* Background Image with Ken Burns effect */}
          <motion.img
            src={current.image}
            alt={current.title}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1.02 }}
            transition={{ duration: 6.5, ease: 'easeOut' }}
            className="w-full h-full object-cover object-center filter brightness-90"
          />

          {/* Dark Overlay Gradient with Glass Accents */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/75 to-navy-950/20 flex items-center">
            <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full">
              <div className="max-w-2xl space-y-5">
                {current.subtitle && (
                  <motion.div
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="inline-flex items-center gap-2 bg-navy-900/80 backdrop-blur-md text-gold-300 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest border border-gold-500/40 shadow-glass"
                  >
                    <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping"></span>
                    <span>{current.subtitle}</span>
                  </motion.div>
                )}

                <motion.h2
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                  className="text-2xl sm:text-4xl lg:text-5xl font-bold font-serif text-white leading-tight drop-shadow-lg"
                >
                  {current.title}
                </motion.h2>

                {current.linkUrl && (
                  <motion.div
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="pt-3"
                  >
                    <Link
                      to={current.linkUrl}
                      className="inline-flex items-center gap-2.5 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-bold text-xs sm:text-sm px-7 py-3.5 rounded-xl shadow-glow transition-all transform hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <span>Explore Programme</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Auto-play Progress Countdown Line */}
      {sliders.length > 1 && (
        <motion.div
          key={`progress-${currentIndex}`}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 6.5, ease: 'linear' }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-gold-500 to-gold-300 z-20"
        />
      )}

      {/* Controls */}
      {sliders.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-navy-950/60 hover:bg-navy-900 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/20 hover:scale-110 shadow-lg z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-gold-400" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-navy-950/60 hover:bg-navy-900 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/20 hover:scale-110 shadow-lg z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-gold-400" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20 bg-navy-950/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            {sliders.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-8 bg-gold-400 shadow-glow'
                    : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroSlider;
