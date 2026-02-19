// sistema-academia\src\components\ui\AuthContainer.tsx
export function AuthContainer({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center p-4">
      {/* Mantenemos el bg-white de la tarjeta, pero el fondo de afuera será el azulado del Layout */}
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md border-t-4 border-[#0D2C6B]">
        <h1 className="mb-6 text-2xl font-bold text-center text-[#0D2C6B]">{title}</h1>
        {children}
      </div>
    </div>
  );
}