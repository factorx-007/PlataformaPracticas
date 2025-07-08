// src/models/Empresa.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Empresa', {
    usuarioId: { type: DataTypes.INTEGER, allowNull: false }, // FK
    ruc: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true,
      comment: 'Solo guardamos el ruc'
    },
    nombre_empresa: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    rubro: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    descripcion: { 
      type: DataTypes.TEXT, 
      allowNull: true 
    },
    direccion: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
    telefono: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
    logo_url: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'URL del logo en Cloudinary'
    }
  });
};
