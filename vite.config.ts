import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  assetsInclude: [],
  build: {
    target: 'ESNext',
    sourcemap: true,
  },
  plugins: [react(), tsconfigPaths()],
});
