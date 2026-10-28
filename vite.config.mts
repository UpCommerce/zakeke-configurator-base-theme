import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Migrato da Create React App: stessa cartella di output (build/), stessi percorsi pubblici
// e stesse variabili d'ambiente.
export default defineConfig(({ command, mode }) => {
	// variabili REACT_APP_* (file .env e ambiente della pipeline) esposte come process.env, come in CRA
	const env = { ...loadEnv(mode, process.cwd(), 'REACT_APP_'), ...Object.fromEntries(Object.entries(process.env).filter(([k]) => k.startsWith('REACT_APP_'))) };
	// come in CRA: PUBLIC_URL (se impostata dalla pipeline, es. l'indirizzo del CDN) prevale su "homepage" in build;
	// in sviluppo si serve sempre dalla radice
	const publicUrl = command === 'build' ? (process.env.PUBLIC_URL || '.').replace(/\/+$/, '') : '';
	return {
		base: `${publicUrl}/`,
		plugins: [
			react(),
			// segnaposto %PUBLIC_URL% in index.html, come in CRA
			{ name: 'public-url', transformIndexHtml: (html: string) => html.replaceAll('%PUBLIC_URL%', publicUrl) }
		],
		define: {
			'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
			'process.env.PUBLIC_URL': JSON.stringify(publicUrl),
			...Object.fromEntries(Object.entries(env).map(([k, v]) => [`process.env.${k}`, JSON.stringify(v)]))
		},
		build: { outDir: 'build', sourcemap: true },
		server: { port: 3000 }
	};
});
