import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Menu, LogOut, ExternalLink, ShieldCheck, User } from 'lucide-react';

const AdminHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-gold-600" />
          <h1 className="text-sm sm:text-base font-bold font-serif text-navy-900">
            College Control Center
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs text-navy-800 hover:text-maroon-600 font-semibold bg-navy-50 hover:bg-navy-100 px-3 py-1.5 rounded-md border border-navy-200 transition-colors"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <span className="block text-xs font-bold text-slate-800">{user?.name}</span>
            <span className="block text-[10px] text-slate-500 capitalize">{user?.role}</span>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors"
            title="Log out of CMS"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
