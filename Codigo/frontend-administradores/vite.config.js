import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		// host: 'trabajo.com',
		port: 5173,
		strictPort: true,
		// Docker
		host: '0.0.0.0',
		allowedHosts: ['trabajo.com'],
	},
});
