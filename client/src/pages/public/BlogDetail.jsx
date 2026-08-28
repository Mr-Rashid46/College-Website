import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api/axios';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await API.get(`/blogs/slug/${slug}`);
        if (res.data.success) {
          setBlog(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load blog post:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-64 bg-slate-200 rounded-2xl"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold font-serif text-navy-900">Blog Article Not Found</h2>
        <Link to="/blogs" className="mt-4 inline-block text-xs font-bold text-navy-800 underline">
          Back to Blog List
        </Link>
      </div>
    );
  }

  const formattedDate = blog.publishDate
    ? new Date(blog.publishDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        
        <Link to="/blogs" className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-800 hover:text-maroon-600">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>

        <article className="bg-white rounded-2xl overflow-hidden shadow-card border border-slate-200">
          {blog.coverImage && (
            <div className="h-80 w-full bg-slate-100 relative">
              <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-6 sm:p-10 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gold-600" />
                  <span>{formattedDate}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-gold-600" />
                  <span>{blog.author || 'College Administration'}</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold font-serif text-navy-900 leading-tight">
                {blog.title}
              </h1>
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                {blog.tags.map((tag, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Tag className="w-3 h-3 text-gold-600" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Rich content body */}
            <div
              className="prose-content pt-4 border-t border-slate-100"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </article>

      </div>
    </div>
  );
};

export default BlogDetail;
