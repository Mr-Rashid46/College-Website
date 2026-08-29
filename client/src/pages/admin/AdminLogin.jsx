import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Lock, Mail, ShieldCheck, AlertCircle, Loader2, KeyRound } from 'lucide-react';

const AdminLogin = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid login credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 relative z-10">
        
        {/* Header */}
        <div className="bg-navy-900 text-white p-8 text-center border-b border-navy-800 space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gold-500 text-navy-950 mx-auto flex items-center justify-center shadow-lg font-bold">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-serif text-white">DBATU Technological CMS</h2>
          <p className="text-xs text-gold-300">University Administrative Portal</p>
        </div>

        <div className="p-8 space-y-6">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dbatu.ac.in"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs py-3 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-gold-400" />
                  <span>Log In to Admin Panel</span>
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
