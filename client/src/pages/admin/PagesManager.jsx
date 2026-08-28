import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import Modal from '../../components/admin/Modal';
import RichTextEditor from '../../components/admin/RichTextEditor';
import MediaUploader from '../../components/admin/MediaUploader';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  FileText,
  Globe,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Layout,
  Layers,
  HelpCircle,
  Download,
  FormInput,
  Grid,
} from 'lucide-react';

const BLOCK_TYPES = [
  { type: 'hero_banner', label: 'Hero Banner Showcase', icon: Layout, desc: 'Title, tagline & banner image' },
  { type: 'rich_text', label: 'Rich Text HTML Block', icon: FileText, desc: 'WYSIWYG article content' },
  { type: 'cards_grid', label: 'Interactive Cards Grid', icon: Grid, desc: 'Placement stats, recruiters, packages' },
  { type: 'custom_form', label: 'Custom Interactive Form Builder', icon: FormInput, desc: 'Student placement registration form' },
  { type: 'accordion_faqs', label: 'Accordion FAQs Section', icon: HelpCircle, desc: 'Collapsible rules & guidelines' },
  { type: 'file_downloads', label: 'Downloadable PDFs Collection', icon: Download, desc: 'Brochures & policy PDFs' },
];

const PagesManager = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    blocks: [],
    parentMenu: '',
    order: 0,
    seoTitle: '',
    seoDescription: '',
    status: 'published',
  });

  const fetchPages = async () => {
    setLoading(true);
    try {
      let url = '/pages?limit=100';
      if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;
      const res = await API.get(url);
      if (res.data.success) {
        setPages(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch pages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [searchQuery]);

  const handleOpenModal = (page = null) => {
    if (page) {
      setEditingId(page._id);
      setFormData({
        title: page.title || '',
        slug: page.slug || '',
        content: page.content || '',
        blocks: page.blocks || [],
        parentMenu: page.parentMenu || '',
        order: page.order || 0,
        seoTitle: page.seoTitle || '',
        seoDescription: page.seoDescription || '',
        status: page.status || 'published',
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        slug: '',
        content: '',
        blocks: [],
        parentMenu: '',
        order: 0,
        seoTitle: '',
        seoDescription: '',
        status: 'published',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/pages/${editingId}`, formData);
      } else {
        await API.post('/pages', formData);
      }
      setIsModalOpen(false);
      fetchPages();
    } catch (err) {
      console.error('Save page failed:', err);
      alert(err.response?.data?.message || 'Error saving page');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;
    try {
      await API.delete(`/pages/${id}`);
      fetchPages();
    } catch (err) {
      console.error('Delete page failed:', err);
    }
  };

  // Block builder operations
  const addBlock = (type) => {
    let initialData = {};
    if (type === 'hero_banner') {
      initialData = { title: 'Page Banner Title', subtitle: 'Subtitle description text', imageUrl: '' };
    } else if (type === 'rich_text') {
      initialData = { contentHtml: '<p>Enter text content here...</p>' };
    } else if (type === 'cards_grid') {
      initialData = {
        sectionTitle: 'Placement Statistics & Highlights',
        cards: [
          { title: 'Highest Package', value: '₹24 LPA', subtitle: 'International Offer', image: '' },
          { title: 'Average Package', value: '₹7.5 LPA', subtitle: 'Overall B.Tech/M.Tech', image: '' },
        ],
      };
    } else if (type === 'custom_form') {
      initialData = {
        formTitle: 'Student Placement Registration Form',
        formDescription: 'Fill in your academic details to enroll for upcoming campus placement drives.',
        submitButtonText: 'Submit Placement Application',
        fields: [
          { label: 'Full Student Name', type: 'text', required: true, placeholder: 'Enter your name' },
          { label: 'University Roll Number', type: 'text', required: true, placeholder: 'e.g. 2026CE104' },
          { label: 'Academic Branch', type: 'select', required: true, options: 'Computer Engg, EXTC, Mechanical, Civil, B.Pharm, MCA' },
          { label: 'Email Address', type: 'email', required: true, placeholder: 'student@dbatu.ac.in' },
          { label: 'Contact Phone', type: 'phone', required: true, placeholder: '+91 9876543210' },
          { label: 'Current CPI / CGPA', type: 'text', required: true, placeholder: 'e.g. 8.75' },
        ],
      };
    } else if (type === 'accordion_faqs') {
      initialData = {
        sectionTitle: 'Placement Guidelines & FAQs',
        items: [
          { title: 'What is the eligibility criterion for campus drives?', content: 'Students with minimum 6.0 CGPA and no live backlogs are eligible.' },
        ],
      };
    } else if (type === 'file_downloads') {
      initialData = {
        sectionTitle: 'Placement Documents & Reports',
        files: [
          { title: 'DBATU Placement Brochure 2026-27', description: 'Download official placement information handbook', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        ],
      };
    }

    setFormData((prev) => ({
      ...prev,
      blocks: [...prev.blocks, { type, data: initialData }],
    }));
  };

  const moveBlock = (index, direction) => {
    const newBlocks = [...formData.blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    setFormData((prev) => ({ ...prev, blocks: newBlocks }));
  };

  const removeBlock = (index) => {
    setFormData((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((_, i) => i !== index),
    }));
  };

  const updateBlockData = (index, newData) => {
    const newBlocks = [...formData.blocks];
    newBlocks[index].data = newData;
    setFormData((prev) => ({ ...prev, blocks: newBlocks }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold font-serif text-navy-900">Dynamic Pages & Component Builder</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Build custom web pages (e.g. Training & Placement, Alumni, NIRF) and compose interactive components & custom forms.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow transition-colors"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Create New Page</span>
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search pages by title or slug..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 text-xs focus:outline-none"
        />
      </div>

      {/* Table List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading pages list...</div>
        ) : pages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3">Page Title</th>
                  <th className="p-3">Slug / Route</th>
                  <th className="p-3">Dynamic Blocks</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pages.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-navy-900">{p.title}</td>
                    <td className="p-3 text-slate-600 font-mono">/page/{p.slug}</td>
                    <td className="p-3 text-slate-500">
                      <span className="bg-slate-100 text-navy-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {p.blocks ? p.blocks.length : 0} Blocks
                      </span>
                    </td>
                    <td className="p-3">
                      {p.status === 'published' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 font-semibold">
                          <Clock className="w-3.5 h-3.5" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <a
                        href={`/page/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-slate-500 hover:text-navy-900 inline-block"
                        title="View Public Page"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleOpenModal(p)}
                        className="p-1.5 text-slate-600 hover:text-navy-900 inline-block"
                        title="Edit Page & Components"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 inline-block"
                        title="Delete Page"
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
          <div className="p-8 text-center text-xs text-slate-400">No pages found.</div>
        )}
      </div>

      {/* Create / Edit Page Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Page & Dynamic Components' : 'Create Dynamic Page'}
        maxWidth="max-w-5xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Page Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Training & Placement Cell"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">URL Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="placement-cell (auto-generated if empty)"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
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

          {/* DYNAMIC BLOCK BUILDER SECTION */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <h3 className="text-sm font-bold font-serif text-navy-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-gold-500" />
                  <span>Visual Dynamic Page Components ({formData.blocks.length} Blocks)</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Add interactive cards, custom forms, FAQs, hero banners, and move them UP or DOWN to arrange where they display on the page.
                </p>
              </div>

              {/* Add Block Dropdown / Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {BLOCK_TYPES.map((bt) => {
                  const IconComp = bt.icon;
                  return (
                    <button
                      key={bt.type}
                      type="button"
                      onClick={() => addBlock(bt.type)}
                      className="px-2.5 py-1.5 text-[11px] font-bold bg-white hover:bg-navy-900 hover:text-white text-navy-900 border border-slate-300 rounded-lg shadow-xs transition-colors flex items-center gap-1"
                      title={bt.desc}
                    >
                      <IconComp className="w-3.5 h-3.5 text-gold-500" />
                      <span>+ {bt.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List of Added Blocks */}
            {formData.blocks.length > 0 ? (
              <div className="space-y-4">
                {formData.blocks.map((block, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-navy-200 p-4 shadow-sm space-y-3 relative group">
                    <div className="flex items-center justify-between bg-navy-950 text-white p-2.5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="bg-gold-500 text-navy-950 text-[10px] font-extrabold px-2 py-0.5 rounded">
                          Block #{idx + 1}
                        </span>
                        <span className="text-xs font-bold font-serif text-gold-300 uppercase tracking-wider">
                          {block.type.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveBlock(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-slate-300 hover:text-white disabled:opacity-30"
                          title="Move Block UP"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveBlock(idx, 'down')}
                          disabled={idx === formData.blocks.length - 1}
                          className="p-1 text-slate-300 hover:text-white disabled:opacity-30"
                          title="Move Block DOWN"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeBlock(idx)}
                          className="p-1 text-red-400 hover:text-red-200 ml-2"
                          title="Remove Block"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* BLOCK SPECIFIC EDITORS */}
                    {block.type === 'hero_banner' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700">Banner Title</label>
                          <input
                            type="text"
                            value={block.data.title || ''}
                            onChange={(e) => updateBlockData(idx, { ...block.data, title: e.target.value })}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700">Tagline / Subtitle</label>
                          <input
                            type="text"
                            value={block.data.subtitle || ''}
                            onChange={(e) => updateBlockData(idx, { ...block.data, subtitle: e.target.value })}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                          />
                        </div>
                        <div className="col-span-full">
                          <label className="block text-[11px] font-semibold text-slate-700">Banner Image URL</label>
                          <MediaUploader
                            value={block.data.imageUrl || ''}
                            onChange={(url) => updateBlockData(idx, { ...block.data, imageUrl: url })}
                          />
                        </div>
                      </div>
                    )}

                    {block.type === 'rich_text' && (
                      <div className="p-2">
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Content HTML</label>
                        <RichTextEditor
                          value={block.data.contentHtml || ''}
                          onChange={(val) => updateBlockData(idx, { ...block.data, contentHtml: val })}
                        />
                      </div>
                    )}

                    {block.type === 'cards_grid' && (
                      <div className="p-2 space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Grid Section Header Title</label>
                          <input
                            type="text"
                            value={block.data.sectionTitle || ''}
                            onChange={(e) => updateBlockData(idx, { ...block.data, sectionTitle: e.target.value })}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                          />
                        </div>

                        <div className="space-y-2">
                          <span className="text-xs font-bold text-navy-900 block">Cards Items ({block.data.cards?.length || 0}):</span>
                          {block.data.cards &&
                            block.data.cards.map((card, cIdx) => (
                              <div key={cIdx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                                <input
                                  type="text"
                                  placeholder="Card Title (e.g. Highest Package)"
                                  value={card.title || ''}
                                  onChange={(e) => {
                                    const newCards = [...block.data.cards];
                                    newCards[cIdx].title = e.target.value;
                                    updateBlockData(idx, { ...block.data, cards: newCards });
                                  }}
                                  className="px-2 py-1 border rounded"
                                />
                                <input
                                  type="text"
                                  placeholder="Highlight Value (e.g. ₹24 LPA)"
                                  value={card.value || ''}
                                  onChange={(e) => {
                                    const newCards = [...block.data.cards];
                                    newCards[cIdx].value = e.target.value;
                                    updateBlockData(idx, { ...block.data, cards: newCards });
                                  }}
                                  className="px-2 py-1 border rounded"
                                />
                                <input
                                  type="text"
                                  placeholder="Subtitle / Detail"
                                  value={card.subtitle || ''}
                                  onChange={(e) => {
                                    const newCards = [...block.data.cards];
                                    newCards[cIdx].subtitle = e.target.value;
                                    updateBlockData(idx, { ...block.data, cards: newCards });
                                  }}
                                  className="px-2 py-1 border rounded"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newCards = block.data.cards.filter((_, i) => i !== cIdx);
                                    updateBlockData(idx, { ...block.data, cards: newCards });
                                  }}
                                  className="text-red-600 font-bold text-right"
                                >
                                  Remove Card
                                </button>
                              </div>
                            ))}
                          <button
                            type="button"
                            onClick={() => {
                              const newCards = [...(block.data.cards || []), { title: 'New Card', value: '100+', subtitle: 'Details' }];
                              updateBlockData(idx, { ...block.data, cards: newCards });
                            }}
                            className="text-xs text-navy-900 font-bold underline"
                          >
                            + Add Card Item
                          </button>
                        </div>
                      </div>
                    )}

                    {block.type === 'custom_form' && (
                      <div className="p-2 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700">Form Title</label>
                            <input
                              type="text"
                              value={block.data.formTitle || ''}
                              onChange={(e) => updateBlockData(idx, { ...block.data, formTitle: e.target.value })}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700">Submit Button Text</label>
                            <input
                              type="text"
                              value={block.data.submitButtonText || ''}
                              onChange={(e) => updateBlockData(idx, { ...block.data, submitButtonText: e.target.value })}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700">Form Description Header</label>
                          <input
                            type="text"
                            value={block.data.formDescription || ''}
                            onChange={(e) => updateBlockData(idx, { ...block.data, formDescription: e.target.value })}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                          />
                        </div>

                        {/* Fields Builder */}
                        <div className="space-y-2 pt-2 border-t border-slate-200">
                          <span className="text-xs font-bold text-navy-900 block">Form Input Fields ({block.data.fields?.length || 0}):</span>
                          {block.data.fields &&
                            block.data.fields.map((f, fIdx) => (
                              <div key={fIdx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs items-center">
                                <input
                                  type="text"
                                  placeholder="Field Label (e.g. Roll No)"
                                  value={f.label || ''}
                                  onChange={(e) => {
                                    const newFields = [...block.data.fields];
                                    newFields[fIdx].label = e.target.value;
                                    updateBlockData(idx, { ...block.data, fields: newFields });
                                  }}
                                  className="px-2 py-1 border rounded"
                                />
                                <select
                                  value={f.type || 'text'}
                                  onChange={(e) => {
                                    const newFields = [...block.data.fields];
                                    newFields[fIdx].type = e.target.value;
                                    updateBlockData(idx, { ...block.data, fields: newFields });
                                  }}
                                  className="px-2 py-1 border rounded"
                                >
                                  <option value="text">Text Input</option>
                                  <option value="email">Email Address</option>
                                  <option value="phone">Phone Number</option>
                                  <option value="select">Dropdown Select</option>
                                  <option value="textarea">Textarea Box</option>
                                </select>

                                <input
                                  type="text"
                                  placeholder="Options (for select, comma separated)"
                                  value={f.options || ''}
                                  onChange={(e) => {
                                    const newFields = [...block.data.fields];
                                    newFields[fIdx].options = e.target.value;
                                    updateBlockData(idx, { ...block.data, fields: newFields });
                                  }}
                                  className="px-2 py-1 border rounded"
                                />

                                <div className="flex items-center justify-between">
                                  <label className="flex items-center gap-1 text-[11px] font-semibold">
                                    <input
                                      type="checkbox"
                                      checked={f.required || false}
                                      onChange={(e) => {
                                        const newFields = [...block.data.fields];
                                        newFields[fIdx].required = e.target.checked;
                                        updateBlockData(idx, { ...block.data, fields: newFields });
                                      }}
                                    /> Required
                                  </label>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newFields = block.data.fields.filter((_, i) => i !== fIdx);
                                      updateBlockData(idx, { ...block.data, fields: newFields });
                                    }}
                                    className="text-red-600 font-bold"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}

                          <button
                            type="button"
                            onClick={() => {
                              const newFields = [...(block.data.fields || []), { label: 'New Field', type: 'text', required: true }];
                              updateBlockData(idx, { ...block.data, fields: newFields });
                            }}
                            className="text-xs text-navy-900 font-bold underline"
                          >
                            + Add Form Field
                          </button>
                        </div>
                      </div>
                    )}

                    {block.type === 'accordion_faqs' && (
                      <div className="p-2 space-y-3">
                        <input
                          type="text"
                          placeholder="Section Title"
                          value={block.data.sectionTitle || ''}
                          onChange={(e) => updateBlockData(idx, { ...block.data, sectionTitle: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs border rounded"
                        />
                        {block.data.items &&
                          block.data.items.map((item, iIdx) => (
                            <div key={iIdx} className="bg-slate-50 p-2.5 rounded border space-y-1.5 text-xs">
                              <input
                                type="text"
                                placeholder="Question Title"
                                value={item.title || ''}
                                onChange={(e) => {
                                  const newItems = [...block.data.items];
                                  newItems[iIdx].title = e.target.value;
                                  updateBlockData(idx, { ...block.data, items: newItems });
                                }}
                                className="w-full px-2 py-1 border rounded font-semibold"
                              />
                              <textarea
                                rows={2}
                                placeholder="Answer Details"
                                value={item.content || ''}
                                onChange={(e) => {
                                  const newItems = [...block.data.items];
                                  newItems[iIdx].content = e.target.value;
                                  updateBlockData(idx, { ...block.data, items: newItems });
                                }}
                                className="w-full px-2 py-1 border rounded"
                              />
                            </div>
                          ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = [...(block.data.items || []), { title: 'New FAQ Question', content: 'Answer details...' }];
                            updateBlockData(idx, { ...block.data, items: newItems });
                          }}
                          className="text-xs text-navy-900 font-bold underline"
                        >
                          + Add FAQ Item
                        </button>
                      </div>
                    )}

                    {block.type === 'file_downloads' && (
                      <div className="p-2 space-y-3">
                        <input
                          type="text"
                          placeholder="Section Title"
                          value={block.data.sectionTitle || ''}
                          onChange={(e) => updateBlockData(idx, { ...block.data, sectionTitle: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs border rounded"
                        />
                        {block.data.files &&
                          block.data.files.map((file, fIdx) => (
                            <div key={fIdx} className="bg-slate-50 p-2.5 rounded border grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                              <input
                                type="text"
                                placeholder="Document Title"
                                value={file.title || ''}
                                onChange={(e) => {
                                  const newFiles = [...block.data.files];
                                  newFiles[fIdx].title = e.target.value;
                                  updateBlockData(idx, { ...block.data, files: newFiles });
                                }}
                                className="px-2 py-1 border rounded"
                              />
                              <input
                                type="text"
                                placeholder="Description"
                                value={file.description || ''}
                                onChange={(e) => {
                                  const newFiles = [...block.data.files];
                                  newFiles[fIdx].description = e.target.value;
                                  updateBlockData(idx, { ...block.data, files: newFiles });
                                }}
                                className="px-2 py-1 border rounded"
                              />
                              <input
                                type="text"
                                placeholder="PDF File URL"
                                value={file.fileUrl || ''}
                                onChange={(e) => {
                                  const newFiles = [...block.data.files];
                                  newFiles[fIdx].fileUrl = e.target.value;
                                  updateBlockData(idx, { ...block.data, files: newFiles });
                                }}
                                className="px-2 py-1 border rounded"
                              />
                            </div>
                          ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newFiles = [...(block.data.files || []), { title: 'Download File PDF', description: 'PDF description', fileUrl: '' }];
                            updateBlockData(idx, { ...block.data, files: newFiles });
                          }}
                          className="text-xs text-navy-900 font-bold underline"
                        >
                          + Add File Download Item
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-400">
                No visual blocks added yet. Click any component button above to build your page!
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">SEO Title</label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">SEO Description</label>
              <input
                type="text"
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
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
              {editingId ? 'Update Dynamic Page' : 'Save Dynamic Page'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PagesManager;
