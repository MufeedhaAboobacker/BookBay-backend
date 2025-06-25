import multer from 'multer';
import fs from 'fs'
import path from 'path';

// Uploads directory
// const uploadDir = path.resolve('uploads');

// Create uploads folder if not exist
// try {
//   if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true }); // <-- important!
//     console.log("Created 'uploads' folder at:", uploadDir);
//   }
// } catch (err) {
//   console.error("Error creating uploads folder:", err.message);
// }

// file filter 
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|pdf/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDF files are allowed'), false);
  }
};

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // upload 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName =`${Date.now()}-${file.fieldname}${ext}`;
    cb(null, uniqueName);
  }
});

// Export multer inst
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

export default upload;
