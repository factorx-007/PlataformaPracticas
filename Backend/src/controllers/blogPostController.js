const { prisma } = require('../config/database');

exports.crearPost = async (req, res) => {
  try {
    const nuevoPost = await prisma.blogPost.create({
      data: req.body
    });
    res.status(201).json({ mensaje: 'Post creado', post: nuevoPost });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear post', detalle: error.message });
  }
};

exports.obtenerPosts = async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      include: {
        categoria: {
          select: { nombre: true }
        }
      }
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener posts' });
  }
};

exports.obtenerPostPorId = async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        categoria: {
          select: { nombre: true }
        }
      }
    });
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar post' });
  }
};

exports.actualizarPost = async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });

    const postActualizado = await prisma.blogPost.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json({ mensaje: 'Post actualizado', post: postActualizado });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar post' });
  }
};

exports.eliminarPost = async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });

    await prisma.blogPost.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ mensaje: 'Post eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar post' });
  }
};
