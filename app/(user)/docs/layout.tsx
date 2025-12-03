// This layout is intentionally minimal - the parent layout handles conditional rendering
export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

