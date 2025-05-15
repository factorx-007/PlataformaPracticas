const sequelize = require('../config/db');

// Importación de modelos como funciones
const UsuarioModel = require('./Usuario');
const EmpresaModel = require('./Empresa');
const OfertaModel = require('./Oferta');
const PostulacionModel = require('./Postulacion');

// Inicialización con instancia de sequelize
const Usuario = UsuarioModel(sequelize);
const Empresa = EmpresaModel(sequelize);
const Oferta = OfertaModel(sequelize);
const Postulacion = PostulacionModel(sequelize);

// Definir relaciones
Usuario.hasOne(Empresa, { foreignKey: 'usuarioId' });
Empresa.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Empresa.hasMany(Oferta, { foreignKey: 'empresaId' });
Oferta.belongsTo(Empresa, { foreignKey: 'empresaId' });

Usuario.hasMany(Postulacion, { foreignKey: 'usuarioId' });
Postulacion.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Oferta.hasMany(Postulacion, { foreignKey: 'ofertaId' });
Postulacion.belongsTo(Oferta, { foreignKey: 'ofertaId' });

module.exports = {
  sequelize,
  Usuario,
  Empresa,
  Oferta,
  Postulacion,
};
