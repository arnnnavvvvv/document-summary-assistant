// Shows a processing error with a retry action.

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state">
      <div className="error-state__title">Something went wrong</div>
      <p className="error-state__message">{message}</p>
      <button type="button" className="error-state__retry" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
