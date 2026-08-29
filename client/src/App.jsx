import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import CookieConsent from './components/common/CookieConsent';

// Public Pages
import Home from './pages/public/Home';
import DynamicPage from './pages/public/DynamicPage';
import ProgrammeList from './pages/public/ProgrammeList';
import ProgrammeDetail from './pages/public/ProgrammeDetail';
import FacultyDirectory from './pages/public/FacultyDirectory';
import NoticeBoard from './pages/public/NoticeBoard';
import Gallery from './pages/public/Gallery';
import BlogList from './pages/public/BlogList';
import BlogDetail from './pages/public/BlogDetail';
import CommitteesPage from './pages/public/CommitteesPage';
import ContactUs from './pages/public/ContactUs';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsOfUse from './pages/public/TermsOfUse';
import NotFoundPage from './pages/public/NotFoundPage';

// Admin Pages & Layout
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import PagesManager from './pages/admin/PagesManager';
import NoticesManager from './pages/admin/NoticesManager';
import ProgrammesManager from './pages/admin/ProgrammesManager';
import FacultyManager from './pages/admin/FacultyManager';
import GalleryManager from './pages/admin/GalleryManager';
import BlogManager from './pages/admin/BlogManager';
import SliderManager from './pages/admin/SliderManager';
import CommitteeManager from './pages/admin/CommitteeManager';
import MenuManager from './pages/admin/MenuManager';
import SubmissionsInbox from './pages/admin/SubmissionsInbox';
import SettingsManager from './pages/admin/SettingsManager';
import UserManagement from './pages/admin/UserManagement';
import AuditLogManager from './pages/admin/AuditLogManager';
import FaqManager from './pages/admin/FaqManager';
import TestimonialManager from './pages/admin/TestimonialManager';

// Layout wrapper for Public Pages
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Public College Website Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/page/:slug" element={<DynamicPage />} />
        <Route path="/programmes" element={<ProgrammeList />} />
        <Route path="/programmes/:id" element={<ProgrammeDetail />} />
        <Route path="/faculty" element={<FacultyDirectory />} />
        <Route path="/notices" element={<NoticeBoard />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />
        <Route path="/committees" element={<CommitteesPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/:slug" element={<DynamicPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Login Route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Panel Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardOverview />} />
        <Route path="dashboard" element={<DashboardOverview />} />
        <Route path="pages" element={<PagesManager />} />
        <Route path="notices" element={<NoticesManager />} />
        <Route path="programmes" element={<ProgrammesManager />} />
        <Route path="faculty" element={<FacultyManager />} />
        <Route path="gallery" element={<GalleryManager />} />
        <Route path="blogs" element={<BlogManager />} />
        <Route path="sliders" element={<SliderManager />} />
        <Route path="committees" element={<CommitteeManager />} />
        <Route path="menu" element={<MenuManager />} />
        <Route path="submissions" element={<SubmissionsInbox />} />
        <Route path="settings" element={<SettingsManager />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="audit-logs" element={<AuditLogManager />} />
        <Route path="faqs" element={<FaqManager />} />
        <Route path="testimonials" element={<TestimonialManager />} />
      </Route>
    </Routes>
  );
}

export default App;
