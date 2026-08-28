import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import {
  FileText,
  Bell,
  GraduationCap,
  BookOpen,
  Inbox,
  ArrowRight,
  PlusCircle,
  Eye,
} from 'lucide-react';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    pages: 0,
    notices: 0,
    programmes: 0,
    blogs: 0,
    submissions: 0,
    unreadSubmissions: 0,
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [pagesRes, noticeRes, progRes, blogRes, contactRes] = await Promise.all([
          API.get('/pages?status=published'),
          API.get('/notices?limit=1'),
          API.get('/programmes?limit=1'),
          API.get('/blogs?limit=1'),
          API.get('/contact?limit=5'),
        ]);

        setStats({
          pages: pagesRes.data.total || pagesRes.data.count || 0,
          notices: noticeRes.data.total || noticeRes.data.count || 0,
          programmes: progRes.data.total || progRes.data.count || 0,
          blogs: blogRes.data.total || blogRes.data.count || 0,
          submissions: contactRes.data.total || 0,
          unreadSubmissions: contactRes.data.unreadCount || 0,
        });

        if (contactRes.data.success) {
          setRecentSubmissions(contactRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Active Notices', value: stats.notices, icon: Bell, path: '/admin/notices', color: 'bg-amber-500' },
    { label: 'Academic Programmes', value: stats.programmes, icon: GraduationCap, path: '/admin/programmes', color: 'bg-emerald-500' },
    { label: 'Unread Inquiries', value: stats.unreadSubmissions, icon: Inbox, path: '/admin/submissions', color: 'bg-red-500' },
    { label: 'Institutional Blogs', value: stats.blogs, icon: BookOpen, path: '/admin/blogs', color: 'bg-blue-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-navy-900">System Dashboard Overview</h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor active notices, student inquiries, dynamic pages, and institutional content metrics.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const IconComp = card.icon;
          return (
            <Link
              key={idx}
              to={card.path}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">
                  {card.label}
                </span>
                <span className="text-3xl font-extrabold font-serif text-navy-900">
                  {card.value}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-xl ${card.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                <IconComp className="w-6 h-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-navy-900 text-white rounded-2xl p-6 shadow-xl border border-navy-800 space-y-4">
        <h3 className="text-sm font-bold font-serif text-gold-400 uppercase tracking-wider">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/notices"
            className="bg-maroon-700 hover:bg-maroon-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-gold-400" />
            <span>Create New Notice</span>
          </Link>

          <Link
            to="/admin/pages"
            className="bg-navy-800 hover:bg-navy-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg border border-navy-700 flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-gold-400" />
            <span>Add Static Page</span>
          </Link>

          <Link
            to="/admin/sliders"
            className="bg-navy-800 hover:bg-navy-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg border border-navy-700 flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-gold-400" />
            <span>Manage Hero Banners</span>
          </Link>

          <Link
            to="/admin/settings"
            className="bg-gold-500 hover:bg-gold-600 text-navy-950 text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
          >
            Edit Site Settings
          </Link>
        </div>
      </div>

      {/* Recent Contact Submissions Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold font-serif text-navy-900">
            Recent Contact Submissions
          </h3>
          <Link to="/admin/submissions" className="text-xs font-bold text-navy-800 hover:underline flex items-center gap-1">
            <span>View All Inbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentSubmissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-3">Sender Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Submitted At</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentSubmissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-navy-900">{sub.name}</td>
                    <td className="p-3 text-slate-600">{sub.email}</td>
                    <td className="p-3 text-slate-800 max-w-xs truncate">{sub.subject}</td>
                    <td className="p-3 text-slate-500">
                      {new Date(sub.submittedAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-3">
                      {sub.isRead ? (
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                          READ
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">
                          UNREAD
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            No contact submissions received yet.
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardOverview;
