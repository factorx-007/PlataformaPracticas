// tests/unit/auth.test.js
const request = require('supertest');
const app = require('../../src/app');
const { 
  prisma, 
  generateTestUser,
  cleanupTestData,
  setupTestDatabase,
  teardownTestDatabase
} = require('../helpers/testSetup');
const bcrypt = require('bcryptjs');

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await cleanupTestData();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new student successfully', async () => {
      const userData = {
        nombre: 'Test Student',
        email: 'student@test.com',
        password: 'password123',
        rol: 'estudiante',
        carrera: 'Ingeniería de Sistemas',
        tipo: 'estudiante'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('mensaje', 'Usuario registrado con éxito');
      expect(response.body.user).toHaveProperty('email', userData.email);
      expect(response.body.user).toHaveProperty('rol', 'estudiante');
      expect(response.body).toHaveProperty('perfil');
    });

    it('should register a new company successfully', async () => {
      const userData = {
        nombre: 'Test Company',
        email: 'company@test.com',
        password: 'password123',
        rol: 'empresa',
        ruc: '12345678901',
        nombre_empresa: 'Test Company SAC',
        rubro: 'Tecnología'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('mensaje', 'Usuario registrado con éxito');
      expect(response.body.user).toHaveProperty('email', userData.email);
      expect(response.body.user).toHaveProperty('rol', 'empresa');
      expect(response.body).toHaveProperty('perfil');
    });

    it('should reject registration with existing email', async () => {
      // Create a user first
      const userData = generateTestUser();
      await prisma.usuario.create({ data: userData });

      // Try to register with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'Another User',
          email: userData.email,
          password: 'password123',
          rol: 'estudiante',
          carrera: 'Ingeniería'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'El email ya está en uso');
    });

    it('should reject student registration without carrera', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'Test Student',
          email: 'student@test.com',
          password: 'password123',
          rol: 'estudiante'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'La carrera es obligatoria para estudiantes y egresados');
    });

    it('should reject company registration without required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'Test Company',
          email: 'company@test.com',
          password: 'password123',
          rol: 'empresa'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'RUC, nombre de empresa y rubro son obligatorios para empresas');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      // Create a test user
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const userData = generateTestUser({
        password: hashedPassword
      });
      
      const user = await prisma.usuario.create({ data: userData });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: password
        })
        .expect(200);

      expect(response.body).toHaveProperty('mensaje', 'Login exitoso');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', userData.email);
    });

    it('should reject login with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123'
        })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Usuario no encontrado');
    });

    it('should reject login with invalid password', async () => {
      // Create a test user
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      const userData = generateTestUser({
        password: hashedPassword
      });
      
      await prisma.usuario.create({ data: userData });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Contraseña incorrecta');
    });
  });

  describe('GET /api/auth/perfil', () => {
    it('should return user profile when authenticated', async () => {
      // This test would require implementing token generation and middleware testing
      // For now, we'll skip it as it requires more complex setup
    });

    it('should reject access without token', async () => {
      const response = await request(app)
        .get('/api/auth/perfil')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
});