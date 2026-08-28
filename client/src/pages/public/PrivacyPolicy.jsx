import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Lock, FileText, Eye } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <Helmet>
        <title>Privacy Policy & Data Protection | DBATU Lonere</title>
        <meta name="description" content="Privacy policy and personal data protection principles under the Digital Personal Data Protection Act for DBATU Lonere." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80">
          <div className="flex items-center space-x-3 text-blue-600 mb-4">
            <ShieldCheck className="w-8 h-8" />
            <span className="text-xs font-bold uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              DPDP Act 2023 Compliant
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy & Data Protection Notice
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Last Updated: August 2026 • Dr. Babasaheb Ambedkar Technological University (DBATU)
          </p>

          <hr className="my-8 border-slate-100" />

          <div className="prose prose-slate max-w-none space-y-6 text-slate-700 text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" /> 1. Data Collection & Purpose
              </h2>
              <p>
                Dr. Babasaheb Ambedkar Technological University (DBATU), Lonere, collects personal data provided voluntarily through our contact forms, admission enquiry portals, and newsletter subscriptions (such as student/parent full name, email address, contact numbers, and academic queries).
              </p>
              <p>
                All data collected is strictly processed for legitimate educational administrative purposes, addressing student admissions, examination notices, and responding to enquiries.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" /> 2. Compliance with DPDP Act 2023 (India)
              </h2>
              <p>
                In accordance with India's Digital Personal Data Protection (DPDP) Act 2023:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>We process personal data lawfully and only after receiving user consent or for legitimate educational uses.</li>
                <li>Data subjects have the right to request access, correction, or deletion of their submitted personal information.</li>
                <li>We do not sell, rent, or share personal data with third-party advertising vendors.</li>
                <li>Data security protocols, including encryption in transit and access controls, safeguard stored records.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" /> 3. Cookies & Analytics
              </h2>
              <p>
                Our portal utilizes essential technical cookies for session maintenance, security challenge validation, and user preference storage. Anonymous web analytics help us optimize portal speed and accessibility.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">4. Contact Data Fiduciary Officer</h2>
              <p>
                For data privacy requests, corrections, or grievances, please contact our Data Protection Officer at:
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs space-y-1">
                <p><strong>Email:</strong> registrar@dbatu.ac.in</p>
                <p><strong>Address:</strong> DBATU Main Campus, Lonere, Mangaon, Raigad - 402103</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
