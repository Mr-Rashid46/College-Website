import React, { useState, useEffect } from 'react';
import { Image, FileText, Upload, Check, X, Search, Trash2, Edit2, Link, Copy } from 'lucide-react';
import API from '../../api/axios';

const MediaLibraryModal = ({ isOpen, onClose, onSelectMedia, title = 'Media Library' }) => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadAltText, setUploadAltText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [notification, setNotification] = useState('');

  const fetchMedia = async () => {
    if (!isOpen) return;
    try {
      setLoading(true);
      const res = await API.get('/media', {
        params: { search, type: typeFilter, limit: 30 },
      });
      if (res.data.success) {
        setMediaList(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch media list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [isOpen, search, typeFilter]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('altText', uploadAltText);

    try {
      setUploading(true);
      const res = await API.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setNotification('File uploaded successfully!');
        setSelectedFile(null);
        setUploadAltText('');
        fetchMedia();
        setTimeout(() => setNotification(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await API.delete(`/media/${id}`);
      setMediaList((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert('Failed to delete media asset');
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setNotification('URL copied to clipboard!');
    setTimeout(() => setNotification(''), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {notification && (
            <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-medium">
              {notification}
            </div>
          )}

          {/* Quick Upload Form */}
          <form onSubmit={handleFileUpload} className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/50 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-blue-600" /> Upload New Asset
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select File</label>
                <input
                  type="file"
                  required
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Alt Text / Description (Accessibility)</label>
                <input
                  type="text"
                  placeholder="e.g. Campus Building Entrance"
                  value={uploadAltText}
                  onChange={(e) => setUploadAltText(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>
              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {uploading ? 'Uploading...' : 'Upload Asset'}
              </button>
            </div>
          </form>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search file name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setTypeFilter('')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  typeFilter === '' ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                All Files
              </button>
              <button
                onClick={() => setTypeFilter('image')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  typeFilter === 'image' ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Images Only
              </button>
              <button
                onClick={() => setTypeFilter('document')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  typeFilter === 'document' ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Documents Only
              </button>
            </div>
          </div>

          {/* Asset Grid */}
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">Loading media assets...</div>
          ) : mediaList.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">No media files found. Upload one above!</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mediaList.map((item) => {
                const isImage = item.mimeType?.startsWith('image/');
                return (
                  <div
                    key={item._id}
                    className="group relative bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col hover:border-blue-500 transition-all shadow-sm"
                  >
                    <div className="h-32 bg-slate-200 dark:bg-slate-900 flex items-center justify-center overflow-hidden relative">
                      {isImage ? (
                        <img
                          src={item.url}
                          alt={item.altText || item.originalName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <FileText className="w-10 h-10 text-slate-400" />
                      )}
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {onSelectMedia && (
                          <button
                            onClick={() => {
                              onSelectMedia(item);
                              onClose();
                            }}
                            className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow"
                          >
                            <Check className="w-4 h-4" /> Select
                          </button>
                        )}
                        <button
                          onClick={() => copyToClipboard(item.url)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs shadow"
                          title="Copy Link"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMedia(item._id, item.originalName)}
                          className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs shadow"
                          title="Delete File"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate" title={item.originalName}>
                        {item.originalName}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {(item.size / 1024).toFixed(1)} KB • {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaLibraryModal;
