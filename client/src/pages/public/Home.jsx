import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSlider from '../../components/public/HeroSlider';
import NoticeTicker from '../../components/public/NoticeTicker';
import StatsCounter from '../../components/public/StatsCounter';
import ProgrammeCard from '../../components/public/ProgrammeCard';
import NoticeCard from '../../components/public/NoticeCard';
import BlogCard from '../../components/public/BlogCard';
import ChatbotWidget from '../../components/common/ChatbotWidget';
import TestimonialsSection from '../../components/public/TestimonialsSection';
import API from '../../api/axios';
import { SiteSettingsContext } from '../../context/SiteSettingsContext';
import {
  BookOpen,
  Bell,
  GraduationCap,
  Award,
  ArrowRight,
  ShieldCheck,
  Building,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

const Home = () => {
  const { settings } = useContext(SiteSettingsContext);
  const [programmes, setProgrammes] = useState([]);
  const [notices, setNotices] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [progTab, setProgTab] = useState('ALL');
  const [noticeTab, setNoticeTab] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [progRes, noticeRes, blogRes] = await Promise.all([
          API.get('/programmes?limit=6'),
          API.get('/notices?limit=6'),
          API.get('/blogs?limit=3'),
        ]);

        if (progRes.data.success) setProgrammes(progRes.data.data);
        if (noticeRes.data.success) setNotices(noticeRes.data.data);
        if (blogRes.data.success) setBlogs(blogRes.data.data);
      } catch (err) {
        console.error('Failed to load homepage resources:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const filteredProgrammes = progTab === 'ALL'
    ? programmes
    : programmes.filter((p) => p.level === progTab);

  const filteredNotices = noticeTab === 'ALL'
    ? notices
    : notices.filter((n) => n.category === noticeTab);

  return (
    <div className="space-y-0 relative overflow-hidden bg-slate-50">
      {/* Background Ambient Floating Glowing Blobs */}
      <div className="absolute top-96 left-[-10%] w-[500px] h-[500px] bg-navy-200/40 rounded-full blur-3xl pointer-events-none animate-blob"></div>
      <div className="absolute top-[1400px] right-[-10%] w-[500px] h-[500px] bg-gold-200/40 rounded-full blur-3xl pointer-events-none animate-blob animation-delay-2000"></div>

      {/* 1. Hero Carousel */}
      <HeroSlider />

      {/* 2. Scrolling Notice Marquee Ticker */}
      <NoticeTicker />

      {/* 3. Institutional Summary / About Block */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-20 bg-white border-b border-slate-100 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-navy-50/90 border border-navy-200 text-navy-900 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
              <Sparkles className="w-4 h-4 text-gold-500" />
              <span>State Technological University of Maharashtra</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-navy-900 leading-tight">
              {settings?.collegeName || 'Dr. Babasaheb Ambedkar Technological University'}
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              {settings?.aboutSummaryText || "Established by the Government of Maharashtra under Act No. XXII of 2014, Dr. Babasaheb Ambedkar Technological University (DBATU), Lonere, Raigad, is Maharashtra's premier State Technological University. DBATU fosters excellence in Engineering, Pharmacy, Architecture, and High-Performance Technological Research across its main campus and affiliated institutes statewide."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 shadow-xs hover:border-gold-500/40 transition-colors">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-navy-900">NAAC Accredited & UGC Recognized</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Highest quality benchmarks in technical education & research</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 shadow-xs hover:border-gold-500/40 transition-colors">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-navy-900">NEP 2020 Aligned B.Tech & M.Tech</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Industry 4.0 credit framework & mandatory internships</p>
                </div>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                to="/page/about"
                className="bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs px-7 py-3.5 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>Read Full History & Vision</span>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </Link>
              <Link
                to="/page/principal-message"
                className="text-xs font-bold text-navy-900 hover:text-maroon-600 underline underline-offset-4 transition-colors"
              >
                Principal's Address
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80"
                alt="College Infrastructure"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent flex items-end p-7">
                <div className="text-white space-y-1">
                  <h4 className="font-serif font-bold text-xl text-gold-300">Central Knowledge Resource Center</h4>
                  <p className="text-xs text-slate-200">Over 45,000 reference books & digital E-Journals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 4. Programmes Offered Grid Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-20 bg-slate-50 border-b border-slate-200/80 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-maroon-600 block mb-1">
                Academic Excellence
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-navy-900">
                Degree Programmes Offered
              </h2>
            </div>

            {/* Filter Tabs with Dynamic Pill Highlight */}
            <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm gap-1">
              {['ALL', 'UG', 'PG'].map((tab) => {
                const isSelected = progTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setProgTab(tab)}
                    className={`relative px-5 py-2 rounded-xl text-xs font-bold transition-colors ${
                      isSelected ? 'text-navy-950' : 'text-slate-600 hover:text-navy-900'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeProgTabPill"
                        className="absolute inset-0 bg-gradient-to-r from-gold-400 to-gold-500 rounded-xl shadow-md"
                        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      />
                    )}
                    <span className="relative z-10">
                      {tab === 'ALL' ? 'All Degree Courses' : tab === 'UG' ? 'Undergraduate (UG)' : 'Postgraduate (PG)'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProgrammes.length > 0 ? (
                filteredProgrammes.map((p) => <ProgrammeCard key={p._id} programme={p} />)
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full py-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm"
                >
                  No academic programmes listed for this level.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="text-center pt-4">
            <Link
              to="/programmes"
              className="inline-flex items-center gap-2 text-xs font-bold text-navy-900 hover:text-maroon-600 underline underline-offset-4 transition-colors"
            >
              <span>Explore All Departments & Syllabi</span>
              <ArrowRight className="w-4 h-4 text-gold-500" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* 5. Animated Stats Counter Bar */}
      <StatsCounter />

      {/* 6. Dynamic Notices & Announcements Board */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-20 bg-white border-b border-slate-100 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Notice Board (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-maroon-600 block mb-1">
                  Official Updates
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-navy-900 flex items-center gap-2.5">
                  <Bell className="w-7 h-7 text-gold-500 stroke-[2.2]" />
                  <span>Notice Board & Circulars</span>
                </h2>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                {['ALL', 'Admission', 'Exam', 'Circular', 'General'].map((cat) => {
                  const isSelected = noticeTab === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setNoticeTab(cat)}
                      className={`relative px-3.5 py-1 rounded-xl text-[11px] font-bold transition-colors ${
                        isSelected ? 'text-white' : 'text-slate-600 hover:text-navy-900'
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="activeNoticeTabPill"
                          className="absolute inset-0 bg-maroon-700 rounded-xl shadow-xs"
                          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                        />
                      )}
                      <span className="relative z-10">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredNotices.length > 0 ? (
                  filteredNotices.map((n) => <NoticeCard key={n._id} notice={n} />)
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-10 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200"
                  >
                    No notices posted in this category.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="pt-2">
              <Link
                to="/notices"
                className="bg-navy-50 hover:bg-navy-100 text-navy-900 text-xs font-bold px-5 py-3 rounded-xl border border-navy-200 inline-flex items-center gap-2 transition-all transform hover:-translate-y-0.5 shadow-xs"
              >
                <span>View Full Paginated Notice Board</span>
                <ArrowRight className="w-4 h-4 text-gold-500" />
              </Link>
            </div>
          </div>

          {/* Institutional Highlights Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white rounded-3xl p-7 shadow-2xl border border-navy-800 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl pointer-events-none"></div>

              <h3 className="text-xl font-bold font-serif text-gold-400 border-b border-navy-800 pb-4 flex items-center gap-2.5">
                <Award className="w-6 h-6 text-gold-400" />
                <span>Institutional Cells</span>
              </h3>

              <ul className="space-y-5">
                <li className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-navy-800 text-gold-400 flex items-center justify-center shrink-0 border border-navy-700 shadow-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">IQAC & Quality Assurance</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Monitoring continuous improvement & NAAC benchmarks.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-navy-800 text-gold-400 flex items-center justify-center shrink-0 border border-navy-700 shadow-xs">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Career Placement Cell</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Campus drives, soft-skill training & corporate ties.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-navy-800 text-gold-400 flex items-center justify-center shrink-0 border border-navy-700 shadow-xs">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Research & Innovation Center</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Faculty research projects & student seminars.</p>
                  </div>
                </li>
              </ul>

              <div className="pt-3 border-t border-navy-800">
                <Link
                  to="/committees"
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-bold text-xs py-3 rounded-xl text-center block transition-all shadow-glow hover:shadow-2xl"
                >
                  View Statutory Committees
                </Link>
              </div>
            </div>
          </div>

        </div>
      </motion.section>

      {/* 7. Institutional News & Blogs */}
      {blogs.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-20 bg-slate-50 relative z-10"
        >
          <div className="max-w-7xl mx-auto px-6 space-y-10">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-maroon-600 block mb-1">
                  Campus Stories
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-navy-900">
                  Institutional News & Articles
                </h2>
              </div>
              <Link to="/blogs" className="text-xs font-bold text-navy-900 hover:text-maroon-600 underline underline-offset-4 transition-colors">
                View All Articles
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.map((b) => (
                <BlogCard key={b._id} blog={b} />
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Student & Alumni Testimonials Section */}
      <TestimonialsSection />

      {/* Floating Chatbot Assistant */}
      <ChatbotWidget />
    </div>
  );
};

export default Home;
