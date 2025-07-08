// src/models/Estudiante.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Estudiante', {
    usuarioId: { type: DataTypes.INTEGER, allowNull: false }, // FK
    cv: { 
      type: DataTypes.STRING, 
      allowNull: true,
      comment: 'Ruta/URL del archivo PDF'
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
    foto_perfil: { 
      type: DataTypes.STRING, 
      allowNull: true,
      comment: 'Ruta de la imagen'
    },
    tipo: { 
      type: DataTypes.ENUM('estudiante', 'egresado'),
      allowNull: false 
    }
  });
};
