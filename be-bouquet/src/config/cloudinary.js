const multer = require('multer');
const path = require('path');
const fs = require('fs');

const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'REPLACE_ME' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'REPLACE_ME';

let cloudinary = null;
let upload;

if (isCloudinaryConfigured) {
  const cloudinaryLib = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  cloudinaryLib.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinaryLib,
    params: {
      folder: 'true-spark',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 800, height: 1000, crop: 'limit', quality: 'auto' }],
    },
  });

  cloudinary = cloudinaryLib;
  upload = multer({ storage });
  console.log('Image storage: Cloudinary');
} else {
  // Local disk fallback
  const uploadDir = path.join(__dirname, '../../public/uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    },
  });

  upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      const allowed = /jpg|jpeg|png|webp/i;
      cb(null, allowed.test(path.extname(file.originalname)));
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  });

  console.log('Image storage: Local disk (public/uploads)');
}

module.exports = { cloudinary, upload };
