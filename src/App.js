import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import GlobePage from "./pages/GlobePage";
import CountryDetailsPage from "./pages/CountryDetailsPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<GlobePage />} />
          <Route
            path="/country/:countryName"
            element={<CountryDetailsPage />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
