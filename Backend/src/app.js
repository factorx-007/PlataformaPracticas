const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const apiRoutes = require('./routes/api');

const app = express();

// Middlewares globales
app.use(cors({
    origin: 'http://localhost:3000',  
    credentials: true                 
}));
app.use(express.json());
app.use(morgan('dev'));

// Rutas base (se irán agregando luego)
app.get('/', (req, res) => {
  res.send('Hola ProTalent');
});

// Montar rutas
app.use('/api', apiRoutes);

module.exports = app;
