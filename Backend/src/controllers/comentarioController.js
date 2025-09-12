const { prisma } = require('../config/database');

exports.crearComentario = async (req, res) => {
  try {
    const comentario = await prisma.comentario.create({
      data: req.body
    });
    res.status(201).json({ mensaje: 'Comentario creado', comentario });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear comentario', detalle: error.message });
  }
};

exports.obtenerComentarios = async (req, res) => {
  try {
    const comentarios = await prisma.comentario.findMany();
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
};

exports.obtenerComentarioPorId = async (req, res) => {
  try {
    const comentario = await prisma.comentario.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!comentario) return res.status(404).json({ error: 'Comentario no encontrado' });
    res.json(comentario);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar comentario' });
  }
};

exports.actualizarComentario = async (req, res) => {
  try {
    const comentario = await prisma.comentario.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!comentario) return res.status(404).json({ error: 'Comentario no encontrado' });

    const comentarioActualizado = await prisma.comentario.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json({ mensaje: 'Comentario actualizado', comentario: comentarioActualizado });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar comentario' });
  }
};

exports.eliminarComentario = async (req, res) => {
  try {
    const comentario = await prisma.comentario.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!comentario) return res.status(404).json({ error: 'Comentario no encontrado' });

    await prisma.comentario.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ mensaje: 'Comentario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar comentario' });
  }
};
