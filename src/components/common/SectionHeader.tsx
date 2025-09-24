export default function SectionHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {subtitle ? <p className="text-muted-foreground">{subtitle}</p> : null}
      </div>
      {right}
    </div>
  );
}


