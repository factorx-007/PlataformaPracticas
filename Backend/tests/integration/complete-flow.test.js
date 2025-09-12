// tests/integration/complete-flow.test.js
const request = require('supertest');
const app = require('../../src/app');
const { 
  prisma, 
  cleanupTestData,
  setupTestDatabase,
  teardownTestDatabase
} = require('../helpers/testSetup');

describe('Complete Application Flow Integration Tests', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await cleanupTestData();
  });

  describe('Complete User Journey', () => {
    it('should complete full student-company interaction flow', async () => {
      // 1. Register a company
      const companyData = {
        nombre: 'Tech Company',
        email: 'company@techflow.com',
        password: 'password123',
        rol: 'empresa',
        ruc: '12345678901',
        nombre_empresa: 'TechFlow SAC',
        rubro: 'Tecnología'
      };

      const companyRegResponse = await request(app)
        .post('/api/auth/register')
        .send(companyData)
        .expect(201);

      expect(companyRegResponse.body.user).toHaveProperty('rol', 'empresa');
      const companyUserId = companyRegResponse.body.user.id;

      // 2. Login as company
      const companyLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: companyData.email,
          password: companyData.password
        })
        .expect(200);

      const companyToken = companyLoginResponse.body.token;

      // 3. Create a category for blog
      const categoryResponse = await request(app)
        .post('/api/categorias')
        .send({
          nombre: 'Tecnología',
          descripcion: 'Categoría de tecnología'
        })
        .expect(201);

      const categoryId = categoryResponse.body.categoria.id;

      // 4. Create a blog post
      const blogPostResponse = await request(app)
        .post('/api/posts')
        .send({
          titulo: 'Oportunidades en Tecnología',
          contenido: 'Contenido del blog sobre tecnología...',
          categoriaId: categoryId
        })
        .expect(201);

      expect(blogPostResponse.body.blogPost).toHaveProperty('titulo');

      // 5. Create job offer as company
      const ofertaData = {
        titulo: 'Desarrollador Backend Node.js',
        descripcion: 'Buscamos desarrollador con experiencia en Node.js',
        duracion: '6 meses',
        empresaId: companyRegResponse.body.perfil.id,
        requisitos: [
          {
            requisito: 'Conocimientos en Node.js',
            descripcion: 'Experiencia mínima 2 años',
            tipo: 'obligatorio',
            categoria: 'tecnico'
          }
        ]
      };

      const ofertaResponse = await request(app)
        .post('/api/ofertas')
        .set('Authorization', `Bearer ${companyToken}`)
        .send(ofertaData)
        .expect(201);

      const ofertaId = ofertaResponse.body.oferta.id;

      // 6. Add questions to the offer
      const preguntaResponse = await request(app)
        .post('/api/preguntas-oferta')
        .set('Authorization', `Bearer ${companyToken}`)
        .send({
          ofertaId: ofertaId,
          pregunta: '¿Cuántos años de experiencia tienes con Node.js?',
          tipo: 'number',
          requerida: true
        })
        .expect(201);

      const preguntaId = preguntaResponse.body.pregunta.id;

      // 7. Register a student
      const studentData = {
        nombre: 'Juan Estudiante',
        email: 'juan@student.com',
        password: 'password123',
        rol: 'estudiante',
        carrera: 'Ingeniería de Sistemas',
        tipo: 'estudiante'
      };

      const studentRegResponse = await request(app)
        .post('/api/auth/register')
        .send(studentData)
        .expect(201);

      expect(studentRegResponse.body.user).toHaveProperty('rol', 'estudiante');

      // 8. Login as student
      const studentLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: studentData.email,
          password: studentData.password
        })
        .expect(200);

      const studentToken = studentLoginResponse.body.token;

      // 9. Student views available offers
      const ofertasResponse = await request(app)
        .get('/api/ofertas')
        .expect(200);

      expect(ofertasResponse.body).toHaveLength(1);
      expect(ofertasResponse.body[0]).toHaveProperty('titulo', ofertaData.titulo);

      // 10. Student applies to the offer
      const postulacionResponse = await request(app)
        .post('/api/postulaciones')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          ofertaId: ofertaId,
          mensaje: 'Estoy muy interesado en esta posición',
          respuestas: [
            {
              preguntaOfertaId: preguntaId,
              respuesta: '3'
            }
          ]
        })
        .expect(201);

      expect(postulacionResponse.body.postulacion).toHaveProperty('estado', 'pendiente');

      // 11. Company views applications
      const postulacionesResponse = await request(app)
        .get('/api/postulaciones')
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(200);

      expect(postulacionesResponse.body).toHaveLength(1);
      expect(postulacionesResponse.body[0]).toHaveProperty('estudiante');

      // 12. Company accepts the application
      const postulacionId = postulacionesResponse.body[0].id;
      const updateResponse = await request(app)
        .put(`/api/postulaciones/${postulacionId}`)
        .set('Authorization', `Bearer ${companyToken}`)
        .send({
          estado: 'aceptada',
          mensaje: 'Aplicación aceptada, nos contactaremos pronto'
        })
        .expect(200);

      expect(updateResponse.body.postulacion).toHaveProperty('estado', 'aceptada');

      // 13. Student checks application status
      const studentPostulacionesResponse = await request(app)
        .get('/api/postulaciones')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(studentPostulacionesResponse.body[0]).toHaveProperty('estado', 'aceptada');

      // 14. Add comment to blog post
      const commentResponse = await request(app)
        .post('/api/comentarios')
        .send({
          postId: blogPostResponse.body.blogPost.id,
          autor: 'Juan Estudiante',
          email: 'juan@student.com',
          contenido: 'Excelente artículo sobre oportunidades en tecnología'
        })
        .expect(201);

      expect(commentResponse.body.comentario).toHaveProperty('contenido');

      // 15. Verify complete data integrity
      const finalOferta = await prisma.oferta.findUnique({
        where: { id: ofertaId },
        include: {
          empresa: true,
          requisitos: true,
          postulaciones: {
            include: {
              estudiante: {
                include: {
                  usuario: true
                }
              }
            }
          },
          preguntas: true
        }
      });

      expect(finalOferta).toBeTruthy();
      expect(finalOferta.postulaciones).toHaveLength(1);
      expect(finalOferta.postulaciones[0].estado).toBe('ACEPTADA');
      expect(finalOferta.preguntas).toHaveLength(1);
      expect(finalOferta.requisitos).toHaveLength(1);
    });

    it('should handle rejection flow properly', async () => {
      // Setup basic company and student
      const companyData = {
        nombre: 'Reject Company',
        email: 'reject@company.com',
        password: 'password123',
        rol: 'empresa',
        ruc: '98765432109',
        nombre_empresa: 'Reject Co',
        rubro: 'Testing'
      };

      const studentData = {
        nombre: 'Test Student',
        email: 'student@reject.com',
        password: 'password123',
        rol: 'estudiante',
        carrera: 'Ingeniería',
        tipo: 'estudiante'
      };

      // Register company and student
      const companyReg = await request(app)
        .post('/api/auth/register')
        .send(companyData)
        .expect(201);

      const studentReg = await request(app)
        .post('/api/auth/register')
        .send(studentData)
        .expect(201);

      // Login both users
      const companyLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: companyData.email, password: companyData.password })
        .expect(200);

      const studentLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: studentData.email, password: studentData.password })
        .expect(200);

      // Create offer
      const ofertaResponse = await request(app)
        .post('/api/ofertas')
        .set('Authorization', `Bearer ${companyLogin.body.token}`)
        .send({
          titulo: 'Test Rejection Offer',
          descripcion: 'This offer will be rejected',
          empresaId: companyReg.body.perfil.id
        })
        .expect(201);

      // Student applies
      const postulacionResponse = await request(app)
        .post('/api/postulaciones')
        .set('Authorization', `Bearer ${studentLogin.body.token}`)
        .send({
          ofertaId: ofertaResponse.body.oferta.id,
          mensaje: 'Please consider my application'
        })
        .expect(201);

      // Company rejects application
      const rejectResponse = await request(app)
        .put(`/api/postulaciones/${postulacionResponse.body.postulacion.id}`)
        .set('Authorization', `Bearer ${companyLogin.body.token}`)
        .send({
          estado: 'rechazada',
          mensaje: 'Thank you for your interest, but we decided to go with another candidate'
        })
        .expect(200);

      expect(rejectResponse.body.postulacion).toHaveProperty('estado', 'rechazada');

      // Verify student can see the rejection
      const studentPostulaciones = await request(app)
        .get('/api/postulaciones')
        .set('Authorization', `Bearer ${studentLogin.body.token}`)
        .expect(200);

      expect(studentPostulaciones.body[0]).toHaveProperty('estado', 'rechazada');
    });
  });
});