import React, { useState, useEffect, useContext } from 'react';
import API from '../../api/axios';
import MediaUploader from '../../components/admin/MediaUploader';
import { SiteSettingsContext } from '../../context/SiteSettingsContext';
import { Settings, Save, CheckCircle2, Loader2, Globe, Mail, ShieldAlert, BarChart3, BellRing, Phone } from 'lucide-react';

const SettingsManager = () => {
  const { refreshSettings } = useContext(SiteSettingsContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    collegeName: '',
    shortName: '',
    tagLine: '',
    logoUrl: '',
    address: '',
    phoneNumbersStr: '',
    emailsStr: '',
    workingHours: '',
    visitorCounter: 12500,
    footerText: '',
    mapEmbedUrl: '',
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    linkedin: '',
    programmesCount: 16,
    departmentsCount: 10,
    studentsCount: 4200,
    facultyCount: 78,
    // Announcement Banner
    bannerEnabled: false,
    bannerText: '',
    bannerLinkUrl: '',
    // SEO & Analytics
    googleAnalyticsId: '',
    searchConsoleVerification: '',
    // SMTP Email
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: '',
    smtpFromEmail: '',
    smtpAdminEmail: '',
    smtpEnabled: false,
    // WhatsApp/SMS
    whatsappWebhookUrl: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get('/settings?incVisitor=false');
        if (res.data.success && res.data.data) {
          const s = res.data.data;
          setFormData({
            collegeName: s.collegeName || '',
            shortName: s.shortName || '',
            tagLine: s.tagLine || '',
            logoUrl: s.logoUrl || '',
            address: s.address || '',
            phoneNumbersStr: s.phoneNumbers ? s.phoneNumbers.join(', ') : '',
            emailsStr: s.emails ? s.emails.join(', ') : '',
            workingHours: s.workingHours || '',
            visitorCounter: s.visitorCounter || 12500,
            footerText: s.footerText || '',
            mapEmbedUrl: s.mapEmbedUrl || '',
            facebook: s.socialLinks?.facebook || '',
            twitter: s.socialLinks?.twitter || '',
            instagram: s.socialLinks?.instagram || '',
            youtube: s.socialLinks?.youtube || '',
            linkedin: s.socialLinks?.linkedin || '',
            programmesCount: s.statsCounters?.programmesCount || 16,
            departmentsCount: s.statsCounters?.departmentsCount || 10,
            studentsCount: s.statsCounters?.studentsCount || 4200,
            facultyCount: s.statsCounters?.facultyCount || 78,
            // Announcement Banner
            bannerEnabled: s.announcementBanner?.enabled || false,
            bannerText: s.announcementBanner?.text || '',
            bannerLinkUrl: s.announcementBanner?.linkUrl || '',
            // SEO
            googleAnalyticsId: s.googleAnalyticsId || '',
            searchConsoleVerification: s.searchConsoleVerification || '',
            // SMTP
            smtpHost: s.smtpSettings?.host || '',
            smtpPort: s.smtpSettings?.port || 587,
            smtpUser: s.smtpSettings?.user || '',
            smtpPass: s.smtpSettings?.pass || '',
            smtpFromEmail: s.smtpSettings?.fromEmail || 'no-reply@dbatu.ac.in',
            smtpAdminEmail: s.smtpSettings?.adminNotificationEmail || 'admin@dbatu.ac.in',
            smtpEnabled: s.smtpSettings?.enabled || false,
            // Webhook & Homepage
            whatsappWebhookUrl: s.whatsappWebhookUrl || '',
            aboutSummaryText: s.aboutSummaryText || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch site settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      const payload = {
        collegeName: formData.collegeName,
        shortName: formData.shortName,
        tagLine: formData.tagLine,
        logoUrl: formData.logoUrl,
        address: formData.address,
        phoneNumbers: formData.phoneNumbersStr.split(',').map((p) => p.trim()).filter((p) => p !== ''),
        emails: formData.emailsStr.split(',').map((e) => e.trim()).filter((e) => e !== ''),
        workingHours: formData.workingHours,
        visitorCounter: Number(formData.visitorCounter),
        footerText: formData.footerText,
        mapEmbedUrl: formData.mapEmbedUrl,
        socialLinks: {
          facebook: formData.facebook,
          twitter: formData.twitter,
          instagram: formData.instagram,
          youtube: formData.youtube,
          linkedin: formData.linkedin,
        },
        statsCounters: {
          programmesCount: Number(formData.programmesCount),
          departmentsCount: Number(formData.departmentsCount),
          studentsCount: Number(formData.studentsCount),
          facultyCount: Number(formData.facultyCount),
        },
        announcementBanner: {
          enabled: formData.bannerEnabled,
          text: formData.bannerText,
          linkUrl: formData.bannerLinkUrl,
        },
        googleAnalyticsId: formData.googleAnalyticsId,
        searchConsoleVerification: formData.searchConsoleVerification,
        smtpSettings: {
          host: formData.smtpHost,
          port: Number(formData.smtpPort),
          user: formData.smtpUser,
          pass: formData.smtpPass,
          fromEmail: formData.smtpFromEmail,
          adminNotificationEmail: formData.smtpAdminEmail,
          enabled: formData.smtpEnabled,
        },
        whatsappWebhookUrl: formData.whatsappWebhookUrl,
        aboutSummaryText: formData.aboutSummaryText,
      };

      const res = await API.put('/settings', payload);
      if (res.data.success) {
        setSuccessMsg('Global Site Settings saved & updated live!');
        await refreshSettings();
      }
    } catch (err) {
      console.error('Save site settings failed:', err);
      alert(err.response?.data?.message || 'Error saving site settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading site settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-bold font-serif text-navy-900">Site Settings Control Panel</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure institutional brand details, campus contact info, announcement alert bars, SEO analytics, and SMTP email services.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-card space-y-8">
        
        {/* Section 1: Branding */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold font-serif text-navy-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" /> 1. Institutional Branding & Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full College Name *</label>
              <input
                type="text"
                required
                value={formData.collegeName}
                onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Short Brand Name</label>
              <input
                type="text"
                value={formData.shortName}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline / NAAC Accreditation Statement</label>
            <input
              type="text"
              value={formData.tagLine}
              onChange={(e) => setFormData({ ...formData, tagLine: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
            />
          </div>

          <MediaUploader
            value={formData.logoUrl}
            onChange={(url) => setFormData({ ...formData, logoUrl: url })}
            label="College Emblem Logo Image"
            accept="image/*"
          />
        </div>

        {/* Section 2: Contact Info */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold font-serif text-navy-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-600" /> 2. Campus Contact Details
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Address *</label>
            <textarea
              rows="2"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Numbers (Comma-separated)</label>
              <input
                type="text"
                value={formData.phoneNumbersStr}
                onChange={(e) => setFormData({ ...formData, phoneNumbersStr: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Addresses (Comma-separated)</label>
              <input
                type="text"
                value={formData.emailsStr}
                onChange={(e) => setFormData({ ...formData, emailsStr: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Working Hours</label>
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Visitor Counter Baseline</label>
              <input
                type="number"
                value={formData.visitorCounter}
                onChange={(e) => setFormData({ ...formData, visitorCounter: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Google Maps Embed iframe URL</label>
            <input
              type="text"
              value={formData.mapEmbedUrl}
              onChange={(e) => setFormData({ ...formData, mapEmbedUrl: e.target.value })}
              className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
            />
          </div>
        </div>

        {/* Section 3: Announcement Alert Banner */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold font-serif text-navy-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <BellRing className="w-4 h-4 text-amber-600" /> 3. Top Announcement Alert Banner
          </h3>

          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="bannerEnabled"
              checked={formData.bannerEnabled}
              onChange={(e) => setFormData({ ...formData, bannerEnabled: e.target.checked })}
              className="w-4 h-4 text-navy-800 rounded focus:ring-0"
            />
            <label htmlFor="bannerEnabled" className="text-xs font-bold text-slate-800">
              Display Announcement Alert Bar at Top of Website
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Announcement Message Text</label>
              <input
                type="text"
                placeholder="e.g. Admissions 2026-27 Merit List & Counseling Schedule Released!"
                value={formData.bannerText}
                onChange={(e) => setFormData({ ...formData, bannerText: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Link URL</label>
              <input
                type="text"
                placeholder="/notices or /page/admissions"
                value={formData.bannerLinkUrl}
                onChange={(e) => setFormData({ ...formData, bannerLinkUrl: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: SEO & Web Analytics */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold font-serif text-navy-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600" /> 4. SEO & Search Engine Analytics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Google Analytics Measurement ID (GA4)</label>
              <input
                type="text"
                placeholder="e.g. G-XXXXXXXXXX"
                value={formData.googleAnalyticsId}
                onChange={(e) => setFormData({ ...formData, googleAnalyticsId: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Google Search Console Verification Code</label>
              <input
                type="text"
                placeholder="Meta tag content string"
                value={formData.searchConsoleVerification}
                onChange={(e) => setFormData({ ...formData, searchConsoleVerification: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Email SMTP Integration */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold font-serif text-navy-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-600" /> 5. Automated Email SMTP Server Settings
          </h3>

          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="smtpEnabled"
              checked={formData.smtpEnabled}
              onChange={(e) => setFormData({ ...formData, smtpEnabled: e.target.checked })}
              className="w-4 h-4 text-navy-800 rounded focus:ring-0"
            />
            <label htmlFor="smtpEnabled" className="text-xs font-bold text-slate-800">
              Enable Automatic Email Dispatch (Contact Form Alerts & Auto-Replies)
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">SMTP Host Server</label>
              <input
                type="text"
                placeholder="smtp.gmail.com or smtp.mailtrap.io"
                value={formData.smtpHost}
                onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">SMTP Port</label>
              <input
                type="number"
                placeholder="587 or 465"
                value={formData.smtpPort}
                onChange={(e) => setFormData({ ...formData, smtpPort: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sender Email Address</label>
              <input
                type="email"
                placeholder="no-reply@dbatu.ac.in"
                value={formData.smtpFromEmail}
                onChange={(e) => setFormData({ ...formData, smtpFromEmail: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">SMTP Username / Email</label>
              <input
                type="text"
                value={formData.smtpUser}
                onChange={(e) => setFormData({ ...formData, smtpUser: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">SMTP Password / App Key</label>
              <input
                type="password"
                value={formData.smtpPass}
                onChange={(e) => setFormData({ ...formData, smtpPass: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Recipient Email (For Inquiry Alerts)</label>
            <input
              type="email"
              placeholder="admin@dbatu.ac.in"
              value={formData.smtpAdminEmail}
              onChange={(e) => setFormData({ ...formData, smtpAdminEmail: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
            />
          </div>
        </div>

        {/* Section 6: Emergency WhatsApp / SMS Webhook */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold font-serif text-navy-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" /> 6. SMS / WhatsApp Alert Webhook Integration
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp / SMS API Webhook URL</label>
            <input
              type="text"
              placeholder="https://api.twilio.com/v1/... or https://api.gupshup.io/..."
              value={formData.whatsappWebhookUrl}
              onChange={(e) => setFormData({ ...formData, whatsappWebhookUrl: e.target.value })}
              className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none"
            />
          </div>
        </div>

        {/* Section 7: Social Links */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold font-serif text-navy-900 border-b border-slate-100 pb-2">
            7. Social Media Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline / Sub-heading</label>
              <input
                type="text"
                value={formData.tagLine}
                onChange={(e) => setFormData({ ...formData, tagLine: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Homepage About Summary Paragraph</label>
              <textarea
                rows={3}
                value={formData.aboutSummaryText}
                onChange={(e) => setFormData({ ...formData, aboutSummaryText: e.target.value })}
                placeholder="Write the institutional introduction paragraph displayed on the homepage..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Facebook URL</label>
              <input
                type="text"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Instagram URL</label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>
          </div>
        </div>

        {/* Section 8: Stats Counters */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold font-serif text-navy-900 border-b border-slate-100 pb-2">
            8. Homepage Key Metrics Counters
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Programmes</label>
              <input
                type="number"
                value={formData.programmesCount}
                onChange={(e) => setFormData({ ...formData, programmesCount: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Departments</label>
              <input
                type="number"
                value={formData.departmentsCount}
                onChange={(e) => setFormData({ ...formData, departmentsCount: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Students</label>
              <input
                type="number"
                value={formData.studentsCount}
                onChange={(e) => setFormData({ ...formData, studentsCount: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty</label>
              <input
                type="number"
                value={formData.facultyCount}
                onChange={(e) => setFormData({ ...formData, facultyCount: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 9: Footer Copyright */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold font-serif text-navy-900 border-b border-slate-100 pb-2">
            9. Footer Copyright Text
          </h3>

          <div>
            <textarea
              rows="2"
              value={formData.footerText}
              onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs px-8 py-3 rounded-lg shadow-md transition-colors flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                <span>Saving Settings...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-gold-400" />
                <span>Save Site Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsManager;
