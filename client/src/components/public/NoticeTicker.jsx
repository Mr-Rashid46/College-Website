import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Flame, FileText, ChevronRight } from 'lucide-react';
import API from '../../api/axios';

const NoticeTicker = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchFeaturedNotices = async () => {
      try {
        const res = await API.get('/notices?isFeatured=true&limit=6');
        if (res.data.success) {
          setNotices(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load notice ticker:', err);
      }
    };
    fetchFeaturedNotices();
  }, []);

  const isNew = (pubDate) => {
    if (!pubDate) return false;
    const diffDays = (new Date() - new Date(pubDate)) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  if (notices.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-900 text-white border-b border-maroon-950 shadow-lg flex flex-col md:flex-row items-stretch overflow-hidden relative">
      {/* Ticker Badge */}
      <div className="bg-maroon-950 px-5 py-3 flex items-center gap-2.5 shrink-0 font-bold text-xs tracking-widest uppercase border-r border-maroon-800 text-gold-400 z-10 shadow-xl">
        <div className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center">
          <Bell className="w-3.5 h-3.5 text-gold-400 animate-bounce" />
        </div>
        <span>Announcements:</span>
      </div>

      {/* Scrolling Content */}
      <div className="flex-1 overflow-hidden relative py-3 px-4 flex items-center bg-navy-950/30">
        <div className="animate-ticker flex items-center gap-10">
          {notices.map((n) => (
            <div key={n._id} className="inline-flex items-center gap-3 text-xs">
              <span className="bg-navy-900/90 text-gold-300 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border border-gold-500/30 shadow-xs">
                {n.category}
              </span>
              {isNew(n.publishDate) && (
                <span className="bg-gradient-to-r from-gold-500 to-amber-400 text-navy-950 px-2 py-0.5 rounded-full text-[9px] uppercase font-extrabold flex items-center gap-1 shadow-xs animate-pulse">
                  <Flame className="w-3 h-3 text-maroon-900" />
                  NEW
                </span>
              )}
              {n.fileUrl ? (
                <a
                  href={n.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold-300 hover:underline flex items-center gap-1.5 font-semibold transition-colors text-slate-100"
                >
                  <span>{n.title}</span>
                  <FileText className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                </a>
              ) : (
                <Link to="/notices" className="hover:text-gold-300 hover:underline font-semibold text-slate-100">
                  {n.title}
                </Link>
              )}
              <span className="text-gold-500 font-bold ml-4 text-xs opacity-60">◆</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden lg:flex items-center px-5 bg-maroon-950/80 text-xs shrink-0 z-10 border-l border-maroon-800">
        <Link to="/notices" className="text-gold-400 hover:text-white flex items-center gap-1.5 font-bold transition-colors">
          <span>All Notices</span>
          <ChevronRight className="w-4 h-4 text-gold-400" />
        </Link>
      </div>
    </div>
  );
};

export default NoticeTicker;
