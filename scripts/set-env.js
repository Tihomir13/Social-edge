const fs = require('fs');
const path = require('path');

const FALLBACK_API = 'https://social-edge-server.onrender.com';
const FALLBACK_FE_API = 'https://social-edge.netlify.app';

const api = process.env.API_URL;
const feApi = process.env.FE_API_URL;

if (!api && !feApi) {
  process.exit(0);
}

const target = path.join(__dirname, '..', 'src', 'environments', 'environment.production.ts');

const content = `export const environment = {
  production: true,
  api: '${api || FALLBACK_API}',
  feApi: '${feApi || FALLBACK_FE_API}',
};
`;

fs.writeFileSync(target, content);
console.log(`[set-env] wrote ${target} (api=${api || FALLBACK_API}, feApi=${feApi || FALLBACK_FE_API})`);
