import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

const BlogCard = ({ blog }) => {
  const formattedDate = blog.publishDate
    ? new Date(blog.publishDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-2xl hover:border-gold-500/40 transition-all duration-300 flex flex-col group relative"
    >
      <div className="h-52 w-full bg-slate-100 overflow-hidden relative">
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy-950 via-navy-900 to-maroon-900 flex items-center justify-center text-gold-400 font-serif text-lg font-bold">
            DBATU Technological Pulse
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity"></div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2 font-medium">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gold-500" />
              <span>{formattedDate}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-gold-500" />
              <span>{blog.author || 'Administration'}</span>
            </div>
          </div>

          <h3 className="text-base font-bold font-serif text-navy-900 group-hover:text-maroon-600 transition-colors line-clamp-2 leading-snug">
            {blog.title}
          </h3>

          <div
            className="text-xs text-slate-600 mt-2 line-clamp-3 prose-content font-normal"
            dangerouslySetInnerHTML={{ __html: blog.content ? blog.content.substring(0, 150) + '...' : '' }}
          />
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {blog.tags.slice(0, 3).map((t, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 border border-slate-200">
                <Tag className="w-2.5 h-2.5 text-gold-600" />
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="pt-3 border-t border-slate-100">
          <Link
            to={`/blogs/${blog.slug}`}
            className="text-xs font-bold text-navy-900 hover:text-maroon-600 inline-flex items-center gap-1.5 group/link"
          >
            <span>Read Article</span>
            <ArrowRight className="w-4 h-4 text-gold-500 transition-transform group-hover/link:translate-x-1.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
