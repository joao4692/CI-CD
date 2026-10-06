import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';
import { createServer } from 'node:http';

import { createApp } from '../src/functions/app.js';

const app = createApp();
let server;
let baseUrl;

before(async () => {
    server = createServer(app);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
    await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
    });
});

describe('aplicação Node.js', () => {
    test('responde o endpoint de saúde', async () => {
        const response = await fetch(`${baseUrl}/health`);
        const body = await response.json();

        assert.equal(response.status, 200);
        assert.deepEqual(body, {
            status: 'ok',
            service: 'github-actions-ci-cd-example'
        });
    });

    test('retorna mensagem para rotas desconhecidas', async () => {
        const response = await fetch(`${baseUrl}/rota-inexistente`);
        const body = await response.text();

        assert.equal(response.status, 404);
        assert.equal(body, 'Rota não encontrada');
    });
});
