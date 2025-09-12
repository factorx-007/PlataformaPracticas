//src/services/authService
const bcrypt = require('bcryptjs');
const { prisma } = require('../config/database');
const generateToken = require('../utils/generateToken');

const login = async (email, password) => {
  const user = await prisma.usuario.findUnique({ where: { email } });

  if (!user) throw new Error('Usuario no encontrado');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Contraseña incorrecta');

  // Convert rol to lowercase for token compatibility
  const token = generateToken({ id: user.id, rol: user.rol.toLowerCase() });
  
  // Convert rol to lowercase for API compatibility
  const userFormatted = {
    ...user,
    rol: user.rol.toLowerCase()
  };
  
  return { user: userFormatted, token };
};

module.exports = { login };
