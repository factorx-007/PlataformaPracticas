//routes/api.js
const express = require('express');
const router = express.Router();
const { saludo } = require('../controllers/exampleController');

const authRoutes = require('./auth');

router.get('/', saludo);
router.use('/auth', authRoutes); 

module.exports = router;
