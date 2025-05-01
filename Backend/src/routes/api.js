const express = require('express');
const router = express.Router();
const { saludo } = require('../controllers/exampleController');

router.get('/', saludo);

module.exports = router;
