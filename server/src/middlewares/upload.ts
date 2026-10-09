import multer from 'multer';

const upload  = multer({
   storage: multer.memoryStorage(),
   limits: {
    fileSize: 90 * 1024 * 1024 // 90MB limit
   }
})

export default upload;