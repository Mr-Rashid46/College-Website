import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import Modal from '../../components/admin/Modal';
import MediaUploader from '../../components/admin/MediaUploader';
import { Plus, Edit, Trash2, Sliders, CheckCircle, XCircle } from 'lucide-react';

const SliderManager = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    image: '',
    title: '',
    subtitle: '',
    linkUrl: '',
    order: 0,
    isActive: true,
  });

  const fetchSliders = async () => {
    setLoading(true);
    try {
      const res = await API.get('/sliders?status=all');
      if (res.data.success) {
        setSliders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch sliders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleOpenModal = (s = null) => {
    if (s) {
      setEditingId(s._id);
      setFormData({
        image: s.image || '',
        title: s.title || '',
        subtitle: s.subtitle || '',
        linkUrl: s.linkUrl || '',
        order: s.order || 0,
        isActive: s.isActive !== undefined ? s.isActive : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        image: '',
        title: '',
        subtitle: '',
        linkUrl: '',
        order: 0,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      alert('Please upload a hero banner image');
      return;
    }
    try {
      if (editingId) {
        await API.put(`/sliders/${editingId}`, formData);
      } else {
        await API.post('/sliders', formData);
      }
      setIsModalOpen(false);
      fetchSliders();
    } catch (err) {
      console.error('Save slider failed:', err);
      alert(err.response?.data?.message || 'Error saving slider banner');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hero banner?')) return;
    try {
      await API.delete(`/sliders/${id}`);
      fetchSliders();
    } catch (err) {
      console.error('Delete slider failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold font-serif text-navy-900">Hero Slider Manager</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload, reorder, and activate/deactivate homepage hero carousel banners.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow transition-colors"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Add Hero Banner</span>
        </button>
      </div>

      {/* Grid of Banners */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading slider banners...</div>
      ) : sliders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sliders.map((s) => (
            <div key={s._id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-card flex flex-col justify-between">
              <div className="h-48 w-full bg-slate-100 relative">
                <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-navy-900/80 backdrop-blur text-gold-400 font-bold text-xs px-2.5 py-1 rounded">
                  Order: #{s.order}
                </span>
                <span
                  className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded uppercase ${
                    s.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                  }`}
                >
                  {s.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-base font-bold font-serif text-navy-900">{s.title || 'Untitled Banner'}</h3>
                {s.subtitle && <p className="text-xs text-slate-600 line-clamp-2">{s.subtitle}</p>}
                {s.linkUrl && <p className="text-[11px] font-mono text-slate-400">Link: {s.linkUrl}</p>}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => handleOpenModal(s)}
                  className="px-3 py-1.5 text-xs font-semibold text-navy-800 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-white border border-slate-200 hover:bg-red-50 rounded-lg flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl text-center border border-slate-200 text-slate-400 text-xs">
          No hero slider banners configured yet.
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Hero Banner' : 'Add Hero Banner'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <MediaUploader
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            label="Hero Banner Image (High Quality 1600x600 recommended) *"
            accept="image/*"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Banner Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Welcome to Dr. Babasaheb Ambedkar Technological University"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subtitle / Tagline</label>
            <textarea
              rows="2"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="e.g. Admissions Open Academic Year 2026-27"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Link URL (Optional)</label>
              <input
                type="text"
                value={formData.linkUrl}
                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                placeholder="/programmes or /page/about"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-navy-800 rounded"
            />
            <label htmlFor="isActive" className="text-xs font-semibold text-slate-800">
              Active Banner (Visible on Homepage Carousel)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
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
              Save Hero Banner
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SliderManager;
