import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../../api/axios';
import ProgrammeCard from '../../components/public/ProgrammeCard';
import { Search, GraduationCap } from 'lucide-react';

const ProgrammeList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const levelFilter = searchParams.get('level') || 'ALL';
  const [programmes, setProgrammes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgrammes = async () => {
      setLoading(true);
      try {
        let url = '/programmes?limit=50';
        if (levelFilter !== 'ALL') url += `&level=${levelFilter}`;
        if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;

        const res = await API.get(url);
        if (res.data.success) {
          setProgrammes(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch programmes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgrammes();
  }, [levelFilter, searchQuery]);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* Page Banner Header */}
        <div className="bg-navy-900 text-white rounded-2xl p-8 shadow-xl border border-navy-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-xs font-bold uppercase text-gold-400 tracking-wider">Academics</span>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif text-white mt-1">
              Programmes & Degree Courses
            </h1>
            <p className="text-xs text-slate-300 mt-2 max-w-2xl">
              Explore Undergraduate, Postgraduate, and Diploma programmes offered across Commerce, Information Technology, Management, and Humanities.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search course or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-navy-800 text-white text-xs pl-9 pr-4 py-2.5 rounded-lg border border-navy-700 focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        {/* Level Filters */}
        <div className="flex flex-wrap gap-2">
          {['ALL', 'UG', 'PG', 'Diploma', 'Certificate'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSearchParams(lvl === 'ALL' ? {} : { level: lvl })}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                levelFilter === lvl
                  ? 'bg-navy-800 text-gold-400 shadow-md border-l-4 border-gold-500'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {lvl === 'ALL' ? 'All Programmes' : lvl}
            </button>
          ))}
        </div>

        {/* Programme Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        ) : programmes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programmes.map((p) => (
              <ProgrammeCard key={p._id} programme={p} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl text-center border border-slate-200 text-slate-500">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold">No programmes found matching your filter criteria.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProgrammeList;
