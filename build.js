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
            gap: 0.5rem;
            margin-top: 1rem;
        }
        .controls button {
            flex: 1;
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

        fs.writeFileSync('dist/index.html', finalHtml);
        console.log('Build completed! Output: dist/index.html');
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

if (isWatch) {
    console.log('Watching for changes...');
    let timeout;
    esbuild.build({
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
        watch: {
            onRebuild(error, result) {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    if (error) {
                        console.error('Watch build failed:', error);
                    } else {
                        const jsCode = result.outputFiles[0].text;
                        const finalHtml = htmlTemplate.replace('__BUNDLE__', jsCode);
                        fs.writeFileSync('dist/index.html', finalHtml);
                        console.log('Rebuilt at', new Date().toLocaleTimeString());
                    }
                }, 100);
            }
        }
    }).then(() => {
        build();
    });
} else {
    build();
}