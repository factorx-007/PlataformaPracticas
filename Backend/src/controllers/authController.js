//src/controllers/authController.js
const bcrypt = require('bcryptjs');
const { prisma } = require('../config/database');
const { OAuth2Client } = require('google-auth-library');
const generateToken = require('../utils/generateToken');

// Inicializar cliente de Google OAuth
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Registro
const register = async (req, res) => {
  const { nombre, email, password, rol, carrera, tipo, ruc, nombre_empresa, rubro } = req.body;

  try {
    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) return res.status(400).json({ error: 'El email ya está en uso' });

    // Validaciones específicas por rol
    if ((rol === 'estudiante' || rol === 'egresado') && !carrera) {
      return res.status(400).json({ error: 'La carrera es obligatoria para estudiantes y egresados' });
    }

    if (rol === 'empresa' && (!ruc || !nombre_empresa || !rubro)) {
      return res.status(400).json({ error: 'RUC, nombre de empresa y rubro son obligatorios para empresas' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear usuario base con perfil específico en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear usuario base
      const user = await tx.usuario.create({
        data: {
          nombre,
          email,
          password: hashedPassword,
          rol: rol.toUpperCase(),
        }
      });

      let perfil = null;

      // Crear perfil específico según el rol
      if (rol === 'estudiante' || rol === 'egresado') {
        perfil = await tx.estudiante.create({
          data: {
            usuarioId: user.id,
            carrera,
            tipo: (tipo || rol).toUpperCase(),
          }
        });
      } else if (rol === 'empresa') {
        perfil = await tx.empresa.create({
          data: {
            usuarioId: user.id,
            ruc,
            nombre_empresa,
            rubro,
          }
        });
      }

      return { user, perfil };
    });

    res.status(201).json({ 
      mensaje: 'Usuario registrado con éxito', 
      user: {
        id: result.user.id,
        nombre: result.user.nombre,
        email: result.user.email,
        rol: result.user.rol.toLowerCase(),
      },
      perfil: result.perfil
    });
  } catch (err) {
    res.status(500).json({ error: 'Error en el registro', detalle: err.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = generateToken({ id: user.id, rol: user.rol });

    res.json({
      mensaje: 'Login exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol.toLowerCase(),
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión', detalle: err.message });
  }
};

// Ruta protegida para ver perfil
const perfil = async (req, res) => {
  try {
    // Asegúrate de que req.user.id exista y sea válido (viene del middleware verifyToken)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'No autorizado o ID de usuario no encontrado en token' });
    }

    const user = await prisma.usuario.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        estudiante: {
          select: {
            id: true,
            carrera: true,
            año_egreso: true,
            telefono: true,
            tipo: true,
            cv: true,
            foto_perfil: true
          }
        },
        empresa: {
          select: {
            id: true,
            ruc: true,
            nombre_empresa: true,
            rubro: true,
            descripcion: true,
            direccion: true,
            telefono: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado con el ID proporcionado' });
    }

    // Convertir enum values to lowercase para mantener compatibilidad
    const userResponse = {
      ...user,
      rol: user.rol.toLowerCase(),
      estudiante: user.estudiante ? {
        ...user.estudiante,
        tipo: user.estudiante.tipo.toLowerCase()
      } : user.estudiante
    };

    res.json({ 
      mensaje: 'Perfil del usuario', 
      user: userResponse
    });
  } catch (err) {
    console.error("Error en /perfil:", err);
    res.status(500).json({ error: 'Error al obtener perfil', detalle: err.message });
  }
};

// Cerrar sesión
const logout = (req, res) => {
  // En frontend, basta con borrar el token
  res.json({ mensaje: 'Sesión cerrada. Por favor, elimina el token del cliente.' });
};

// Login/Registro con Google
const googleAuth = async (req, res) => {
  try {
    const { credential, rol } = req.body;

    if (!credential) {
      return res.status(400).json({ error: 'Token de Google requerido' });
    }

    if (!rol || !['estudiante', 'egresado', 'empresa'].includes(rol)) {
      return res.status(400).json({ error: 'Rol válido requerido: estudiante, egresado, empresa' });
    }

    // ✅ VERIFICAR TOKEN CON GOOGLE (SEGURIDAD)
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (error) {
      return res.status(401).json({ error: 'Token de Google inválido' });
    }

    const payload = ticket.getPayload();
    const { sub: googleId, email, name: nombre, picture } = payload;

    // Verificar que el email esté verificado por Google
    if (!payload.email_verified) {
      return res.status(400).json({ error: 'Email no verificado por Google' });
    }

    // Buscar usuario existente por googleId o email
    let user = await prisma.usuario.findFirst({ 
      where: { 
        OR: [
          { googleId },
          { email }
        ]
      }
    });

    if (user) {
      // Usuario existente
      if (!user.googleId) {
        // Vincular cuenta existente con Google
        user = await prisma.usuario.update({
          where: { id: user.id },
          data: { googleId }
        });
      }
      
      // Actualizar información si es necesario
      if (user.nombre !== nombre) {
        user = await prisma.usuario.update({
          where: { id: user.id },
          data: { nombre }
        });
      }
    } else {
      // Nuevo usuario - crear con Google
      user = await prisma.usuario.create({
        data: {
          nombre,
          email,
          googleId,
          rol: rol.toUpperCase(),
          password: null,
          perfilCompleto: false
        }
      });
    }

    // Verificar si tiene perfil específico completo
    let perfilEspecifico = null;
    if (user.rol === 'EMPRESA') {
      perfilEspecifico = await prisma.empresa.findUnique({ where: { usuarioId: user.id } });
    } else if (user.rol === 'ESTUDIANTE' || user.rol === 'EGRESADO') {
      perfilEspecifico = await prisma.estudiante.findUnique({ where: { usuarioId: user.id } });
    }

    // Actualizar perfilCompleto si es necesario
    const tienePerfilCompleto = !!perfilEspecifico;
    if (user.perfilCompleto !== tienePerfilCompleto) {
      user = await prisma.usuario.update({
        where: { id: user.id },
        data: { perfilCompleto: tienePerfilCompleto }
      });
    }

    const token = generateToken({ id: user.id, rol: user.rol });

    res.json({
      mensaje: 'Autenticación con Google exitosa',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol.toLowerCase(),
        perfilCompleto: tienePerfilCompleto,
        picture // URL de la foto de Google
      },
      necesitaCompletarPerfil: !tienePerfilCompleto,
      redirectTo: !tienePerfilCompleto ? 
        (user.rol === 'EMPRESA' ? '/auth/completar-perfil-empresa' : '/perfil/completar') : 
        '/dashboard'
    });
  } catch (error) {
    console.error('Error en Google Auth:', error);
    res.status(500).json({ error: 'Error en autenticación con Google', detalle: error.message });
  }
};

// Completar perfil de empresa (después de Google Auth)
const completarPerfilEmpresa = async (req, res) => {
  try {
    const { ruc, nombre_empresa, rubro, descripcion, direccion, telefono } = req.body;
    const usuarioId = req.user.id;

    // Verificar que sea una empresa
    const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
    if (!usuario || usuario.rol !== 'EMPRESA') {
      return res.status(403).json({ error: 'Solo empresas pueden completar este perfil' });
    }

    // Verificar que no tenga ya un perfil
    const empresaExistente = await prisma.empresa.findUnique({ where: { usuarioId } });
    if (empresaExistente) {
      return res.status(400).json({ error: 'El perfil de empresa ya existe' });
    }

    // Validar RUC (opcional: integrar con API de SUNAT)
    if (!ruc || ruc.length !== 11) {
      return res.status(400).json({ error: 'RUC debe tener 11 dígitos' });
    }

    // Crear perfil de empresa en una transacción
    const result = await prisma.$transaction(async (tx) => {
      const empresa = await tx.empresa.create({
        data: {
          usuarioId,
          ruc,
          nombre_empresa,
          rubro,
          descripcion,
          direccion,
          telefono
        }
      });

      // Marcar perfil como completo
      await tx.usuario.update({
        where: { id: usuarioId },
        data: { perfilCompleto: true }
      });

      return empresa;
    });

    res.status(201).json({
      mensaje: 'Perfil de empresa completado exitosamente',
      empresa: result
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al completar perfil de empresa', detalle: error.message });
  }
};

// Verificar estado del perfil del usuario
const verificarEstadoPerfil = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        perfilCompleto: true,
        estudiante: {
          select: {
            id: true,
            carrera: true,
            año_egreso: true,
            telefono: true,
            tipo: true,
            cv: true,
            foto_perfil: true
          }
        },
        empresa: {
          select: {
            id: true,
            ruc: true,
            nombre_empresa: true,
            rubro: true,
            descripcion: true,
            direccion: true,
            telefono: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const tienePerfilEspecifico = !!(user.estudiante || user.empresa);
    
    // Actualizar perfilCompleto si es necesario
    if (user.perfilCompleto !== tienePerfilEspecifico) {
      await prisma.usuario.update({
        where: { id: userId },
        data: { perfilCompleto: tienePerfilEspecifico }
      });
    }

    // Convertir enum values to lowercase para mantener compatibilidad
    const userResponse = {
      ...user,
      rol: user.rol.toLowerCase(),
      estudiante: user.estudiante ? {
        ...user.estudiante,
        tipo: user.estudiante.tipo.toLowerCase()
      } : user.estudiante,
      perfilCompleto: tienePerfilEspecifico
    };

    res.json({
      mensaje: 'Estado del perfil del usuario',
      user: userResponse,
      perfilCompleto: tienePerfilEspecifico,
      necesitaCompletarPerfil: !tienePerfilEspecifico,
      redirectTo: !tienePerfilEspecifico ? 
        (user.rol === 'EMPRESA' ? '/auth/completar-perfil-empresa' : '/perfil/completar') : 
        null
    });
  } catch (error) {
    console.error('Error al verificar estado del perfil:', error);
    res.status(500).json({ error: 'Error al verificar estado del perfil', detalle: error.message });
  }
};

module.exports = { 
    register, 
    login,
    perfil,
    logout, 
    googleAuth,
    completarPerfilEmpresa,
    verificarEstadoPerfil,
};