//routes/api.js
const express = require('express');
const router = express.Router();
const { saludo } = require('../controllers/exampleController');

const authRoutes = require('./auth');
const empresaRoutes = require('./empresa');
const ofertaRoutes = require('./oferta');
const postulacionRoutes = require('./postulacion');

router.get('/', saludo);
router.use('/auth', authRoutes); 
router.use('/empresas', empresaRoutes);
router.use('/ofertas', ofertaRoutes);
router.use('/postulaciones', postulacionRoutes);

module.exports = router;
