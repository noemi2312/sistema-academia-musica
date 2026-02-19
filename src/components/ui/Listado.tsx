import React from "react";

export function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 border rounded-lg flex justify-between items-center bg-white shadow-sm hover:border-blue-300 transition-all mb-4">
      {children}
    </div>
  );
}