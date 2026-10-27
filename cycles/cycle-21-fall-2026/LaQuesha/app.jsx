
import { useState } from "react";
import "./index.css";

export default function App() {
  const [display, setDisplay] = useState("0");
  const [previous, setPrevious] = useState(null);
  const [operator, setOperator] = useState(null);
  const [fresh, setFresh] = useState(false);

  function click(value) {
    if (value === "C") {
      setDisplay("0");
      setPrevious(null);
      setOperator(null);
      setFresh(false);
      return;
    }

    if (value === "⌫") {
      setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
      return;
    }

    if (["+", "−", "×", "÷"].includes(value)) {
      setPrevious(Number(display));
      setOperator(value);
      setFresh(true);
      return;
    }

    if (value === "=") {
      if (previous === null || !operator) return;

      const a = previous;
      const b = Number(display);
      let result;

      if (operator === "+") result = a + b;
      if (operator === "−") result = a - b;
      if (operator === "×") result = a * b;
      if (operator === "÷") result = b === 0 ? "Error" : a / b;

      setDisplay(
        typeof result === "number" && Number.isFinite(result)
          ? String(Number(result.toPrecision(10)))
          : String(result)
      );
      setPrevious(null);
      setOperator(null);
      setFresh(true);
      return;
    }

    if (value === "." && !fresh && display.includes(".")) return;

    if (fresh) {
      setDisplay(value === "." ? "0." : value);
      setFresh(false);
    } else {
      setDisplay(
        value === "."
          ? display + "."
          : display === "0" || display === "Error"
            ? value
            : display + value
      );
    }
  }

  const rows = [
    ["C", "⌫", "÷", "×"],
    ["7", "8", "9", "−"],
    ["4", "5", "6", "+"],
    ["1", "2", "3", "="],
    ["0", ".", "", ""],
  ];

  return (
    <main className="page">
      <header className="heading">
        <p className="eyebrow">MY FIRST REACT PROJECT</p>
        <h1>Purple Calculator</h1>
        <p>A little math, a lot of purple.</p>
      </header>

      <section className="calculator">
        <div className="display">{display}</div>

        <div className="button-grid">
          {rows.flat().filter(Boolean).map((value) => (
            <button
              key={value}
              className={[
                "calc-button",
                ["+", "−", "×", "÷"].includes(value) ? "operator" : "",
                ["C", "⌫"].includes(value) ? "utility" : "",
                value === "=" ? "equals" : "",
                value === "0" ? "zero" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => click(value)}
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
