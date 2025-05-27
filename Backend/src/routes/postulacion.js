const express = require('express');
const router = express.Router();
const postulacionController = require('../controllers/postulacionController');

router.post('/', postulacionController.crearPostulacion);
router.get('/', postulacionController.obtenerPostulaciones);
router.get('/:id', postulacionController.obtenerPostulacionPorId);
router.put('/:id', postulacionController.actualizarPostulacion);
router.delete('/:id', postulacionController.eliminarPostulacion);

module.exports = router;
