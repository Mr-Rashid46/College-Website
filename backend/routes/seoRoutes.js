const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const Programme = require('../models/Programme');
const Blog = require('../models/Blog');
const Notice = require('../models/Notice');

// @route GET /sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = process.env.CLIENT_URL || req.protocol + '://' + req.get('host');

    // Fetch published entities
    const pages = await Page.find({ status: 'published' }).select('slug updatedAt');
    const programmes = await Programme.find({ status: 'published' }).select('_id updatedAt');
    const blogs = await Blog.find({ status: 'published' }).select('slug updatedAt');

    const staticRoutes = [
      '',
      '/programmes',
      '/faculty',
      '/notices',
      '/gallery',
      '/blogs',
      '/committees',
      '/contact',
      '/privacy-policy',
      '/terms-of-use',
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    staticRoutes.forEach((route) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${route}</loc>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n`;
      xml += `  </url>\n`;
    });

    // Dynamic CMS Pages
    pages.forEach((p) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/page/${p.slug}</loc>\n`;
      xml += `    <lastmod>${new Date(p.updatedAt).toISOString()}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });

    // Programmes
    programmes.forEach((prog) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/programmes/${prog._id}</loc>\n`;
      xml += `    <lastmod>${new Date(prog.updatedAt).toISOString()}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    // Blogs
    blogs.forEach((b) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/blogs/${b.slug}</loc>\n`;
      xml += `    <lastmod>${new Date(b.updatedAt).toISOString()}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
});

// @route GET /robots.txt
router.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.CLIENT_URL || req.protocol + '://' + req.get('host');
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.send(robots);
});

module.exports = router;
