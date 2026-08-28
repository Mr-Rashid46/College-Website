import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SiteSettingsContext } from '../../context/SiteSettingsContext';
import { Phone, Mail, Clock, Eye, Menu, X, ChevronDown, Lock, Search, GraduationCap } from 'lucide-react';

const Header = () => {
  const { settings, menuItems } = useContext(SiteSettingsContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  return (
    <header className="w-full relative z-40">
      {/* Top Urgent Announcement Banner */}
      {settings?.announcementBanner?.enabled && (
        <div className="bg-gradient-to-r from-maroon-800 via-maroon-700 to-maroon-800 text-white text-xs font-bold py-2 px-4 text-center shadow-md flex items-center justify-center gap-2.5">
          <span className="bg-gold-500 text-navy-950 text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full tracking-wider shadow-xs animate-pulse">
            Announcement
          </span>
          <span className="font-medium text-slate-100">{settings.announcementBanner.text}</span>
          {settings.announcementBanner.linkUrl && (
            <Link
              to={settings.announcementBanner.linkUrl}
              className="underline text-gold-300 hover:text-white text-xs font-bold ml-1 transition-colors"
            >
              View Details →
            </Link>
          )}
        </div>
      )}

      {/* Top Utility Bar */}
      <div className="bg-navy-950 text-slate-300 text-xs py-2 px-4 border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex flex-wrap items-center gap-5">
            {settings?.phoneNumbers?.length > 0 && (
              <a href={`tel:${settings.phoneNumbers[0]}`} className="flex items-center gap-1.5 hover:text-gold-400 transition-colors font-medium">
                <Phone className="w-3.5 h-3.5 text-gold-500" />
                <span>{settings.phoneNumbers[0]}</span>
              </a>
            )}
            {settings?.emails?.length > 0 && (
              <a href={`mailto:${settings.emails[0]}`} className="hidden sm:flex items-center gap-1.5 hover:text-gold-400 transition-colors font-medium">
                <Mail className="w-3.5 h-3.5 text-gold-500" />
                <span>{settings.emails[0]}</span>
              </a>
            )}
            {settings?.workingHours && (
              <div className="hidden md:flex items-center gap-1.5 text-slate-400 font-medium">
                <Clock className="w-3.5 h-3.5 text-gold-500" />
                <span>{settings.workingHours}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-navy-900/90 px-3 py-0.5 rounded-full border border-navy-700/80 text-[11px] text-gold-300 shadow-xs">
              <Eye className="w-3 h-3 text-gold-400" />
              <span>Visitors: {settings?.visitorCounter?.toLocaleString() || 12500}</span>
            </div>

            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 hover:text-gold-400 font-semibold transition-colors text-slate-300 border-l border-navy-800 pl-3.5"
            >
              <Lock className="w-3 h-3 text-gold-400" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* College Identity Header */}
      <div className="bg-white py-4 px-4 shadow-xs border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-14 h-14 rounded-full bg-navy-900 border-2 border-gold-500 flex items-center justify-center text-gold-400 shadow-lg group-hover:scale-105 transition-transform overflow-hidden shrink-0">
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt="College Logo" className="w-full h-full object-cover" />
              ) : (
                <GraduationCap className="w-8 h-8 text-gold-400" />
              )}
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-bold tracking-widest text-maroon-600 uppercase block">
                Government of Maharashtra State University
              </span>
              <h1 className="text-base sm:text-xl font-black font-serif text-navy-900 group-hover:text-navy-700 transition-colors leading-tight">
                {settings?.collegeName || 'Dr. Babasaheb Ambedkar Technological University'}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                {settings?.tagLine || 'Premier State Technological University of Maharashtra | NAAC Accredited & UGC Recognized'}
              </p>
            </div>
          </Link>

          {/* Quick Apply / Contact CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/page/admissions"
              className="bg-gradient-to-r from-maroon-700 to-maroon-600 hover:from-maroon-600 hover:to-maroon-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-1.5"
            >
              <span>Admissions 2026</span>
            </Link>
            <Link
              to="/notices"
              className="bg-navy-900 hover:bg-navy-800 text-gold-400 text-xs font-bold px-4.5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 border border-gold-500/30 flex items-center gap-1.5"
            >
              <span>Notice Board</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-navy-50 text-navy-900 hover:bg-navy-100 focus:outline-none transition-colors border border-slate-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-maroon-600" /> : <Menu className="w-6 h-6 text-navy-900" />}
          </button>
        </div>
      </div>

      {/* Sticky Dynamic Navbar */}
      <nav
        className={`bg-navy-900 text-white border-y border-navy-800 transition-all duration-300 ${
          isScrolled ? 'fixed top-0 left-0 right-0 z-50 shadow-2xl backdrop-blur-md bg-navy-900/90 py-1' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="hidden lg:flex items-center justify-between">
            <ul className="flex items-center flex-wrap gap-1">
              {menuItems && menuItems.length > 0 ? (
                menuItems.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <li
                      key={item._id}
                      className="relative group"
                      onMouseEnter={() => setActiveDropdown(item._id)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <Link
                        to={item.url}
                        className={`relative flex items-center gap-1 py-3.5 px-4 text-xs font-bold tracking-wider uppercase transition-colors ${
                          isActive ? 'text-gold-400' : 'text-slate-200 hover:text-gold-300'
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.children && item.children.length > 0 && (
                          <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform" />
                        )}
                        {isActive && (
                          <motion.div
                            layoutId="activeNavIndicator"
                            className="absolute bottom-0 left-2 right-2 h-0.5 bg-gold-400 rounded-full shadow-glow"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                      </Link>

                      {/* Dropdown Menu */}
                      {item.children && item.children.length > 0 && (
                        <div
                          className={`absolute top-full left-0 w-60 bg-navy-950/95 backdrop-blur-md border border-navy-800 rounded-b-2xl shadow-2xl py-2 transition-all duration-200 ${
                            activeDropdown === item._id
                              ? 'opacity-100 visible translate-y-0'
                              : 'opacity-0 invisible -translate-y-2'
                          }`}
                        >
                          {item.children.map((sub) => (
                            <Link
                              key={sub._id}
                              to={sub.url}
                              className="block px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-navy-800 hover:text-gold-300 transition-colors border-l-2 border-transparent hover:border-gold-400"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })
              ) : (
                <>
                  {[
                    { label: 'Home', url: '/' },
                    { label: 'About Us', url: '/page/about' },
                    { label: 'Academics', url: '/programmes' },
                    { label: 'Faculty', url: '/faculty' },
                    { label: 'Notices', url: '/notices' },
                    { label: 'Gallery', url: '/gallery' },
                    { label: 'Contact', url: '/contact' },
                  ].map((navLink) => {
                    const isActive = location.pathname === navLink.url;
                    return (
                      <li key={navLink.url} className="relative">
                        <Link
                          to={navLink.url}
                          className={`relative py-3.5 px-4 text-xs font-bold tracking-wider uppercase block transition-colors ${
                            isActive ? 'text-gold-400' : 'text-slate-200 hover:text-gold-300'
                          }`}
                        >
                          <span>{navLink.label}</span>
                          {isActive && (
                            <motion.div
                              layoutId="activeNavIndicator"
                              className="absolute bottom-0 left-2 right-2 h-0.5 bg-gold-400 rounded-full shadow-glow"
                              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden bg-navy-950 border-t border-navy-800 px-5 py-4 max-h-[80vh] overflow-y-auto shadow-2xl"
            >
              <ul className="space-y-1">
                {menuItems && menuItems.length > 0 ? (
                  menuItems.map((item) => (
                    <li key={item._id} className="border-b border-navy-800/80 py-2">
                      <div className="flex justify-between items-center">
                        <Link
                          to={item.url}
                          className="text-xs font-bold uppercase text-slate-200 hover:text-gold-400"
                        >
                          {item.label}
                        </Link>
                        {item.children && item.children.length > 0 && (
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === item._id ? null : item._id)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${
                                activeDropdown === item._id ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {item.children && item.children.length > 0 && activeDropdown === item._id && (
                        <ul className="pl-4 mt-2 space-y-2 border-l border-gold-500/30">
                          {item.children.map((sub) => (
                            <li key={sub._id}>
                              <Link to={sub.url} className="text-xs font-medium text-slate-400 hover:text-gold-300 block py-1">
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="py-2">
                    <Link to="/" className="text-xs font-bold uppercase text-gold-400">Home</Link>
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
