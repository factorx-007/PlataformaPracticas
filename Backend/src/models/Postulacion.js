// src/models/Postulacion.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Postulacion = sequelize.define('Postulacion', {
  mensaje: { type: DataTypes.TEXT },
  estado: { type: DataTypes.ENUM('pendiente', 'aceptada', 'rechazada'), defaultValue: 'pendiente' },
  usuarioId: { type: DataTypes.INTEGER, allowNull: false }, // postulante
  ofertaId: { type: DataTypes.INTEGER, allowNull: false },  // FK
});

module.exports = Postulacion;
