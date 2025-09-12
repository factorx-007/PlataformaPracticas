const { prisma } = require('../config/database');

exports.crearCategoria = async (req, res) => {
  try {
    const nuevaCategoria = await prisma.categoria.create({
      data: req.body
    });
    res.status(201).json({ mensaje: 'Categoría creada', categoria: nuevaCategoria });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear categoría', detalle: error.message });
  }
};

exports.obtenerCategorias = async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

exports.obtenerCategoriaPorId = async (req, res) => {
  try {
    const categoria = await prisma.categoria.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar categoría' });
  }
};

exports.actualizarCategoria = async (req, res) => {
  try {
    const categoria = await prisma.categoria.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });

    const categoriaActualizada = await prisma.categoria.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json({ mensaje: 'Categoría actualizada', categoria: categoriaActualizada });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
};

exports.eliminarCategoria = async (req, res) => {
  try {
    const categoria = await prisma.categoria.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });

    await prisma.categoria.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
};
