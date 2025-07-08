// src/models/PreguntaOferta.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('PreguntaOferta', {
    ofertaId: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      comment: 'FK a Oferta'
    },
    pregunta: { 
      type: DataTypes.TEXT, 
      allowNull: false,
      comment: 'Texto de la pregunta'
    },
    tipo: {
      type: DataTypes.ENUM('text', 'number', 'select', 'textarea'),
      allowNull: false,
      defaultValue: 'text',
      comment: 'Tipo de input para la respuesta'
    },
    opciones: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Array de opciones para tipo select'
    },
    requerida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Si la pregunta es obligatoria'
    },
    orden: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: 'Orden de presentación de la pregunta'
    }
  });
};
