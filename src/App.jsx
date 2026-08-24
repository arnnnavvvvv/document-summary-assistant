// Root component that composes the document summary workflow.
import Header from "./components/Header.jsx";
import UploadPanel from "./components/UploadPanel.jsx";
import SelectedFile from "./components/SelectedFile.jsx";
import LengthSelector from "./components/LengthSelector.jsx";
import LoadingState from "./components/LoadingState.jsx";
import ResultsPanel from "./components/ResultsPanel.jsx";
import ErrorState from "./components/ErrorState.jsx";
import { useDocumentSummary } from "./hooks/useDocumentSummary.js";

export default function App() {
  const {
    file,
    length,
    status,
    result,
    errorMessage,
    setLength,
    selectFile,
    clearFile,
    reportValidationError,
    submit,
  } = useDocumentSummary();

  return (
    <div className="app">
      <Header />

      <div className="card">
        <div className="section-label">Document</div>
        {file ? (
          <SelectedFile file={file} onRemove={clearFile} />
        ) : (
          <UploadPanel onFileSelected={selectFile} onValidationError={reportValidationError} />
        )}
      </div>

      <div className="card">
        <LengthSelector value={length} onChange={setLength} />
      </div>

      <div className="card">
        <button
          type="button"
          className="primary-button"
          onClick={submit}
          disabled={!file || status === "loading"}
        >
          {status === "loading" ? "Processing..." : "Generate Summary"}
        </button>
      </div>

      {status === "loading" && (
        <div className="card">
          <LoadingState />
        </div>
      )}

      {status === "error" && (
        <div className="card">
          <ErrorState message={errorMessage} onRetry={submit} />
        </div>
      )}

      {status === "success" && result && (
        <div className="card">
          <ResultsPanel result={result} />
        </div>
      )}

      {status === "idle" && !file && (
        <div className="card">
          <p className="empty-state">Upload a document to get started.</p>
        </div>
      )}
    </div>
  );
}
