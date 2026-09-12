
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
 
const __dirname = path.dirname(fileURLToPath(import.meta.url));
 
// آدرس دیپلوی شما: https://kashancity.github.io/Digiweb/
// پس base باید دقیقاً برابر نام ریپازیتوری با همین حروف بزرگ/کوچک باشد.
export default defineConfig({
  plugins: [react()],
  base: '/Digiweb/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
});
 
