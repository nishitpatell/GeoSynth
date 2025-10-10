import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import Layout from "./components/Layout";
import GlobePage from "./pages/GlobePage";
import CountryDetailsPage from "./pages/CountryDetailsPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<GlobePage />} />
            <Route
              path="/country/:countryName"
              element={<CountryDetailsPage />}
            />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
