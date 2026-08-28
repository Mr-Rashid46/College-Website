import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api/axios';
import { Clock, Users, BookOpen, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ProgrammeDetail = () => {
  const { id } = useParams();
  const [programme, setProgramme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgramme = async () => {
      try {
        const res = await API.get(`/programmes/${id}`);
        if (res.data.success) {
          setProgramme(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load programme detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgramme();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-64 bg-slate-200 rounded-2xl"></div>
      </div>
    );
  }

  if (!programme) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold font-serif text-navy-900">Programme Not Found</h2>
        <Link to="/programmes" className="mt-4 inline-block text-xs font-bold text-navy-800 underline">
          Back to All Programmes
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        <Link to="/programmes" className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-800 hover:text-maroon-600">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Programmes Listing</span>
        </Link>

        <div className="bg-white rounded-2xl overflow-hidden shadow-card border border-slate-200 grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
            <div className="space-y-2">
              <span className="bg-navy-900 text-gold-400 text-[11px] font-bold px-3 py-1 rounded-full uppercase">
                {programme.level} Degree
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-navy-900">
                {programme.name}
              </h1>
              <p className="text-xs font-semibold text-maroon-600">Department of {programme.department}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gold-600" />
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Duration</span>
                  <span className="text-xs font-bold text-navy-900">{programme.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gold-600" />
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Sanctioned Intake</span>
                  <span className="text-xs font-bold text-navy-900">{programme.seats} Seats</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold font-serif text-navy-900 uppercase tracking-wider">
                Eligibility Criteria
              </h3>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                {programme.eligibility || 'Candidate must have passed qualifying examination from a recognized university/board.'}
              </div>
            </div>

            {programme.description && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold font-serif text-navy-900 uppercase tracking-wider">
                  Course Overview
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{programme.description}</p>
              </div>
            )}

            {programme.syllabusFileUrl && (
              <div className="pt-4">
                <a
                  href={programme.syllabusFileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-navy-800 hover:bg-navy-900 text-white text-xs font-bold px-6 py-3 rounded-lg shadow inline-flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-gold-400" />
                  <span>Download Full Syllabus PDF</span>
                </a>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 bg-slate-100 relative min-h-[300px]">
            {programme.image ? (
              <img src={programme.image} alt={programme.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-navy-900 flex items-center justify-center text-gold-400">
                <BookOpen className="w-20 h-20" />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProgrammeDetail;
