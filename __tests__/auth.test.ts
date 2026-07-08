import { describe, it, expect } from 'vitest';
import { Role } from '@prisma/client'; 

/**
 * Función de lógica de autorización.
 * Evaluar si el rol proporcionado corresponde al administrador.
 */
const tieneAccesoAdmin = (rol?: Role | null) => {
  return rol === Role.ADMIN;
};

describe('Pruebas de Autorización', () => {
  
  // Prueba del camino feliz (Happy Path)
  it('permitir el acceso si el usuario es ADMIN', () => {
    expect(tieneAccesoAdmin(Role.ADMIN)).toBe(true);
  });

  // Prueba de restricción de privilegios
  it('denegar el acceso si el usuario es ALUMNO', () => {
    expect(tieneAccesoAdmin(Role.ALUMNO)).toBe(false);
  });

  // Prueba de robustez ante estados indefinidos
  it('denegar el acceso si el rol es undefined', () => {
    expect(tieneAccesoAdmin(undefined)).toBe(false);
  });

  // Prueba de robustez ante estados nulos
  it('denegar el acceso si el rol es null', () => {
    expect(tieneAccesoAdmin(null)).toBe(false);
  });
});