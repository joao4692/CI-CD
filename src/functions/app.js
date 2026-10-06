import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const serviceName = 'github-actions-ci-cd-example';

export function createApp() {
    return (request, response) => {
        const url = new URL(request.url, 'http://localhost');

        if (request.method === 'GET' && url.pathname === '/health') {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({
                status: 'ok',
                service: serviceName
            }));
            return;
        }

        if (request.method === 'GET') {
            response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            response.end('Rota não encontrada');
            return;
        }

        response.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Método não permitido');
    };
}

export async function serveStatic(request, response, publicDirectory) {
    const url = new URL(request.url, 'http://localhost');
    const relativePath = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    const filePath = path.resolve(publicDirectory, relativePath);

    if (!filePath.startsWith(path.resolve(publicDirectory))) {
        response.writeHead(403);
        response.end('Proibido');
        return;
    }

    try {
        const content = await readFile(filePath);
        response.writeHead(200);
        response.end(content);
    } catch {
        response.writeHead(404);
        response.end('Página não encontrada');
    }
}

export function getServiceName() {
    return serviceName;
}

export function getAppFilePath() {
    return fileURLToPath(new URL('.', import.meta.url));
}
