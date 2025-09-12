// src/controllers/preguntaOfertaController.js
const { prisma } = require('../config/database');

// Crear pregunta para una oferta
const crearPregunta = async (req, res) => {
  try {
    const { ofertaId, pregunta, tipo, opciones, requerida, orden } = req.body;
    const usuarioId = req.user.id;

    // Verificar que la oferta existe y pertenece a la empresa del usuario
    const oferta = await prisma.oferta.findFirst({
      where: {
        id: parseInt(ofertaId),
        empresa: {
          usuarioId
        }
      },
      include: {
        empresa: true
      }
    });

    if (!oferta) {
      return res.status(404).json({ error: 'Oferta no encontrada o no tienes permisos para editarla' });
    }

    // Validar tipo de pregunta
    if (tipo === 'select' && (!opciones || !Array.isArray(opciones) || opciones.length === 0)) {
      return res.status(400).json({ error: 'Las preguntas de tipo "select" deben tener opciones' });
    }

    const nuevaPregunta = await prisma.preguntaOferta.create({
      data: {
        ofertaId: parseInt(ofertaId),
        pregunta,
        tipo: (tipo || 'text').toUpperCase(), // Convert to uppercase for enum
        opciones: tipo === 'select' ? opciones : null,
        requerida: requerida || false,
        orden: orden || 1
      }
    });

    // Convert tipo to lowercase for API compatibility
    const preguntaFormatted = {
      ...nuevaPregunta,
      tipo: nuevaPregunta.tipo?.toLowerCase()
    };

    res.status(201).json({
      mensaje: 'Pregunta creada exitosamente',
      pregunta: preguntaFormatted
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear pregunta', detalle: error.message });
  }
};

// Obtener preguntas de una oferta
const obtenerPreguntasPorOferta = async (req, res) => {
  try {
    const { ofertaId } = req.params;

    const preguntas = await prisma.preguntaOferta.findMany({
      where: { ofertaId: parseInt(ofertaId) },
      orderBy: [
        { orden: 'asc' },
        { createdAt: 'asc' }
      ]
    });

    // Convert tipo to lowercase for API compatibility
    const preguntasFormatted = preguntas.map(pregunta => ({
      ...pregunta,
      tipo: pregunta.tipo?.toLowerCase()
    }));

    res.json({
      mensaje: 'Preguntas de la oferta',
      preguntas: preguntasFormatted
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener preguntas', detalle: error.message });
  }
};

// Actualizar pregunta
const actualizarPregunta = async (req, res) => {
  try {
    const { id } = req.params;
    const { pregunta, tipo, opciones, requerida, orden } = req.body;
    const usuarioId = req.user.id;

    // Verificar que la pregunta existe y el usuario tiene permisos
    const preguntaExistente = await prisma.preguntaOferta.findFirst({
      where: {
        id: parseInt(id),
        oferta: {
          empresa: {
            usuarioId
          }
        }
      },
      include: {
        oferta: {
          include: {
            empresa: true
          }
        }
      }
    });

    if (!preguntaExistente) {
      return res.status(404).json({ error: 'Pregunta no encontrada o no tienes permisos para editarla' });
    }

    // Validar tipo de pregunta
    if (tipo === 'select' && (!opciones || !Array.isArray(opciones) || opciones.length === 0)) {
      return res.status(400).json({ error: 'Las preguntas de tipo "select" deben tener opciones' });
    }

    const preguntaActualizada = await prisma.preguntaOferta.update({
      where: { id: parseInt(id) },
      data: {
        pregunta,
        tipo: tipo?.toUpperCase(), // Convert to uppercase for enum
        opciones: tipo === 'select' ? opciones : null,
        requerida,
        orden
      }
    });

    // Convert tipo to lowercase for API compatibility
    const preguntaFormatted = {
      ...preguntaActualizada,
      tipo: preguntaActualizada.tipo?.toLowerCase()
    };

    res.json({
      mensaje: 'Pregunta actualizada exitosamente',
      pregunta: preguntaFormatted
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar pregunta', detalle: error.message });
  }
};

// Eliminar pregunta
const eliminarPregunta = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;

    // Verificar que la pregunta existe y el usuario tiene permisos
    const pregunta = await prisma.preguntaOferta.findFirst({
      where: {
        id: parseInt(id),
        oferta: {
          empresa: {
            usuarioId
          }
        }
      },
      include: {
        oferta: {
          include: {
            empresa: true
          }
        }
      }
    });

    if (!pregunta) {
      return res.status(404).json({ error: 'Pregunta no encontrada o no tienes permisos para eliminarla' });
    }

    await prisma.preguntaOferta.delete({ where: { id: parseInt(id) } });
    res.json({ mensaje: 'Pregunta eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar pregunta', detalle: error.message });
  }
};

module.exports = {
  crearPregunta,
  obtenerPreguntasPorOferta,
  actualizarPregunta,
  eliminarPregunta
};
