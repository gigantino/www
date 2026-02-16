export function HomeShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background px-4 py-8 font-sans sm:px-6 overflow-x-hidden">
      {children}
    </div>
  );
}
