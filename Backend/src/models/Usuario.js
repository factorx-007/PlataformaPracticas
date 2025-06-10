// src/models/Usuario.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Usuario', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    rol: {
      type: DataTypes.ENUM('postulante', 'empresa', 'admin'),
      allowNull: false,
    },
    cv: {
      type: DataTypes.STRING,       // Puedes guardar la ruta o URL del archivo PDF
      allowNull: true,              // ✅ Opcional
    }
  });
};
