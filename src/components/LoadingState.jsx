// Shows progress messaging while the document is being processed.

export default function LoadingState() {
  return (
    <div className="loading-state">
      <div className="loading-state__spinner" />
      <p className="loading-state__message">Extracting text and generating your summary...</p>
    </div>
  );
}
