// Manages file selection, summary length, and the document summarization request lifecycle.
import { useState } from "react";

const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

export function useDocumentSummary() {
  const [file, setFile] = useState(null);
  const [length, setLength] = useState("medium");
  const [status, setStatus] = useState(STATUS.IDLE);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Stores the selected file and clears any previous result or error.
  function selectFile(selectedFile) {
    setFile(selectedFile);
    setResult(null);
    setErrorMessage("");
    setStatus(STATUS.IDLE);
  }

  // Clears the selected file and resets the request state.
  function clearFile() {
    setFile(null);
    setResult(null);
    setErrorMessage("");
    setStatus(STATUS.IDLE);
  }

  // Surfaces a client-side validation error without contacting the server.
  function reportValidationError(message) {
    setErrorMessage(message);
    setStatus(STATUS.ERROR);
  }

  // Sends the selected file to the backend and stores the resulting summary or error.
  async function submit() {
    if (!file) return;

    setStatus(STATUS.LOADING);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("length", length);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setResult(data);
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      setErrorMessage(error.message);
      setStatus(STATUS.ERROR);
    }
  }

  return {
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
  };
}
