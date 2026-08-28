import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Download, Flame } from 'lucide-react';

const NoticeCard = ({ notice }) => {
  const formattedDate = notice.publishDate
    ? new Date(notice.publishDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Recent';

  const isNew = notice.publishDate
    ? (new Date() - new Date(notice.publishDate)) / (1000 * 60 * 60 * 24) <= 7
    : false;

  const categoryColors = {
    Admission: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    Exam: 'bg-amber-50 text-amber-700 border-amber-300',
    General: 'bg-blue-50 text-blue-700 border-blue-300',
    Circular: 'bg-purple-50 text-purple-700 border-purple-300',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ x: 4, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-gold-500/40 transition-all flex items-start justify-between gap-4 group"
    >
      <div className="space-y-2 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border shadow-xs ${
              categoryColors[notice.category] || categoryColors.General
            }`}
          >
            {notice.category}
          </span>

          {isNew && (
            <span className="bg-gradient-to-r from-red-600 to-rose-500 text-white font-extrabold text-[9px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs animate-pulse">
              <Flame className="w-3 h-3 text-gold-300" />
              NEW
            </span>
          )}

          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
            <Calendar className="w-3.5 h-3.5 text-gold-500" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <h4 className="text-sm sm:text-base font-bold text-navy-900 leading-snug group-hover:text-maroon-600 transition-colors">
          {notice.title}
        </h4>
      </div>

      {notice.fileUrl && (
        <a
          href={notice.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 bg-navy-50 hover:bg-navy-800 hover:text-white text-navy-800 border border-navy-200 px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all transform hover:scale-105 shadow-xs"
          title="Download Attachment PDF"
        >
          <Download className="w-4 h-4 text-maroon-600 group-hover:text-gold-400 transition-colors" />
          <span className="hidden sm:inline">PDF Document</span>
        </a>
      )}
    </motion.div>
  );
};

export default NoticeCard;
