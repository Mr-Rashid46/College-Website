const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Page = require('./models/Page');
const Notice = require('./models/Notice');
const Programme = require('./models/Programme');
const FacultyStaff = require('./models/FacultyStaff');
const GalleryAlbum = require('./models/GalleryAlbum');
const Blog = require('./models/Blog');
const SliderBanner = require('./models/SliderBanner');
const Committee = require('./models/Committee');
const MenuItem = require('./models/MenuItem');
const SiteSettings = require('./models/SiteSettings');
const Faq = require('./models/Faq');
const Testimonial = require('./models/Testimonial');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/college_cms');
    console.log('🌱 Connected to MongoDB for seeding DBATU data...');

    // Clear existing collections
    await User.deleteMany({});
    await Page.deleteMany({});
    await Notice.deleteMany({});
    await Programme.deleteMany({});
    await FacultyStaff.deleteMany({});
    await GalleryAlbum.deleteMany({});
    await Blog.deleteMany({});
    await SliderBanner.deleteMany({});
    await Committee.deleteMany({});
    await MenuItem.deleteMany({});
    await SiteSettings.deleteMany({});
    await Faq.deleteMany({});
    await Testimonial.deleteMany({});

    console.log('🧹 Existing data wiped successfully.');

    // 1. Create Default Users
    const superadmin = await User.create({
      name: 'Dr. System Administrator',
      email: 'admin@dbatu.ac.in',
      password: 'admin123',
      role: 'superadmin',
      isActive: true,
    });

    const editor = await User.create({
      name: 'Prof. Academic Editor',
      email: 'editor@dbatu.ac.in',
      password: 'editor123',
      role: 'editor',
      isActive: true,
    });

    console.log('✅ DBATU Users seeded: Super Admin (admin@dbatu.ac.in / admin123)');

    // 2. DBATU Site Settings Singleton
    await SiteSettings.create({
      collegeName: 'Dr. Babasaheb Ambedkar Technological University',
      shortName: 'DBATU Lonere',
      tagLine: 'Premier State Technological University of Maharashtra | NAAC Accredited & UGC Recognized',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&auto=format&fit=crop&q=80',
      address: 'DBATU Main Campus, Lonere, Mangaon, Raigad District, Maharashtra - 402103',
      phoneNumbers: ['+91 2140 275142', '+91 2140 275081'],
      emails: ['registrar@dbatu.ac.in', 'vc@dbatu.ac.in'],
      socialLinks: {
        facebook: 'https://facebook.com/dbatustudent',
        twitter: 'https://twitter.com/dbatu_official',
        instagram: 'https://instagram.com/dbatu_lonere_official',
        youtube: 'https://youtube.com/c/DBATULonereOfficial',
        linkedin: 'https://linkedin.com/school/dbatu-lonere',
      },
      workingHours: 'Monday - Saturday: 9:30 AM - 5:30 PM',
      visitorCounter: 48920,
      footerText: '© 2026 Dr. Babasaheb Ambedkar Technological University (DBATU), Lonere, Raigad, Maharashtra. All Rights Reserved.',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3790.354124314112!2d73.3134958148873!3d18.17066918485293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be851c1404c0001%3A0xb35a09c2a6321bb4!2sDr.%20Babasaheb%20Ambedkar%20Technological%20University!5e0!3m2!1sen!2sin!4v1680000000000',
      statsCounters: {
        programmesCount: 28,
        departmentsCount: 14,
        studentsCount: 12500,
        facultyCount: 340,
      },
    });

    console.log('✅ DBATU Site Settings seeded.');

    // 3. Dynamic Menu Items
    const homeMenu = await MenuItem.create({ label: 'Home', url: '/', order: 1 });
    const aboutMenu = await MenuItem.create({ label: 'About DBATU', url: '/page/about', order: 2 });
    const academicMenu = await MenuItem.create({ label: 'Academics', url: '/programmes', order: 3 });
    const admissionsMenu = await MenuItem.create({ label: 'Admissions', url: '/page/admissions', order: 4 });
    const examMenu = await MenuItem.create({ label: 'Examinations', url: '/notices?category=Exam', order: 5 });
    const facultyMenu = await MenuItem.create({ label: 'Faculty & Administration', url: '/faculty', order: 6 });
    const placementMenu = await MenuItem.create({ label: 'Training & Placement', url: '/page/placement-cell', order: 7 });
    const iqacMenu = await MenuItem.create({ label: 'IQAC & NAAC', url: '/page/iqac', order: 8 });
    const galleryMenu = await MenuItem.create({ label: 'Campus Life', url: '/gallery', order: 9 });
    const blogsMenu = await MenuItem.create({ label: 'University News', url: '/blogs', order: 10 });
    const contactMenu = await MenuItem.create({ label: 'Contact Us', url: '/contact', order: 11 });

    // Submenus
    await MenuItem.create({ label: 'About University', url: '/page/about', parentId: aboutMenu._id, order: 1 });
    await MenuItem.create({ label: 'Vice Chancellor\'s Address', url: '/page/principal-message', parentId: aboutMenu._id, order: 2 });
    await MenuItem.create({ label: 'Campus & Infrastructure', url: '/page/infrastructure', parentId: aboutMenu._id, order: 3 });

    await MenuItem.create({ label: 'All Technological Programmes', url: '/programmes', parentId: academicMenu._id, order: 1 });
    await MenuItem.create({ label: 'Undergraduate (B.Tech & B.Pharm)', url: '/programmes?level=UG', parentId: academicMenu._id, order: 2 });
    await MenuItem.create({ label: 'Postgraduate (M.Tech, MCA, M.Pharm)', url: '/programmes?level=PG', parentId: academicMenu._id, order: 3 });

    await MenuItem.create({ label: 'Placement Highlights & Stats', url: '/page/placement-cell', parentId: placementMenu._id, order: 1 });
    await MenuItem.create({ label: 'Student Placement Registration', url: '/page/placement-cell', parentId: placementMenu._id, order: 2 });

    await MenuItem.create({ label: 'CAP Admission Procedure', url: '/page/admissions', parentId: admissionsMenu._id, order: 1 });
    await MenuItem.create({ label: 'Merit Lists & Notices', url: '/notices?category=Admission', parentId: admissionsMenu._id, order: 2 });

    await MenuItem.create({ label: 'IQAC Cell', url: '/page/iqac', parentId: iqacMenu._id, order: 1 });
    await MenuItem.create({ label: 'Statutory Committees', url: '/committees', parentId: iqacMenu._id, order: 2 });

    console.log('✅ Dynamic Menu Structure seeded.');

    // 4. Hero Slider Banners
    await SliderBanner.create([
      {
        image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1600&auto=format&fit=crop&q=80',
        title: 'Welcome to Dr. Babasaheb Ambedkar Technological University',
        subtitle: 'The Premier State Technological University of Maharashtra Empowering Engineers Since 1989',
        linkUrl: '/page/about',
        order: 1,
        isActive: true,
      },
      {
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80',
        title: 'Centralized Engineering & Pharmacy Admissions 2026-27',
        subtitle: 'Explore B.Tech, M.Tech, B.Pharm, MCA and Doctoral Ph.D. Research Programmes',
        linkUrl: '/programmes',
        order: 2,
        isActive: true,
      },
      {
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&auto=format&fit=crop&q=80',
        title: 'High-Performance Technological Research & Innovation Labs',
        subtitle: 'State-of-the-Art Supercomputing Facilities, Robotics Centers & Central Innovation Hub',
        linkUrl: '/page/infrastructure',
        order: 3,
        isActive: true,
      },
    ]);

    console.log('✅ Slider Banners seeded.');

    // 5. Notices & Announcements
    await Notice.create([
      {
        title: 'DBATU Winter 2026 Regular & Supplementary Examination Timetables Published',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        category: 'Exam',
        isFeatured: true,
        publishDate: new Date(),
        status: 'published',
      },
      {
        title: 'Provisional Merit List for B.Tech & M.Tech Admissions Academic Year 2026-27',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        category: 'Admission',
        isFeatured: true,
        publishDate: new Date(Date.now() - 2 * 86400000),
        status: 'published',
      },
      {
        title: 'DBATU Ph.D. Entrance Test (PET 2026) Online Registration Schedule',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        category: 'Circular',
        isFeatured: true,
        publishDate: new Date(Date.now() - 4 * 86400000),
        status: 'published',
      },
      {
        title: 'University Level Technical Symposium "Cynosure 2026" Event Guidelines',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        category: 'General',
        isFeatured: false,
        publishDate: new Date(Date.now() - 8 * 86400000),
        status: 'published',
      },
    ]);

    console.log('✅ DBATU Notices seeded.');

    // 6. DBATU Technological Programmes
    await Programme.create([
      {
        name: 'B.Tech in Computer Engineering',
        shortCode: 'BTECH-CE',
        level: 'UG',
        department: 'Computer Engineering',
        duration: '4 Years (8 Semesters)',
        seats: 120,
        eligibility: 'Passed 10+2 HSC Examination with Physics, Mathematics & Chemistry with MHT-CET / JEE Main score.',
        description: 'Cutting-edge engineering programme covering Data Structures, Artificial Intelligence, High-Performance Computing, Cloud Architecture, and Software Engineering.',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
        syllabusFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
      {
        name: 'B.Tech in Electronics & Telecommunication Engineering',
        shortCode: 'BTECH-EXTC',
        level: 'UG',
        department: 'Electronics & Telecommunication',
        duration: '4 Years (8 Semesters)',
        seats: 60,
        eligibility: 'Passed 10+2 HSC Examination with PCM and valid MHT-CET / JEE score.',
        description: 'Comprehensive curriculum focusing on VLSI System Design, Wireless Communication, Signal Processing, Embedded Systems, and Internet of Things (IoT).',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
        syllabusFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
      {
        name: 'B.Tech in Mechanical Engineering',
        shortCode: 'BTECH-ME',
        level: 'UG',
        department: 'Mechanical Engineering',
        duration: '4 Years (8 Semesters)',
        seats: 60,
        eligibility: 'Passed 10+2 HSC Examination with PCM and valid MHT-CET / JEE score.',
        description: 'Specialized education in CAD/CAM, Robotics, Mechatronics, Thermal Systems, Automotive Engineering, and Advanced Manufacturing.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
        syllabusFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
      {
        name: 'Bachelor of Pharmacy (B.Pharm)',
        shortCode: 'BPHARM',
        level: 'UG',
        department: 'Pharmacy',
        duration: '4 Years (8 Semesters)',
        seats: 100,
        eligibility: 'Passed 10+2 HSC with PCB / PCM and valid MHT-CET Pharmacy score.',
        description: 'PCI-approved pharmaceutical degree preparing students for Drug Design, Clinical Trials, Quality Control, and Pharmaceutical Biotechnology.',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
        syllabusFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
      {
        name: 'M.Tech in Computer Engineering',
        shortCode: 'MTECH-CE',
        level: 'PG',
        department: 'Computer Engineering',
        duration: '2 Years (4 Semesters)',
        seats: 18,
        eligibility: 'B.E. / B.Tech in Computer / IT with valid GATE score.',
        description: 'Advanced master research degree covering Deep Learning, Distributed Systems, Cryptography, and Big Data Analytics.',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
        syllabusFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
      {
        name: 'Master of Computer Applications (MCA)',
        shortCode: 'MCA',
        level: 'PG',
        department: 'Computer Applications',
        duration: '2 Years (4 Semesters)',
        seats: 60,
        eligibility: 'B.Sc. / BCA / B.Com / B.A. with Mathematics at 10+2 or Graduation level and MAH-MCA-CET score.',
        description: 'Postgraduate professional programme in Enterprise Application Development, Full-Stack Frameworks, and Mobile Computing.',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
        syllabusFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
    ]);

    console.log('✅ DBATU Academic Programmes seeded.');

    // 7. DBATU Faculty & Officers
    await FacultyStaff.create([
      {
        name: 'Prof. (Dr.) Karbhari V. Kale',
        designation: 'Vice Chancellor',
        department: 'University Executive Council',
        qualification: 'M.Sc., Ph.D. (Computer Science), Senior IEEE Member',
        email: 'vc@dbatu.ac.in',
        type: 'Administrative',
        photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
        order: 1,
      },
      {
        name: 'Dr. Bhagwan F. Jogi',
        designation: 'Registrar',
        department: 'University Secretariat',
        qualification: 'M.Tech, Ph.D. (Mechanical Engineering)',
        email: 'registrar@dbatu.ac.in',
        type: 'Administrative',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        order: 2,
      },
      {
        name: 'Prof. (Dr.) Arvind W. Kiwelekar',
        designation: 'Dean (Academics) & Senior Professor',
        department: 'Computer Engineering',
        qualification: 'M.Tech (IIT Bombay), Ph.D., SM-IEEE',
        email: 'awk.academics@dbatu.ac.in',
        type: 'Teaching',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        order: 3,
      },
      {
        name: 'Prof. (Dr.) Sanjay M. Pore',
        designation: 'Dean (Research & Development)',
        department: 'Civil Engineering',
        qualification: 'M.E., Ph.D. (Structural Engg)',
        email: 'smpore@dbatu.ac.in',
        type: 'Teaching',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        order: 4,
      },
      {
        name: 'Dr. Vivek S. Sathe',
        designation: 'Controller of Examinations',
        department: 'Examination Board',
        qualification: 'M.Tech, Ph.D.',
        email: 'coe@dbatu.ac.in',
        type: 'Administrative',
        photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
        order: 5,
      },
    ]);

    console.log('✅ DBATU Leadership & Officers seeded.');

    // 8. Gallery Albums
    await GalleryAlbum.create([
      {
        title: 'DBATU 34th Annual University Convocation Ceremony 2026',
        category: 'Event',
        date: new Date('2026-02-15'),
        images: [
          {
            url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=80',
            caption: 'Honorable Governor of Maharashtra addressing DBATU graduates',
          },
          {
            url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
            caption: 'Gold medalists receiving doctoral & engineering degrees',
          },
        ],
      },
      {
        title: 'National Level Technical Symposium "Cynosure 2026"',
        category: 'Cultural',
        date: new Date('2026-01-20'),
        images: [
          {
            url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
            caption: 'Robotics competition and AI project hackathon',
          },
        ],
      },
    ]);

    console.log('✅ Gallery Albums seeded.');

    // 9. DBATU News & Research Blogs
    await Blog.create([
      {
        title: 'DBATU Secures NAAC Accreditation with High Excellence Standards',
        slug: 'dbatu-naac-accreditation-excellence',
        author: 'University IQAC Cell',
        coverImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
        tags: ['NAAC', 'DBATU', 'Engineering Excellence', 'State University'],
        content: `
          <h2>A Major Milestone for State Technological Education</h2>
          <p>Dr. Babasaheb Ambedkar Technological University (DBATU), Lonere, has officially been awarded high accreditation by the National Assessment and Accreditation Council (NAAC).</p>
          <p>The NAAC peer inspection team lauded DBATU\'s state-of-the-art research centers, high placement records in premier MNCs, and pioneering technical curriculum aligned with Industry 4.0 standards.</p>
          <blockquote>"DBATU continues to lead technological advancements, empowering thousands of engineering and pharmacy students across Maharashtra." — Vice Chancellor Prof. (Dr.) Karbhari V. Kale</blockquote>
        `,
        publishDate: new Date('2026-03-01'),
      },
      {
        title: 'DBATU Implements NEP 2020 Flexible Credit Framework across All Engineering Branches',
        slug: 'dbatu-nep-2020-engineering-framework',
        author: 'Academic Council',
        coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
        tags: ['NEP2020', 'BTech Curriculum', 'Engineering Education', 'DBATU Lonere'],
        content: `
          <h2>Implementation of NEP 2020 in Technological Disciplines</h2>
          <p>DBATU Lonere has implemented the National Education Policy 2020 across all B.Tech, M.Tech, and B.Pharm affiliated institutes in Maharashtra.</p>
          <p>Key highlights include mandatory industrial internships, AI-based minor degree specializations, and credit transfers via Academic Bank of Credits (ABC ID).</p>
        `,
        publishDate: new Date('2026-02-18'),
      },
    ]);

    console.log('✅ DBATU Blogs seeded.');

    // 10. Committees
    await Committee.create([
      {
        name: 'Internal Quality Assurance Cell (IQAC)',
        type: 'Statutory',
        description: 'Monitors academic standards, research output, and quality enhancement across DBATU main campus and affiliated institutes.',
        membersList: [
          { name: 'Prof. (Dr.) Karbhari V. Kale', role: 'Chairperson' },
          { name: 'Prof. (Dr.) Arvind W. Kiwelekar', role: 'IQAC Director' },
          { name: 'Dr. Bhagwan F. Jogi', role: 'Member Secretary' },
        ],
      },
      {
        name: 'University Research & Development Committee',
        type: 'Statutory',
        description: 'Oversees doctoral research grants, industry-sponsored projects, and patent filings at DBATU.',
        membersList: [
          { name: 'Prof. (Dr.) Sanjay M. Pore', role: 'Dean R&D' },
          { name: 'Dr. Vivek S. Sathe', role: 'Member' },
        ],
      },
    ]);

    console.log('✅ DBATU Committees seeded.');

    // 11. Custom DBATU Dynamic Pages
    await Page.create([
      {
        title: 'About DBATU University',
        slug: 'about',
        seoTitle: 'About Dr. Babasaheb Ambedkar Technological University (DBATU), Lonere',
        seoDescription: 'Learn about DBATU, the sole State Technological University of Maharashtra located at Lonere, Raigad.',
        content: `
          <h1>Dr. Babasaheb Ambedkar Technological University (DBATU), Lonere</h1>
          <p>Dr. Babasaheb Ambedkar Technological University (DBATU) was established by the Government of Maharashtra under Act No. XXII of 2014 as the unitary and affiliating State Technological University of Maharashtra.</p>
          <p>Situated in the lush green campus at Lonere, Mangaon, Raigad, DBATU oversees technological education across more than 200 affiliated engineering, pharmacy, and architecture colleges in Maharashtra.</p>
          <h3>Our Vision</h3>
          <p>To be a leading Technological University fostering global excellence in engineering education, innovation, research, and sustainable societal development.</p>
          <h3>Our Mission</h3>
          <ul>
            <li>Provide quality technical education aligned with Industry 4.0 and global standards.</li>
            <li>Promote interdisciplinary research, patent generation, and incubation of technology start-ups.</li>
            <li>Ensure equitable access to technical education for rural and urban youth across Maharashtra.</li>
          </ul>
        `,
      },
      {
        title: 'Vice Chancellor\'s Message',
        slug: 'principal-message',
        seoTitle: 'Vice Chancellor\'s Message | DBATU Lonere',
        seoDescription: 'Read the official message from DBATU Vice Chancellor Prof. (Dr.) Karbhari V. Kale.',
        content: `
          <h1>Message from the Vice Chancellor</h1>
          <p>Dear Students, Faculty Members, and Stakeholders,</p>
          <p>Welcome to Dr. Babasaheb Ambedkar Technological University (DBATU), Lonere. As Maharashtra\'s premier State Technological University, DBATU is committed to nurturing world-class engineers, researchers, and technologists who will shape the future of industrial innovation.</p>
          <p>Our curriculum emphasizes hands-on research, NEP 2020 interdisciplinary learning, and strong industry partnerships.</p>
          <p>Warm regards,<br/><strong>Prof. (Dr.) Karbhari V. Kale</strong><br/>Vice Chancellor, DBATU Lonere</p>
        `,
      },
      {
        title: 'Campus Infrastructure & Research Centers',
        slug: 'infrastructure',
        seoTitle: 'Campus Facilities | DBATU Lonere',
        seoDescription: 'Explore the high-performance computing labs, central library, and research infrastructure at DBATU.',
        content: `
          <h1>DBATU Campus Infrastructure & Facilities</h1>
          <p>DBATU Lonere spans a sprawling 468-acre green campus equipped with world-class academic infrastructure:</p>
          <h3>1. Central Library & Knowledge Resource Hub</h3>
          <p>Housing over 1,00,000 technical volumes, IEEE Xplore, ScienceDirect e-journals, and 24/7 digital learning labs.</p>
          <h3>2. High-Performance Supercomputing Laboratory</h3>
          <p>Equipped with advanced GPU clusters, artificial intelligence workstations, and cloud computing infrastructure.</p>
          <h3>3. Central Innovation & Incubation Center</h3>
          <p>Providing seed funding, mentorship, and prototyping facilities for student entrepreneurs and technology start-ups.</p>
        `,
      },
      {
        title: 'DBATU CAP Admission Guidelines 2026-27',
        slug: 'admissions',
        seoTitle: 'Engineering & Pharmacy Admissions 2026-27 | DBATU Lonere',
        seoDescription: 'Guidelines and CAP application procedure for B.Tech, M.Tech, and B.Pharm admissions at DBATU.',
        content: `
          <h1>DBATU Admissions 2026-27 Guidelines</h1>
          <p>All undergraduate B.Tech and B.Pharm admissions at DBATU Lonere and its affiliated institutes are conducted via the Centralized Admission Process (CAP) governed by DTE Maharashtra & State CET Cell.</p>
          <h3>Step-by-Step Application Process</h3>
          <ol>
            <li>Register on the State CET Cell Maharashtra Portal (cetcell.mahacet.org) with MHT-CET / JEE / GATE score.</li>
            <li>Select DBATU Lonere (University Department Choice Codes) during CAP Option Form filling.</li>
            <li>Verify documents at designated ARC / Facilitation Centers.</li>
            <li>Confirm reporting at DBATU Main Campus, Lonere upon allotment.</li>
          </ol>
        `,
      },
      {
        title: 'IQAC & NAAC Cell DBATU',
        slug: 'iqac',
        seoTitle: 'Internal Quality Assurance Cell | DBATU Lonere',
        seoDescription: 'IQAC quality benchmarks and accreditation initiatives at DBATU.',
        content: `
          <h1>Internal Quality Assurance Cell (IQAC) - DBATU</h1>
          <p>The IQAC Cell at DBATU ensures high quality benchmarks in teaching, examination evaluation, research publications, and institutional governance across main campus and affiliated institutes.</p>
        `,
      },
      {
        title: 'Training & Placement Cell',
        slug: 'placement-cell',
        seoTitle: 'Training & Placement Cell | DBATU Lonere',
        seoDescription: 'Training & Placement Cell at DBATU Lonere: Corporate campus drives, salary packages, and placement registration.',
        content: `
          <p>Welcome to the official <strong>Training & Placement Cell</strong> of Dr. Babasaheb Ambedkar Technological University (DBATU), Lonere. Our dedicated placement division bridges academic excellence with industry requirements, facilitating campus placement drives, summer internships, and soft-skill workshops for B.Tech, M.Tech, B.Pharm, and MCA students.</p>
        `,
        blocks: [
          {
            type: 'hero_banner',
            data: {
              title: 'DBATU Training & Placement Cell',
              subtitle: 'Empowering Engineering & Technological Graduates for Top Global Corporate Careers',
              imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80',
            },
          },
          {
            type: 'cards_grid',
            data: {
              sectionTitle: 'Placement Statistics & Milestones (2025-26)',
              cards: [
                { title: 'Highest International Package', value: '₹24.5 LPA', subtitle: 'Offered by Leading MNC' },
                { title: 'Average B.Tech Salary Package', value: '₹7.8 LPA', subtitle: 'Across Computer, EXTC & Mech' },
                { title: 'Campus Placement Rate', value: '92.4%', subtitle: 'Eligible Graduates Placed' },
                { title: 'Recruiting Companies', value: '180+', subtitle: 'TCS, Infosys, Wipro, L&T, Tata Motors' },
              ],
            },
          },
          {
            type: 'accordion_faqs',
            data: {
              sectionTitle: 'Placement Policies & Selection FAQs',
              items: [
                {
                  title: 'What is the eligibility criterion for participating in campus drives?',
                  content: 'Students must maintain a minimum CPI of 6.0 without active backlogs at the time of drive registration.',
                },
                {
                  title: 'How can students register for upcoming placement drives?',
                  content: 'Fill out the online Placement Registration Form below or contact the TPO Coordinator at tpo@dbatu.ac.in.',
                },
              ],
            },
          },
          {
            type: 'custom_form',
            data: {
              formTitle: 'Student Placement Drive Registration Form',
              formDescription: 'Fill out your academic credentials to enroll in upcoming DBATU campus recruitment drives.',
              submitButtonText: 'Submit Placement Application',
              fields: [
                { label: 'Full Candidate Name', type: 'text', required: true, placeholder: 'Enter your full name' },
                { label: 'University Roll / PRN Number', type: 'text', required: true, placeholder: 'e.g. 2026CE104' },
                { label: 'Degree Programme & Department', type: 'select', required: true, options: 'B.Tech Computer Engg, B.Tech EXTC, B.Tech Mechanical, B.Tech Civil, M.Tech Data Science, B.Pharm, MCA' },
                { label: 'Student Email Address', type: 'email', required: true, placeholder: 'student@dbatu.ac.in' },
                { label: 'Contact Phone Number', type: 'phone', required: true, placeholder: '+91 9876543210' },
                { label: 'Current CPI / Aggregate Percentage', type: 'text', required: true, placeholder: 'e.g. 8.75' },
                { label: 'Link to Online Resume / Portfolio', type: 'text', required: false, placeholder: 'https://drive.google.com/your-resume-pdf' },
              ],
            },
          },
          {
            type: 'file_downloads',
            data: {
              sectionTitle: 'Placement Guidelines & Information Brochures',
              files: [
                {
                  title: 'DBATU Official Placement Information Brochure 2026-27',
                  description: 'Comprehensive handbook detailing recruiter statistics, department syllabi, and lab facilities.',
                  fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                },
              ],
            },
          },
        ],
      },
    ]);

    console.log('✅ Custom DBATU Dynamic Pages seeded.');

    // 12. Chatbot FAQs
    await Faq.create([
      {
        question: 'How do I apply for B.Tech or M.Tech admissions at DBATU?',
        answer: 'Admissions for B.Tech, M.Tech, B.Pharm, and MCA courses at DBATU are conducted via Centralized Admission Process (CAP) on the MHT-CET portal (cetcell.mahacet.org). Select DBATU Lonere during choice code filling.',
        keywords: ['admission', 'apply', 'form', 'enroll', 'process', 'cap', 'cet', 'btech', 'mtech'],
        category: 'Admission',
        order: 1,
        isActive: true,
      },
      {
        question: 'What technological degree programmes are offered at DBATU Lonere?',
        answer: 'DBATU offers B.Tech (Computer, EXTC, Mechanical, Civil), B.Pharm, M.Tech (Computer Engg), MCA, and Ph.D. research programmes. Visit our Academics page to view detailed syllabi.',
        keywords: ['course', 'programme', 'degree', 'btech', 'mtech', 'bpharm', 'mca', 'engineering'],
        category: 'Courses',
        order: 2,
        isActive: true,
      },
      {
        question: 'Where can I find winter and summer examination timetables?',
        answer: 'All official DBATU examination timetables, revaluation circulars, and merit lists are published on our Notice Board and official portal (dbatu.ac.in).',
        keywords: ['notice', 'exam', 'timetable', 'result', 'circular', 'winter', 'summer'],
        category: 'Exams',
        order: 3,
        isActive: true,
      },
      {
        question: 'What is the contact information for DBATU Lonere main campus?',
        answer: 'DBATU Campus is located at Lonere, Mangaon, Raigad District, Maharashtra - 402103. Phone: +91 2140 275142. Email: registrar@dbatu.ac.in.',
        keywords: ['contact', 'address', 'phone', 'location', 'email', 'lonere'],
        category: 'General',
        order: 4,
        isActive: true,
      },
      {
        question: 'How can reserved category students claim MahaDBT scholarships?',
        answer: 'Fee structures for DBATU technological programmes are displayed under Admissions. Category students can apply for Government Scholarships via MahaDBT portal.',
        keywords: ['fee', 'scholarship', 'freeship', 'mahadbt'],
        category: 'Fees',
        order: 5,
        isActive: true,
      },
    ]);

    console.log('✅ Chatbot FAQs seeded.');

    // 13. Student & Alumni Testimonials
    await Testimonial.create([
      {
        name: 'Aditya R. Sharma',
        role: 'B.Tech Computer Engineering (Batch 2024)',
        company: 'Software Engineer @ Tata Consultancy Services',
        quote: 'DBATU provided me with exceptional technical exposure. The supercomputing facilities and project-based learning prepared me directly for industry challenges.',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        rating: 5,
        order: 1,
        isActive: true,
      },
      {
        name: 'Priya V. Kulkarni',
        role: 'M.Tech Data Science (Batch 2025)',
        company: 'AI Research Scholar @ L&T Infotech',
        quote: 'The research culture and guidance from professors at DBATU Lonere enabled me to publish IEEE conference papers and land my dream research role.',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        rating: 5,
        order: 2,
        isActive: true,
      },
      {
        name: 'Rohan M. Patil',
        role: 'B.Tech Mechanical Engineering (Batch 2023)',
        company: 'Design Specialist @ Mahindra & Mahindra',
        quote: 'State-of-the-art CAD/CAM labs and robotics workshops at DBATU gave me hands-on confidence to solve complex mechanical engineering problems.',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        rating: 5,
        order: 3,
        isActive: true,
      },
    ]);

    console.log('✅ Testimonials seeded.');

    console.log('🎉 DBATU Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during database seeding:', err);
    process.exit(1);
  }
};

seedData();
