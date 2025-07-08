//src/controllers/authController.js
const bcrypt = require('bcryptjs');
const { Usuario, Estudiante, Empresa } = require('../models');
const { Op } = require('sequelize');
const generateToken = require('../utils/generateToken');
const { Op } = require('sequelize');

// Registro
const register = async (req, res) => {
  const { nombre, email, password, rol, carrera, tipo, ruc, nombre_empresa, rubro } = req.body;

  try {
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) return res.status(400).json({ error: 'El email ya está en uso' });

    // Validaciones específicas por rol
    if ((rol === 'estudiante' || rol === 'egresado') && !carrera) {
      return res.status(400).json({ error: 'La carrera es obligatoria para estudiantes y egresados' });
    }

    if (rol === 'empresa' && (!ruc || !nombre_empresa || !rubro)) {
      return res.status(400).json({ error: 'RUC, nombre de empresa y rubro son obligatorios para empresas' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear usuario base
    const user = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      rol,
    });

    let perfil = null;

    // Crear perfil específico según el rol
    if (rol === 'estudiante' || rol === 'egresado') {
      perfil = await Estudiante.create({
        usuarioId: user.id,
        carrera,
        tipo: tipo || rol, // usar el tipo proporcionado o el rol como fallback
      });
    } else if (rol === 'empresa') {
      perfil = await Empresa.create({
        usuarioId: user.id,
        ruc,
        nombre_empresa,
        rubro,
      });
    }

    res.status(201).json({ 
      mensaje: 'Usuario registrado con éxito', 
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
      perfil
    });
  } catch (err) {
    res.status(500).json({ error: 'Error en el registro', detalle: err.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Usuario.findOne({ where: { email } });
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
        rol: user.rol,
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

    const user = await Usuario.findByPk(req.user.id, {
      attributes: ['id', 'nombre', 'email', 'rol'],
      include: [
        {
          model: Estudiante,
          required: false,
          attributes: ['id', 'carrera', 'año_egreso', 'telefono', 'tipo', 'cv', 'foto_perfil']
        },
        {
          model: Empresa,
          required: false,
          attributes: ['id', 'ruc', 'nombre_empresa', 'rubro', 'descripcion', 'direccion', 'telefono']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado con el ID proporcionado' });
    }

    res.json({ 
      mensaje: 'Perfil del usuario', 
      user
    });
  } catch (err) {
    console.error("Error en /perfil:", err); // Loguear el error en backend es útil
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
    const { googleId, email, nombre, rol } = req.body;

    // Buscar usuario existente por googleId o email
    let user = await Usuario.findOne({ 
      where: { 
        [Op.or]: [
          { googleId },
          { email }
        ]
      }
    });

    if (user) {
      // Usuario existente - actualizar googleId si es necesario
      if (!user.googleId) {
        await user.update({ googleId });
      }
    } else {
      // Nuevo usuario - crear con Google
      user = await Usuario.create({
        nombre,
        email,
        googleId,
        rol,
        password: null, // No tiene contraseña
        perfilCompleto: false
      });
    }

    // Verificar si tiene perfil completo
    let perfilEspecifico = null;
    if (user.rol === 'empresa') {
      perfilEspecifico = await Empresa.findOne({ where: { usuarioId: user.id } });
    } else if (user.rol === 'estudiante' || user.rol === 'egresado') {
      perfilEspecifico = await Estudiante.findOne({ where: { usuarioId: user.id } });
    }

    const token = generateToken({ id: user.id, rol: user.rol });

    res.json({
      mensaje: 'Autenticación con Google exitosa',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        perfilCompleto: !!perfilEspecifico
      },
      necesitaCompletarPerfil: !perfilEspecifico
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en autenticación con Google', detalle: error.message });
  }
};

// Completar perfil de empresa (después de Google Auth)
const completarPerfilEmpresa = async (req, res) => {
  try {
    const { ruc, nombre_empresa, rubro, descripcion, direccion, telefono } = req.body;
    const usuarioId = req.user.id;

    // Verificar que sea una empresa
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario || usuario.rol !== 'empresa') {
      return res.status(403).json({ error: 'Solo empresas pueden completar este perfil' });
    }

    // Verificar que no tenga ya un perfil
    const empresaExistente = await Empresa.findOne({ where: { usuarioId } });
    if (empresaExistente) {
      return res.status(400).json({ error: 'El perfil de empresa ya existe' });
    }

    // Validar RUC (opcional: integrar con API de SUNAT)
    if (!ruc || ruc.length !== 11) {
      return res.status(400).json({ error: 'RUC debe tener 11 dígitos' });
    }

    // Crear perfil de empresa
    const empresa = await Empresa.create({
      usuarioId,
      ruc,
      nombre_empresa,
      rubro,
      descripcion,
      direccion,
      telefono
    });

    // Marcar perfil como completo
    await usuario.update({ perfilCompleto: true });

    res.status(201).json({
      mensaje: 'Perfil de empresa completado exitosamente',
      empresa
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al completar perfil de empresa', detalle: error.message });
  }
};

module.exports = { 
    register, 
    login,
    perfil,
    logout, 
    googleAuth,
    completarPerfilEmpresa,
};
