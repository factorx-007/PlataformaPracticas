// src/models/Postulacion.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Postulacion', {
    mensaje: { type: DataTypes.TEXT },
    estado: {
      type: DataTypes.ENUM('pendiente', 'aceptada', 'rechazada'),
      defaultValue: 'pendiente',
    },
    usuarioId: { type: DataTypes.INTEGER, allowNull: false }, // FK
    ofertaId: { type: DataTypes.INTEGER, allowNull: false },  // FK
  });
};
