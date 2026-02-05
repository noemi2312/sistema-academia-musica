//cuadro azul con el borde lateral más grueso que usamos para destacar información importante.

export function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 p-4 border-l-4 border-blue-500 bg-blue-50 text-sm text-blue-700">
      {children}
    </div>
  );
}