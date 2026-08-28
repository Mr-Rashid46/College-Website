import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import Modal from '../../components/admin/Modal';
import RichTextEditor from '../../components/admin/RichTextEditor';
import MediaUploader from '../../components/admin/MediaUploader';
import { Plus, Edit, Trash2, Search, BookOpen } from 'lucide-react';

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    author: 'College Administration',
    coverImage: '',
    content: '',
    tagsStr: '',
    status: 'published',
  });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      let url = '/blogs?limit=100';
      if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;
      const res = await API.get(url);
      if (res.data.success) {
        setBlogs(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [searchQuery]);

  const handleOpenModal = (blog = null) => {
    if (blog) {
      setEditingId(blog._id);
      setFormData({
        title: blog.title,
        slug: blog.slug,
        author: blog.author || 'College Administration',
        coverImage: blog.coverImage || '',
        content: blog.content || '',
        tagsStr: blog.tags ? blog.tags.join(', ') : '',
        status: blog.status || 'published',
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        slug: '',
        author: 'College Administration',
        coverImage: '',
        content: '',
        tagsStr: '',
        status: 'published',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tagsStr
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t !== '');

      const payload = {
        title: formData.title,
        slug: formData.slug,
        author: formData.author,
        coverImage: formData.coverImage,
        content: formData.content,
        tags: tagsArray,
        status: formData.status,
      };

      if (editingId) {
        await API.put(`/blogs/${editingId}`, payload);
      } else {
        await API.post('/blogs', payload);
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (err) {
      console.error('Save blog post failed:', err);
      alert(err.response?.data?.message || 'Error saving blog post');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await API.delete(`/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error('Delete blog post failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold font-serif text-navy-900">Institutional Blogs Manager</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Write and publish articles on NAAC accreditation, NEP 2020 guidelines, and college achievements.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow transition-colors"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search articles by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 text-xs focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading blog articles...</div>
        ) : blogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3">Article Title</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Publish Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {blogs.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-navy-900 max-w-xs truncate">{b.title}</td>
                    <td className="p-3 text-slate-700">{b.author}</td>
                    <td className="p-3 text-slate-500">
                      {new Date(b.publishDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-3">
                      {b.status === 'published' ? (
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
                        onClick={() => handleOpenModal(b)}
                        className="p-1.5 text-slate-600 hover:text-navy-900 inline-block"
                        title="Edit Article"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 inline-block"
                        title="Delete Article"
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
          <div className="p-8 text-center text-xs text-slate-400">No blog articles found.</div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Blog Article' : 'Write Blog Article'}
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Article Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. DBATU Secures NAAC Accreditation"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Author Name</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="IQAC Cell / Administration"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                value={formData.tagsStr}
                onChange={(e) => setFormData({ ...formData, tagsStr: e.target.value })}
                placeholder="NAAC, IQAC, Accreditation"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Publish Status</label>
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

          <MediaUploader
            value={formData.coverImage}
            onChange={(url) => setFormData({ ...formData, coverImage: url })}
            label="Cover Feature Image"
            accept="image/*"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Article Content *</label>
            <RichTextEditor
              value={formData.content}
              onChange={(val) => setFormData({ ...formData, content: val })}
            />
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
              Save Article
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BlogManager;
