import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, ArrowRight, BookOpen, FileText } from 'lucide-react';

const ProgrammeCard = ({ programme }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-2xl hover:border-gold-500/40 transition-all duration-300 flex flex-col group relative"
    >
      {/* Image Banner */}
      <div className="h-52 w-full bg-slate-100 relative overflow-hidden">
        {programme.image ? (
          <img
            src={programme.image}
            alt={programme.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 flex items-center justify-center text-gold-400">
            <BookOpen className="w-12 h-12 stroke-[1.5] group-hover:scale-110 transition-transform" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
        <span className="absolute top-3 left-3 bg-navy-900/90 backdrop-blur-md text-gold-300 font-bold text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider border border-gold-500/30 shadow-glass">
          {programme.level}
        </span>
        <span className="absolute top-3 right-3 bg-maroon-700/90 backdrop-blur-md text-white font-semibold text-[11px] px-3 py-1 rounded-md border border-maroon-500/40">
          {programme.shortCode}
        </span>
      </div>

      {/* Details */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <span className="text-[11px] font-semibold text-gold-600 uppercase tracking-wider block mb-1">
            Department of {programme.department}
          </span>
          <h3 className="text-lg font-bold font-serif text-navy-900 group-hover:text-maroon-600 transition-colors line-clamp-2 leading-snug">
            {programme.name}
          </h3>
          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed font-normal">
            {programme.eligibility || programme.description}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-4 h-4 text-gold-500" />
            <span>{programme.duration || '3 Years'}</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <Users className="w-4 h-4 text-gold-500" />
            <span>{programme.seats} Seats</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Link
            to={`/programmes/${programme._id}`}
            className="text-xs font-bold text-navy-900 hover:text-maroon-600 flex items-center gap-1.5 group/link"
          >
            <span>View Programme</span>
            <ArrowRight className="w-4 h-4 text-gold-500 transition-transform group-hover/link:translate-x-1" />
          </Link>

          {programme.syllabusFileUrl && (
            <a
              href={programme.syllabusFileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-slate-600 hover:text-navy-900 hover:bg-slate-100 flex items-center gap-1.5 border border-slate-200 px-2.5 py-1 rounded-md transition-colors"
              title="Download Syllabus PDF"
            >
              <FileText className="w-3.5 h-3.5 text-maroon-600" />
              <span>Syllabus</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProgrammeCard;
