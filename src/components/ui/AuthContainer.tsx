export function AuthContainer({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">{title}</h1>
        {children}
      </div>
    </div>
  );
}