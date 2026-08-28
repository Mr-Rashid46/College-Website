import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import API from '../../api/axios';
import {
  FileText,
  ChevronRight,
  Printer,
  AlertCircle,
  Download,
  ChevronDown,
  Send,
  CheckCircle,
  Sparkles,
  Award,
  Layers,
} from 'lucide-react';

const DynamicPage = () => {
  const { slug } = useParams();
  const [pageData, setPageData] = useState(null);
  const [allPages, setAllPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dynamic custom form states
  const [formDataState, setFormDataState] = useState({});
  const [submittingForm, setSubmittingForm] = useState(false);
  const [formSuccessMsg, setFormSuccessMsg] = useState('');

  // Accordion active open index state per block
  const [openAccordions, setOpenAccordions] = useState({});

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await API.get(`/pages/slug/${slug}`);
        if (res.data.success) {
          setPageData(res.data.data);
        } else {
          setError('Page not found.');
        }

        // Fetch sibling pages for sidebar navigation
        const listRes = await API.get('/pages?limit=10');
        if (listRes.data.success) {
          setAllPages(listRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load page content:', err);
        setError('The requested page could not be found or is set to draft.');
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  const handleFormInputChange = (fieldLabel, value) => {
    setFormDataState((prev) => ({ ...prev, [fieldLabel]: value }));
  };

  const handleCustomFormSubmit = async (e, formTitle) => {
    e.preventDefault();
    setSubmittingForm(true);
    setFormSuccessMsg('');
    try {
      const res = await API.post('/forms/submit', {
        pageSlug: slug,
        formTitle: formTitle || pageData?.title || 'Custom Form',
        formData: formDataState,
      });

      if (res.data.success) {
        setFormSuccessMsg('Thank you! Your submission has been received successfully.');
        setFormDataState({});
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit form. Please try again.');
    } finally {
      setSubmittingForm(false);
    }
  };

  const toggleAccordion = (blockIdx, itemIdx) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [`${blockIdx}-${itemIdx}`]: !prev[`${blockIdx}-${itemIdx}`],
    }));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-slate-200 rounded w-1/3"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-maroon-600 mx-auto" />
        <h2 className="text-2xl font-bold font-serif text-navy-900">Page Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'This page does not exist or has been removed.'}</p>
        <Link to="/" className="inline-block bg-navy-800 text-white font-bold text-xs px-6 py-2.5 rounded-lg">
          Return to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      {/* Dynamic SEO Meta Tags */}
      <Helmet>
        <title>{pageData.seoTitle || pageData.title} | DBATU Lonere</title>
        {pageData.seoDescription && <meta name="description" content={pageData.seoDescription} />}
      </Helmet>

      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-navy-900">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-navy-900 font-semibold">{pageData.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content & Dynamic Components Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Header Title Block */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-card border border-slate-200 space-y-4">
              <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-maroon-600 block mb-1">
                    Institutional Dynamic Page
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold font-serif text-navy-900">
                    {pageData.title}
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-2 text-slate-500 hover:text-navy-900 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Print Page"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Classic HTML Content Body */}
              {pageData.content && (
                <div
                  className="prose-content"
                  dangerouslySetInnerHTML={{ __html: pageData.content }}
                />
              )}
            </div>

            {/* DYNAMIC BLOCKS RENDERER (Rendered in order set by Admin) */}
            {pageData.blocks && pageData.blocks.length > 0 && (
              <div className="space-y-8">
                {pageData.blocks.map((block, blockIdx) => {
                  const data = block.data || {};

                  // 1. HERO BANNER BLOCK
                  if (block.type === 'hero_banner') {
                    return (
                      <div key={blockIdx} className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-navy-950 text-white p-8 sm:p-12 space-y-3">
                        {data.imageUrl && (
                          <img
                            src={data.imageUrl}
                            alt={data.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-30"
                          />
                        )}
                        <div className="relative z-10 space-y-3 max-w-2xl">
                          <span className="inline-flex items-center gap-1.5 bg-gold-500/20 text-gold-300 border border-gold-500/40 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" /> Featured Highlight
                          </span>
                          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-white leading-tight">
                            {data.title}
                          </h2>
                          {data.subtitle && <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">{data.subtitle}</p>}
                        </div>
                      </div>
                    );
                  }

                  // 2. RICH TEXT HTML BLOCK
                  if (block.type === 'rich_text') {
                    return (
                      <div key={blockIdx} className="bg-white p-6 sm:p-8 rounded-2xl shadow-card border border-slate-200">
                        <div className="prose-content" dangerouslySetInnerHTML={{ __html: data.contentHtml || '' }} />
                      </div>
                    );
                  }

                  // 3. INTERACTIVE CARDS GRID BLOCK
                  if (block.type === 'cards_grid') {
                    return (
                      <div key={blockIdx} className="bg-white p-6 sm:p-8 rounded-2xl shadow-card border border-slate-200 space-y-6">
                        {data.sectionTitle && (
                          <h3 className="text-xl font-bold font-serif text-navy-900 border-b border-slate-200 pb-3 flex items-center gap-2">
                            <Award className="w-5 h-5 text-gold-500" />
                            <span>{data.sectionTitle}</span>
                          </h3>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {data.cards &&
                            data.cards.map((c, cIdx) => (
                              <div key={cIdx} className="bg-slate-50 p-5 rounded-xl border border-slate-200 hover:border-gold-500/40 hover:shadow-md transition-all space-y-2">
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{c.title}</h4>
                                <div className="text-2xl font-extrabold font-serif text-navy-900 text-gold-600">{c.value}</div>
                                {c.subtitle && <p className="text-xs text-slate-600">{c.subtitle}</p>}
                              </div>
                            ))}
                        </div>
                      </div>
                    );
                  }

                  // 4. CUSTOM INTERACTIVE FORM BUILDER BLOCK
                  if (block.type === 'custom_form') {
                    return (
                      <div key={blockIdx} className="bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white p-6 sm:p-10 rounded-3xl shadow-2xl border border-navy-800 space-y-6">
                        <div className="border-b border-navy-800 pb-4 space-y-1">
                          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block">Online Portal Form</span>
                          <h3 className="text-2xl font-bold font-serif text-white">{data.formTitle || 'Submission Form'}</h3>
                          {data.formDescription && <p className="text-xs text-slate-300">{data.formDescription}</p>}
                        </div>

                        {formSuccessMsg ? (
                          <div className="bg-emerald-500/20 border border-emerald-500/40 p-4 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 shrink-0" />
                            <span>{formSuccessMsg}</span>
                          </div>
                        ) : (
                          <form onSubmit={(e) => handleCustomFormSubmit(e, data.formTitle)} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {data.fields &&
                                data.fields.map((f, fIdx) => {
                                  const opts = f.options ? f.options.split(',').map((o) => o.trim()) : [];
                                  return (
                                    <div key={fIdx} className={f.type === 'textarea' ? 'col-span-full' : ''}>
                                      <label className="block text-xs font-semibold text-slate-200 mb-1">
                                        {f.label} {f.required && <span className="text-gold-400">*</span>}
                                      </label>

                                      {f.type === 'select' ? (
                                        <select
                                          required={f.required}
                                          value={formDataState[f.label] || ''}
                                          onChange={(e) => handleFormInputChange(f.label, e.target.value)}
                                          className="w-full px-3 py-2.5 text-xs bg-navy-900 border border-navy-700 text-white rounded-xl focus:outline-none focus:border-gold-400"
                                        >
                                          <option value="">Select option...</option>
                                          {opts.map((opt, oIdx) => (
                                            <option key={oIdx} value={opt}>
                                              {opt}
                                            </option>
                                          ))}
                                        </select>
                                      ) : f.type === 'textarea' ? (
                                        <textarea
                                          rows={3}
                                          required={f.required}
                                          value={formDataState[f.label] || ''}
                                          onChange={(e) => handleFormInputChange(f.label, e.target.value)}
                                          placeholder={f.placeholder || ''}
                                          className="w-full px-3 py-2.5 text-xs bg-navy-900 border border-navy-700 text-white rounded-xl focus:outline-none focus:border-gold-400"
                                        />
                                      ) : (
                                        <input
                                          type={f.type || 'text'}
                                          required={f.required}
                                          value={formDataState[f.label] || ''}
                                          onChange={(e) => handleFormInputChange(f.label, e.target.value)}
                                          placeholder={f.placeholder || ''}
                                          className="w-full px-3 py-2.5 text-xs bg-navy-900 border border-navy-700 text-white rounded-xl focus:outline-none focus:border-gold-400"
                                        />
                                      )}
                                    </div>
                                  );
                                })}
                            </div>

                            <button
                              type="submit"
                              disabled={submittingForm}
                              className="w-full sm:w-auto bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-bold text-xs px-8 py-3 rounded-xl transition-all shadow-glow flex items-center justify-center gap-2"
                            >
                              <Send className="w-4 h-4" />
                              <span>{submittingForm ? 'Submitting...' : data.submitButtonText || 'Submit Form'}</span>
                            </button>
                          </form>
                        )}
                      </div>
                    );
                  }

                  // 5. ACCORDION FAQS BLOCK
                  if (block.type === 'accordion_faqs') {
                    return (
                      <div key={blockIdx} className="bg-white p-6 sm:p-8 rounded-2xl shadow-card border border-slate-200 space-y-6">
                        {data.sectionTitle && (
                          <h3 className="text-xl font-bold font-serif text-navy-900 border-b border-slate-200 pb-3">
                            {data.sectionTitle}
                          </h3>
                        )}

                        <div className="space-y-3">
                          {data.items &&
                            data.items.map((item, itemIdx) => {
                              const isOpen = openAccordions[`${blockIdx}-${itemIdx}`];
                              return (
                                <div key={itemIdx} className="border border-slate-200 rounded-xl overflow-hidden">
                                  <button
                                    onClick={() => toggleAccordion(blockIdx, itemIdx)}
                                    className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 font-bold text-xs sm:text-sm text-navy-900 flex justify-between items-center transition-colors"
                                  >
                                    <span>{item.title}</span>
                                    <ChevronDown className={`w-4 h-4 text-gold-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                  </button>

                                  {isOpen && (
                                    <div className="p-4 text-xs text-slate-700 bg-white border-t border-slate-200 leading-relaxed">
                                      {item.content}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    );
                  }

                  // 6. FILE DOWNLOADS COLLECTION BLOCK
                  if (block.type === 'file_downloads') {
                    return (
                      <div key={blockIdx} className="bg-white p-6 sm:p-8 rounded-2xl shadow-card border border-slate-200 space-y-6">
                        {data.sectionTitle && (
                          <h3 className="text-xl font-bold font-serif text-navy-900 border-b border-slate-200 pb-3">
                            {data.sectionTitle}
                          </h3>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {data.files &&
                            data.files.map((file, fIdx) => (
                              <div key={fIdx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                                <div>
                                  <h4 className="text-xs font-bold text-navy-900">{file.title}</h4>
                                  <p className="text-[11px] text-slate-500">{file.description}</p>
                                </div>
                                <a
                                  href={file.fileUrl || '#'}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="bg-navy-900 hover:bg-navy-800 text-gold-400 font-bold text-xs p-2.5 rounded-lg shrink-0 flex items-center gap-1.5 shadow-xs"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Download</span>
                                </a>
                              </div>
                            ))}
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            )}
          </div>

          {/* Sibling Page Links Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-200">
              <h3 className="text-sm font-bold font-serif text-navy-900 uppercase tracking-wider border-b border-slate-200 pb-3 mb-4">
                Related Pages
              </h3>

              <ul className="space-y-1.5 text-xs">
                {allPages.map((p) => (
                  <li key={p._id}>
                    <Link
                      to={`/page/${p.slug}`}
                      className={`block px-3 py-2.5 rounded-lg font-medium transition-colors ${
                        p.slug === slug
                          ? 'bg-navy-800 text-gold-400 font-semibold'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-navy-900'
                      }`}
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DynamicPage;
