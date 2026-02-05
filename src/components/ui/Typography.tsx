export function TextSecondary({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-600">{children}</p>;
}

export function HighlightText({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-blue-700 bg-gray-100 px-1 rounded">{children}</span>;
}