import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import Modal from '../../components/admin/Modal';
import MediaUploader from '../../components/admin/MediaUploader';
import { Plus, Edit, Trash2, Search, GraduationCap } from 'lucide-react';

const ProgrammesManager = () => {
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    shortCode: '',
    level: 'UG',
    department: '',
    duration: '3 Years',
    seats: 60,
    eligibility: '',
    description: '',
    image: '',
    syllabusFileUrl: '',
    status: 'published',
  });

  const fetchProgrammes = async () => {
    setLoading(true);
    try {
      let url = '/programmes?limit=100';
      if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;
      const res = await API.get(url);
      if (res.data.success) {
        setProgrammes(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch programmes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrammes();
  }, [searchQuery]);

  const handleOpenModal = (p = null) => {
    if (p) {
      setEditingId(p._id);
      setFormData({
        name: p.name,
        shortCode: p.shortCode,
        level: p.level || 'UG',
        department: p.department || '',
        duration: p.duration || '3 Years',
        seats: p.seats || 60,
        eligibility: p.eligibility || '',
        description: p.description || '',
        image: p.image || '',
        syllabusFileUrl: p.syllabusFileUrl || '',
        status: p.status || 'published',
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        shortCode: '',
        level: 'UG',
        department: '',
        duration: '3 Years',
        seats: 60,
        eligibility: '',
        description: '',
        image: '',
        syllabusFileUrl: '',
        status: 'published',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/programmes/${editingId}`, formData);
      } else {
        await API.post('/programmes', formData);
      }
      setIsModalOpen(false);
      fetchProgrammes();
    } catch (err) {
      console.error('Save programme failed:', err);
      alert(err.response?.data?.message || 'Error saving programme');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this programme?')) return;
    try {
      await API.delete(`/programmes/${id}`);
      fetchProgrammes();
    } catch (err) {
      console.error('Delete programme failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold font-serif text-navy-900">Academic Programmes Manager</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage degree courses, eligibility, seats intake, syllabus PDFs, and course descriptions.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow transition-colors"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Add Programme</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search programmes by name or code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 text-xs focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading programmes list...</div>
        ) : programmes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3">Course Name</th>
                  <th className="p-3">Level</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Seats</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {programmes.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-navy-900">
                      {p.name} <span className="text-slate-400">({p.shortCode})</span>
                    </td>
                    <td className="p-3 font-bold text-navy-800">{p.level}</td>
                    <td className="p-3 text-slate-600">{p.department}</td>
                    <td className="p-3 text-slate-600">{p.duration}</td>
                    <td className="p-3 font-mono">{p.seats}</td>
                    <td className="p-3">
                      {p.status === 'published' ? (
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
                        onClick={() => handleOpenModal(p)}
                        className="p-1.5 text-slate-600 hover:text-navy-900 inline-block"
                        title="Edit Programme"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 inline-block"
                        title="Delete Programme"
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
          <div className="p-8 text-center text-xs text-slate-400">No programmes found.</div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Academic Programme' : 'Add Academic Programme'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Programme Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Bachelor of Commerce (B.Com)"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Short Code *</label>
              <input
                type="text"
                required
                value={formData.shortCode}
                onChange={(e) => setFormData({ ...formData, shortCode: e.target.value })}
                placeholder="e.g. BCOM"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Level *</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              >
                <option value="UG">UG (Undergraduate)</option>
                <option value="PG">PG (Postgraduate)</option>
                <option value="Diploma">Diploma</option>
                <option value="Certificate">Certificate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department *</label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Commerce / IT"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Intake Seats</label>
              <input
                type="number"
                value={formData.seats}
                onChange={(e) => setFormData({ ...formData, seats: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="3 Years (6 Semesters)"
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Eligibility Criteria</label>
            <textarea
              rows="2"
              value={formData.eligibility}
              onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
              placeholder="Passed 10+2 HSC Examination..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Programme Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the course..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
            ></textarea>
          </div>

          <MediaUploader
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            label="Course Banner Image"
            accept="image/*"
          />

          <MediaUploader
            value={formData.syllabusFileUrl}
            onChange={(url) => setFormData({ ...formData, syllabusFileUrl: url })}
            label="Syllabus PDF File"
            accept="application/pdf"
          />

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
              Save Programme
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProgrammesManager;
