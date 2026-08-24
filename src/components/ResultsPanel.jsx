// Displays the generated summary, key points, and main ideas.

export default function ResultsPanel({ result }) {
  const { summary, keyPoints, mainIdeas } = result;

  return (
    <div>
      <div className="results-section">
        <h2 className="results-section__title">Summary</h2>
        <p className="results-section__text">{summary}</p>
      </div>

      {keyPoints.length > 0 && (
        <div className="results-section">
          <h2 className="results-section__title">Key Points</h2>
          <ul className="results-list">
            {keyPoints.map((point, index) => (
              <li className="results-list__item" key={index}>
                <span className="results-list__marker">→</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {mainIdeas.length > 0 && (
        <div className="results-section">
          <h2 className="results-section__title">Main Ideas</h2>
          <ul className="results-list">
            {mainIdeas.map((idea, index) => (
              <li className="results-list__item" key={index}>
                <span className="results-list__marker">•</span>
                <span>{idea}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
