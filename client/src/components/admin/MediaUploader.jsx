import React, { useState } from 'react';
import API from '../../api/axios';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';

const MediaUploader = ({ value, onChange, label = 'Upload Media / Document (PDF or Image)', accept = 'image/*,application/pdf' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        onChange(res.data.fileUrl);
      }
    } catch (err) {
      console.error('File upload error:', err);
      setError(err.response?.data?.message || 'File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const isPdf = value && value.toLowerCase().endsWith('.pdf');
  const isImage = value && (value.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || !isPdf);

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700">{label}</label>

      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border-2 border-dashed border-slate-300 hover:border-navy-600 rounded-xl bg-slate-50 transition-colors">
        {/* Upload Input */}
        <label className="cursor-pointer flex flex-col items-center justify-center text-center p-3 w-full sm:w-auto bg-white border border-slate-200 shadow-xs rounded-lg hover:bg-slate-100 transition-colors">
          <Upload className="w-5 h-5 text-navy-700 mb-1" />
          <span className="text-xs font-semibold text-navy-800">
            {uploading ? 'Uploading...' : 'Choose File'}
          </span>
          <input
            type="file"
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
            disabled={uploading}
          />
        </label>

        {/* Current File Preview */}
        <div className="flex-1 w-full flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 overflow-hidden">
          {uploading ? (
            <div className="flex items-center gap-2 text-xs text-navy-700">
              <Loader2 className="w-4 h-4 animate-spin text-gold-500" />
              <span>Uploading file to server...</span>
            </div>
          ) : value ? (
            <div className="flex items-center gap-3 overflow-hidden">
              {isImage ? (
                <div className="w-10 h-10 rounded border border-slate-200 overflow-hidden shrink-0 bg-slate-100">
                  <img src={value} alt="Uploaded Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
                  <FileText className="w-5 h-5" />
                </div>
              )}
              <div className="overflow-hidden">
                <span className="text-xs font-medium text-slate-800 truncate block">
                  {value}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ImageIcon className="w-4 h-4" />
              <span>No file uploaded yet.</span>
            </div>
          )}

          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-[11px] font-bold text-red-600 hover:underline shrink-0 ml-2"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
