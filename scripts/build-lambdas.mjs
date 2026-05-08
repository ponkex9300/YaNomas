import { build } from 'esbuild';
import { mkdirSync, readdirSync } from 'fs';
import { resolve, join, basename } from 'path';

mkdirSync('dist-lambda', { recursive: true });

const lambdaDir = resolve('aws-lambda');
const shared = new Set(['aws-clients.ts', 'shared-utils.ts', 'aws-sdk.d.ts']);

const entries = readdirSync(lambdaDir)
  .filter(f => f.endsWith('.ts') && !f.endsWith('.d.ts') && !shared.has(f));

for (const file of entries) {
  const name = basename(file, '.ts');
  await build({
    entryPoints: [join(lambdaDir, file)],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'cjs',
    outfile: `dist-lambda/${name}.js`,
    minify: false,
  });
  console.log(`✓ ${name}.js`);
}

console.log('\nBuild completo. Archivos en dist-lambda/');
