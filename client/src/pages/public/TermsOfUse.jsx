import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck } from 'lucide-react';

const TermsOfUse = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <Helmet>
        <title>Terms of Use | DBATU Lonere</title>
        <meta name="description" content="Official Terms of Use for accessing DBATU Lonere website and online CMS services." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80">
          <div className="flex items-center space-x-3 text-blue-600 mb-4">
            <ShieldCheck className="w-8 h-8" />
            <span className="text-xs font-bold uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Official Governance Document
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms & Conditions of Use
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Last Updated: August 2026 • Dr. Babasaheb Ambedkar Technological University (DBATU)
          </p>

          <hr className="my-8 border-slate-100" />

          <div className="prose prose-slate max-w-none space-y-6 text-slate-700 text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
              <p>
                By accessing and navigating this web portal, students, faculty, staff, and public visitors agree to abide by these Terms of Use and all applicable technological education guidelines governed by DBATU and Maharashtra State Authorities.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">2. Intellectual Property & Notice Dissemination</h2>
              <p>
                All institutional logos, examination timetables, circulars, syllabus structures, and syllabus downloads published on this portal belong exclusively to Dr. Babasaheb Ambedkar Technological University (DBATU). Content may be downloaded strictly for personal, non-commercial academic reference.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">3. Portal Accuracy & Official Verification</h2>
              <p>
                While every effort is made to maintain real-time updates for notices and exam schedules, official college notice boards on campus remain the final legal authority for official announcements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">4. Prohibited Conduct</h2>
              <p>
                Users agree not to attempt unauthorized administrative login, bypass CAPTCHA security challenges, perform automated scraper scraping without permission, or submit malicious data via contact forms.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
