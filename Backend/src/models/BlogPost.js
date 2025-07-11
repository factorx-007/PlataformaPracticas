module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');

  return sequelize.define('BlogPost', {
    titulo: { type: DataTypes.STRING, allowNull: false },
    contenido: { type: DataTypes.TEXT, allowNull: false },
    publicado: { type: DataTypes.BOOLEAN, defaultValue: true },
    categoriaId: { type: DataTypes.INTEGER, allowNull: false }, // FK a Categoria
    imagen_destacada: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'URL de imagen destacada en Cloudinary'
    }
  });
};
