module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');

  return sequelize.define('Categoria', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.TEXT }
  });
};
