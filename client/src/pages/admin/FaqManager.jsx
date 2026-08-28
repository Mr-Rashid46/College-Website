import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import Modal from '../../components/admin/Modal';
import { Plus, Edit, Trash2, HelpCircle, Search, CheckCircle, XCircle } from 'lucide-react';

const CATEGORIES = ['General', 'Admission', 'Courses', 'Exams', 'Fees', 'Facilities'];

const FaqManager = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    keywords: '',
    category: 'General',
    order: 0,
    isActive: true,
  });

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await API.get('/faqs?status=all');
      if (res.data.success) {
        setFaqs(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setFormData({
        question: item.question || '',
        answer: item.answer || '',
        keywords: item.keywords ? item.keywords.join(', ') : '',
        category: item.category || 'General',
        order: item.order || 0,
        isActive: item.isActive !== undefined ? item.isActive : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        question: '',
        answer: '',
        keywords: '',
        category: 'General',
        order: 0,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const keywordsArray = formData.keywords
        .split(',')
        .map((k) => k.trim().toLowerCase())
        .filter((k) => k.length > 0);

      const payload = {
        ...formData,
        keywords: keywordsArray,
        order: Number(formData.order) || 0,
      };

      if (editingId) {
        await API.put(`/faqs/${editingId}`, payload);
      } else {
        await API.post('/faqs', payload);
      }
      setIsModalOpen(false);
      fetchFaqs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save FAQ');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ item?')) return;
    try {
      await API.delete(`/faqs/${id}`);
      fetchFaqs();
    } catch (err) {
      alert('Failed to delete FAQ');
    }
  };

  const filteredFaqs = faqs.filter((item) => {
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesQ =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.keywords && item.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesQ;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <h1 className="text-xl font-bold font-serif text-navy-900 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-gold-500" />
            <span>Chatbot FAQ Manager</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage Virtual Assistant FAQs, admission queries, keyword triggers, and instant answers.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-navy-900 hover:bg-navy-800 text-gold-400 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search FAQs by question or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Category:</span>
          {['ALL', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-navy-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Table / List */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 animate-pulse">Loading FAQs...</div>
        ) : filteredFaqs.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredFaqs.map((f) => (
              <div key={f._id} className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-navy-100 text-navy-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                      {f.category}
                    </span>
                    {f.isActive ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
                        <XCircle className="w-3.5 h-3.5" /> Inactive
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-navy-900 leading-snug">{f.question}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 font-normal">
                    {f.answer}
                  </p>

                  {f.keywords && f.keywords.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">Triggers:</span>
                      {f.keywords.map((k, idx) => (
                        <span key={idx} className="bg-slate-200/70 text-slate-700 text-[10px] px-2 py-0.5 rounded-md font-mono">
                          {k}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleOpenModal(f)}
                    className="p-2 text-slate-600 hover:text-navy-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    title="Edit FAQ"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(f._id)}
                    className="p-2 text-slate-400 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-400">No FAQ entries match your filters.</div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Chatbot FAQ' : 'Add New Chatbot FAQ'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">User Question / Topic *</label>
            <input
              type="text"
              required
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="e.g. How do I apply for B.Tech CAP counseling?"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assistant Answer Response *</label>
            <textarea
              rows={3}
              required
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Provide clear, concise answer text shown by the chatbot..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Keyword Triggers (Comma Separated)
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              placeholder="e.g. admission, cap, cet, apply, merit"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              When a student's message contains any of these words, the assistant triggers this response.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isActiveFaq"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-navy-900 rounded border-slate-300"
              />
              <label htmlFor="isActiveFaq" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Active in Chatbot
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-navy-900 hover:bg-navy-800 text-gold-400 rounded-lg shadow-sm"
            >
              {editingId ? 'Update FAQ' : 'Save FAQ'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FaqManager;
