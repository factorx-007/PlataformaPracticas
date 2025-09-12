// src/controllers/estudianteController.js
const { prisma } = require('../config/database');

// Crear perfil de estudiante
const crearEstudiante = async (req, res) => {
  try {
    const { carrera, año_egreso, telefono, tipo } = req.body;
    const usuarioId = req.user.id; // Del middleware verifyToken

    // Verificar que el usuario no tenga ya un perfil de estudiante
    const existeEstudiante = await prisma.estudiante.findFirst({ where: { usuarioId } });
    if (existeEstudiante) {
      return res.status(400).json({ error: 'Ya existe un perfil de estudiante para este usuario' });
    }

    const estudiante = await prisma.estudiante.create({
      data: {
        usuarioId,
        carrera,
        año_egreso,
        telefono,
        tipo: tipo?.toUpperCase() // Convert to uppercase for enum
      }
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
    const estudiantes = await prisma.estudiante.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        }
      }
    });

    // Convert tipo to lowercase for API compatibility
    const estudiantesFormatted = estudiantes.map(estudiante => ({
      ...estudiante,
      tipo: estudiante.tipo?.toLowerCase()
    }));
    res.json(estudiantesFormatted);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estudiantes', detalle: error.message });
  }
};

// Obtener estudiante por ID
const obtenerEstudiantePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const estudiante = await prisma.estudiante.findUnique({
      where: { id: parseInt(id) },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        }
      }
    });

    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    // Convert tipo to lowercase for API compatibility
    const estudianteFormatted = {
      ...estudiante,
      tipo: estudiante.tipo?.toLowerCase()
    };

    res.json(estudianteFormatted);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estudiante', detalle: error.message });
  }
};

// Actualizar estudiante
const actualizarEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const { carrera, año_egreso, telefono, tipo, cv, foto_perfil } = req.body;

    const estudiante = await prisma.estudiante.findUnique({ where: { id: parseInt(id) } });
    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    // Verificar que el usuario tenga permisos (solo puede editar su propio perfil o ser admin)
    if (estudiante.usuarioId !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No tienes permisos para actualizar este perfil' });
    }

    const estudianteActualizado = await prisma.estudiante.update({
      where: { id: parseInt(id) },
      data: {
        carrera,
        año_egreso,
        telefono,
        tipo: tipo?.toUpperCase(), // Convert to uppercase for enum
        cv,
        foto_perfil
      }
    });

    // Convert tipo to lowercase for API compatibility
    const estudianteFormatted = {
      ...estudianteActualizado,
      tipo: estudianteActualizado.tipo?.toLowerCase()
    };

    res.json({
      mensaje: 'Perfil de estudiante actualizado exitosamente',
      estudiante: estudianteFormatted
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estudiante', detalle: error.message });
  }
};

// Eliminar estudiante
const eliminarEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const estudiante = await prisma.estudiante.findUnique({ where: { id: parseInt(id) } });

    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    // Solo admin puede eliminar perfiles
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No tienes permisos para eliminar perfiles' });
    }

    await prisma.estudiante.delete({ where: { id: parseInt(id) } });
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
