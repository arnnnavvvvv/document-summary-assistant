// Lets the user choose the desired summary length.
import { SUMMARY_LENGTHS } from "../constants.js";

export default function LengthSelector({ value, onChange }) {
  return (
    <div>
      <div className="section-label">Summary length</div>
      <div className="length-options">
        {SUMMARY_LENGTHS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`length-option${value === option.value ? " length-option--selected" : ""}`}
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
