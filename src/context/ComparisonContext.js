import React, { createContext, useContext, useState } from "react";

const ComparisonContext = createContext();

export function ComparisonProvider({ children }) {
  const [compareList, setCompareList] = useState([]);

  const addToCompare = (country) => {
    setCompareList((prev) => {
      // Avoid duplicates and limit to 4 countries for UI clarity
      if (prev.find((c) => c.name.common === country.name.common)) return prev;
      if (prev.length >= 4) return prev;
      return [...prev, country];
    });
  };

  const removeFromCompare = (countryName) => {
    setCompareList((prev) => prev.filter((c) => c.name.common !== countryName));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <ComparisonContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error("useComparison must be used within ComparisonProvider");
  }
  return context;
}
