const { Oferta, Empresa, PreguntaOferta, RequisitoOferta } = require('../models');

exports.crearOferta = async (req, res) => {
  try {
    const { titulo, descripcion, duracion, requiereCV, requiereCarta, empresaId, requisitos } = req.body;

    // Crear la oferta
    const nuevaOferta = await Oferta.create({
      titulo,
      descripcion,
      duracion,
      requiereCV,
      requiereCarta,
      empresaId
    });

    // Crear requisitos si existen
    if (requisitos && Array.isArray(requisitos) && requisitos.length > 0) {
      const requisitosACrear = requisitos.map((req, index) => ({
        ofertaId: nuevaOferta.id,
        descripcion: req.descripcion,
        tipo: req.tipo || 'obligatorio',
        categoria: req.categoria || 'otro',
        orden: req.orden || index + 1
      }));

      await RequisitoOferta.bulkCreate(requisitosACrear);
    }

    // Retornar oferta con requisitos
    const ofertaCompleta = await Oferta.findByPk(nuevaOferta.id, {
      include: [{
        model: RequisitoOferta,
        order: [['orden', 'ASC']]
      }]
    });

    res.status(201).json({ 
      mensaje: 'Oferta creada exitosamente', 
      oferta: ofertaCompleta 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear oferta', detalle: error.message });
  }
};

exports.obtenerOfertas = async (req, res) => {
  try {
    const ofertas = await Oferta.findAll({
      include: [
        {
          model: Empresa,
          attributes: ['id', 'nombre_empresa', 'rubro']
        },
        {
          model: RequisitoOferta,
          attributes: ['id', 'descripcion', 'tipo', 'categoria', 'orden'],
          order: [['orden', 'ASC']]
        }
      ]
    });
    res.json(ofertas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ofertas', detalle: error.message });
  }
};

exports.obtenerOfertaPorId = async (req, res) => {
  try {
    const oferta = await Oferta.findByPk(req.params.id, {
      include: [
        {
          model: Empresa,
          attributes: ['id', 'nombre_empresa', 'rubro']
        },
        {
          model: RequisitoOferta,
          attributes: ['id', 'descripcion', 'tipo', 'categoria', 'orden'],
          order: [['orden', 'ASC']]
        },
        {
          model: PreguntaOferta,
          attributes: ['id', 'pregunta', 'tipo', 'opciones', 'requerida', 'orden'],
          order: [['orden', 'ASC']]
        }
      ]
    });
    if (!oferta) return res.status(404).json({ error: 'Oferta no encontrada' });
    res.json(oferta);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar oferta', detalle: error.message });
  }
};

exports.actualizarOferta = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, duracion, requiereCV, requiereCarta, requisitos } = req.body;

    const oferta = await Oferta.findByPk(id);
    if (!oferta) return res.status(404).json({ error: 'Oferta no encontrada' });

    // Actualizar campos de la oferta
    await oferta.update({
      titulo,
      descripcion,
      duracion,
      requiereCV,
      requiereCarta
    });

    // Si se envían requisitos, actualizar completamente
    if (requisitos && Array.isArray(requisitos)) {
      // Eliminar requisitos existentes
      await RequisitoOferta.destroy({ where: { ofertaId: id } });

      // Crear nuevos requisitos
      if (requisitos.length > 0) {
        const requisitosACrear = requisitos.map((req, index) => ({
          ofertaId: id,
          descripcion: req.descripcion,
          tipo: req.tipo || 'obligatorio',
          categoria: req.categoria || 'otro',
          orden: req.orden || index + 1
        }));

        await RequisitoOferta.bulkCreate(requisitosACrear);
      }
    }

    // Retornar oferta actualizada con requisitos
    const ofertaActualizada = await Oferta.findByPk(id, {
      include: [{
        model: RequisitoOferta,
        order: [['orden', 'ASC']]
      }]
    });

    res.json({ 
      mensaje: 'Oferta actualizada exitosamente', 
      oferta: ofertaActualizada 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar oferta', detalle: error.message });
  }
};

exports.eliminarOferta = async (req, res) => {
  try {
    const oferta = await Oferta.findByPk(req.params.id);
    if (!oferta) return res.status(404).json({ error: 'Oferta no encontrada' });

    // Los requisitos se eliminarán automáticamente por CASCADE (si se configura en la BD)
    // O podemos eliminarlos manualmente:
    await RequisitoOferta.destroy({ where: { ofertaId: req.params.id } });
    
    await oferta.destroy();
    res.json({ mensaje: 'Oferta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar oferta', detalle: error.message });
  }
};
