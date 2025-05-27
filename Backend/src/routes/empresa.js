const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');
const verifyToken = require('../middlewares/verifyToken');

// ✅ Requiere login:
router.post('/', verifyToken, empresaController.crearEmpresa);
router.put('/:id', verifyToken, empresaController.actualizarEmpresa);
router.delete('/:id', verifyToken, empresaController.eliminarEmpresa);

// 🔓 Públicos:
router.get('/', empresaController.obtenerEmpresas);
router.get('/:id', empresaController.obtenerEmpresaPorId);

module.exports = router;
