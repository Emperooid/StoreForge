"use client";

export default function ErrorState({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="app-state">
      <p className="app-state__eyebrow">Something went wrong</p>
      <h1>We couldn’t load this page.</h1>
      <p>Try again, or return to your StoreForge dashboard.</p>
      <div className="app-state__actions">
        <button type="button" className="app-button app-button--primary" onClick={reset}>Try again</button>
        <a className="app-button app-button--secondary" href="/stores">Go to dashboard</a>
      </div>
    </main>
  );
}
