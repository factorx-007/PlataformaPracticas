const { prisma } = require('../config/database');

exports.crearPostulacion = async (req, res) => {
  try {
    const { mensaje, ofertaId, respuestas } = req.body;
    const usuarioId = req.user.id;

    // Verificar que el usuario sea estudiante o egresado
    const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
    if (!usuario || (usuario.rol !== 'ESTUDIANTE' && usuario.rol !== 'EGRESADO')) {
      return res.status(403).json({ error: 'Solo estudiantes y egresados pueden postular a ofertas' });
    }

    // Obtener el perfil de estudiante
    const estudiante = await prisma.estudiante.findFirst({ where: { usuarioId } });
    if (!estudiante) {
      return res.status(404).json({ error: 'Perfil de estudiante no encontrado. Complete su perfil primero.' });
    }

    // Verificar que no haya postulado ya a esta oferta
    const postulacionExistente = await prisma.postulacion.findFirst({
      where: { 
        estudianteId: estudiante.id, 
        ofertaId: parseInt(ofertaId) 
      }
    });

    if (postulacionExistente) {
      return res.status(400).json({ error: 'Ya has postulado a esta oferta' });
    }

    // Obtener preguntas de la oferta
    const preguntasOferta = await prisma.preguntaOferta.findMany({
      where: { ofertaId: parseInt(ofertaId) },
      orderBy: { orden: 'asc' }
    });

    // Validar respuestas requeridas
    const preguntasRequeridas = preguntasOferta.filter(p => p.requerida);
    const respuestasMap = new Map((respuestas || []).map(r => [r.preguntaOfertaId, r.respuesta]));

    for (const pregunta of preguntasRequeridas) {
      if (!respuestasMap.has(pregunta.id) || !respuestasMap.get(pregunta.id).trim()) {
        return res.status(400).json({ 
          error: `La pregunta "${pregunta.pregunta}" es requerida` 
        });
      }
    }

    // Verificar que la oferta existe
    const ofertaExiste = await prisma.oferta.findUnique({ where: { id: parseInt(ofertaId) } });
    if (!ofertaExiste) {
      return res.status(404).json({ error: 'Oferta no encontrada' });
    }

    // Crear postulación
    const nuevaPostulacion = await prisma.postulacion.create({
      data: {
        mensaje,
        estudianteId: estudiante.id,
        ofertaId: parseInt(ofertaId)
      }
    });

    // Crear respuestas si existen
    if (respuestas && respuestas.length > 0) {
      const respuestasACrear = respuestas
        .filter(r => preguntasOferta.find(p => p.id === r.preguntaOfertaId))
        .map(r => ({
          postulacionId: nuevaPostulacion.id,
          preguntaOfertaId: r.preguntaOfertaId,
          respuesta: r.respuesta
        }));

      if (respuestasACrear.length > 0) {
        await prisma.respuestaPostulacion.createMany({
          data: respuestasACrear
        });
      }
    }

    // Format response with lowercase enum values
    const postulacionFormatted = {
      ...nuevaPostulacion,
      estado: nuevaPostulacion.estado?.toLowerCase()
    };

    res.status(201).json({ 
      mensaje: 'Postulación creada exitosamente', 
      postulacion: postulacionFormatted 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear postulación', detalle: error.message });
  }
};

exports.obtenerPostulaciones = async (req, res) => {
  try {
    // Context-aware endpoint: redirect to specific endpoints based on user role
    if (req.user) {
      if (req.user.rol === 'ESTUDIANTE' || req.user.rol === 'EGRESADO') {
        return exports.obtenerMisPostulaciones(req, res);
      } else if (req.user.rol === 'EMPRESA') {
        return exports.obtenerPostulacionesEmpresa(req, res);
      }
    }

    // If no user context, return all postulaciones (public access)
    const postulaciones = await prisma.postulacion.findMany({
      include: {
        oferta: {
          select: {
            id: true,
            titulo: true,
            descripcion: true
          }
        },
        estudiante: {
          select: {
            id: true,
            carrera: true,
            tipo: true
          },
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
                email: true
              }
            }
          }
        }
      }
    });

    // Convert estado and tipo to lowercase for API compatibility
    const postulacionesFormatted = postulaciones.map(post => ({
      ...post,
      estado: post.estado?.toLowerCase(),
      estudiante: {
        ...post.estudiante,
        tipo: post.estudiante.tipo?.toLowerCase()
      }
    }));

    res.json(postulacionesFormatted);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener postulaciones', detalle: error.message });
  }
};

