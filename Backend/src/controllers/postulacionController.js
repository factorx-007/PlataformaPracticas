const { Postulacion, Oferta } = require('../models');

exports.crearPostulacion = async (req, res) => {
  try {
    const nuevaPostulacion = await Postulacion.create(req.body);
    res.status(201).json({ mensaje: 'Postulación creada', postulacion: nuevaPostulacion });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear postulación', detalle: error.message });
  }
};

exports.obtenerPostulaciones = async (req, res) => {
  try {
    const postulaciones = await Postulacion.findAll({
      include: [{ model: Oferta, attributes: ['id', 'titulo'] }]
    });
    res.json(postulaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener postulaciones' });
  }
};

exports.obtenerPostulacionPorId = async (req, res) => {
  try {
    const postulacion = await Postulacion.findByPk(req.params.id);
    if (!postulacion) return res.status(404).json({ error: 'Postulación no encontrada' });
    res.json(postulacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar postulación' });
  }
};

exports.actualizarPostulacion = async (req, res) => {
  try {
    const postulacion = await Postulacion.findByPk(req.params.id);
    if (!postulacion) return res.status(404).json({ error: 'Postulación no encontrada' });

    await postulacion.update(req.body);
    res.json({ mensaje: 'Postulación actualizada', postulacion });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar postulación' });
  }
};

exports.eliminarPostulacion = async (req, res) => {
  try {
    const postulacion = await Postulacion.findByPk(req.params.id);
    if (!postulacion) return res.status(404).json({ error: 'Postulación no encontrada' });

    await postulacion.destroy();
    res.json({ mensaje: 'Postulación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar postulación' });
  }
};
