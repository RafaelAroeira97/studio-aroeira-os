import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANTE: troque "studio-aroeira-os" abaixo pelo nome exato do seu
// repositório no GitHub, se for publicar no GitHub Pages.
// Exemplo: se seu repositório é github.com/rafael/meu-app, use base: "/meu-app/"
export default defineConfig({
  plugins: [react()],
  base: "/studio-aroeira-os/",
});
