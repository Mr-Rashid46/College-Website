import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import Modal from '../../components/admin/Modal';
import { Plus, Edit, Trash2, ShieldCheck, PlusCircle } from 'lucide-react';

const CommitteeManager = () => {
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Statutory',
    description: '',
    membersList: [{ name: '', role: '' }],
    status: 'published',
  });

  const fetchCommittees = async () => {
    setLoading(true);
    try {
      const res = await API.get('/committees');
      if (res.data.success) {
        setCommittees(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch committees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommittees();
  }, []);

  const handleOpenModal = (com = null) => {
    if (com) {
      setEditingId(com._id);
      setFormData({
        name: com.name,
        type: com.type || 'Statutory',
        description: com.description || '',
        membersList: com.membersList && com.membersList.length > 0 ? com.membersList : [{ name: '', role: '' }],
        status: com.status || 'published',
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        type: 'Statutory',
        description: '',
        membersList: [{ name: '', role: '' }],
        status: 'published',
      });
    }
    setIsModalOpen(true);
  };

  const handleAddMemberRow = () => {
    setFormData({
      ...formData,
      membersList: [...formData.membersList, { name: '', role: '' }],
    });
  };

  const handleRemoveMemberRow = (index) => {
    const updated = formData.membersList.filter((_, idx) => idx !== index);
    setFormData({ ...formData, membersList: updated });
  };

  const handleMemberChange = (index, field, val) => {
    const updated = [...formData.membersList];
    updated[index][field] = val;
    setFormData({ ...formData, membersList: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanedMembers = formData.membersList.filter((m) => m.name.trim() !== '');
      const payload = { ...formData, membersList: cleanedMembers };

      if (editingId) {
        await API.put(`/committees/${editingId}`, payload);
      } else {
        await API.post('/committees', payload);
      }
      setIsModalOpen(false);
      fetchCommittees();
    } catch (err) {
      console.error('Save committee failed:', err);
      alert(err.response?.data?.message || 'Error saving committee');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this committee?')) return;
    try {
      await API.delete(`/committees/${id}`);
      fetchCommittees();
    } catch (err) {
      console.error('Delete committee failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold font-serif text-navy-900">Committees Manager</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure Statutory (IQAC, Anti-Ragging) and Non-Statutory Committees & Member Rosters.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow transition-colors"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Add Committee</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading committees...</div>
        ) : committees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3">Committee Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Members Count</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {committees.map((com) => (
                  <tr key={com._id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-navy-900">{com.name}</td>
                    <td className="p-3 font-bold text-maroon-700">{com.type}</td>
                    <td className="p-3 font-mono">{com.membersList?.length || 0} Members</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(com)}
                        className="p-1.5 text-slate-600 hover:text-navy-900 inline-block"
                        title="Edit Committee"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(com._id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 inline-block"
                        title="Delete Committee"
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
          <div className="p-8 text-center text-xs text-slate-400">No committees defined.</div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Committee' : 'Add Committee'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Committee Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Anti-Ragging & Discipline Committee"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Committee Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              >
                <option value="Statutory">Statutory</option>
                <option value="Non-Statutory">Non-Statutory</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Responsibilities & mandate..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
            ></textarea>
          </div>

          {/* Members List Builder */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase text-navy-900">Member Roster</label>
              <button
                type="button"
                onClick={handleAddMemberRow}
                className="text-xs text-navy-800 hover:text-maroon-600 font-semibold flex items-center gap-1"
              >
                <PlusCircle className="w-4 h-4" /> Add Member
              </button>
            </div>

            {formData.membersList.map((m, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                <input
                  type="text"
                  placeholder="Member Name (e.g. Dr. Sunita Wadhwa)"
                  value={m.name}
                  onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Role (e.g. Convener / Chairperson)"
                  value={m.role}
                  onChange={(e) => handleMemberChange(idx, 'role', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded"
                />
                {formData.membersList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMemberRow(idx)}
                    className="text-xs font-bold text-red-600 p-1 hover:underline shrink-0"
                  >
                    Remove
                  </button>
                )}
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
              Save Committee
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CommitteeManager;
