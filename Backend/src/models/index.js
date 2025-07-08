const sequelize = require('../config/db');

// Importación de modelos
const UsuarioModel = require('./Usuario');
const EstudianteModel = require('./Estudiante');
const EmpresaModel = require('./Empresa');
const OfertaModel = require('./Oferta');
const RequisitoOfertaModel = require('./RequisitoOferta');
const PostulacionModel = require('./Postulacion');
const PreguntaOfertaModel = require('./PreguntaOferta');
const RespuestaPostulacionModel = require('./RespuestaPostulacion');
const CategoriaModel = require('./Categoria');
const BlogPostModel = require('./BlogPost');
const ComentarioModel = require('./Comentario');

// Inicialización
const Usuario = UsuarioModel(sequelize);
const Estudiante = EstudianteModel(sequelize);
const Empresa = EmpresaModel(sequelize);
const Oferta = OfertaModel(sequelize);
const RequisitoOferta = RequisitoOfertaModel(sequelize);
const Postulacion = PostulacionModel(sequelize);
const PreguntaOferta = PreguntaOfertaModel(sequelize);
const RespuestaPostulacion = RespuestaPostulacionModel(sequelize);
const Categoria = CategoriaModel(sequelize);
const BlogPost = BlogPostModel(sequelize);
const Comentario = ComentarioModel(sequelize);

// Relaciones del sistema principal
Usuario.hasOne(Estudiante, { foreignKey: 'usuarioId' });
Estudiante.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Usuario.hasOne(Empresa, { foreignKey: 'usuarioId' });
Empresa.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Empresa.hasMany(Oferta, { foreignKey: 'empresaId' });
Oferta.belongsTo(Empresa, { foreignKey: 'empresaId' });

// ✅ NUEVAS RELACIONES: Requisitos de Oferta
Oferta.hasMany(RequisitoOferta, { foreignKey: 'ofertaId' });
RequisitoOferta.belongsTo(Oferta, { foreignKey: 'ofertaId' });

// ✅ CAMBIO: Ahora Estudiante tiene las postulaciones (no Usuario)
Estudiante.hasMany(Postulacion, { foreignKey: 'estudianteId' });
Postulacion.belongsTo(Estudiante, { foreignKey: 'estudianteId' });

Oferta.hasMany(Postulacion, { foreignKey: 'ofertaId' });
Postulacion.belongsTo(Oferta, { foreignKey: 'ofertaId' });

// ✅ NUEVAS RELACIONES: Sistema de Preguntas y Respuestas
Oferta.hasMany(PreguntaOferta, { foreignKey: 'ofertaId' });
PreguntaOferta.belongsTo(Oferta, { foreignKey: 'ofertaId' });

Postulacion.hasMany(RespuestaPostulacion, { foreignKey: 'postulacionId' });
RespuestaPostulacion.belongsTo(Postulacion, { foreignKey: 'postulacionId' });

PreguntaOferta.hasMany(RespuestaPostulacion, { foreignKey: 'preguntaOfertaId' });
RespuestaPostulacion.belongsTo(PreguntaOferta, { foreignKey: 'preguntaOfertaId' });

// Relaciones del blog
Categoria.hasMany(BlogPost, { foreignKey: 'categoriaId' });
BlogPost.belongsTo(Categoria, { foreignKey: 'categoriaId' });

BlogPost.hasMany(Comentario, { foreignKey: 'postId' });
Comentario.belongsTo(BlogPost, { foreignKey: 'postId' });

module.exports = {
  sequelize,
  Usuario,
  Estudiante,
  Empresa,
  Oferta,
  RequisitoOferta,
  Postulacion,
  PreguntaOferta,
  RespuestaPostulacion,
  Categoria,
  BlogPost,
  Comentario
};
