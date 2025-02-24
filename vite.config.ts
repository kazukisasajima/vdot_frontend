import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],  // tailwindcss()を追加
  server: {
    port: 3000,
    host: true,  // 外部アクセスを許可
    watch: {
      usePolling: true,  // ポーリングを有効化して変更を検出
    },
  },
})