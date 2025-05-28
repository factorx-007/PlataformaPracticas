const express = require('express');
const router = express.Router();
const postulacionController = require('../controllers/postulacionController');
const verifyToken = require('../middlewares/verifyToken');

// 🔐 Rutas protegidas
router.post('/', verifyToken, postulacionController.crearPostulacion);
router.put('/:id', verifyToken, postulacionController.actualizarPostulacion);
router.delete('/:id', verifyToken, postulacionController.eliminarPostulacion);

// 🔓 Rutas públicas
router.get('/', postulacionController.obtenerPostulaciones);
router.get('/:id', postulacionController.obtenerPostulacionPorId);

module.exports = router;
