import React, { useState, useEffect } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import API from '../../api/axios';

const CaptchaChallenge = ({ onCaptchaChange }) => {
  const [captchaId, setCaptchaId] = useState('');
  const [question, setQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCaptcha = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/contact/captcha');
      if (res.data.success) {
        setCaptchaId(res.data.captchaId);
        setQuestion(res.data.question);
        setUserAnswer('');
        if (onCaptchaChange) {
          onCaptchaChange({ captchaId: res.data.captchaId, captchaAnswer: '' });
        }
      }
    } catch (err) {
      setError('Could not load security challenge. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setUserAnswer(val);
    if (onCaptchaChange) {
      onCaptchaChange({ captchaId, captchaAnswer: val });
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Security Challenge (Anti-Spam)
        </label>
        <button
          type="button"
          onClick={fetchCaptcha}
          disabled={loading}
          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 transition-colors"
          title="Get new question"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-slate-200 dark:bg-slate-900 px-4 py-2 rounded-lg font-mono font-bold text-slate-800 dark:text-slate-100 text-sm select-none border border-slate-300 dark:border-slate-700 shadow-inner">
          {loading ? 'Loading...' : question || 'Security check'}
        </div>
        <span className="text-slate-500 font-bold">=</span>
        <input
          type="number"
          required
          placeholder="Answer"
          value={userAnswer}
          onChange={handleInputChange}
          className="w-24 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
        />
      </div>
      {error && <p className="text-xs text-rose-500 mt-1.5">{error}</p>}
    </div>
  );
};

export default CaptchaChallenge;
