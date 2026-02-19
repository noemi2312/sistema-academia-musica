import React from "react";

/**
 * 1. Título Principal (Hero)
 * Ideal para el encabezado del Landing con el azul UAP.
 */
export function TitleMain({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-4xl md:text-5xl font-extrabold text-[#0D2C6B] text-center mb-4 tracking-tight">
      {children}
    </h1>
  );
}

/**
 * 2. Títulos de bloques internos
 * Con el detalle del borde inferior dorado institucional.
 */
export function TitleSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center w-full">
      <h3 className="text-xl font-semibold text-[#0D2C6B] mt-8 mb-4 border-b-2 border-[#F4C430] pb-2 inline-block">
        {children}
      </h3>
    </div>
  );
}

/**
 * 3. Texto Secundario o descripciones
 */
export function TextSecondary({ children }: { children: React.ReactNode }) {
  return <p className="text-slate-500 italic text-center">{children}</p>;
}

/**
 * 4. Resaltado de texto (estilo mono)
 * Usa el fondo dorado suave para destacar sin desentonar.
 */
export function HighlightText({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[#0D2C6B] bg-[#fdf4d7] px-1 rounded border border-[#F4C430]/20">
      {children}
    </span>
  );
}

/**
 * 5. Texto en negrita para énfasis
 */
export function TextBold({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-slate-900">{children}</span>;
}