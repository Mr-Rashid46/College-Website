import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Image as ImageIcon, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const [albums, setAlbums] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        let url = '/gallery?limit=30';
        if (categoryFilter !== 'ALL') url += `&category=${categoryFilter}`;
        const res = await API.get(url);
        if (res.data.success) {
          setAlbums(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch gallery albums:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [categoryFilter]);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* Banner Header */}
        <div className="bg-navy-900 text-white rounded-2xl p-8 shadow-xl border border-navy-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-xs font-bold uppercase text-gold-400 tracking-wider">Campus Life</span>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif text-white mt-1 flex items-center gap-2">
              <ImageIcon className="w-8 h-8 text-gold-500" />
              <span>Photo Gallery Albums</span>
            </h1>
            <p className="text-xs text-slate-300 mt-2 max-w-xl">
              Glimpses of Convocation ceremonies, Annual Sports meets, Cultural fests, and campus events.
            </p>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {['ALL', 'Event', 'Sports', 'Cultural', 'Campus'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                categoryFilter === cat
                  ? 'bg-navy-800 text-gold-400 shadow-md border-l-4 border-gold-500'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Photo Albums' : cat}
            </button>
          ))}
        </div>

        {/* Albums Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        ) : albums.length > 0 ? (
          <div className="space-y-12">
            {albums.map((album) => (
              <div key={album._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <span className="bg-navy-50 text-navy-800 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase border border-navy-200">
                      {album.category}
                    </span>
                    <h3 className="text-lg font-bold font-serif text-navy-900 mt-1">
                      {album.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(album.date).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>

                {/* Images grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {album.images && album.images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className="h-40 rounded-xl overflow-hidden cursor-pointer relative group border border-slate-200 bg-slate-100"
                    >
                      <img
                        src={img.url}
                        alt={img.caption || album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center text-white text-xs">
                        <span>{img.caption || 'Click to Enlarge'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl text-center border border-slate-200 text-slate-500">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold">No gallery albums available in this category.</p>
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 bg-navy-950/90 backdrop-blur flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full bg-black rounded-2xl overflow-hidden shadow-2xl">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 text-white bg-black/50 hover:bg-black rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={selectedImage.url}
                alt={selectedImage.caption}
                className="w-full max-h-[80vh] object-contain mx-auto"
              />
              {selectedImage.caption && (
                <div className="p-4 bg-navy-900 text-white text-center text-xs font-medium">
                  {selectedImage.caption}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Gallery;
