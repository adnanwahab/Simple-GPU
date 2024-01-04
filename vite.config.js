//import glsl from 'vite-plugin-glsl'
import react from '@vitejs/plugin-react'

export default {
    server: {
        port: 3000,
        open: true,
    },
    root: './src/',
    publicDir: '../static/',
    base: './',
    build:
    {
        outDir: '../dist', // Output in the dist/ folder
        emptyOutDir: true, // Empty the folder first
        sourcemap: false, // Add sourcemap
        target: 'esnext'
    },
    plugins:
    [
        react(),
    ]
}