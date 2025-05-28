const { BlogPost, Categoria } = require('../models');

exports.crearPost = async (req, res) => {
  try {
    const nuevoPost = await BlogPost.create(req.body);
    res.status(201).json({ mensaje: 'Post creado', post: nuevoPost });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear post', detalle: error.message });
  }
};

exports.obtenerPosts = async (req, res) => {
  try {
    const posts = await BlogPost.findAll({
      include: { model: Categoria, attributes: ['nombre'] }
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener posts' });
  }
};

exports.obtenerPostPorId = async (req, res) => {
  try {
    const post = await BlogPost.findByPk(req.params.id, {
      include: { model: Categoria, attributes: ['nombre'] }
    });
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar post' });
  }
};

exports.actualizarPost = async (req, res) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });

    await post.update(req.body);
    res.json({ mensaje: 'Post actualizado', post });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar post' });
  }
};

exports.eliminarPost = async (req, res) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });

    await post.destroy();
    res.json({ mensaje: 'Post eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar post' });
  }
};
