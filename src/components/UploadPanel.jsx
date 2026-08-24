// Lets the user select a document via drag-and-drop or a file picker.
import { useRef, useState } from "react";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_BYTES } from "../constants.js";

const ACCEPT_ATTRIBUTE = ".pdf,.png,.jpg,.jpeg,.webp";

// Checks a locally selected file against type and size constraints.
function getClientValidationError(file) {
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return "Unsupported file type. Please upload a PDF, PNG, JPG, or WEBP file.";
  }
  if (file.size === 0) {
    return "The selected file is empty.";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "The file is too large. Maximum size is 15MB.";
  }
  return null;
}

export default function UploadPanel({ onFileSelected, onValidationError }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef(null);

  function handleFiles(fileList) {
    const file = fileList?.[0];
    if (!file) return;

    const error = getClientValidationError(file);
    if (error) {
      onValidationError(error);
      return;
    }

    onFileSelected(file);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragActive(false);
    handleFiles(event.dataTransfer.files);
  }

  return (
    <div
      className={`dropzone${isDragActive ? " dropzone--active" : ""}`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragActive(true);
      }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          inputRef.current?.click();
        }
      }}
    >
      <p className="dropzone__title">Drag and drop a file here, or click to browse</p>
      <p className="dropzone__hint">PDF, PNG, JPG, or WEBP · up to 15MB</p>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTRIBUTE}
        onChange={(event) => handleFiles(event.target.files)}
      />
    </div>
  );
}
