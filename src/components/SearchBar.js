import React from "react";

// props:
// - value: string (controlled input value)
// - suggestions: array of string names to show
// - onChange: function, handles input changes
// - onKeyDown: function, handles input key events (e.g. Enter)
// - onSuggestionClick: function, called with suggestion string when user clicks a suggestion

function SearchBar({
  value,
  suggestions,
  onChange,
  onKeyDown,
  onSuggestionClick,
  placeholder = "Search...",
}) {
  return (
    <div style={{ width: 250, position: "relative" }}>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
        style={{
          padding: "8px 12px",
          fontSize: 16,
          borderRadius: 4,
          border: "1px solid #ccc",
          width: "100%",
        }}
      />
      {suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: 40,
            left: 0,
            zIndex: 30,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: 4,
            listStyleType: "none",
            padding: 0,
            margin: 0,
            width: "100%",
            maxHeight: 180,
            overflowY: "auto",
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          }}
        >
          {suggestions.map((name, idx) => (
            <li
              key={idx}
              onClick={() => onSuggestionClick(name)}
              style={{
                padding: "8px 12px",
                borderBottom: "1px solid #eee",
              }}
              onMouseDown={(e) => e.preventDefault()}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
