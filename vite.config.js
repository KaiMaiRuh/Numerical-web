import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Numerical-web/',   // 👈 เพิ่มบรรทัดนี้
})
