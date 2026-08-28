import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Bell,
  GraduationCap,
  Users,
  Image,
  BookOpen,
  Sliders,
  ShieldCheck,
  Menu,
  Inbox,
  Settings,
  UserCheck,
  Globe,
  ChevronRight,
  ShieldAlert,
  FolderOpen,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useContext(AuthContext);

  const navGroups = [
    {
      title: 'Main Overview',
      items: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Public Site', path: '/', icon: Globe, external: true },
      ],
    },
    {
      title: 'Content Management',
      items: [
        { label: 'Create Pages', path: '/admin/pages', icon: FileText },
        { label: 'Notices & Circulars', path: '/admin/notices', icon: Bell },
        { label: 'Programmes / Courses', path: '/admin/programmes', icon: GraduationCap },
        { label: 'Faculty & Staff', path: '/admin/faculty', icon: Users },
        { label: 'Gallery Albums', path: '/admin/gallery', icon: Image },
        { label: 'Institutional Blogs', path: '/admin/blogs', icon: BookOpen },
        { label: 'Committees', path: '/admin/committees', icon: ShieldCheck },
        { label: 'Chatbot FAQs', path: '/admin/faqs', icon: HelpCircle },
        { label: 'Testimonials & Alumni', path: '/admin/testimonials', icon: MessageSquare },
      ],
    },
    {
      title: 'Site Administration',
      items: [
        { label: 'Menu Builder', path: '/admin/menu', icon: Menu },
        { label: 'Hero Sliders', path: '/admin/sliders', icon: Sliders },
        { label: 'Contact Inquiries', path: '/admin/submissions', icon: Inbox },
        { label: 'Site Settings', path: '/admin/settings', icon: Settings },
      ],
    },
  ];

  if (user?.role === 'superadmin' || user?.role === 'editor') {
    navGroups.push({
      title: 'Security & Assets',
      items: [
        { label: 'Audit Activity Logs', path: '/admin/audit-logs', icon: ShieldAlert },
        { label: 'User Management', path: '/admin/users', icon: UserCheck },
      ],
    });
  }

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-navy-950 text-slate-300 border-r border-navy-800 transition-transform duration-300 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-6 bg-navy-900 border-b border-navy-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gold-500 text-navy-950 flex items-center justify-center font-bold">
            CMS
          </div>
          <div>
            <h2 className="text-sm font-bold font-serif text-white">DBATU Lonere</h2>
            <p className="text-[10px] text-gold-400 uppercase font-semibold">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">
              {group.title}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const IconComp = item.icon;
                if (item.external) {
                  return (
                    <li key={item.path}>
                      <a
                        href={item.path}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-navy-900 hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <IconComp className="w-4 h-4 text-gold-500" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight className="w-3 h-3 opacity-50" />
                      </a>
                    </li>
                  );
                }
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${isActive
                          ? 'bg-navy-800 text-gold-400 font-semibold border-l-4 border-gold-500 shadow'
                          : 'text-slate-400 hover:bg-navy-900 hover:text-slate-200'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComp className="w-4 h-4 text-gold-400" />
                        <span>{item.label}</span>
                      </div>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Admin User Footer */}
      <div className="p-4 bg-navy-900 border-t border-navy-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-maroon-700 text-white flex items-center justify-center font-bold text-xs uppercase">
          {user?.name ? user.name[0] : 'A'}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-xs font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
          <span className="text-[10px] bg-gold-500/20 text-gold-400 px-1.5 py-0.5 rounded font-mono uppercase">
            {user?.role || 'Superadmin'}
          </span>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
