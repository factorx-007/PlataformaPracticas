// src/controllers/estudianteController.js
const { Estudiante, Usuario } = require('../models');

// Crear perfil de estudiante
const crearEstudiante = async (req, res) => {
  try {
    const { carrera, año_egreso, telefono, tipo } = req.body;
    const usuarioId = req.user.id; // Del middleware verifyToken

    // Verificar que el usuario no tenga ya un perfil de estudiante
    const existeEstudiante = await Estudiante.findOne({ where: { usuarioId } });
    if (existeEstudiante) {
      return res.status(400).json({ error: 'Ya existe un perfil de estudiante para este usuario' });
    }

    const estudiante = await Estudiante.create({
      usuarioId,
      carrera,
      año_egreso,
      telefono,
      tipo
    });

    res.status(201).json({
      mensaje: 'Perfil de estudiante creado exitosamente',
      estudiante
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear perfil de estudiante', detalle: error.message });
  }
};

// Obtener todos los estudiantes
const obtenerEstudiantes = async (req, res) => {
  try {
    const estudiantes = await Estudiante.findAll({
      include: [{ 
        model: Usuario, 
        attributes: ['id', 'nombre', 'email'] 
      }]
    });
    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estudiantes', detalle: error.message });
  }
};

// Obtener estudiante por ID
const obtenerEstudiantePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const estudiante = await Estudiante.findByPk(id, {
      include: [{ 
        model: Usuario, 
        attributes: ['id', 'nombre', 'email'] 
      }]
    });

    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    res.json(estudiante);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estudiante', detalle: error.message });
  }
};

// Actualizar estudiante
const actualizarEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const { carrera, año_egreso, telefono, tipo, cv, foto_perfil } = req.body;

    const estudiante = await Estudiante.findByPk(id);
    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    // Verificar que el usuario tenga permisos (solo puede editar su propio perfil o ser admin)
    if (estudiante.usuarioId !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No tienes permisos para actualizar este perfil' });
    }

    await estudiante.update({
      carrera,
      año_egreso,
      telefono,
      tipo,
      cv,
      foto_perfil
    });

    res.json({
      mensaje: 'Perfil de estudiante actualizado exitosamente',
      estudiante
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estudiante', detalle: error.message });
  }
};

// Eliminar estudiante
const eliminarEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const estudiante = await Estudiante.findByPk(id);

    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    // Solo admin puede eliminar perfiles
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No tienes permisos para eliminar perfiles' });
    }

    await estudiante.destroy();
    res.json({ mensaje: 'Perfil de estudiante eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar estudiante', detalle: error.message });
  }
};

module.exports = {
  crearEstudiante,
  obtenerEstudiantes,
  obtenerEstudiantePorId,
  actualizarEstudiante,
  eliminarEstudiante
};
