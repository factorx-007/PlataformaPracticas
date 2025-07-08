// src/routes/upload.js
const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { uploadMiddlewares } = require('../services/uploadService');
const verifyToken = require('../middlewares/verifyToken');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Upload de foto de perfil de estudiante
router.post('/foto-perfil', 
  uploadMiddlewares.fotosPerfil.single('foto'), 
  uploadController.uploadFotoPerfil
);

// Upload de logo de empresa
router.post('/logo', 
  uploadMiddlewares.logos.single('logo'), 
  uploadController.uploadLogo
);

// Upload de CV de estudiante
router.post('/cv', 
  uploadMiddlewares.cvs.single('cv'), 
  uploadController.uploadCV
);

// Upload de imagen para blog
router.post('/blog-image', 
  uploadMiddlewares.blogImages.single('imagen'), 
  uploadController.uploadBlogImage
);

// Eliminar archivo por public_id
router.delete('/:publicId', uploadController.deleteUploadedFile);

module.exports = router;
