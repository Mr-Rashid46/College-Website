import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Award } from 'lucide-react';
import API from '../../api/axios';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await API.get('/testimonials');
        if (res.data.success && res.data.data.length > 0) {
          setTestimonials(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (!loading && testimonials.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-20 bg-white border-b border-slate-100 relative z-10 overflow-hidden"
    >
      {/* Background glow orb */}
      <div className="absolute w-96 h-96 bg-gold-500/5 rounded-full blur-3xl top-0 right-0 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-navy-50 border border-navy-200 text-navy-900 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider">
            <Award className="w-4 h-4 text-gold-500" />
            <span>Alumni & Student Voices</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-navy-900">
            Student & Alumni Success Stories
          </h2>
          <p className="text-slate-600 text-sm">
            Hear from DBATU graduates who have transformed their technical passion into impactful global careers.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 bg-slate-100 rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <motion.div
                key={t._id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-50/80 rounded-2xl p-7 border border-slate-200/90 shadow-card hover:shadow-2xl hover:border-gold-500/40 transition-all flex flex-col justify-between relative group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gold-500">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-gold-400 stroke-gold-500" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-gold-500/20 group-hover:text-gold-500/40 transition-colors" />
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 font-serif italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/60 flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-navy-900 overflow-hidden shrink-0 border-2 border-gold-500/40 shadow-sm">
                    {t.photo ? (
                      <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-navy-900 text-gold-400 font-bold flex items-center justify-center text-sm uppercase">
                        {t.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-navy-900">{t.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{t.role}</p>
                    {t.company && (
                      <span className="inline-block mt-0.5 text-[10px] font-bold text-gold-600 uppercase tracking-wider bg-gold-50 px-2 py-0.5 rounded-md border border-gold-200">
                        {t.company}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default TestimonialsSection;
