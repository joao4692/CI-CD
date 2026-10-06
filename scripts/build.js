import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = path.join(rootDirectory, 'dist');

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await mkdir(path.join(outputDirectory, 'scripts'), { recursive: true });

await cp(path.join(rootDirectory, 'src'), path.join(outputDirectory, 'src'), {
  recursive: true,
  force: true
});

await cp(path.join(rootDirectory, 'scripts', 'deploy.js'), path.join(outputDirectory, 'scripts', 'deploy.js'));
await cp(path.join(rootDirectory, 'package.json'), path.join(outputDirectory, 'package.json'));

console.log(`Build criado em ${outputDirectory}`);
