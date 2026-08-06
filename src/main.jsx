import React from "react";
import ReactDOM from "react-dom/client";
import StudioAroeiraOS, { CatalogoModelos } from "./App.jsx";

const ehCatalogo = new URLSearchParams(window.location.search).get("catalogo") === "1";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {ehCatalogo ? <CatalogoModelos /> : <StudioAroeiraOS />}
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {});
  });
}
