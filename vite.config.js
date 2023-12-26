//import glsl from 'vite-plugin-glsl'
import react from '@vitejs/plugin-react'

export default {
    //root: './index.html',
    server: {
        proxy: {
          // Proxying requests from /api to localhost:3000
          '/frameData': {
            target: 'http://localhost:3000',
            changeOrigin: false,
            secure: false,
          },
        },
      },
    publicDir: './public/',
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
        {
            name: 'load+transform-js-files-as-jsx',
            async transform(code, id)
            {
                if (!id.match(/src\/.*\.js$/))
                    return null

                return transformWithEsbuild(code, id, {
                    loader: 'jsx',
                    jsx: 'automatic',
                });
            },
        },
        //glsl()
    ]
}