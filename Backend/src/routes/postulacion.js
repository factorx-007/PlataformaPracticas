const express = require('express');
const router = express.Router();
const postulacionController = require('../controllers/postulacionController');
const verifyToken = require('../middlewares/verifyToken');
const requireCompleteProfile = require('../middlewares/requireCompleteProfile');

// 🔐 Rutas protegidas (requieren login Y perfil completo)
router.post('/', verifyToken, requireCompleteProfile, postulacionController.crearPostulacion);
router.get('/mis-postulaciones', verifyToken, requireCompleteProfile, postulacionController.obtenerMisPostulaciones);
router.get('/empresa-postulaciones', verifyToken, requireCompleteProfile, postulacionController.obtenerPostulacionesEmpresa);
router.put('/:id', verifyToken, requireCompleteProfile, postulacionController.actualizarPostulacion);
router.delete('/:id', verifyToken, requireCompleteProfile, postulacionController.eliminarPostulacion);

// 🔓 Rutas públicas
router.get('/', postulacionController.obtenerPostulaciones);
router.get('/:id', postulacionController.obtenerPostulacionPorId);

module.exports = router;
