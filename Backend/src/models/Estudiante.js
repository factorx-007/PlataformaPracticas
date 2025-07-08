// src/models/Estudiante.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Estudiante', {
    usuarioId: { type: DataTypes.INTEGER, allowNull: false }, // FK
    cv: { 
      type: DataTypes.STRING, 
      allowNull: true,
      comment: 'URL del CV en Cloudinary'
    },
    foto_perfil: { 
      type: DataTypes.STRING, 
      allowNull: true,
      comment: 'URL de la foto de perfil en Cloudinary'
    },
    carrera: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    año_egreso: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: 'Solo para egresados'
    },
    telefono: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
    tipo: { 
      type: DataTypes.ENUM('estudiante', 'egresado'),
      allowNull: false 
    }
  });
};
