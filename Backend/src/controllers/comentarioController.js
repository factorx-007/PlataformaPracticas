const { Comentario, BlogPost } = require('../models');

exports.crearComentario = async (req, res) => {
  try {
    const comentario = await Comentario.create(req.body);
    res.status(201).json({ mensaje: 'Comentario creado', comentario });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear comentario', detalle: error.message });
  }
};

exports.obtenerComentarios = async (req, res) => {
  try {
    const comentarios = await Comentario.findAll();
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
};

exports.obtenerComentarioPorId = async (req, res) => {
  try {
    const comentario = await Comentario.findByPk(req.params.id);
    if (!comentario) return res.status(404).json({ error: 'Comentario no encontrado' });
    res.json(comentario);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar comentario' });
  }
};

exports.actualizarComentario = async (req, res) => {
  try {
    const comentario = await Comentario.findByPk(req.params.id);
    if (!comentario) return res.status(404).json({ error: 'Comentario no encontrado' });

    await comentario.update(req.body);
    res.json({ mensaje: 'Comentario actualizado', comentario });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar comentario' });
  }
};

exports.eliminarComentario = async (req, res) => {
  try {
    const comentario = await Comentario.findByPk(req.params.id);
    if (!comentario) return res.status(404).json({ error: 'Comentario no encontrado' });

    await comentario.destroy();
    res.json({ mensaje: 'Comentario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar comentario' });
  }
};
