// tests/unit/postulaciones.test.js
const request = require('supertest');
const app = require('../../src/app');
const { 
  prisma, 
  generateTestUser,
  generateTestEmpresa,
  generateTestEstudiante,
  generateTestOferta,
  cleanupTestData,
  setupTestDatabase,
  teardownTestDatabase
} = require('../helpers/testSetup');
const jwt = require('jsonwebtoken');

describe('Postulaciones Endpoints', () => {
  let estudianteUser, empresaUser;
  let estudiante, empresa;
  let oferta;
  let estudianteToken, empresaToken;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await cleanupTestData();
    
    // Create test student
    estudianteUser = await prisma.usuario.create({
      data: generateTestUser({
        rol: 'ESTUDIANTE',
        email: 'estudiante@test.com'
      })
    });

    estudiante = await prisma.estudiante.create({
      data: generateTestEstudiante(estudianteUser.id)
    });

    // Create test company
    empresaUser = await prisma.usuario.create({
      data: generateTestUser({
        rol: 'EMPRESA',
        email: 'empresa@test.com'
      })
    });

    empresa = await prisma.empresa.create({
      data: generateTestEmpresa(empresaUser.id)
    });

    // Create test oferta
    oferta = await prisma.oferta.create({
      data: generateTestOferta(empresa.id)
    });

    // Generate auth tokens
    estudianteToken = jwt.sign(
      { id: estudianteUser.id, rol: 'ESTUDIANTE' },
      process.env.JWT_SECRET || 'testsecret'
    );

    empresaToken = jwt.sign(
      { id: empresaUser.id, rol: 'EMPRESA' },
      process.env.JWT_SECRET || 'testsecret'
    );
  });

  describe('POST /api/postulaciones', () => {
    it('should create postulacion successfully', async () => {
      const postulacionData = {
        ofertaId: oferta.id,
        mensaje: 'Estoy muy interesado en esta oferta'
      };

      const response = await request(app)
        .post('/api/postulaciones')
        .set('Authorization', `Bearer ${estudianteToken}`)
        .send(postulacionData)
        .expect(201);

      expect(response.body).toHaveProperty('mensaje', 'Postulación creada exitosamente');
      expect(response.body.postulacion).toHaveProperty('ofertaId', oferta.id);
      expect(response.body.postulacion).toHaveProperty('estudianteId', estudiante.id);
      expect(response.body.postulacion).toHaveProperty('estado', 'pendiente');
    });

    it('should reject duplicate postulacion', async () => {
      // Create first postulacion
      await prisma.postulacion.create({
        data: {
          estudianteId: estudiante.id,
          ofertaId: oferta.id,
          mensaje: 'Primera postulación',
          estado: 'PENDIENTE'
        }
      });

      const postulacionData = {
        ofertaId: oferta.id,
        mensaje: 'Segunda postulación'
      };

      const response = await request(app)
        .post('/api/postulaciones')
        .set('Authorization', `Bearer ${estudianteToken}`)
        .send(postulacionData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Ya has postulado a esta oferta');
    });

    it('should reject postulacion without authentication', async () => {
      const postulacionData = {
        ofertaId: oferta.id,
        mensaje: 'Test message'
      };

      const response = await request(app)
        .post('/api/postulaciones')
        .send(postulacionData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject postulacion to non-existent oferta', async () => {
      const postulacionData = {
        ofertaId: 99999,
        mensaje: 'Test message'
      };

      const response = await request(app)
        .post('/api/postulaciones')
        .set('Authorization', `Bearer ${estudianteToken}`)
        .send(postulacionData)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Oferta no encontrada');
    });
  });

  describe('GET /api/postulaciones', () => {
    it('should return student postulations', async () => {
      // Create test postulaciones
      await prisma.postulacion.createMany({
        data: [
          {
            estudianteId: estudiante.id,
            ofertaId: oferta.id,
            mensaje: 'Postulación 1',
            estado: 'PENDIENTE'
          }
        ]
      });

      const response = await request(app)
        .get('/api/postulaciones')
        .set('Authorization', `Bearer ${estudianteToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('oferta');
      expect(response.body[0]).toHaveProperty('estado', 'pendiente');
    });

    it('should return company postulations', async () => {
      // Create test postulacion
      await prisma.postulacion.create({
        data: {
          estudianteId: estudiante.id,
          ofertaId: oferta.id,
          mensaje: 'Postulación de prueba',
          estado: 'PENDIENTE'
        }
      });

      const response = await request(app)
        .get('/api/postulaciones')
        .set('Authorization', `Bearer ${empresaToken}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('estudiante');
      expect(response.body[0]).toHaveProperty('oferta');
    });
  });

  describe('PUT /api/postulaciones/:id', () => {
    it('should update postulacion status by company', async () => {
      const postulacion = await prisma.postulacion.create({
        data: {
          estudianteId: estudiante.id,
          ofertaId: oferta.id,
          mensaje: 'Test postulación',
          estado: 'PENDIENTE'
        }
      });

      const updateData = {
        estado: 'aceptada',
        mensaje: 'Postulación aceptada'
      };

      const response = await request(app)
        .put(`/api/postulaciones/${postulacion.id}`)
        .set('Authorization', `Bearer ${empresaToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('mensaje', 'Postulación actualizada exitosamente');
      expect(response.body.postulacion).toHaveProperty('estado', 'aceptada');
    });

    it('should reject update by unauthorized user', async () => {
      const postulacion = await prisma.postulacion.create({
        data: {
          estudianteId: estudiante.id,
          ofertaId: oferta.id,
          mensaje: 'Test postulación',
          estado: 'PENDIENTE'
        }
      });

      const response = await request(app)
        .put(`/api/postulaciones/${postulacion.id}`)
        .set('Authorization', `Bearer ${estudianteToken}`)
        .send({ estado: 'aceptada' })
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/postulaciones/:id', () => {
    it('should delete postulacion by student', async () => {
      const postulacion = await prisma.postulacion.create({
        data: {
          estudianteId: estudiante.id,
          ofertaId: oferta.id,
          mensaje: 'Test postulación',
          estado: 'PENDIENTE'
        }
      });

      const response = await request(app)
        .delete(`/api/postulaciones/${postulacion.id}`)
        .set('Authorization', `Bearer ${estudianteToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('mensaje', 'Postulación eliminada exitosamente');

      // Verify deletion
      const deletedPostulacion = await prisma.postulacion.findUnique({
        where: { id: postulacion.id }
      });
      expect(deletedPostulacion).toBeNull();
    });

    it('should reject deletion by unauthorized user', async () => {
      const postulacion = await prisma.postulacion.create({
        data: {
          estudianteId: estudiante.id,
          ofertaId: oferta.id,
          mensaje: 'Test postulación',
          estado: 'PENDIENTE'
        }
      });

      const response = await request(app)
        .delete(`/api/postulaciones/${postulacion.id}`)
        .set('Authorization', `Bearer ${empresaToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });
  });
});