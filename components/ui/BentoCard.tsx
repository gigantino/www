export function BentoCard({ id, className, children }: { id: string; className: string; children: React.ReactNode }) {
  return (
    <div id={id} className={`neo-card min-w-0 p-6 ${className}`}>
      {children}
    </div>
  );
}
