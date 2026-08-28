import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { ShieldCheck, Users, ChevronDown } from 'lucide-react';

const CommitteesPage = () => {
  const [committees, setCommittees] = useState([]);
  const [activeType, setActiveType] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommittees = async () => {
      setLoading(true);
      try {
        let url = '/committees';
        if (activeType !== 'ALL') url += `?type=${activeType}`;
        const res = await API.get(url);
        if (res.data.success) {
          setCommittees(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch committees:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCommittees();
  }, [activeType]);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* Banner Header */}
        <div className="bg-navy-900 text-white rounded-2xl p-8 shadow-xl border border-navy-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-xs font-bold uppercase text-gold-400 tracking-wider">Governance</span>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif text-white mt-1 flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-gold-500" />
              <span>Institutional Committees</span>
            </h1>
            <p className="text-xs text-slate-300 mt-2 max-w-xl">
              Statutory and Non-Statutory committees ensuring regulatory compliance, student welfare, discipline, and gender equity.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          {['ALL', 'Statutory', 'Non-Statutory'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeType === t
                  ? 'bg-navy-800 text-gold-400 shadow-md border-l-4 border-gold-500'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {t === 'ALL' ? 'All Committees' : `${t} Committees`}
            </button>
          ))}
        </div>

        {/* Committees List */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>
        ) : committees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {committees.map((com) => (
              <div key={com._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <span className="bg-maroon-50 text-maroon-700 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase border border-maroon-200">
                      {com.type} Committee
                    </span>
                    <h3 className="text-lg font-bold font-serif text-navy-900 mt-1">
                      {com.name}
                    </h3>
                  </div>
                </div>

                {com.description && (
                  <p className="text-xs text-slate-600 leading-relaxed">{com.description}</p>
                )}

                {/* Member Roster Table */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase text-navy-900 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-gold-600" />
                    <span>Committee Members ({com.membersList?.length || 0})</span>
                  </h4>

                  <div className="border border-slate-100 rounded-lg overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
                        <tr>
                          <th className="p-2 font-bold">Member Name</th>
                          <th className="p-2 font-bold">Role / Position</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {com.membersList?.map((m, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2 font-semibold text-slate-800">{m.name}</td>
                            <td className="p-2 text-slate-600">{m.role}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl text-center border border-slate-200 text-slate-500">
            <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold">No committees found for this type.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default CommitteesPage;
