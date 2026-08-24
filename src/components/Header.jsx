// Displays the product name and a short description of the tool.

export default function Header() {
  return (
    <header className="app-header">
      <h1 className="app-header__title">Document Summary Assistant</h1>
      <p className="app-header__subtitle">
        Upload a PDF or image and get a concise summary with key points, powered by Groq.
      </p>
    </header>
  );
}
