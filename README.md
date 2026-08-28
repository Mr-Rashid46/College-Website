# Dynamic College Content Management System (MERN Stack)

A full-stack, production-ready **Dynamic Content Management System (CMS)** built for educational institutions (modeled after **NKTT College Thane - https://www.nktt.edu.in/**). 

Every single piece of content on the public site—including multi-level navigation menus, hero sliders, notices & circulars with PDF attachments, academic programmes, faculty directory, photo gallery albums, blogs, committee rosters, and site settings—is editable via the custom-built **Admin Panel** without needing code deployments.

---

## 🌟 Key Features

### 🏛️ Public-Facing Institutional Website
- **Dynamic Multi-Level Mega Navbar**: Rendered directly from `MenuItem` MongoDB collection (supporting nested dropdowns, custom URLs & ordering).
- **Hero Banner Slider**: Animated homepage carousel with custom titles, taglines, and call-to-action buttons.
- **Scrolling Announcements Ticker**: Marquee display of featured notices with automatic `"NEW"` badges for notices published within 7 days.
- **Academic Programmes Directory**: Filterable by level (UG / PG / Diploma / Certificate) with seat count, eligibility, duration, and downloadable syllabus PDFs.
- **Faculty & Staff Directory**: Searchable directory by department and type (Teaching / Administrative) with photo cards and email links.
- **Official Notice Board**: Category-filterable (Admission / Exam / General / Circular) with search bar and direct PDF attachment uploader.
- **Photo Gallery & Lightbox**: Categorized albums (Events / Sports / Cultural / Campus) with full-screen interactive lightbox.
- **Institutional Blogs & News**: Rich text blog posts with tag pills, cover images, and author metadata.
- **Virtual Assistant Chatbot**: Floating interactive helper answering student queries on admissions, fees, timetables, and campus contacts.
- **Interactive Contact Us Form**: Form submission writing to `ContactSubmission` with rate limiting, live Google Map embed, and dynamic phone/email/address details.
- **SEO & Responsiveness**: Dynamic page title and meta descriptions powered by `react-helmet-async`, fully mobile-responsive UI with smooth scroll animations.

### 🔐 Custom Admin Panel (`/admin`)
- **JWT Authentication & RBAC**: Secure admin login with password hashing (`bcryptjs`) and Role-Based Access Control (`superadmin`, `editor`).
- **Dashboard Overview**: Metrics cards (Notices, Programmes, Unread Inquiries, Blogs) + recent submission feed.
- **Rich Text Editor**: Integrated `ReactQuill` editor for Pages and Blogs.
- **Media & Document Uploader**: Drag-and-drop file uploader supporting images and PDF attachments.
- **Dynamic Menu Builder**: Interactive tree manager for updating public navbar links and dropdown sub-items.
- **Site Settings Singleton Editor**: Update college name, emblem logo, contact numbers, email addresses, working hours, social links, and visitor counter.
- **Contact Submissions Inbox**: View inquiries, mark read/unread, read detailed messages, or delete.
- **User Management (Superadmin Only)**: Create, edit, activate/deactivate, or remove admin/editor user accounts.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Axios, React Router v6, Lucide Icons, React Quill, React Helmet Async
- **Backend**: Node.js, Express.js (REST API), MongoDB with Mongoose ODM
- **Security & Uploads**: JWT Authentication, bcryptjs, Multer Disk Storage (`/server/uploads`), Express Rate Limit, Helmet, Cors, Morgan
- **Database Seeder**: Automated seed script (`seed.js`) populating realistic institutional demo data.

---

## 🚀 Quick Setup & Installation Guide

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB installed locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI string.

---

### Step 1: Clone & Configure Server

```bash
cd server
npm install
```

Create `.env` inside `/server`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/college_cms
JWT_SECRET=college_cms_super_secret_jwt_key_2026
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

### Step 2: Seed the Database with Demo Data

Run the seeder script to clear and populate all 12 MongoDB collections with realistic sample data:

```bash
npm run seed
```

---

### Step 3: Configure & Start Frontend Client

In a new terminal:

```bash
cd client
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`.

---

### Step 4: Start Backend Server

```bash
cd server
npm run dev
```

The server REST API will run at `http://localhost:5000`.

---

## 🔐 Default Admin Credentials

Immediately test the Admin Panel at **`http://localhost:5173/admin/login`**:

- **Super Admin Account**:
  - **Email**: `admin@nktt.edu.in`
  - **Password**: `admin123`
  - **Access**: Full system access including User Management & Site Settings.

- **Editor Account**:
  - **Email**: `editor@nktt.edu.in`
  - **Password**: `editor123`
  - **Access**: Content management (Notices, Programmes, Faculty, Blogs, Gallery, Pages).

---

## 📡 Key REST API Endpoints Summary

```
POST   /api/auth/login        Admin JWT Login
GET    /api/auth/me           Get Current Profile
GET    /api/auth/users        List All Admin Users (Superadmin)

GET    /api/pages             Public Published Pages list / Search
GET    /api/pages/slug/:slug  Get Single Page by Slug
POST   /api/pages             Create Page (Admin)
PUT    /api/pages/:id         Update Page (Admin)
DELETE /api/pages/:id         Delete Page (Admin)

GET    /api/notices           Get Notices (Filterable by category & isFeatured)
POST   /api/notices           Create Notice (Admin)

GET    /api/programmes        Get Degree Courses (Filterable by level/department)
POST   /api/programmes        Create Programme (Admin)

GET    /api/faculty           Get Faculty Staff (Filterable by type/department)
POST   /api/faculty           Add Faculty Member (Admin)

GET    /api/gallery           Get Photo Albums (Filterable by category)
POST   /api/gallery           Create Gallery Album (Admin)

GET    /api/blogs             Get Articles (Searchable, paginated)
POST   /api/blogs             Create Blog Post (Admin)

GET    /api/sliders           Get Active Homepage Hero Banners
POST   /api/sliders           Add Hero Banner (Admin)

GET    /api/committees        Get Statutory & Non-Statutory Committees
POST   /api/committees        Create Committee (Admin)

GET    /api/menu              Get Hierarchical Public Navbar Menu Tree
POST   /api/menu              Create / Update Menu Item (Admin)

POST   /api/contact           Submit Public Contact Inquiry (Rate-limited)
GET    /api/contact           Get Submissions Inbox (Admin)

GET    /api/settings          Get Site Settings Singleton & Increment Visitor Count
PUT    /api/settings          Update Site Settings (Admin)

POST   /api/upload            Upload Image/PDF file (Multer)
```
