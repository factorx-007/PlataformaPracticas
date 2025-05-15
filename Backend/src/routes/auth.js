//src/routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login, perfil, logout } = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/register', register);
router.post('/login', login);
router.get('/perfil', verifyToken, perfil);   // ✅ protegida
router.post('/logout', verifyToken, logout);  // ✅ también protegida (opcional)

module.exports = router;
