export function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    // Usamos el dorado para el fondo y el borde, y azul para el texto
    <div className="mt-6 p-4 border-l-4 border-[#F4C430] bg-[#fffcf0] text-sm text-[#0D2C6B] rounded-r-md">
      <div className="flex items-center gap-2">
        <span className="text-[#F4C430]"></span>
        {children}
      </div>
    </div>
  );
}