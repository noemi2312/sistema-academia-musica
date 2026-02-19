import { describe, it, expect } from 'vitest';

//verifica si un usuario tiene acceso administrativo
const tieneAccesoAdmin = (user: { rol?: string }) => {
  return user.rol === 'ADMIN' || user.rol === 'ACADEMIA';
};

describe('Pruebas de Autorización', () => {
  it('debería permitir el acceso si el usuario es ADMIN', () => {
    const user = { rol: 'ADMIN' };
    expect(tieneAccesoAdmin(user)).toBe(true);
  });

  it('debería denegar el acceso si el usuario es ALUMNO', () => {
    const user = { rol: 'ALUMNO' };
    expect(tieneAccesoAdmin(user)).toBe(false);
  });

  it('debería denegar el acceso si el usuario no tiene rol definido', () => {
    const user = {};
    expect(tieneAccesoAdmin(user)).toBe(false);
  });
});