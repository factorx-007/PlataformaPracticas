// src/models/Empresa.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Empresa', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.TEXT },
    rubro: { type: DataTypes.STRING },
    usuarioId: { type: DataTypes.INTEGER, allowNull: false }, // FK
  });
};
