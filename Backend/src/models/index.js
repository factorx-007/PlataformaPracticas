const sequelize = require('../config/db');

// Importación de modelos
const UsuarioModel = require('./Usuario');
const EmpresaModel = require('./Empresa');
const OfertaModel = require('./Oferta');
const PostulacionModel = require('./Postulacion');
const CategoriaModel = require('./Categoria');
const BlogPostModel = require('./BlogPost');
const ComentarioModel = require('./Comentario');

// Inicialización
const Usuario = UsuarioModel(sequelize);
const Empresa = EmpresaModel(sequelize);
const Oferta = OfertaModel(sequelize);
const Postulacion = PostulacionModel(sequelize);
const Categoria = CategoriaModel(sequelize);
const BlogPost = BlogPostModel(sequelize);
const Comentario = ComentarioModel(sequelize);

// Relaciones del sistema principal
Usuario.hasOne(Empresa, { foreignKey: 'usuarioId' });
Empresa.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Empresa.hasMany(Oferta, { foreignKey: 'empresaId' });
Oferta.belongsTo(Empresa, { foreignKey: 'empresaId' });

Usuario.hasMany(Postulacion, { foreignKey: 'usuarioId' });
Postulacion.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Oferta.hasMany(Postulacion, { foreignKey: 'ofertaId' });
Postulacion.belongsTo(Oferta, { foreignKey: 'ofertaId' });

// Relaciones del blog
Categoria.hasMany(BlogPost, { foreignKey: 'categoriaId' });
BlogPost.belongsTo(Categoria, { foreignKey: 'categoriaId' });

BlogPost.hasMany(Comentario, { foreignKey: 'postId' });
Comentario.belongsTo(BlogPost, { foreignKey: 'postId' });

module.exports = {
  sequelize,
  Usuario,
  Empresa,
  Oferta,
  Postulacion,
  Categoria,
  BlogPost,
  Comentario
};
