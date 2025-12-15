import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		host: true,            // allow network access
		port: 4173,
		allowedHosts: ['waimeng.moe'], // for `vite dev`
	},
	preview: {
		host: true,
		port: 4173,
		allowedHosts: ['waimeng.moe'], // for `vite preview`
	}
});
