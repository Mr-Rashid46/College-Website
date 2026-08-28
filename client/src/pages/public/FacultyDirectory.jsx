import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Search, Mail, UserCheck, GraduationCap, Briefcase } from 'lucide-react';

const FacultyDirectory = () => {
  const [faculty, setFaculty] = useState([]);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaculty = async () => {
      setLoading(true);
      try {
        let url = '/faculty?limit=50';
        if (typeFilter !== 'ALL') url += `&type=${typeFilter}`;
        if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;

        const res = await API.get(url);
        if (res.data.success) {
          setFaculty(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch faculty staff:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, [typeFilter, searchQuery]);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* Banner Header */}
        <div className="bg-navy-900 text-white rounded-2xl p-8 shadow-xl border border-navy-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-xs font-bold uppercase text-gold-400 tracking-wider">Human Resources</span>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif text-white mt-1">
              Faculty & Staff Directory
            </h1>
            <p className="text-xs text-slate-300 mt-2 max-w-xl">
              Meet our distinguished professors, department heads, and administrative support personnel committed to academic excellence.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, dept or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-navy-800 text-white text-xs pl-9 pr-4 py-2.5 rounded-lg border border-navy-700 focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          {['ALL', 'Teaching', 'Administrative'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                typeFilter === t
                  ? 'bg-navy-800 text-gold-400 shadow-md border-l-4 border-gold-500'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {t === 'ALL' ? 'All Staff Members' : `${t} Staff`}
            </button>
          ))}
        </div>

        {/* Directory Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        ) : faculty.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {faculty.map((member) => (
              <div
                key={member._id}
                className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col group text-center"
              >
                <div className="h-56 w-full bg-slate-100 relative overflow-hidden">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-navy-950 flex items-center justify-center text-gold-400 font-bold text-2xl">
                      {member.name[0]}
                    </div>
                  )}
                  <span className="absolute top-3 right-3 bg-navy-900/90 text-gold-400 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
                    {member.type}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold font-serif text-navy-900 group-hover:text-maroon-600 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-maroon-600 mt-0.5">{member.designation}</p>
                    <p className="text-[11px] text-slate-500 mt-1">Dept of {member.department}</p>
                  </div>

                  {member.qualification && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-600">
                      <GraduationCap className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                      <span>{member.qualification}</span>
                    </div>
                  )}

                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="text-[11px] font-semibold text-navy-800 hover:text-maroon-600 flex items-center justify-center gap-1 hover:underline"
                    >
                      <Mail className="w-3 h-3 text-gold-600" />
                      <span>{member.email}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl text-center border border-slate-200 text-slate-500">
            <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold">No faculty members found for this criteria.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default FacultyDirectory;
