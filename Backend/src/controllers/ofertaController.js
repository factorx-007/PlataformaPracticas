const { prisma } = require('../config/database');

exports.crearOferta = async (req, res) => {
  try {
    const { titulo, descripcion, duracion, requiereCV, requiereCarta, empresaId, requisitos } = req.body;

    // Crear la oferta
    const nuevaOferta = await prisma.oferta.create({
      data: {
        titulo,
        descripcion,
        duracion,
        requiereCV,
        requiereCarta,
        empresaId
      }
    });

    // Crear requisitos si existen
    if (requisitos && Array.isArray(requisitos) && requisitos.length > 0) {
      const requisitosACrear = requisitos.map((req, index) => ({
        ofertaId: nuevaOferta.id,
        requisito: req.requisito || req.descripcion || 'Requisito no especificado',
        descripcion: req.descripcion,
        tipo: req.tipo?.toUpperCase() || 'OBLIGATORIO', // Convert to uppercase for enum
        categoria: req.categoria?.toUpperCase() || 'OTRO', // Convert to uppercase for enum
        orden: req.orden || index + 1
      }));

      await prisma.requisitoOferta.createMany({
        data: requisitosACrear
      });
    }

    // Retornar oferta con requisitos
    const ofertaCompleta = await prisma.oferta.findUnique({
      where: { id: nuevaOferta.id },
      include: {
        requisitos: {
          orderBy: {
            orden: 'asc'
          }
        }
      }
    });

    // Convert enum values to lowercase for API compatibility
    const ofertaFormated = {
      ...ofertaCompleta,
      requisitos: ofertaCompleta.requisitos?.map(req => ({
        ...req,
        tipo: req.tipo?.toLowerCase(),
        categoria: req.categoria?.toLowerCase()
      }))
    };

    res.status(201).json({ 
      mensaje: 'Oferta creada exitosamente', 
      oferta: ofertaFormated 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear oferta', detalle: error.message });
  }
};

exports.obtenerOfertas = async (req, res) => {
  try {
    const ofertas = await prisma.oferta.findMany({
      include: {
        empresa: {
          select: {
            id: true,
            nombre_empresa: true,
            rubro: true
          }
        },
        requisitos: {
          select: {
            id: true,
            descripcion: true,
            tipo: true,
            categoria: true,
            orden: true
          },
          orderBy: {
            orden: 'asc'
          }
        }
      }
    });

    // Convert enum values to lowercase for API compatibility
    const ofertasFormatted = ofertas.map(oferta => ({
      ...oferta,
      requisitos: oferta.requisitos?.map(req => ({
        ...req,
        tipo: req.tipo?.toLowerCase(),
        categoria: req.categoria?.toLowerCase()
      }))
    }));

    res.json(ofertasFormatted);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ofertas', detalle: error.message });
  }
};

exports.obtenerOfertaPorId = async (req, res) => {
  try {
    const oferta = await prisma.oferta.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        empresa: {
          select: {
            id: true,
            nombre_empresa: true,
            rubro: true
          }
        },
        requisitos: {
          select: {
            id: true,
            descripcion: true,
            tipo: true,
            categoria: true,
            orden: true
          },
          orderBy: {
            orden: 'asc'
          }
        },
        preguntas: {
          select: {
            id: true,
            pregunta: true,
            tipo: true,
            opciones: true,
            requerida: true,
            orden: true
          },
          orderBy: {
            orden: 'asc'
          }
        }
      }
    });
    if (!oferta) return res.status(404).json({ error: 'Oferta no encontrada' });
    
    // Convert enum values to lowercase for API compatibility
    const ofertaFormatted = {
      ...oferta,
      requisitos: oferta.requisitos?.map(req => ({
        ...req,
        tipo: req.tipo?.toLowerCase(),
        categoria: req.categoria?.toLowerCase()
      })),
      preguntas: oferta.preguntas?.map(preg => ({
        ...preg,
        tipo: preg.tipo?.toLowerCase()
      }))
    };
    
    res.json(ofertaFormatted);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar oferta', detalle: error.message });
  }
};

exports.actualizarOferta = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, duracion, requiereCV, requiereCarta, requisitos } = req.body;

    const oferta = await prisma.oferta.findUnique({ where: { id: parseInt(id) } });
    if (!oferta) return res.status(404).json({ error: 'Oferta no encontrada' });

    // Actualizar campos de la oferta
    await prisma.oferta.update({
      where: { id: parseInt(id) },
      data: {
        titulo,
        descripcion,
        duracion,
        requiereCV,
        requiereCarta
      }
    });

    // Si se envían requisitos, actualizar completamente
    if (requisitos && Array.isArray(requisitos)) {
      // Eliminar requisitos existentes
      await prisma.requisitoOferta.deleteMany({ where: { ofertaId: parseInt(id) } });

      // Crear nuevos requisitos
      if (requisitos.length > 0) {
        const requisitosACrear = requisitos.map((req, index) => ({
          ofertaId: parseInt(id),
          requisito: req.requisito || req.descripcion || 'Requisito no especificado',
          descripcion: req.descripcion,
          tipo: req.tipo?.toUpperCase() || 'OBLIGATORIO', // Convert to uppercase for enum
          categoria: req.categoria?.toUpperCase() || 'OTRO', // Convert to uppercase for enum
          orden: req.orden || index + 1
        }));

        await prisma.requisitoOferta.createMany({
          data: requisitosACrear
        });
      }
    }

    // Retornar oferta actualizada con requisitos
    const ofertaActualizada = await prisma.oferta.findUnique({
      where: { id: parseInt(id) },
      include: {
        requisitos: {
          orderBy: {
            orden: 'asc'
          }
        }
      }
    });

    // Convert enum values to lowercase for API compatibility
    const ofertaFormatted = {
      ...ofertaActualizada,
      requisitos: ofertaActualizada.requisitos?.map(req => ({
        ...req,
        tipo: req.tipo?.toLowerCase(),
        categoria: req.categoria?.toLowerCase()
      }))
    };

    res.json({ 
      mensaje: 'Oferta actualizada exitosamente', 
      oferta: ofertaFormatted 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar oferta', detalle: error.message });
  }
};

exports.eliminarOferta = async (req, res) => {
  try {
    const oferta = await prisma.oferta.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!oferta) return res.status(404).json({ error: 'Oferta no encontrada' });

    // Los requisitos se eliminarán automáticamente por CASCADE (si se configura en la BD)
    // O podemos eliminarlos manualmente:
    await prisma.requisitoOferta.deleteMany({ where: { ofertaId: parseInt(req.params.id) } });
    
    await prisma.oferta.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ mensaje: 'Oferta eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar oferta', detalle: error.message });
  }
};
