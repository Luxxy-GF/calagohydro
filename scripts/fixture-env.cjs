// Node-only fixtures need a translation stub; product code uses the real provider.
const path = require('node:path');
const storage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
globalThis.sessionStorage = storage;
globalThis.localStorage = storage;
globalThis.window = { location: { origin: 'http://127.0.0.1:4173' }, addEventListener() {}, dispatchEvent() {} };
const modulePath = path.resolve(process.env.CALAGOPUS_ROOT || path.resolve(__dirname, '../../..'), 'frontend/src/providers/TranslationProvider.tsx');
require.cache[modulePath] = { id: modulePath, filename: modulePath, loaded: true, exports: { getTranslations: () => ({ t: (key) => key }) } };
