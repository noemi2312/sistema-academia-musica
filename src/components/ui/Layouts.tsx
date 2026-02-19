import React from "react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#F0F4F8] flex flex-col">{children}</div>;
}

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
      {children}
    </main>
  );
}

export function Grid({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-6 ${className}`}>
      {children}
    </div>
  );
}

export function GroupTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xl font-bold text-[#0D2C6B] mb-6 block text-center border-b border-gray-200 pb-2 w-full">
      {children}
    </h3>
  );
}

export function Section({ children }: { children: React.ReactNode }) {
  return <section className="mb-16 w-full flex flex-col items-center">{children}</section>;
}

/**
 * FormGroup: Ahora asegura que cualquier hijo (Link o Button) se centre automáticamente.
 */
export function FormGroup({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-6 flex flex-col items-center justify-center text-center w-full mb-10 ${className}`}>
      {children}
    </div>
  );
}

export function ActionGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-4 mt-6 justify-center w-full">{children}</div>
  );
}

export function LandingGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl mt-12 mx-auto">
      {children}
    </div>
  );
}

export const PageLayout = DashboardLayout;
export const FormStack = FormGroup;
export const AuthFooter = FormGroup;