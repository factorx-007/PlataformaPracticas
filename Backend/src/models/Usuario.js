// src/models/Usuario.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Usuario', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { 
      type: DataTypes.STRING, 
      allowNull: true,  // ✅ Cambio: Permitir null para usuarios de Google
      comment: 'Null para usuarios que se registran con Google'
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      comment: 'ID único de Google OAuth'
    },
    rol: {
      type: DataTypes.ENUM('estudiante', 'egresado', 'empresa', 'admin'),
      allowNull: false,
    },
    perfilCompleto: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Si el usuario completó su perfil específico (Estudiante/Empresa)'
    }
  });
};
