import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import Modal from '../../components/admin/Modal';
import { Inbox, CheckCircle, Mail, Phone, Calendar, Trash2, Eye, FormInput } from 'lucide-react';

const SubmissionsInbox = () => {
  const [activeTab, setActiveTab] = useState('CONTACT'); // 'CONTACT' | 'DYNAMIC_FORMS'
  const [submissions, setSubmissions] = useState([]);
  const [formSubmissions, setFormSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRead, setFilterRead] = useState('ALL');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedFormSub, setSelectedFormSub] = useState(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      if (activeTab === 'CONTACT') {
        let url = '/contact?limit=100';
        if (filterRead === 'UNREAD') url += '&isRead=false';
        if (filterRead === 'READ') url += '&isRead=true';
        const res = await API.get(url);
        if (res.data.success) {
          setSubmissions(res.data.data);
        }
      } else {
        let url = '/forms/submissions?limit=100';
        if (filterRead === 'UNREAD') url += '&isRead=false';
        if (filterRead === 'READ') url += '&isRead=true';
        const res = await API.get(url);
        if (res.data.success) {
          setFormSubmissions(res.data.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [activeTab, filterRead]);

  const handleToggleRead = async (sub) => {
    try {
      if (activeTab === 'CONTACT') {
        await API.put(`/contact/${sub._id}/read`, { isRead: !sub.isRead });
      } else {
        await API.put(`/forms/submissions/${sub._id}/read`, { isRead: !sub.isRead });
      }
      fetchSubmissions();
    } catch (err) {
      console.error('Failed to toggle read status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission entry?')) return;
    try {
      if (activeTab === 'CONTACT') {
        await API.delete(`/contact/${id}`);
        if (selectedSubmission && selectedSubmission._id === id) setSelectedSubmission(null);
      } else {
        await API.delete(`/forms/submissions/${id}`);
        if (selectedFormSub && selectedFormSub._id === id) setSelectedFormSub(null);
      }
      fetchSubmissions();
    } catch (err) {
      console.error('Failed to delete submission:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold font-serif text-navy-900 flex items-center gap-2">
            <Inbox className="w-6 h-6 text-gold-500" />
            <span>Submissions & Forms Inbox</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View student contact inquiries and custom dynamic page form entries (Placement registrations, etc.).
          </p>
        </div>

        {/* Tab Selection & Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-slate-200 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('CONTACT')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'CONTACT' ? 'bg-navy-900 text-gold-400 shadow-sm' : 'text-slate-700'
              }`}
            >
              Contact Messages
            </button>
            <button
              onClick={() => setActiveTab('DYNAMIC_FORMS')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'DYNAMIC_FORMS' ? 'bg-navy-900 text-gold-400 shadow-sm' : 'text-slate-700'
              }`}
            >
              Dynamic Page Forms
            </button>
          </div>

          <div className="flex gap-1">
            {['ALL', 'UNREAD', 'READ'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterRead(f)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  filterRead === f
                    ? 'bg-navy-800 text-gold-400 shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading inbox...</div>
        ) : activeTab === 'CONTACT' ? (
          submissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Status</th>
                    <th className="p-3">Sender Name</th>
                    <th className="p-3">Email & Phone</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Submitted At</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub) => (
                    <tr
                      key={sub._id}
                      className={`hover:bg-slate-50 ${!sub.isRead ? 'bg-amber-50/40 font-semibold' : ''}`}
                    >
                      <td className="p-3">
                        {sub.isRead ? (
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">READ</span>
                        ) : (
                          <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">UNREAD</span>
                        )}
                      </td>
                      <td className="p-3 text-navy-900">{sub.name}</td>
                      <td className="p-3 text-slate-600">
                        <div>{sub.email}</div>
                        {sub.phone && <div className="text-[10px] text-slate-400">{sub.phone}</div>}
                      </td>
                      <td className="p-3 text-slate-800 max-w-xs truncate">{sub.subject}</td>
                      <td className="p-3 text-slate-500">{new Date(sub.submittedAt).toLocaleDateString('en-IN')}</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedSubmission(sub);
                            if (!sub.isRead) handleToggleRead(sub);
                          }}
                          className="p-1.5 text-navy-800 hover:text-maroon-600 inline-block"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(sub._id)} className="p-1.5 text-slate-400 hover:text-red-600 inline-block">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">No contact messages found.</div>
          )
        ) : formSubmissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3">Status</th>
                  <th className="p-3">Form Title</th>
                  <th className="p-3">Page Slug</th>
                  <th className="p-3">Fields Preview</th>
                  <th className="p-3">Submitted At</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {formSubmissions.map((sub) => (
                  <tr key={sub._id} className={`hover:bg-slate-50 ${!sub.isRead ? 'bg-amber-50/40 font-semibold' : ''}`}>
                    <td className="p-3">
                      {sub.isRead ? (
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">READ</span>
                      ) : (
                        <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">UNREAD</span>
                      )}
                    </td>
                    <td className="p-3 font-bold text-navy-900">{sub.formTitle}</td>
                    <td className="p-3 font-mono text-slate-600">/page/{sub.pageSlug}</td>
                    <td className="p-3 text-slate-600 max-w-xs truncate">
                      {sub.formData ? JSON.stringify(sub.formData) : '{}'}
                    </td>
                    <td className="p-3 text-slate-500">{new Date(sub.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedFormSub(sub);
                          if (!sub.isRead) handleToggleRead(sub);
                        }}
                        className="p-1.5 text-navy-800 hover:text-maroon-600 inline-block"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(sub._id)} className="p-1.5 text-slate-400 hover:text-red-600 inline-block">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">No dynamic page form submissions found yet.</div>
        )}
      </div>

      {/* Contact Inquiry Detail Modal */}
      <Modal isOpen={!!selectedSubmission} onClose={() => setSelectedSubmission(null)} title="Contact Inquiry Detail">
        {selectedSubmission && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-bold text-navy-900">{selectedSubmission.name}</h3>
                <span className="text-slate-400 text-[11px]">{new Date(selectedSubmission.submittedAt).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-600">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-gold-600" /> {selectedSubmission.email}</span>
                {selectedSubmission.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-gold-600" /> {selectedSubmission.phone}</span>}
              </div>
            </div>
            <div>
              <span className="font-bold text-navy-900 block mb-1 uppercase text-[10px]">Subject:</span>
              <p className="font-semibold text-slate-800 text-sm">{selectedSubmission.subject}</p>
            </div>
            <div>
              <span className="font-bold text-navy-900 block mb-1 uppercase text-[10px]">Message Content:</span>
              <div className="p-4 bg-white rounded-xl border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedSubmission.message}</div>
            </div>
          </div>
        )}
      </Modal>

      {/* Dynamic Custom Form Submission Detail Modal */}
      <Modal isOpen={!!selectedFormSub} onClose={() => setSelectedFormSub(null)} title="Dynamic Page Form Entry Detail">
        {selectedFormSub && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-navy-950 text-white rounded-xl border border-navy-800 space-y-1">
              <span className="text-gold-400 text-[10px] uppercase font-bold tracking-wider">Page: /page/{selectedFormSub.pageSlug}</span>
              <h3 className="text-base font-bold font-serif text-white">{selectedFormSub.formTitle}</h3>
              <span className="text-slate-400 text-[10px] block">{new Date(selectedFormSub.createdAt).toLocaleString('en-IN')}</span>
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-bold text-navy-900 block uppercase text-[10px] border-b pb-1">Submitted Form Data:</span>
              {selectedFormSub.formData &&
                Object.entries(selectedFormSub.formData).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1.5 border-b border-slate-200/60">
                    <span className="font-bold text-slate-700">{k}:</span>
                    <span className="font-mono text-navy-900">{String(v)}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SubmissionsInbox;
