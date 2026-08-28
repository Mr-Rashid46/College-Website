import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SiteSettingsContext } from '../../context/SiteSettingsContext';
import { MapPin, Phone, Mail, Clock, ExternalLink, Facebook, Twitter, Instagram, Youtube, GraduationCap, ShieldCheck } from 'lucide-react';

const Footer = () => {
  const { settings } = useContext(SiteSettingsContext);

  return (
    <footer className="bg-navy-950 text-slate-300 pt-14 pb-6 border-t-4 border-gold-500">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        
        {/* Col 1: Brand & About */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-navy-800 border border-gold-500 flex items-center justify-center text-gold-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif text-white">
                {settings?.shortName || 'DBATU Lonere'}
              </h2>
              <p className="text-[10px] text-gold-400 font-semibold uppercase tracking-wider">
                Raigad, Maharashtra
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dr. Babasaheb Ambedkar Technological University (DBATU) is the premier State Technological University of Maharashtra, fostering innovation in Engineering, Pharmacy, and Technology.
          </p>
          <div className="flex items-center gap-3 pt-2">
            {settings?.socialLinks?.facebook && (
              <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center text-slate-300 hover:bg-gold-500 hover:text-navy-900 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {settings?.socialLinks?.instagram && (
              <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center text-slate-300 hover:bg-gold-500 hover:text-navy-900 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {settings?.socialLinks?.youtube && (
              <a href={settings.socialLinks.youtube} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center text-slate-300 hover:bg-gold-500 hover:text-navy-900 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            )}
            {settings?.socialLinks?.twitter && (
              <a href={settings.socialLinks.twitter} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center text-slate-300 hover:bg-gold-500 hover:text-navy-900 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-navy-800 pb-2 mb-4 font-serif">
            Quick Navigation
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/page/about" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                <span>›</span> About Institution
              </Link>
            </li>
            <li>
              <Link to="/programmes" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                <span>›</span> Programmes & Courses
              </Link>
            </li>
            <li>
              <Link to="/notices" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                <span>›</span> Examinations & Notices
              </Link>
            </li>
            <li>
              <Link to="/faculty" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                <span>›</span> Faculty Directory
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                <span>›</span> Privacy Policy (DPDP Act)
              </Link>
            </li>
            <li>
              <Link to="/terms-of-use" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                <span>›</span> Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Contact Info */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-navy-800 pb-2 mb-4 font-serif">
            Campus Contact
          </h3>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <span className="text-slate-300 leading-relaxed">
                {settings?.address || 'Kharkar Alley, Behind District Court, Thane (W), Maharashtra - 400601'}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-gold-400 shrink-0" />
              <span>{settings?.phoneNumbers?.join(', ') || '+91 22 2543 1119'}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-gold-400 shrink-0" />
              <span>{settings?.emails?.join(', ') || 'nkttcollege@gmail.com'}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-gold-400 shrink-0" />
              <span>{settings?.workingHours || 'Mon - Sat: 8:00 AM - 5:00 PM'}</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Location Map Preview */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-navy-800 pb-2 mb-4 font-serif">
            Campus Location
          </h3>
          <div className="w-full h-32 rounded-lg overflow-hidden border border-navy-700 relative">
            <iframe
              title="College Location Map"
              src={settings?.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.175510931215!2d72.97491221490212!3d19.18701835411739!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b8e6ef920f3b%3A0x6b86212879555c82!2sN.K.T.%20College%20of%20Commerce%20%26%20Arts!5e0!3m2!1sen!2sin!4v1680000000000"}
              className="w-full h-full border-0"
              loading="lazy"
            ></iframe>
          </div>
          <Link to="/contact" className="mt-3 inline-flex items-center gap-1.5 text-xs text-gold-400 hover:underline">
            <span>View Interactive Google Map</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

      </div>

      {/* Sub Footer / Copyright */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-navy-900 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-3">
        <p>{settings?.footerText || '© 2026 Dr. Babasaheb Ambedkar Technological University (DBATU), Lonere, Raigad. All Rights Reserved.'}</p>
        <div className="flex items-center gap-4">
          <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy</Link>
          <span>•</span>
          <Link to="/terms-of-use" className="hover:text-slate-300 transition-colors">Terms</Link>
          <span>•</span>
          <Link to="/admin/login" className="hover:text-slate-300 transition-colors">Admin Portal</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
