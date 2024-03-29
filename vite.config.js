import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  rollupInputOptions: {
    manualChunks(id) {
      if (id.includes('reservaciones')) {
        return 'reservaciones';
    }
  }
}
})