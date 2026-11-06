import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./content.js"; // define window.FV_CONTENT
import App from "./App";
import { installProtection } from "./lib/protect";
import { monkeyFaviconSvg } from "./components/PixelArt";

installProtection();

try {
  const link = document.createElement("link");
  link.rel = "icon";
  link.href = "data:image/svg+xml," + encodeURIComponent(monkeyFaviconSvg());
  document.head.appendChild(link);
} catch { /* sin favicon */ }

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
