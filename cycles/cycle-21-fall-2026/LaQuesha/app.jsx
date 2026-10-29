
import { useState } from "react";
import "./index.css";

const buttons = [
  ["C", "⌫", "÷", "×"],
  ["7", "8", "9", "−"],
  ["4", "5", "6", "+"],
  ["1", "2", "3", "="],
  ["0", ".", "", ""],
];

export default function App() {
  const [display, setDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [startNewNumber, setStartNewNumber] = useState(false);

  function calculate(a, b, op) {
    if (op === "+") return a + b;
    if (op === "−") return a - b;
    if (op === "×") return a * b;
    if (op === "÷") return b === 0 ? "Error" : a / b;
    return b;
  }

  function handleClick(value) {
    if (value === "C") {
      setDisplay("0");
      setStoredValue(null);
      setOperator(null);
      setStartNewNumber(false);
      return;
    }

    if (value === "⌫") {
      if (startNewNumber || display === "Error") {
        setDisplay("0");
        setStartNewNumber(false);
      } else {
        setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
      }
      return;
    }

    if (["+", "−", "×", "÷"].includes(value)) {
      if (display === "Error") return;
      const current = Number(display);

      if (operator && storedValue !== null && !startNewNumber) {
        const result = calculate(storedValue, current, operator);
        if (!Number.isFinite(result)) {
          setDisplay("Error");
          setStoredValue(null);
          setOperator(null);
          return;
        }
        setDisplay(String(Number(result.toPrecision(10))));
        setStoredValue(result);
      } else {
        setStoredValue(current);
      }

      setOperator(value);
      setStartNewNumber(true);
      return;
    }

    if (value === "=") {
      if (operator && storedValue !== null && display !== "Error") {
        const result = calculate(storedValue, Number(display), operator);
        setDisplay(
          Number.isFinite(result)
            ? String(Number(result.toPrecision(10)))
            : "Error"
        );
        setStoredValue(null);
        setOperator(null);
        setStartNewNumber(true);
      }
      return;
    }

    if (display === "Error") setDisplay("0");

    if (value === "." && !startNewNumber && display.includes(".")) return;

    if (startNewNumber) {
      setDisplay(value === "." ? "0." : value);
      setStartNewNumber(false);
    } else {
      setDisplay(
        value === "."
          ? display === "Error" ? "0." : display + "."
          : display === "0" || display === "Error"
            ? value
            : display + value
      );
    }
  }

  return (
    <main className="page">
      <header className="heading">
        <p className="eyebrow">MY FIRST REACT PROJECT</p>
        <h1>Purple Calculator</h1>
        <p>A little math, a lot of purple.</p>
      </header>

      <section className="calculator" aria-label="Calculator">
        <div className="display" aria-live="polite">
          {display}
        </div>

        <div className="button-grid">
          {buttons.flat().filter(Boolean).map((value) => (
            <button
              key={value}
              type="button"
              className={[
                "calc-button",
                ["+", "−", "×", "÷"].includes(value) ? "operator" : "",
                value === "C" || value === "⌫" ? "utility" : "",
                value === "=" ? "equals" : "",
                value === "0" ? "zero" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => handleClick(value)}
              aria-label={value === "⌫" ? "Delete last digit" : value}
            >
              {value}
            </button>
          ))}
        </div>
        <p className="calculator-footer">BUILT WITH REACT 💜</p>
      </section>

      <footer className="page-footer">
        Designed & built one line at a time.
      </footer>
    </main>
  );
}
