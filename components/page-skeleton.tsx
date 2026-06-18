export function PageSkeleton() {
  return (
    <div className="site-shell skeleton-shell">
      <header className="site-header skeleton-row">
        <div className="skeleton skeleton-brand" />
        <div className="skeleton skeleton-nav" />
        <div className="skeleton skeleton-pill" />
      </header>
      <main className="site-main">
        <section className="skeleton-hero">
          <div className="skeleton skeleton-copy" />
          <div className="skeleton skeleton-panel" />
        </section>
        <section className="skeleton-grid">
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
        </section>
      </main>
    </div>
  );
}
