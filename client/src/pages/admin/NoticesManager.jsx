import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import Modal from '../../components/admin/Modal';
import MediaUploader from '../../components/admin/MediaUploader';
import MediaLibraryModal from '../../components/admin/MediaLibraryModal';
import { Plus, Edit, Trash2, Search, Download, Flame, Eye, CheckSquare, Square, Image } from 'lucide-react';

const NoticesManager = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    fileUrl: '',
    category: 'General',
    isFeatured: false,
    status: 'published',
    publishDate: new Date().toISOString().slice(0, 16),
  });

  const fetchNotices = async () => {
    setLoading(true);
    try {
      let url = '/notices?limit=100';
      if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;
      const res = await API.get(url);
      if (res.data.success) {
        setNotices(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch notices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [searchQuery]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(notices.map((n) => n._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;
    const confirmMsg = `Are you sure you want to ${action} ${selectedIds.length} notice(s)?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await API.post('/notices/bulk', { action, ids: selectedIds });
      if (res.data.success) {
        setSelectedIds([]);
        fetchNotices();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Bulk action failed');
    }
  };

  const handleOpenModal = (notice = null) => {
    if (notice) {
      setEditingId(notice._id);
      setFormData({
        title: notice.title,
        fileUrl: notice.fileUrl || '',
        category: notice.category || 'General',
        isFeatured: notice.isFeatured || false,
        status: notice.status || 'published',
        publishDate: notice.publishDate ? new Date(notice.publishDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        fileUrl: '',
        category: 'General',
        isFeatured: false,
        status: 'published',
        publishDate: new Date().toISOString().slice(0, 16),
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/notices/${editingId}`, formData);
      } else {
        await API.post('/notices', formData);
      }
      setIsModalOpen(false);
      fetchNotices();
    } catch (err) {
      console.error('Save notice failed:', err);
      alert(err.response?.data?.message || 'Error saving notice');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await API.delete(`/notices/${id}`);
      fetchNotices();
    } catch (err) {
      console.error('Delete notice failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold font-serif text-navy-900">Notices & Circulars Manager</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Publish official announcements with scheduled publishing, PDF attachments, and bulk operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMediaLibraryOpen(true)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-200"
          >
            <Image className="w-4 h-4 text-blue-600" />
            <span>Media Library</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow transition-colors"
          >
            <Plus className="w-4 h-4 text-gold-400" />
            <span>Publish New Notice</span>
          </button>
        </div>
      </div>

      {/* Bulk Actions & Search Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notices by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 sm:w-64 text-xs focus:outline-none"
          />
        </div>

        {/* Bulk Toolbar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 text-blue-900 px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-100 w-full sm:w-auto justify-between sm:justify-start">
            <span>{selectedIds.length} Selected</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleBulkAction('publish')}
                className="px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded hover:bg-emerald-700"
              >
                Publish All
              </button>
              <button
                onClick={() => handleBulkAction('unpublish')}
                className="px-2 py-1 bg-amber-600 text-white text-[10px] font-bold rounded hover:bg-amber-700"
              >
                Unpublish All
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-2 py-1 bg-rose-600 text-white text-[10px] font-bold rounded hover:bg-rose-700"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading notices list...</div>
        ) : notices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3 w-8 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedIds.length === notices.length && notices.length > 0}
                      className="rounded text-navy-800 focus:ring-0"
                    />
                  </th>
                  <th className="p-3">Notice Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Ticker Flag</th>
                  <th className="p-3">Attachment</th>
                  <th className="p-3">Publish Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notices.map((n) => {
                  const isSelected = selectedIds.includes(n._id);
                  const isScheduledFuture = new Date(n.publishDate) > new Date();

                  return (
                    <tr key={n._id} className={`hover:bg-slate-50 ${isSelected ? 'bg-blue-50/40' : ''}`}>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(n._id)}
                          className="rounded text-navy-800 focus:ring-0"
                        />
                      </td>
                      <td className="p-3 font-semibold text-navy-900 max-w-xs truncate">{n.title}</td>
                      <td className="p-3">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                          {n.category}
                        </span>
                      </td>
                      <td className="p-3">
                        {n.isFeatured ? (
                          <span className="bg-gold-500/20 text-gold-700 font-extrabold text-[10px] px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                            <Flame className="w-3 h-3 text-gold-600" /> Ticker
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Standard</span>
                        )}
                      </td>
                      <td className="p-3">
                        {n.fileUrl ? (
                          <a
                            href={n.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-red-600 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Download className="w-3.5 h-3.5" /> PDF
                          </a>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-500">
                        {new Date(n.publishDate).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                        {isScheduledFuture && (
                          <span className="ml-1 text-[9px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                            Scheduled
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {n.status === 'published' ? (
                          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                            PUBLISHED
                          </span>
                        ) : (
                          <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200">
                            DRAFT
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            setFormData({
                              title: n.title,
                              fileUrl: n.fileUrl || '',
                              category: n.category || 'General',
                              isFeatured: n.isFeatured || false,
                              status: n.status || 'published',
                              publishDate: n.publishDate ? new Date(n.publishDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
                            });
                            setIsPreviewOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 inline-block"
                          title="Preview Notice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenModal(n)}
                          className="p-1.5 text-slate-600 hover:text-navy-900 inline-block"
                          title="Edit Notice"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(n._id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 inline-block"
                          title="Delete Notice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">No notices found.</div>
        )}
      </div>

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={isMediaLibraryOpen}
        onClose={() => setIsMediaLibraryOpen(false)}
        onSelectMedia={(media) => {
          setFormData((prev) => ({ ...prev, fileUrl: media.url }));
        }}
      />

      {/* Live Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Live Notice Preview (Client Mode)"
      >
        <div className="space-y-4 p-2">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
              {formData.category}
            </span>
            <h2 className="text-lg font-bold text-navy-900 mt-2">{formData.title || 'Untitled Notice'}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Scheduled Date: {new Date(formData.publishDate).toLocaleString()}
            </p>
            {formData.fileUrl && (
              <div className="mt-4 pt-3 border-t border-slate-200">
                <a
                  href={formData.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg border border-red-200 transition-colors"
                >
                  <Download className="w-4 h-4" /> Download Attached PDF Document
                </a>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold"
            >
              Close Preview
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit / Publish Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Notice' : 'Publish New Notice'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Title *</label>
            <textarea
              required
              rows="2"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. First Year UG Admission Online Merit List 2026-27 Announced"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              >
                <option value="Admission">Admission</option>
                <option value="Exam">Exam</option>
                <option value="General">General</option>
                <option value="Circular">Circular</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Publish Date & Time *</label>
              <input
                type="datetime-local"
                value={formData.publishDate}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">Notice Attachment (PDF / Image)</label>
              <button
                type="button"
                onClick={() => setIsMediaLibraryOpen(true)}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                <Image className="w-3.5 h-3.5" /> Choose from Media Library
              </button>
            </div>
            <MediaUploader
              value={formData.fileUrl}
              onChange={(url) => setFormData({ ...formData, fileUrl: url })}
              label=""
              accept="application/pdf,image/*"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 text-navy-800 rounded focus:ring-0"
            />
            <label htmlFor="isFeatured" className="text-xs font-semibold text-slate-800">
              Display in Homepage Ticker / Featured Section
            </label>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1"
            >
              <Eye className="w-4 h-4" /> Live Preview
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-xs font-bold text-white bg-navy-800 hover:bg-navy-900 rounded-lg shadow"
              >
                Save Notice
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NoticesManager;
