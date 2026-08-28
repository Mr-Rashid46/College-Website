import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { SiteSettingsContext } from '../../context/SiteSettingsContext';
import { BookOpen, Building2, Users, Award } from 'lucide-react';

const StatsCounter = () => {
  const { settings } = useContext(SiteSettingsContext);

  const stats = [
    {
      label: 'Degree Programmes Offered',
      value: settings?.statsCounters?.programmesCount || 16,
      suffix: '+',
      icon: BookOpen,
    },
    {
      label: 'Academic Departments',
      value: settings?.statsCounters?.departmentsCount || 10,
      suffix: '',
      icon: Building2,
    },
    {
      label: 'Enrolled Students',
      value: settings?.statsCounters?.studentsCount || 4200,
      suffix: '+',
      icon: Users,
    },
    {
      label: 'Expert Faculty & Staff',
      value: settings?.statsCounters?.facultyCount || 78,
      suffix: '+',
      icon: Award,
    },
  ];

  return (
    <section className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white py-14 relative overflow-hidden border-y-4 border-gold-500">
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:20px_20px]"></div>
      
      {/* Ambient background glowing blob */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-maroon-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="p-6 sm:p-7 rounded-2xl bg-navy-800/80 border border-navy-700/80 backdrop-blur-md shadow-card hover:border-gold-500/60 hover:shadow-glow transition-all duration-300 group relative overflow-hidden"
              >
                {/* Gloss overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-500/5 text-gold-400 mx-auto flex items-center justify-center mb-4 border border-gold-500/30 group-hover:scale-110 transition-transform">
                  <IconComp className="w-7 h-7" />
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-white mb-2 tracking-tight">
                  {item.value.toLocaleString()}
                  <span className="text-gold-400 drop-shadow-xs">{item.suffix}</span>
                </div>
                <p className="text-xs text-slate-300 font-semibold tracking-wider uppercase">
                  {item.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
