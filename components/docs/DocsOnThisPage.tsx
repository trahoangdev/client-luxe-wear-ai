type Props = {
  items?: { id: string; label: string }[];
};

export default function DocsOnThisPage({ items = [] }: Props) {
  const defaultItems = [
    { id: "why-choose", label: "Why Choose LuxeWear?" },
    { id: "ready-to-start", label: "Ready to get started?" },
  ];
  const list = items.length ? items : defaultItems;
  return (
    <aside className="hidden xl:block xl:col-span-2">
      <div className="sticky top-24 rounded-xl border p-4">
        <div className="text-xs font-semibold text-muted-foreground mb-3">On this page</div>
        <ul className="space-y-2 text-sm">
          {list.map((i) => (
            <li key={i.id}>
              <a 
                className="text-muted-foreground hover:text-foreground transition-colors block py-1" 
                href={`#${i.id}`}
              >
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
