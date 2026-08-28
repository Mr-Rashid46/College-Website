# Credentials Handover & Support Maintenance Protocol

**Project**: N. K. T. Thanawala College Dynamic CMS & Web Portal  
**Document Type**: Handover Protocol & Service Level Agreement (SLA)  
**Date**: August 2026  

---

## 1. System Credentials Inventory (Template & Sign-off)

> [!IMPORTANT]
> Upon official handover sign-off, all default passwords below must be changed immediately by the institution's IT Administrator.

| Service / Account | Platform / Host | Access URL / Identifier | Default Username / Role | Action Required |
| :--- | :--- | :--- | :--- | :--- |
| **CMS Superadmin** | Application Portal | `/admin/login` | `admin@nktt.edu.in` | **Change Password Immediately** |
| **CMS Editor** | Application Portal | `/admin/login` | `editor@nktt.edu.in` | Update email & password |
| **MongoDB Atlas** | Database Cluster | `cloud.mongodb.com` | `nktt_db_admin` | Transfer Owner Email |
| **SMTP Server** | Email Provider | `smtp.gmail.com` / cPanel | `no-reply@nkttcollege.edu.in` | Update App Password |
| **Hosting Server** | VPS / PM2 / Render | IP / Dashboard | Root / SSH Key | Revoke Developer SSH Key |
| **DNS Manager** | Domain Registrar | GoDaddy / Cloudflare | Domain Registrar Login | Transfer 2FA to IT Head |

---

## 2. Post-Handover Support Maintenance Agreement (SLA)

### Scope of Warranty (Initial 90-Day Handover Period)
- **Bug Fixes**: Rectification of any software defects, broken endpoints, or rendering glitches without additional charge.
- **Security Patches**: Immediate patching of zero-day security vulnerabilities in core Node.js dependencies.
- **Database Backups**: Verification of automated 30-day daily backup rotation scripts.

### Maintenance Exclusions
- Adding new feature modules not included in the original project specification.
- Content entry (the college staff is responsible for populating notices, faculty photos, and text).
- Third-party hosting downtime or domain expiry caused by unpaid registrar fees.

### Emergency Response Targets
- **Critical (Site Down / Security Breach)**: Response within 2 hours; resolution within 8 hours.
- **Major (Notice Upload Issue / Broken Image Link)**: Response within 6 hours; resolution within 24 hours.
- **Minor (Formatting tweak / Content Advice)**: Response within 24 hours.

---

## 3. Official Sign-off & Transfer Acknowledgement

By signing below, the Client confirms receipt of all system credentials, administrative user manuals, source code repositories, and operational access keys.

- **Developer / Lead Engineer**: ___________________________ Date: ____________
- **College IT Principal / Representative**: _________________ Date: ____________
