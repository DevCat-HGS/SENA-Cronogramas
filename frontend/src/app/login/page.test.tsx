import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';

describe('LoginPage', () => {
  it('submits form with valid data', async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.queryByText(/credenciales inválidas/i)).not.toBeInTheDocument();
    });
  });

  it('shows validation errors', async () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText(/correo electrónico inválido/i)).toBeInTheDocument();
      expect(screen.getByText(/la contraseña es requerida/i)).toBeInTheDocument();
    });
  });
}); 