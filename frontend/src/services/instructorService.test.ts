import { instructorService } from './instructorService';

describe('instructorService', () => {
  it('fetches instructors successfully', async () => {
    const instructores = await instructorService.getAll();
    expect(instructores).toHaveLength(1);
    expect(instructores[0].nombre).toBe('John');
  });

  it('creates instructor successfully', async () => {
    const newInstructor = {
      nombre: 'Jane',
      apellido: 'Doe',
      correo: 'jane@example.com',
      contraseña: 'password123',
    };

    const result = await instructorService.create(newInstructor);
    expect(result.nombre).toBe('Jane');
  });
}); 