exports.obtenerPostulacionPorId = async (req, res) => {
  try {
    const postulacion = await prisma.postulacion.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        oferta: {
          select: {
            id: true,
            titulo: true,
            descripcion: true,
            requisitos: true
          },
          include: {
            preguntas: {
              select: {
                id: true,
                pregunta: true,
                tipo: true,
                opciones: true,
                requerida: true,
                orden: true
              },
              orderBy: { orden: 'asc' }
            }
          }
        },
        estudiante: {
          select: {
            id: true,
            carrera: true,
            tipo: true,
            cv: true
          },
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
                email: true
              }
            }
          }
        },
        respuestas: {
          select: {
            id: true,
            preguntaOfertaId: true,
            respuesta: true
          },
          include: {
            preguntaOferta: {
              select: {
                id: true,
                pregunta: true,
                tipo: true
              }
            }
          }
        }
      }
    });
    
    if (!postulacion) return res.status(404).json({ error: 'Postulación no encontrada' });
    
    // Convert enum values to lowercase for API compatibility
    const postulacionFormatted = {
      ...postulacion,
      estado: postulacion.estado?.toLowerCase(),
      estudiante: {
        ...postulacion.estudiante,
        tipo: postulacion.estudiante.tipo?.toLowerCase()
      },
      oferta: {
        ...postulacion.oferta,
        preguntas: postulacion.oferta.preguntas?.map(preg => ({
          ...preg,
          tipo: preg.tipo?.toLowerCase()
        }))
      },
      respuestas: postulacion.respuestas?.map(resp => ({
        ...resp,
        preguntaOferta: {
          ...resp.preguntaOferta,
          tipo: resp.preguntaOferta.tipo?.toLowerCase()
        }
      }))
    };
    
    res.json(postulacionFormatted);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar postulación', detalle: error.message });
  }
};

exports.actualizarPostulacion = async (req, res) => {
  try {
    const { estado, mensaje } = req.body;
    const postulacion = await prisma.postulacion.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        estudiante: {
          include: {
            usuario: {
              select: { id: true }
            }
          }
        }
      }
    });

    if (!postulacion) return res.status(404).json({ error: 'Postulación no encontrada' });

    // Verificar permisos: solo empresa de la oferta o admin pueden actualizar estado
    // Los estudiantes pueden actualizar mensaje pero no estado
    const usuarioId = req.user.id;
    const esAdmin = req.user.rol === 'ADMIN';
    
    // Verificar si es la empresa propietaria de la oferta
    let esEmpresaPropietaria = false;
    if (req.user.rol === 'EMPRESA') {
      const empresa = await prisma.empresa.findFirst({ where: { usuarioId } });
      if (empresa) {
        const oferta = await prisma.oferta.findUnique({ where: { id: postulacion.ofertaId } });
        esEmpresaPropietaria = oferta && oferta.empresaId === empresa.id;
      }
    }

    // Si se intenta cambiar el estado, solo empresa o admin pueden hacerlo
    if (estado && !esAdmin && !esEmpresaPropietaria) {
      return res.status(403).json({ error: 'Solo las empresas pueden actualizar el estado de las postulaciones' });
    }

    // Si no es admin, empresa propietaria, ni estudiante propietario, denegar acceso
    const esEstudiantePropietario = postulacion.estudiante.usuario.id === usuarioId;
    if (!esEstudiantePropietario && !esAdmin && !esEmpresaPropietaria) {
      return res.status(403).json({ error: 'No tienes permisos para actualizar esta postulación' });
    }

    const postulacionActualizada = await prisma.postulacion.update({
      where: { id: parseInt(req.params.id) },
      data: { 
        estado: estado?.toUpperCase(), // Convert to uppercase for enum
        mensaje 
      }
    });
    
    // Convert estado to lowercase for API compatibility
    const postulacionFormatted = {
      ...postulacionActualizada,
      estado: postulacionActualizada.estado?.toLowerCase()
    };
    
    res.json({ mensaje: 'Postulación actualizada exitosamente', postulacion: postulacionFormatted });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar postulación', detalle: error.message });
  }
};

