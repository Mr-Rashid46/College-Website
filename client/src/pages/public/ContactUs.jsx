import React, { useState, useContext } from 'react';
import API from '../../api/axios';
import { SiteSettingsContext } from '../../context/SiteSettingsContext';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import CaptchaChallenge from '../../components/common/CaptchaChallenge';

const ContactUs = () => {
  const { settings } = useContext(SiteSettingsContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    captchaId: '',
    captchaAnswer: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptchaChange = ({ captchaId, captchaAnswer }) => {
    setFormData((prev) => ({ ...prev, captchaId, captchaAnswer }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!formData.captchaAnswer) {
      setErrorMsg('Please solve the anti-spam math challenge before submitting.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await API.post('/contact', formData);
      if (res.data.success) {
        setSuccessMsg(res.data.message || 'Thank you! Your message has been received.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '', captchaId: '', captchaAnswer: '' });
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to send message. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        
        {/* Banner */}
        <div className="bg-navy-900 text-white rounded-2xl p-8 shadow-xl border border-navy-800">
          <span className="text-xs font-bold uppercase text-gold-400 tracking-wider">Get In Touch</span>
          <h1 className="text-2xl sm:text-4xl font-bold font-serif text-white mt-1">
            Contact Us & General Enquiries
          </h1>
          <p className="text-xs text-slate-300 mt-2 max-w-2xl">
            Have questions regarding admissions, degree programmes, or transcript verifications? Reach out to our campus office or send us an online message.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Contact Details Card (5 Cols) */}
          <div className="lg:col-span-5 bg-white p-8 rounded-2xl shadow-card border border-slate-200 space-y-6">
            <h3 className="text-lg font-bold font-serif text-navy-900 border-b border-slate-100 pb-3">
              College Campus Address
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center shrink-0 border border-navy-200">
                  <MapPin className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h4 className="font-bold text-navy-900 text-sm">Location</h4>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    {settings?.address || 'Kharkar Alley, Behind District Court, Thane (West), Maharashtra - 400601'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center shrink-0 border border-navy-200">
                  <Phone className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h4 className="font-bold text-navy-900 text-sm">Telephone Numbers</h4>
                  <p className="text-slate-600 mt-0.5">{settings?.phoneNumbers?.join(' / ') || '+91 22 2543 1119'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center shrink-0 border border-navy-200">
                  <Mail className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h4 className="font-bold text-navy-900 text-sm">Official Email</h4>
                  <p className="text-slate-600 mt-0.5">{settings?.emails?.join(' / ') || 'registrar@dbatu.ac.in'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center shrink-0 border border-navy-200">
                  <Clock className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h4 className="font-bold text-navy-900 text-sm">Office Hours</h4>
                  <p className="text-slate-600 mt-0.5">{settings?.workingHours || 'Mon - Sat: 8:00 AM - 5:00 PM'}</p>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="pt-4 border-t border-slate-100">
              <div className="w-full h-56 rounded-xl overflow-hidden border border-slate-200">
                <iframe
                  title="Campus Map"
                  src={settings?.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.175510931215!2d72.97491221490212!3d19.18701835411739!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b8e6ef920f3b%3A0x6b86212879555c82!2sN.K.T.%20College%20of%20Commerce%20%26%20Arts!5e0!3m2!1sen!2sin!4v1680000000000"}
                  className="w-full h-full border-0"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Submission Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl shadow-card border border-slate-200 space-y-6">
            <div>
              <h3 className="text-xl font-bold font-serif text-navy-900">
                Send an Online Inquiry
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Fill in the form below and our administrative office will respond shortly.
              </p>
            </div>

            {successMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="rahul@example.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Admission inquiry for B.Sc. IT"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message *</label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please write your detailed inquiry message here..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
                ></textarea>
              </div>

              {/* Math CAPTCHA Anti-Spam Challenge */}
              <CaptchaChallenge onCaptchaChange={handleCaptchaChange} />

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs py-3 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                    <span>Submitting Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-gold-400" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;
