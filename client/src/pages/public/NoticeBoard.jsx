import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../../api/axios';
import NoticeCard from '../../components/public/NoticeCard';
import { Search, Bell, Filter } from 'lucide-react';

const NoticeBoard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || 'ALL';
  const [notices, setNotices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      try {
        let url = `/notices?page=${page}&limit=12`;
        if (categoryFilter !== 'ALL') url += `&category=${categoryFilter}`;
        if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;

        const res = await API.get(url);
        if (res.data.success) {
          setNotices(res.data.data);
          setTotal(res.data.total || res.data.data.length);
        }
      } catch (err) {
        console.error('Failed to fetch notices:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, [categoryFilter, searchQuery, page]);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* Banner Header */}
        <div className="bg-navy-900 text-white rounded-2xl p-8 shadow-xl border border-navy-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-xs font-bold uppercase text-gold-400 tracking-wider">Circulars & Bulletins</span>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif text-white mt-1 flex items-center gap-2">
              <Bell className="w-8 h-8 text-gold-500" />
              <span>Official Notice Board</span>
            </h1>
            <p className="text-xs text-slate-300 mt-2 max-w-xl">
              Access all latest DBATU examination timetables, B.Tech/M.Tech circulars, admission notifications, and hall tickets.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notices by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-navy-800 text-white text-xs pl-9 pr-4 py-2.5 rounded-lg border border-navy-700 focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {['ALL', 'Admission', 'Exam', 'Circular', 'General'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setPage(1);
                setSearchParams(cat === 'ALL' ? {} : { category: cat });
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                categoryFilter === cat
                  ? 'bg-maroon-700 text-white shadow-md border-l-4 border-gold-500'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Bulletins' : cat}
            </button>
          ))}
        </div>

        {/* Notice List */}
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-slate-200 rounded-lg"></div>
            ))}
          </div>
        ) : notices.length > 0 ? (
          <div className="space-y-3">
            {notices.map((n) => (
              <NoticeCard key={n._id} notice={n} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl text-center border border-slate-200 text-slate-500">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold">No notices found matching your criteria.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default NoticeBoard;
