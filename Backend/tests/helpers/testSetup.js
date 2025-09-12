// tests/helpers/testSetup.js
const { PrismaClient } = require('@prisma/client');

// Create a separate Prisma instance for testing
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED,
    },
  },
});

// Test data generators
const generateTestUser = (overrides = {}) => ({
  nombre: 'Test User',
  email: `test${Date.now()}@example.com`,
  password: 'hashedpassword123',
  rol: 'ESTUDIANTE',
  ...overrides
});

const generateTestEmpresa = (usuarioId, overrides = {}) => ({
  usuarioId,
  ruc: `${Date.now().toString().slice(-11)}`,
  nombre_empresa: 'Test Company',
  rubro: 'Tecnología',
  descripcion: 'Empresa de prueba',
  ...overrides
});

const generateTestEstudiante = (usuarioId, overrides = {}) => ({
  usuarioId,
  carrera: 'Ingeniería de Sistemas',
  tipo: 'ESTUDIANTE',
  ...overrides
});

const generateTestOferta = (empresaId, overrides = {}) => ({
  titulo: 'Oferta de Prueba',
  descripcion: 'Descripción de la oferta de prueba',
  duracion: '6 meses',
  empresaId,
  ...overrides
});

// Clean up test data
const cleanupTestData = async () => {
  // Delete in order of dependencies to avoid foreign key conflicts
  await prisma.respuestaPostulacion.deleteMany({});
  await prisma.postulacion.deleteMany({});
  await prisma.preguntaOferta.deleteMany({});
  await prisma.requisitoOferta.deleteMany({});
  await prisma.oferta.deleteMany({});
  await prisma.comentario.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.categoria.deleteMany({});
  await prisma.estudiante.deleteMany({});
  await prisma.empresa.deleteMany({});
  await prisma.usuario.deleteMany({
    where: {
      OR: [
        { email: { contains: 'test' } },
        { email: { contains: 'techflow.com' } },
        { email: { contains: 'example.com' } }
      ]
    }
  });
};

// Setup test database
const setupTestDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('Test database connected successfully');
  } catch (error) {
    console.error('Test database connection failed:', error);
    throw error;
  }
};

// Teardown test database
const teardownTestDatabase = async () => {
  await cleanupTestData();
  await prisma.$disconnect();
};

module.exports = {
  prisma,
  generateTestUser,
  generateTestEmpresa,
  generateTestEstudiante,
  generateTestOferta,
  cleanupTestData,
  setupTestDatabase,
  teardownTestDatabase
};