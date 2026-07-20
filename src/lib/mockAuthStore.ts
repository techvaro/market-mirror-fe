// Lightweight mock credential store for the prototype.
// Persists email -> password mappings in localStorage so the
// Forgot Password flow has something real to change and validate against.

const STORAGE_KEY = 'market_mirror_credentials';

type CredentialMap = Record<string, string>;

function readStore(): CredentialMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to parse credential store', e);
    return {};
  }
}

function writeStore(store: CredentialMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function hasAccount(email: string): boolean {
  const store = readStore();
  return Object.prototype.hasOwnProperty.call(store, normalizeEmail(email));
}

export function setPassword(email: string, password: string) {
  const store = readStore();
  store[normalizeEmail(email)] = password;
  writeStore(store);
}

export function verifyPassword(email: string, password: string): boolean {
  const store = readStore();
  return store[normalizeEmail(email)] === password;
}
