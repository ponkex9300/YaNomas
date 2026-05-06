import { build } from 'esbuild';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

const lambdaDir = path.resolve('aws-lambda');
const outputDir = path.resolve('dist-lambda');

const lambdaFiles = (await readdir(lambdaDir))
  .filter((file) => file.endsWith('.ts'))
  .filter((file) => !file.endsWith('.d.ts'))
  .filter((file) => file !== 'aws-clients.ts')
  .filter((file) => file !== 'shared-utils.ts');

await mkdir(outputDir, { recursive: true });

for (const file of lambdaFiles) {
  const entryPoint = path.join(lambdaDir, file);
  const outputFile = path.join(outputDir, file.replace(/\.ts$/, '.js'));

  await build({
    entryPoints: [entryPoint],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'cjs',
    outfile: outputFile,
    sourcemap: false,
    minify: false,
    packages: 'bundle',
  });

  console.log(`Built ${path.basename(outputFile)}`);
}