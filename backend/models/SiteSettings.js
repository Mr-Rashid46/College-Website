const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    collegeName: {
      type: String,
      default: 'Dr. Babasaheb Ambedkar Technological University',
    },
    shortName: {
      type: String,
      default: 'DBATU Lonere',
    },
    tagLine: {
      type: String,
      default: 'Premier State Technological University of Maharashtra | NAAC Accredited & UGC Recognized',
    },
    logoUrl: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: 'DBATU Main Campus, Lonere, Mangaon, Raigad District, Maharashtra - 402103',
    },
    phoneNumbers: [
      {
        type: String,
      },
    ],
    emails: [
      {
        type: String,
      },
    ],
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com/dbatustudent' },
      twitter: { type: String, default: 'https://twitter.com/dbatu_official' },
      instagram: { type: String, default: 'https://instagram.com/dbatu_lonere_official' },
      youtube: { type: String, default: 'https://youtube.com/c/DBATULonereOfficial' },
      linkedin: { type: String, default: 'https://linkedin.com/school/dbatu-lonere' },
    },
    workingHours: {
      type: String,
      default: 'Mon - Sat: 9:30 AM - 5:30 PM',
    },
    visitorCounter: {
      type: Number,
      default: 48920,
    },
    footerText: {
      type: String,
      default: '© 2026 Dr. Babasaheb Ambedkar Technological University (DBATU), Lonere, Raigad, Maharashtra. All Rights Reserved.',
    },
    mapEmbedUrl: {
      type: String,
      default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3790.354124314112!2d73.3134958148873!3d18.17066918485293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be851c1404c0001%3A0xb35a09c2a6321bb4!2sDr.%20Babasaheb%20Ambedkar%20Technological%20University!5e0!3m2!1sen!2sin!4v1680000000000',
    },
    statsCounters: {
      programmesCount: { type: Number, default: 28 },
      departmentsCount: { type: Number, default: 14 },
      studentsCount: { type: Number, default: 12500 },
      facultyCount: { type: Number, default: 340 },
    },
    announcementBanner: {
      enabled: { type: Boolean, default: false },
      text: { type: String, default: ' DBATU CAP Engineering & Pharmacy Merit List 2026-27 Announced!' },
      linkUrl: { type: String, default: '/notices' },
      bgColor: { type: String, default: 'bg-maroon-700' },
    },
    googleAnalyticsId: {
      type: String,
      default: '',
    },
    searchConsoleVerification: {
      type: String,
      default: '',
    },
    smtpSettings: {
      host: { type: String, default: '' },
      port: { type: Number, default: 587 },
      user: { type: String, default: '' },
      pass: { type: String, default: '' },
      fromEmail: { type: String, default: 'no-reply@dbatu.ac.in' },
      adminNotificationEmail: { type: String, default: 'admin@dbatu.ac.in' },
      enabled: { type: Boolean, default: false },
    },
    whatsappWebhookUrl: {
      type: String,
      default: '',
    },
    aboutSummaryText: {
      type: String,
      default: 'Established by the Government of Maharashtra under Act No. XXII of 2014, Dr. Babasaheb Ambedkar Technological University (DBATU), Lonere, Raigad, is Maharashtra\'s premier State Technological University. DBATU fosters excellence in Engineering, Pharmacy, Architecture, and High-Performance Technological Research across its main campus and affiliated institutes statewide.',
    },
    knowledgeBanner: {
      title: { type: String, default: 'Central Knowledge Resource Center' },
      subtitle: { type: String, default: 'Over 1,00,000 technical reference volumes, IEEE Xplore & 24/7 digital E-Journals' },
      imageUrl: { type: String, default: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80' },
    },
    institutionalCells: [
      {
        title: { type: String, default: 'IQAC & Quality Assurance' },
        description: { type: String, default: 'Monitoring continuous improvement & NAAC benchmarks.' },
        icon: { type: String, default: 'ShieldCheck' },
      },
      {
        title: { type: String, default: 'Career Placement Cell' },
        description: { type: String, default: 'Campus drives, soft-skill training & corporate ties.' },
        icon: { type: String, default: 'GraduationCap' },
      },
      {
        title: { type: String, default: 'Research & Innovation Center' },
        description: { type: String, default: 'Faculty research projects, patents & incubation.' },
        icon: { type: String, default: 'Building' },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
