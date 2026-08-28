import React, { useState, useEffect, useContext } from 'react';
import API from '../../api/axios';
import Modal from '../../components/admin/Modal';
import { SiteSettingsContext } from '../../context/SiteSettingsContext';
import { Plus, Edit, Trash2, Menu, CornerDownRight } from 'lucide-react';

const MenuManager = () => {
  const { refreshSettings } = useContext(SiteSettingsContext);
  const [rawItems, setRawItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    label: '',
    url: '',
    parentId: '',
    order: 0,
    status: 'published',
  });

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const res = await API.get('/menu?raw=true&status=all');
      if (res.data.success) {
        setRawItems(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setFormData({
        label: item.label,
        url: item.url,
        parentId: item.parentId ? item.parentId.toString() : '',
        order: item.order || 0,
        status: item.status || 'published',
      });
    } else {
      setEditingId(null);
      setFormData({
        label: '',
        url: '',
        parentId: '',
        order: 0,
        status: 'published',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        parentId: formData.parentId ? formData.parentId : null,
      };

      if (editingId) {
        await API.put(`/menu/${editingId}`, payload);
      } else {
        await API.post('/menu', payload);
      }
      setIsModalOpen(false);
      await fetchMenuItems();
      await refreshSettings();
    } catch (err) {
      console.error('Save menu item failed:', err);
      alert(err.response?.data?.message || 'Error saving menu item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item and any sub-items?')) return;
    try {
      await API.delete(`/menu/${id}`);
      await fetchMenuItems();
      await refreshSettings();
    } catch (err) {
      console.error('Delete menu item failed:', err);
    }
  };

  const parentOptions = rawItems.filter((i) => !i.parentId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold font-serif text-navy-900">Dynamic Menu Builder</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Customize the public site top navigation bar structure, labels, URLs, dropdown nesting & ordering.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow transition-colors"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Add Menu Item</span>
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading menu configuration...</div>
        ) : rawItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3">Menu Label</th>
                  <th className="p-3">Link URL / Slug</th>
                  <th className="p-3">Parent Item</th>
                  <th className="p-3">Order</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rawItems.map((item) => {
                  const parentItem = rawItems.find((p) => p._id === item.parentId);
                  return (
                    <tr key={item._id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-navy-900 flex items-center gap-2">
                        {item.parentId && <CornerDownRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                        <span>{item.label}</span>
                      </td>
                      <td className="p-3 font-mono text-slate-600">{item.url}</td>
                      <td className="p-3 text-slate-500">{parentItem ? parentItem.label : 'Top Level Navbar'}</td>
                      <td className="p-3 font-mono">{item.order}</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-1.5 text-slate-600 hover:text-navy-900 inline-block"
                          title="Edit Menu Item"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 inline-block"
                          title="Delete Menu Item"
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
          <div className="p-8 text-center text-xs text-slate-400">No menu items configured.</div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Menu Item' : 'Add Menu Item'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Menu Label *</label>
              <input
                type="text"
                required
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g. About Us"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target URL / Slug *</label>
              <input
                type="text"
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="/page/about or /notices"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Parent Dropdown Menu</label>
              <select
                value={formData.parentId}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              >
                <option value="">None (Top Level Item)</option>
                {parentOptions
                  .filter((p) => p._id !== editingId)
                  .map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.label}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Order Index</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>
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
              Save Menu Item
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MenuManager;