exports.eliminarPostulacion = async (req, res) => {
  try {
    const postulacion = await prisma.postulacion.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        estudiante: {
          include: {
            usuario: {
              select: { id: true }
            }
          }
        }
      }
    });

    if (!postulacion) return res.status(404).json({ error: 'Postulación no encontrada' });

    // Verificar permisos: solo estudiante propietario o admin pueden eliminar
    const usuarioId = req.user.id;
    const esEstudiantePropietario = postulacion.estudiante.usuario.id === usuarioId;
    const esAdmin = req.user.rol === 'ADMIN';

    if (!esEstudiantePropietario && !esAdmin) {
      return res.status(403).json({ error: 'No tienes permisos para eliminar esta postulación' });
    }

    await prisma.postulacion.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ mensaje: 'Postulación eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar postulación', detalle: error.message });
  }
};

// Obtener postulaciones del estudiante autenticado
exports.obtenerMisPostulaciones = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    // Obtener el perfil de estudiante
    const estudiante = await prisma.estudiante.findFirst({ where: { usuarioId } });
    if (!estudiante) {
      return res.status(404).json({ error: 'Perfil de estudiante no encontrado' });
    }

    const postulaciones = await prisma.postulacion.findMany({
      where: { estudianteId: estudiante.id },
      include: {
        oferta: {
          select: {
            id: true,
            titulo: true,
            descripcion: true,
            duracion: true
          },
          include: {
            empresa: {
              select: {
                id: true,
                nombre_empresa: true,
                rubro: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Convert estado to lowercase for API compatibility
    const postulacionesFormatted = postulaciones.map(post => ({
      ...post,
      estado: post.estado?.toLowerCase()
    }));

    res.json(postulacionesFormatted);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mis postulaciones', detalle: error.message });
  }
};

// Obtener postulaciones para las ofertas de mi empresa
exports.obtenerPostulacionesEmpresa = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    // Verificar que el usuario sea una empresa
    const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
    if (!usuario || usuario.rol !== 'EMPRESA') {
      return res.status(403).json({ error: 'Solo las empresas pueden acceder a esta función' });
    }

    // Obtener el perfil de empresa
    const empresa = await prisma.empresa.findFirst({ where: { usuarioId } });
    if (!empresa) {
      return res.status(404).json({ error: 'Perfil de empresa no encontrado' });
    }

    const postulaciones = await prisma.postulacion.findMany({
      where: {
        oferta: {
          empresaId: empresa.id
        }
      },
      include: {
        oferta: {
          select: {
            id: true,
            titulo: true,
            descripcion: true
          }
        },
        estudiante: {
          select: {
            id: true,
            carrera: true,
            tipo: true,
            cv: true
          },
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Format enums to lowercase for API compatibility
    const postulacionesFormatted = postulaciones.map(post => ({
      ...post,
      estado: post.estado?.toLowerCase(),
      estudiante: {
        ...post.estudiante,
        tipo: post.estudiante.tipo?.toLowerCase()
      }
    }));

    res.json(postulacionesFormatted);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener postulaciones de empresa', detalle: error.message });
  }
};
