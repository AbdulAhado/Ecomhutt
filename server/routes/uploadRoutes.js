import path from 'path';
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = 'uploads/';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// function checkFileType(file, cb) {
//   const filetypes = /jpg|jpeg|png|webp|gif/i;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb(new Error(`Images only! (jpg, jpeg, png, webp, gif) - Received: ext=${path.extname(file.originalname)}, mimetype=${file.mimetype}`));
//   }
// }
function checkFileType(file, cb) {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  cb(
    new Error(
      `Only image files are allowed. Received: ${file.mimetype}`
    )
  );
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

router.post('/', upload.array('images', 3), async (req, res) => {
  console.log('Upload route hit. req.files:', req.files, 'req.body:', req.body);
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No file uploaded or invalid file type.' });
  }
  
  try {
    const uploadPromises = req.files.map(file => {
      const absolutePath = path.resolve(file.path);
      return cloudinary.uploader.upload(absolutePath, {
        folder: 'ecomhutt',
        fetch_format: 'auto',
        quality: 'auto',
        timeout: 120000 // 120 seconds timeout
      });
    });

    const uploadResults = await Promise.all(uploadPromises);
    const paths = uploadResults.map(result => {
      return cloudinary.url(result.public_id, {
        fetch_format: 'auto',
        quality: 'auto',
        secure: true
      });
    });

    // Delete local files
    req.files.forEach(file => {
      fs.unlink(file.path, (err) => {
        if (err) console.error('Failed to delete local image:', err);
      });
    });

    res.send(paths);
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Failed to upload images to Cloudinary' });
  }
});

// Handle multer errors
router.use((err, req, res, next) => {
  console.error('Multer error:', err);
  if (err) {
    return res.status(400).json({ message: err.message || 'File upload error' });
  }
  next();
});

export default router;
