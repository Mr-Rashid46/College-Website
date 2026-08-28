import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import Modal from '../../components/admin/Modal';
import MediaUploader from '../../components/admin/MediaUploader';
import { Plus, Edit, Trash2, Image as ImageIcon, PlusCircle } from 'lucide-react';

const GalleryManager = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Event',
    date: new Date().toISOString().split('T')[0],
    images: [{ url: '', caption: '' }],
    status: 'published',
  });

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const res = await API.get('/gallery?limit=100');
      if (res.data.success) {
        setAlbums(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch gallery albums:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleOpenModal = (album = null) => {
    if (album) {
      setEditingId(album._id);
      setFormData({
        title: album.title,
        category: album.category || 'Event',
        date: album.date ? new Date(album.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        images: album.images && album.images.length > 0 ? album.images : [{ url: '', caption: '' }],
        status: album.status || 'published',
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        category: 'Event',
        date: new Date().toISOString().split('T')[0],
        images: [{ url: '', caption: '' }],
        status: 'published',
      });
    }
    setIsModalOpen(true);
  };

  const handleAddImageRow = () => {
    setFormData({
      ...formData,
      images: [...formData.images, { url: '', caption: '' }],
    });
  };

  const handleRemoveImageRow = (index) => {
    const updated = formData.images.filter((_, idx) => idx !== index);
    setFormData({ ...formData, images: updated });
  };

  const handleImageChange = (index, field, val) => {
    const updated = [...formData.images];
    updated[index][field] = val;
    setFormData({ ...formData, images: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanedImages = formData.images.filter((img) => img.url.trim() !== '');
      const payload = { ...formData, images: cleanedImages };

      if (editingId) {
        await API.put(`/gallery/${editingId}`, payload);
      } else {
        await API.post('/gallery', payload);
      }
      setIsModalOpen(false);
      fetchAlbums();
    } catch (err) {
      console.error('Save album failed:', err);
      alert(err.response?.data?.message || 'Error saving album');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photo album?')) return;
    try {
      await API.delete(`/gallery/${id}`);
      fetchAlbums();
    } catch (err) {
      console.error('Delete album failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold font-serif text-navy-900">Gallery Albums Manager</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create photo albums for Convocation, Sports meets, Cultural fests & Campus infrastructure.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow transition-colors"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Create New Album</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading gallery albums...</div>
        ) : albums.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3">Album Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Images Count</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 font-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {albums.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-navy-900">{a.title}</td>
                    <td className="p-3 font-bold text-navy-800">{a.category}</td>
                    <td className="p-3 font-mono">{a.images?.length || 0} Photos</td>
                    <td className="p-3 text-slate-500">
                      {new Date(a.date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(a)}
                        className="p-1.5 text-slate-600 hover:text-navy-900 inline-block"
                        title="Edit Album"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(a._id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 inline-block"
                        title="Delete Album"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">No gallery albums created.</div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Gallery Album' : 'Create Gallery Album'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Album Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. 34th Annual Convocation 2026"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              >
                <option value="Event">Event</option>
                <option value="Sports">Sports</option>
                <option value="Cultural">Cultural</option>
                <option value="Campus">Campus</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Event Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
            />
          </div>

          {/* Dynamic Images list */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase text-navy-900">Album Photos</label>
              <button
                type="button"
                onClick={handleAddImageRow}
                className="text-xs text-navy-800 hover:text-maroon-600 font-semibold flex items-center gap-1"
              >
                <PlusCircle className="w-4 h-4" /> Add Photo
              </button>
            </div>

            {formData.images.map((img, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <MediaUploader
                  value={img.url}
                  onChange={(url) => handleImageChange(idx, 'url', url)}
                  label={`Photo #${idx + 1}`}
                  accept="image/*"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Caption (e.g. Chief Guest addressing students)"
                    value={img.caption}
                    onChange={(e) => handleImageChange(idx, 'caption', e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded"
                  />
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImageRow(idx)}
                      className="text-xs font-bold text-red-600 p-1 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
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
              Save Album
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GalleryManager;
