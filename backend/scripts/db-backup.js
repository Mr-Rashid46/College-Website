/**
 * Database Automated Backup & Retention Utility
 * Can be executed via Cron or PM2 Cron task
 */
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const BACKUP_DIR = path.join(__dirname, '../backups');
const MAX_RETENTION_DAYS = 30;

// Ensure backup folder exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const runBackup = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFolder = path.join(BACKUP_DIR, `backup-${timestamp}`);
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/college-cms';

  console.log(`[${new Date().toISOString()}] Starting automated database backup...`);

  // Try executing mongodump
  const cmd = `mongodump --uri="${mongoUri}" --out="${backupFolder}"`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.warn(`mongodump CLI binary not found or failed. Falling back to Mongoose JSON dump. Detail: ${error.message}`);
      fallbackJsonBackup(backupFolder);
      return;
    }
    console.log(`✅ Backup successfully created at: ${backupFolder}`);
    cleanOldBackups();
  });
};

// Fallback method exporting JSON dumps of main collections if mongodump CLI is not installed locally
const fallbackJsonBackup = async (targetFolder) => {
  try {
    const mongoose = require('mongoose');
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/college-cms';
    
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoUri);
    }

    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const col of collections) {
      const docs = await mongoose.connection.db.collection(col.name).find({}).toArray();
      const filePath = path.join(targetFolder, `${col.name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(docs, null, 2));
    }

    console.log(`✅ Fallback JSON database dump created at: ${targetFolder}`);
    cleanOldBackups();
  } catch (err) {
    console.error(`❌ Fallback JSON backup failed: ${err.message}`);
  }
};

// Cleanup backups older than retention policy (30 days)
const cleanOldBackups = () => {
  const now = Date.now();
  const retentionMs = MAX_RETENTION_DAYS * 24 * 60 * 60 * 1000;

  fs.readdir(BACKUP_DIR, (err, files) => {
    if (err) return;
    files.forEach((file) => {
      const filePath = path.join(BACKUP_DIR, file);
      fs.stat(filePath, (statErr, stats) => {
        if (statErr) return;
        if (now - stats.ctimeMs > retentionMs) {
          fs.rm(filePath, { recursive: true, force: true }, (rmErr) => {
            if (!rmErr) console.log(`🗑️ Rotated old backup: ${file}`);
          });
        }
      });
    });
  });
};

// Run directly if invoked from command line
if (require.main === module) {
  runBackup();
}

module.exports = { runBackup };
