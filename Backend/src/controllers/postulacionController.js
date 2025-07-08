const { Postulacion, Oferta, Estudiante, Usuario, Empresa, PreguntaOferta, RespuestaPostulacion } = require('../models');

exports.crearPostulacion = async (req, res) => {
  try {
    const { mensaje, ofertaId, respuestas } = req.body;
    const usuarioId = req.user.id;

    // Verificar que el usuario sea estudiante o egresado
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario || (usuario.rol !== 'estudiante' && usuario.rol !== 'egresado')) {
      return res.status(403).json({ error: 'Solo estudiantes y egresados pueden postular a ofertas' });
    }

    // Obtener el perfil de estudiante
    const estudiante = await Estudiante.findOne({ where: { usuarioId } });
    if (!estudiante) {
      return res.status(404).json({ error: 'Perfil de estudiante no encontrado. Complete su perfil primero.' });
    }

    // Verificar que no haya postulado ya a esta oferta
    const postulacionExistente = await Postulacion.findOne({
      where: { estudianteId: estudiante.id, ofertaId }
    });

    if (postulacionExistente) {
      return res.status(400).json({ error: 'Ya has postulado a esta oferta' });
    }

    // Obtener preguntas de la oferta
    const preguntasOferta = await PreguntaOferta.findAll({
      where: { ofertaId },
      order: [['orden', 'ASC']]
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

    // Crear postulación
    const nuevaPostulacion = await Postulacion.create({
      mensaje,
      estudianteId: estudiante.id,
      ofertaId
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
        await RespuestaPostulacion.bulkCreate(respuestasACrear);
      }
    }

    res.status(201).json({ 
      mensaje: 'Postulación creada exitosamente', 
      postulacion: nuevaPostulacion 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear postulación', detalle: error.message });
  }
};

exports.obtenerPostulaciones = async (req, res) => {
  try {
    const postulaciones = await Postulacion.findAll({
      include: [
        { 
          model: Oferta, 
          attributes: ['id', 'titulo', 'descripcion'] 
        },
        {
          model: Estudiante,
          attributes: ['id', 'carrera', 'tipo'],
          include: [{
            model: Usuario,
            attributes: ['id', 'nombre', 'email']
          }]
        }
      ]
    });
    res.json(postulaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener postulaciones', detalle: error.message });
  }
};

exports.obtenerPostulacionPorId = async (req, res) => {
  try {
    const postulacion = await Postulacion.findByPk(req.params.id, {
      include: [
        { 
          model: Oferta, 
          attributes: ['id', 'titulo', 'descripcion', 'requisitos'],
          include: [{
            model: PreguntaOferta,
            attributes: ['id', 'pregunta', 'tipo', 'opciones', 'requerida', 'orden'],
            order: [['orden', 'ASC']]
          }]
        },
        {
          model: Estudiante,
          attributes: ['id', 'carrera', 'tipo', 'cv'],
          include: [{
            model: Usuario,
            attributes: ['id', 'nombre', 'email']
          }]
        },
        {
          model: RespuestaPostulacion,
          attributes: ['id', 'preguntaOfertaId', 'respuesta'],
          include: [{
            model: PreguntaOferta,
            attributes: ['id', 'pregunta', 'tipo']
          }]
        }
      ]
    });
    
    if (!postulacion) return res.status(404).json({ error: 'Postulación no encontrada' });
    res.json(postulacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar postulación', detalle: error.message });
  }
};

exports.actualizarPostulacion = async (req, res) => {
  try {
    const { estado, mensaje } = req.body;
    const postulacion = await Postulacion.findByPk(req.params.id, {
      include: [{
        model: Estudiante,
        include: [{
          model: Usuario,
          attributes: ['id']
        }]
      }]
    });

    if (!postulacion) return res.status(404).json({ error: 'Postulación no encontrada' });

    // Verificar permisos: solo el estudiante propietario o admin pueden actualizar
    const usuarioId = req.user.id;
    const esEstudiantePropietario = postulacion.Estudiante.Usuario.id === usuarioId;
    const esAdmin = req.user.rol === 'admin';

    if (!esEstudiantePropietario && !esAdmin) {
      return res.status(403).json({ error: 'No tienes permisos para actualizar esta postulación' });
    }

    await postulacion.update({ estado, mensaje });
    res.json({ mensaje: 'Postulación actualizada exitosamente', postulacion });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar postulación', detalle: error.message });
  }
};

exports.eliminarPostulacion = async (req, res) => {
  try {
    const postulacion = await Postulacion.findByPk(req.params.id, {
      include: [{
        model: Estudiante,
        include: [{
          model: Usuario,
          attributes: ['id']
        }]
      }]
    });

    if (!postulacion) return res.status(404).json({ error: 'Postulación no encontrada' });

    // Verificar permisos: solo el estudiante propietario o admin pueden eliminar
    const usuarioId = req.user.id;
    const esEstudiantePropietario = postulacion.Estudiante.Usuario.id === usuarioId;
    const esAdmin = req.user.rol === 'admin';

    if (!esEstudiantePropietario && !esAdmin) {
      return res.status(403).json({ error: 'No tienes permisos para eliminar esta postulación' });
    }

    await postulacion.destroy();
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
    const estudiante = await Estudiante.findOne({ where: { usuarioId } });
    if (!estudiante) {
      return res.status(404).json({ error: 'Perfil de estudiante no encontrado' });
    }

    const postulaciones = await Postulacion.findAll({
      where: { estudianteId: estudiante.id },
      include: [{
        model: Oferta,
        attributes: ['id', 'titulo', 'descripcion', 'duracion'],
        include: [{
          model: Empresa,
          attributes: ['id', 'nombre_empresa', 'rubro']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      mensaje: 'Mis postulaciones',
      postulaciones
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mis postulaciones', detalle: error.message });
  }
};

// Obtener postulaciones para las ofertas de mi empresa
exports.obtenerPostulacionesEmpresa = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    // Verificar que el usuario sea una empresa
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario || usuario.rol !== 'empresa') {
      return res.status(403).json({ error: 'Solo las empresas pueden acceder a esta función' });
    }

    // Obtener el perfil de empresa
    const empresa = await Empresa.findOne({ where: { usuarioId } });
    if (!empresa) {
      return res.status(404).json({ error: 'Perfil de empresa no encontrado' });
    }

    const postulaciones = await Postulacion.findAll({
      include: [
        {
          model: Oferta,
          where: { empresaId: empresa.id },
          attributes: ['id', 'titulo', 'descripcion']
        },
        {
          model: Estudiante,
          attributes: ['id', 'carrera', 'tipo', 'cv'],
          include: [{
            model: Usuario,
            attributes: ['id', 'nombre', 'email']
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      mensaje: 'Postulaciones para mis ofertas',
      postulaciones
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener postulaciones de empresa', detalle: error.message });
  }
};
