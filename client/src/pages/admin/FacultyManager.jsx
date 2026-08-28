import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import Modal from '../../components/admin/Modal';
import MediaUploader from '../../components/admin/MediaUploader';
import { Plus, Edit, Trash2, Search, Users } from 'lucide-react';

const FacultyManager = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    department: '',
    photo: '',
    qualification: '',
    email: '',
    type: 'Teaching',
    order: 0,
    status: 'published',
  });

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      let url = '/faculty?limit=100';
      if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;
      const res = await API.get(url);
      if (res.data.success) {
        setFaculty(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch faculty:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, [searchQuery]);

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingId(member._id);
      setFormData({
        name: member.name,
        designation: member.designation,
        department: member.department,
        photo: member.photo || '',
        qualification: member.qualification || '',
        email: member.email || '',
        type: member.type || 'Teaching',
        order: member.order || 0,
        status: member.status || 'published',
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        designation: '',
        department: '',
        photo: '',
        qualification: '',
        email: '',
        type: 'Teaching',
        order: 0,
        status: 'published',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/faculty/${editingId}`, formData);
      } else {
        await API.post('/faculty', formData);
      }
      setIsModalOpen(false);
      fetchFaculty();
    } catch (err) {
      console.error('Save faculty member failed:', err);
      alert(err.response?.data?.message || 'Error saving faculty member');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    try {
      await API.delete(`/faculty/${id}`);
      fetchFaculty();
    } catch (err) {
      console.error('Delete faculty member failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold font-serif text-navy-900">Faculty & Staff Directory Manager</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add and manage teaching professors, coordinators, and administrative officers.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow transition-colors"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search staff by name or designation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 text-xs focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading faculty list...</div>
        ) : faculty.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3">Staff Name</th>
                  <th className="p-3">Designation</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Email</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {faculty.map((f) => (
                  <tr key={f._id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-navy-900 flex items-center gap-2">
                      {f.photo ? (
                        <img src={f.photo} alt={f.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-navy-800 text-gold-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {f.name[0]}
                        </div>
                      )}
                      <span>{f.name}</span>
                    </td>
                    <td className="p-3 text-slate-800">{f.designation}</td>
                    <td className="p-3 text-slate-600">{f.department}</td>
                    <td className="p-3 font-bold text-navy-800">{f.type}</td>
                    <td className="p-3 text-slate-500">{f.email || '—'}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(f)}
                        className="p-1.5 text-slate-600 hover:text-navy-900 inline-block"
                        title="Edit Faculty Member"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(f._id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 inline-block"
                        title="Delete Faculty Member"
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
          <div className="p-8 text-center text-xs text-slate-400">No staff members found.</div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Faculty / Staff Member' : 'Add Faculty / Staff Member'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dr. Sunita K. Wadhwa"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Designation *</label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Vice Principal & HOD"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department *</label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Accountancy"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Staff Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              >
                <option value="Teaching">Teaching Faculty</option>
                <option value="Administrative">Administrative Staff</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Qualifications</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="M.Com, Ph.D, NET"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="awk.academics@dbatu.ac.in"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>
          </div>

          <MediaUploader
            value={formData.photo}
            onChange={(url) => setFormData({ ...formData, photo: url })}
            label="Faculty Profile Photo"
            accept="image/*"
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
              Save Member
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FacultyManager;
