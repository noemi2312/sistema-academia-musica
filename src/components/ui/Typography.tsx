import React from "react";

export function TextSecondary({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-600">{children}</p>;
}

export function HighlightText({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-blue-700 bg-gray-100 px-1 rounded">{children}</span>;
}

//títulos de bloques internos
export function TitleSection({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-4 border-b pb-2">{children}</h3>;
}

export function TextBold({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-gray-900">{children}</span>;
}