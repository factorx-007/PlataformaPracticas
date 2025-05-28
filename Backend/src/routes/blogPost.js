const express = require('express');
const router = express.Router();
const blogPostController = require('../controllers/blogPostController');
const verifyToken = require('../middlewares/verifyToken');

// Protegidas
router.post('/', verifyToken, blogPostController.crearPost);
router.put('/:id', verifyToken, blogPostController.actualizarPost);
router.delete('/:id', verifyToken, blogPostController.eliminarPost);

// Públicas
router.get('/', blogPostController.obtenerPosts);
router.get('/:id', blogPostController.obtenerPostPorId);

module.exports = router;
