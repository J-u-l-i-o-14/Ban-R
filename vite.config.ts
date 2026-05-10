import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['spotted-spirited-proofs.ngrok-free.dev', '.ngrok-free.dev', '.loca.lt'],
  },
})
