// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
//
// export default defineConfig({
//   plugins: [react()],
//
//   resolve: {
//     dedupe: ["three", "react", "react-dom"],
//   },
//
//   build: {
//     target: "esnext",
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  resolve: {
    dedupe: ["three", "react", "react-dom"],
  },

  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    }
  },

  build: {
    target: "esnext",
  },
});
