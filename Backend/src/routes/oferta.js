const express = require('express');
const router = express.Router();
const ofertaController = require('../controllers/ofertaController');
const verifyToken = require('../middlewares/verifyToken');

// 🔐 Rutas protegidas (requieren login)
router.post('/', verifyToken, ofertaController.crearOferta);
router.put('/:id', verifyToken, ofertaController.actualizarOferta);
router.delete('/:id', verifyToken, ofertaController.eliminarOferta);

// 🔓 Rutas públicas
router.get('/', ofertaController.obtenerOfertas);
router.get('/:id', ofertaController.obtenerOfertaPorId);

module.exports = router;
