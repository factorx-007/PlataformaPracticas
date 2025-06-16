//routes/api.js
const express = require('express');
const router = express.Router();
const { saludo } = require('../controllers/exampleController');

const authRoutes = require('./auth');
const empresaRoutes = require('./empresa');
const ofertaRoutes = require('./oferta');
const postulacionRoutes = require('./postulacion');
const categoriaRoutes = require('./categoria');
const blogPostRoutes = require('./blogPost');
const comentarioRoutes = require('./comentario');

router.get('/', saludo);
router.use('/auth', authRoutes); 
router.use('/empresas', empresaRoutes);
router.use('/ofertas', ofertaRoutes);
router.use('/postulaciones', postulacionRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/posts', blogPostRoutes);
router.use('/comentarios', comentarioRoutes);

module.exports = router;
