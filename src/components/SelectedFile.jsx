// Shows the currently selected file's name, type, and size with a remove action.

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function SelectedFile({ file, onRemove }) {
  return (
    <div className="selected-file">
      <div className="selected-file__details">
        <div className="selected-file__name">{file.name}</div>
        <div className="selected-file__meta">
          {file.type || "unknown type"} · {formatFileSize(file.size)}
        </div>
      </div>
      <button
        type="button"
        className="selected-file__remove"
        onClick={onRemove}
        aria-label="Remove selected file"
      >
        ×
      </button>
    </div>
  );
}
