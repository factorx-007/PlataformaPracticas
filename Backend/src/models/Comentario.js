module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');

  return sequelize.define('Comentario', {
    contenido: { type: DataTypes.TEXT, allowNull: false },
    postId: { type: DataTypes.INTEGER, allowNull: false } // FK a BlogPost
  });
};
