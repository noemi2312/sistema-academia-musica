import { describe, it, expect } from 'vitest';
import { Role } from '@prisma/client'; 

const tieneAccesoAdmin = (rol?: Role) => {
  return rol === Role.ADMIN;
};

describe('Pruebas de Autorización (Actualizadas)', () => {
  it('debería permitir el acceso si el usuario es ADMIN', () => {
    expect(tieneAccesoAdmin(Role.ADMIN)).toBe(true);
  });

  it('debería denegar el acceso si el usuario es ALUMNO', () => {
    expect(tieneAccesoAdmin(Role.ALUMNO)).toBe(false);
  });
});