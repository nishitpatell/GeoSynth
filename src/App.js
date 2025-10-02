import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GlobePage from "./pages/GlobePage";
import CountryDetailsPage from "./pages/CountryDetailsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GlobePage />} />
        <Route path="/country/:countryName" element={<CountryDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
