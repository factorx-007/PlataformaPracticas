const { Oferta } = require('../models');

exports.crearOferta = async (req, res) => {
  try {
    const nuevaOferta = await Oferta.create(req.body);
    res.status(201).json({ mensaje: 'Oferta creada', oferta: nuevaOferta });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear oferta', detalle: error.message });
  }
};

exports.obtenerOfertas = async (req, res) => {
  try {
    const ofertas = await Oferta.findAll();
    res.json(ofertas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ofertas' });
  }
};

exports.obtenerOfertaPorId = async (req, res) => {
  try {
    const oferta = await Oferta.findByPk(req.params.id);
    if (!oferta) return res.status(404).json({ error: 'Oferta no encontrada' });
    res.json(oferta);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar oferta' });
  }
};

exports.actualizarOferta = async (req, res) => {
  try {
    const oferta = await Oferta.findByPk(req.params.id);
    if (!oferta) return res.status(404).json({ error: 'Oferta no encontrada' });

    await oferta.update(req.body);
    res.json({ mensaje: 'Oferta actualizada', oferta });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar oferta' });
  }
};

exports.eliminarOferta = async (req, res) => {
  try {
    const oferta = await Oferta.findByPk(req.params.id);
    if (!oferta) return res.status(404).json({ error: 'Oferta no encontrada' });

    await oferta.destroy();
    res.json({ mensaje: 'Oferta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar oferta' });
  }
};
