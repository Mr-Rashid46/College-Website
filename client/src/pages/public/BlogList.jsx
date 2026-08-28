import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import BlogCard from '../../components/public/BlogCard';
import { BookOpen, Search } from 'lucide-react';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        let url = '/blogs?limit=20';
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
    fetchBlogs();
  }, [searchQuery]);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* Banner Header */}
        <div className="bg-navy-900 text-white rounded-2xl p-8 shadow-xl border border-navy-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-xs font-bold uppercase text-gold-400 tracking-wider">Publications</span>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif text-white mt-1 flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-gold-500" />
              <span>Institutional Blogs & News</span>
            </h1>
            <p className="text-xs text-slate-300 mt-2 max-w-xl">
              Articles on accreditation achievements, NEP 2020 initiatives, research projects, and campus milestones.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-navy-800 text-white text-xs pl-9 pr-4 py-2.5 rounded-lg border border-navy-700 focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        {/* Blogs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <BlogCard key={b._id} blog={b} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl text-center border border-slate-200 text-slate-500">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold">No blog articles found matching your search.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogList;
