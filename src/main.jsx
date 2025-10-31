import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { validateEnv } from "./config/env.js";

validateEnv();

createRoot(document.getElementById("root")).render(<App />);
