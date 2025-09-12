// tests/unit/ofertas.test.js
const request = require('supertest');
const app = require('../../src/app');
const { 
  prisma, 
  generateTestUser,
  generateTestEmpresa,
  generateTestOferta,
  cleanupTestData,
  setupTestDatabase,
  teardownTestDatabase
} = require('../helpers/testSetup');
const jwt = require('jsonwebtoken');

describe('Ofertas Endpoints', () => {
  let empresaUser;
  let empresa;
  let authToken;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await cleanupTestData();
    
    // Create test company and user
    empresaUser = await prisma.usuario.create({
      data: generateTestUser({
        rol: 'EMPRESA'
      })
    });

    empresa = await prisma.empresa.create({
      data: generateTestEmpresa(empresaUser.id)
    });

    // Generate auth token
    authToken = jwt.sign(
      { id: empresaUser.id, rol: 'EMPRESA' },
      process.env.JWT_SECRET || 'testsecret'
    );
  });

  describe('GET /api/ofertas', () => {
    it('should return all ofertas', async () => {
      // Create test ofertas
      await prisma.oferta.createMany({
        data: [
          generateTestOferta(empresa.id, { titulo: 'Oferta 1' }),
          generateTestOferta(empresa.id, { titulo: 'Oferta 2' })
        ]
      });

      const response = await request(app)
        .get('/api/ofertas')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('titulo');
      expect(response.body[0]).toHaveProperty('empresa');
    });

    it('should return empty array when no ofertas exist', async () => {
      const response = await request(app)
        .get('/api/ofertas')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /api/ofertas/:id', () => {
    it('should return specific oferta with details', async () => {
      const oferta = await prisma.oferta.create({
        data: generateTestOferta(empresa.id)
      });

      const response = await request(app)
        .get(`/api/ofertas/${oferta.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', oferta.id);
      expect(response.body).toHaveProperty('titulo', oferta.titulo);
      expect(response.body).toHaveProperty('empresa');
    });

    it('should return 404 for non-existent oferta', async () => {
      const response = await request(app)
        .get('/api/ofertas/99999')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Oferta no encontrada');
    });
  });

  describe('POST /api/ofertas', () => {
    it('should create new oferta successfully', async () => {
      const ofertaData = {
        titulo: 'Nueva Oferta de Prueba',
        descripcion: 'Descripción de la oferta',
        duracion: '6 meses',
        empresaId: empresa.id,
        requisitos: [
          {
            requisito: 'Conocimientos en JavaScript',
            descripcion: 'Experiencia mínima 2 años',
            tipo: 'obligatorio',
            categoria: 'tecnico'
          }
        ]
      };

      const response = await request(app)
        .post('/api/ofertas')
        .set('Authorization', `Bearer ${authToken}`)
        .send(ofertaData)
        .expect(201);

      expect(response.body).toHaveProperty('mensaje', 'Oferta creada exitosamente');
      expect(response.body.oferta).toHaveProperty('titulo', ofertaData.titulo);
      expect(response.body.oferta).toHaveProperty('requisitos');
    });

    it('should reject creation without authentication', async () => {
      const ofertaData = {
        titulo: 'Nueva Oferta',
        descripcion: 'Descripción',
        empresaId: empresa.id
      };

      const response = await request(app)
        .post('/api/ofertas')
        .send(ofertaData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/ofertas/:id', () => {
    it('should update oferta successfully', async () => {
      const oferta = await prisma.oferta.create({
        data: generateTestOferta(empresa.id)
      });

      const updateData = {
        titulo: 'Título Actualizado',
        descripcion: 'Descripción actualizada'
      };

      const response = await request(app)
        .put(`/api/ofertas/${oferta.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('mensaje', 'Oferta actualizada exitosamente');
      expect(response.body.oferta).toHaveProperty('titulo', updateData.titulo);
    });

    it('should reject update of non-existent oferta', async () => {
      const response = await request(app)
        .put('/api/ofertas/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ titulo: 'Updated' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Oferta no encontrada');
    });
  });

  describe('DELETE /api/ofertas/:id', () => {
    it('should delete oferta successfully', async () => {
      const oferta = await prisma.oferta.create({
        data: generateTestOferta(empresa.id)
      });

      const response = await request(app)
        .delete(`/api/ofertas/${oferta.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('mensaje', 'Oferta eliminada exitosamente');

      // Verify oferta was deleted
      const deletedOferta = await prisma.oferta.findUnique({
        where: { id: oferta.id }
      });
      expect(deletedOferta).toBeNull();
    });

    it('should return 404 for non-existent oferta', async () => {
      const response = await request(app)
        .delete('/api/ofertas/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Oferta no encontrada');
    });
  });
});