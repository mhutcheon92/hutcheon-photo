// Patches Keystatic's token schema to handle both expiring and non-expiring
// GitHub OAuth tokens. Keystatic requires refresh_token + expires_in but
// GitHub OAuth Apps may return non-expiring tokens without those fields.
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = resolve(__dirname, '../node_modules/@keystatic/core/dist/keystatic-core-api-generic.node.js');

let content;
try {
  content = readFileSync(filePath, 'utf8');
} catch {
  console.log('patch-keystatic: file not found, skipping');
  process.exit(0);
}

const oldSchema = `const tokenDataResultType = s.type({
  access_token: s.string(),
  expires_in: s.number(),
  refresh_token: s.string(),
  refresh_token_expires_in: s.number(),
  scope: s.string(),
  token_type: s.literal('bearer')
});`;

const newSchema = `const tokenDataResultType = {
  create(data) {
    if (!data || typeof data.access_token !== 'string') {
      throw new Error('Missing access_token');
    }
    return {
      access_token: data.access_token,
      expires_in: typeof data.expires_in === 'number' ? data.expires_in : 28800,
      refresh_token: typeof data.refresh_token === 'string' ? data.refresh_token : '',
      refresh_token_expires_in: typeof data.refresh_token_expires_in === 'number' ? data.refresh_token_expires_in : 15897600,
      scope: typeof data.scope === 'string' ? data.scope : '',
      token_type: 'bearer',
    };
  }
};`;

if (content.includes(newSchema)) {
  console.log('patch-keystatic: already applied, skipping');
  process.exit(0);
}

if (!content.includes(oldSchema)) {
  console.log('patch-keystatic: target not found, schema may have changed');
  process.exit(0);
}

writeFileSync(filePath, content.replace(oldSchema, newSchema));
console.log('patch-keystatic: applied successfully');
