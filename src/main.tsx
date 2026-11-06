import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./content.js"; // define window.FV_CONTENT
import App from "./App";
import { installProtection } from "./lib/protect";

installProtection();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
