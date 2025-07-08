//routes/api.js
const express = require('express');
const router = express.Router();
const { saludo } = require('../controllers/exampleController');

const authRoutes = require('./auth');
const estudianteRoutes = require('./estudiante');
const empresaRoutes = require('./empresa');
const ofertaRoutes = require('./oferta');
const postulacionRoutes = require('./postulacion');
const preguntaOfertaRoutes = require('./preguntaOferta');
const categoriaRoutes = require('./categoria');
const blogPostRoutes = require('./blogPost');
const comentarioRoutes = require('./comentario');
const uploadRoutes = require('./upload');

router.get('/', saludo);
router.use('/auth', authRoutes); 
router.use('/estudiantes', estudianteRoutes);
router.use('/empresas', empresaRoutes);
router.use('/ofertas', ofertaRoutes);
router.use('/postulaciones', postulacionRoutes);
router.use('/preguntas-oferta', preguntaOfertaRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/posts', blogPostRoutes);
router.use('/comentarios', comentarioRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
