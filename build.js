const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const isWatch = process.argv.includes('--watch');

const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mastery</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
    <style>
        .timer-display {
            font-family: 'Courier New', monospace;
            font-size: 2rem;
            font-weight: bold;
            text-align: center;
            margin: 1rem 0;
        }
        .goal-card {
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 1rem;
            margin-bottom: 1rem;
        }
        .time-spent {
            color: var(--muted-color);
            font-size: 0.9rem;
        }
        .controls {
            display: flex;
            gap: 0.75rem;
            margin-top: 1rem;
            justify-content: flex-start;
        }
        .controls button {
            background: none;
            border: none;
            padding: 0.5rem;
            font-size: 1.4rem;
            cursor: pointer;
            border-radius: 50%;
            width: 2.5rem;
            height: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            color: var(--muted-color);
        }
        .controls button:hover {
            background-color: var(--muted-border-color);
            color: var(--color);
            transform: scale(1.1);
        }
        .controls button:active {
            transform: scale(0.95);
        }
        .controls button:not(.secondary) {
            color: var(--primary);
        }
        .controls button:not(.secondary):hover {
            background-color: var(--primary);
            color: white;
        }
        .progress-info {
            margin: 1rem 0;
        }
        .progress-bar {
            width: 100%;
            height: 10px;
            background-color: var(--muted-border-color);
            border-radius: 5px;
            overflow: hidden;
            margin: 0.5rem 0;
        }
        .progress-fill {
            height: 100%;
            background-color: var(--primary);
            transition: width 0.3s ease;
        }
        .remaining-time, .estimated-completion {
            color: var(--muted-color);
            font-size: 0.8rem;
            margin: 0.2rem 0;
        }
        .progress-modal {
            max-width: 80vw;
            width: 80vw;
        }
        .progress-modal article {
            max-width: none;
            width: 100%;
        }
        .chart-section {
            min-height: 300px;
            margin-top: 1rem;
            width: 100%;
        }
        .progress-details {
            width: 100%;
        }
        .progress-modal .chart-section > div {
            width: 100% !important;
            min-width: 600px;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    <script>__BUNDLE__</script>
</body>
</html>`;

async function build() {
    try {
        const result = await esbuild.build({
            entryPoints: ['src/index.tsx'],
            bundle: true,
            minify: !isWatch,
            sourcemap: isWatch,
            target: 'es2020',
            format: 'iife',
            write: false,
            jsx: 'automatic',
            loader: {
                '.tsx': 'tsx',
                '.ts': 'ts'
            },
            define: {
                'process.env.NODE_ENV': isWatch ? '"development"' : '"production"',
                'global': 'globalThis'
            },
            external: [],
            mainFields: ['browser', 'module', 'main'],
            conditions: ['import', 'module', 'browser', 'default'],
            resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json']
        });

        const jsCode = result.outputFiles[0].text;
        const finalHtml = htmlTemplate.replace('__BUNDLE__', jsCode);

        // Ensure dist directory exists
        if (!fs.existsSync('dist')) {
            fs.mkdirSync('dist', { recursive: true });
        }

        fs.writeFileSync('dist/index.html', finalHtml);
        console.log('Build completed! Output: dist/index.html');
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

if (isWatch) {
    console.log('Watching for changes...');

    async function startWatch() {
        const context = await esbuild.context({
            entryPoints: ['src/index.tsx'],
            bundle: true,
            sourcemap: true,
            target: 'es2020',
            format: 'iife',
            write: false,
            jsx: 'automatic',
            loader: {
                '.tsx': 'tsx',
                '.ts': 'ts'
            },
            define: {
                'process.env.NODE_ENV': '"development"',
                'global': 'globalThis'
            },
            external: [],
            mainFields: ['browser', 'module', 'main'],
            conditions: ['import', 'module', 'browser', 'default'],
            resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
            plugins: [{
                name: 'rebuild-notify',
                setup(build) {
                    build.onEnd(result => {
                        if (result.errors.length === 0) {
                            const jsCode = result.outputFiles[0].text;
                            const finalHtml = htmlTemplate.replace('__BUNDLE__', jsCode);

                            // Ensure dist directory exists
                            if (!fs.existsSync('dist')) {
                                fs.mkdirSync('dist', { recursive: true });
                            }

                            fs.writeFileSync('dist/index.html', finalHtml);
                            console.log('Rebuilt at', new Date().toLocaleTimeString());
                        } else {
                            console.error('Watch build failed:', result.errors);
                        }
                    });
                }
            }]
        });

        await context.watch();

        // Initial build
        build();

        // Keep process alive
        process.on('SIGINT', () => {
            context.dispose();
            process.exit(0);
        });
    }

    startWatch().catch(error => {
        console.error('Watch setup failed:', error);
        process.exit(1);
    });
} else {
    build();
}