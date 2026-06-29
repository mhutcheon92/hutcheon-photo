// Patches Keystatic internals to fix two GitHub OAuth issues:
// 1. Token schema: handles non-expiring tokens that omit expires_in / refresh_token.
// 2. OAuth scope: injects public_repo so Keystatic can create commits.
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

let changed = false;

// Patch 1: allow non-expiring OAuth tokens (omit expires_in / refresh_token).
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
  console.log('patch-keystatic: patch 1 (token schema) already applied');
} else if (!content.includes(oldSchema)) {
  console.log('patch-keystatic: patch 1 target not found, schema may have changed');
} else {
  content = content.replace(oldSchema, newSchema);
  changed = true;
  console.log('patch-keystatic: patch 1 (token schema) applied');
}

// Patch 2: inject public_repo scope into the GitHub OAuth authorization URL.
// Without this, GitHub issues a token with empty scopes and Keystatic cannot
// create commits (createCommitOnBranch requires public_repo).
const oldLogin = `url.searchParams.set('client_id', config.clientId);
  url.searchParams.set('redirect_uri', \`\${reqUrl.origin}/api/keystatic/github/oauth/callback\`);`;
const newLogin = `url.searchParams.set('client_id', config.clientId);
  url.searchParams.set('scope', 'public_repo');
  url.searchParams.set('redirect_uri', \`\${reqUrl.origin}/api/keystatic/github/oauth/callback\`);`;

if (content.includes(newLogin)) {
  console.log('patch-keystatic: patch 2 (oauth scope) already applied');
} else if (!content.includes(oldLogin)) {
  console.log('patch-keystatic: patch 2 target not found, schema may have changed');
} else {
  content = content.replace(oldLogin, newLogin);
  changed = true;
  console.log('patch-keystatic: patch 2 (oauth scope) applied');
}

if (changed) {
  writeFileSync(filePath, content);
  console.log('patch-keystatic: done');
}
