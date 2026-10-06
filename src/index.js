import { createServer } from 'node:http';
import { createApp } from './functions/app.js';

const port = Number(process.env.PORT) || 3000;
const server = createServer(createApp());

server.listen(port, '0.0.0.0', () => {
    console.log(`Aplicação executando em http://localhost:${port}`);
});

function shutdown(signal) {
    console.log(`Recebido ${signal}. Encerrando servidor.`);
    server.close(() => process.exit(0));
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

console.log('Servidor iniciado. Aguardando requisições...');
