const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');
const verifyToken = require('../middlewares/verifyToken');

// Protegidas
router.post('/', verifyToken, comentarioController.crearComentario);
router.put('/:id', verifyToken, comentarioController.actualizarComentario);
router.delete('/:id', verifyToken, comentarioController.eliminarComentario);

// Públicas
router.get('/', comentarioController.obtenerComentarios);
router.get('/:id', comentarioController.obtenerComentarioPorId);

module.exports = router;
