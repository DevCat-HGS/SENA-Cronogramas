import { rest } from 'msw';

export const handlers = [
  // Auth handlers
  rest.post('/api/instructores/login', (req, res, ctx) => {
    return res(
      ctx.json({
        token: 'fake-token',
      })
    );
  }),

  // Instructores handlers
  rest.get('/api/instructores', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          _id: '1',
          nombre: 'John',
          apellido: 'Doe',
          correo: 'john@example.com',
          estado: 'activo',
        },
      ])
    );
  }),

  // Dashboard handlers
  rest.get('/api/dashboard/stats', (req, res, ctx) => {
    return res(
      ctx.json({
        totalInstructores: 10,
        instructoresActivos: 8,
        actividadesActivas: 15,
        eventosPendientes: 5,
      })
    );
  }),
]; 