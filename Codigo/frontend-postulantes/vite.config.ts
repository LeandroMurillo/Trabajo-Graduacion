import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		// host: 'trabajo.com', // Cambia esto por el dominio que desees
		port: 80,
		strictPort: true,
		// Docker
		host: '0.0.0.0',
		allowedHosts: ['trabajo.com'],
		// Deploy
		// host: '0.0.0.0',
		// allowedHosts: ['.up.railway.app'],
	},
});
