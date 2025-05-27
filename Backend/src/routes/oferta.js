const express = require('express');
const router = express.Router();
const ofertaController = require('../controllers/ofertaController');

router.post('/', ofertaController.crearOferta);
router.get('/', ofertaController.obtenerOfertas);
router.get('/:id', ofertaController.obtenerOfertaPorId);
router.put('/:id', ofertaController.actualizarOferta);
router.delete('/:id', ofertaController.eliminarOferta);

module.exports = router;
