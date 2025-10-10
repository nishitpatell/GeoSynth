import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import Layout from "./components/Layout";
import { ComparisonProvider } from "./context/ComparisonContext";
import GlobePage from "./pages/GlobePage";
import CountryDetailsPage from "./pages/CountryDetailsPage";
import ComparisonPage from "./pages/ComparisonPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ComparisonProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<GlobePage />} />
              <Route
                path="/country/:countryName"
                element={<CountryDetailsPage />}
              />
              <Route path="/compare" element={<ComparisonPage />} />
            </Routes>
          </Layout>
        </Router>
      </ComparisonProvider>
    </ThemeProvider>
  );
}

export default App;
