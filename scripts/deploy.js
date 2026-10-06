import { spawnSync } from 'node:child_process';

const requiredVariables = [
  'DEPLOY_HOST',
  'DEPLOY_USER',
  'DEPLOY_PATH',
  'DEPLOY_KEY_PATH'
];

const missingVariables = requiredVariables.filter((name) => !process.env[name]);

if (missingVariables.length > 0) {
  console.error(`Variáveis de deploy ausentes: ${missingVariables.join(', ')}`);
  process.exit(1);
}

const sshCommand = `ssh -i "${process.env.DEPLOY_KEY_PATH}" -o StrictHostKeyChecking=no`;
const command = [
  'rsync',
  '-avz',
  '--delete',
  '-e',
  sshCommand,
  './',
  `${process.env.DEPLOY_USER}@${process.env.DEPLOY_HOST}:${process.env.DEPLOY_PATH}`
];

const result = spawnSync(command[0], command.slice(1), {
  stdio: 'inherit',
  env: process.env
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log('Aplicação enviada para o servidor de deploy.');
