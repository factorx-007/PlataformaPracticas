// src/controllers/uploadController.js
const { uploadFile, deleteFile, getOptimizedUrl } = require('../config/cloudinary');
const { Usuario, Estudiante, Empresa, BlogPost } = require('../models');

// Upload de foto de perfil de estudiante
const uploadFotoPerfil = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se encontró archivo para subir' });
    }

    const userId = req.user.id;
    const fileUrl = req.file.path;
    const publicId = req.file.filename;

    // Encontrar el estudiante del usuario
    const estudiante = await Estudiante.findOne({ where: { usuarioId: userId } });
    if (!estudiante) {
      return res.status(404).json({ error: 'Perfil de estudiante no encontrado' });
    }

    // Actualizar la foto de perfil del estudiante
    await estudiante.update({ foto_perfil: fileUrl });

    res.json({
      mensaje: 'Foto de perfil actualizada correctamente',
      foto_perfil: fileUrl,
      publicId: publicId
    });
  } catch (error) {
    console.error('Error uploading foto perfil:', error);
    res.status(500).json({ error: 'Error al subir foto de perfil' });
  }
};

// Upload de logo de empresa
const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se encontró archivo para subir' });
    }

    const userId = req.user.id;
    const fileUrl = req.file.path;
    const publicId = req.file.filename;

    // Encontrar la empresa del usuario
    const empresa = await Empresa.findOne({ where: { usuarioId: userId } });
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    // Actualizar el logo de la empresa
    await empresa.update({ logo_url: fileUrl });

    res.json({
      mensaje: 'Logo actualizado correctamente',
      logo: fileUrl,
      publicId: publicId
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ error: 'Error al subir logo' });
  }
};

// Upload de CV de estudiante
const uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se encontró archivo para subir' });
    }

    const userId = req.user.id;
    const fileUrl = req.file.path;
    const publicId = req.file.filename;

    // Encontrar el estudiante del usuario
    const estudiante = await Estudiante.findOne({ where: { usuarioId: userId } });
    if (!estudiante) {
      return res.status(404).json({ error: 'Perfil de estudiante no encontrado' });
    }

    // Actualizar el CV del estudiante
    await estudiante.update({ cv: fileUrl });

    res.json({
      mensaje: 'CV actualizado correctamente',
      cv: fileUrl,
      publicId: publicId
    });
  } catch (error) {
    console.error('Error uploading CV:', error);
    res.status(500).json({ error: 'Error al subir CV' });
  }
};

// Upload de imagen para blog post
const uploadBlogImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se encontró archivo para subir' });
    }

    const fileUrl = req.file.path;
    const publicId = req.file.filename;

    res.json({
      mensaje: 'Imagen subida correctamente',
      imagen: fileUrl,
      publicId: publicId
    });
  } catch (error) {
    console.error('Error uploading blog image:', error);
    res.status(500).json({ error: 'Error al subir imagen' });
  }
};

// Eliminar archivo
const deleteUploadedFile = async (req, res) => {
  try {
    const { publicId } = req.params;
    
    const result = await deleteFile(publicId);
    
    res.json({
      mensaje: 'Archivo eliminado correctamente',
      result
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Error al eliminar archivo' });
  }
};

module.exports = {
  uploadFotoPerfil,
  uploadLogo,
  uploadCV,
  uploadBlogImage,
  deleteUploadedFile
};
