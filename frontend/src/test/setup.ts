import '@testing-library/jest-dom';
import { vi } from 'vitest';

function createStorageMock() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => { store.set(key, String(value)); },
    removeItem: (key: string) => { store.delete(key); },
    clear: () => { store.clear(); },
    get length() { return store.size; },
    key: (index: number) => [...store.keys()][index] ?? null,
  };
}

vi.stubGlobal('localStorage', createStorageMock());
vi.stubGlobal('sessionStorage', createStorageMock());

/**
 * Default `fetch` stub.
 *
 * Several components/services call `fetch` on mount/init (PdfPlayerService,
 * useFaqData, telemetryContextBuilder, etc.). Tests that render them without
 * providing their own fetch mock would otherwise let happy-dom issue REAL network
 * requests (e.g. to http://localhost:5173/). Those requests are still in flight when
 * the test window is torn down, so happy-dom aborts them — and the leaked async tasks
 * bleed into later test files, corrupting their freshly-created DOM. That corruption
 * non-deterministically degrades DOMPurify (sanitizeHtml) into stripping safe tags,
 * which is the root cause of the flaky CI failures in sanitizeHtml.test.ts /
 * FAQSection.test.tsx.
 *
 * This default resolves to a failed (non-ok) response — matching the previous
 * "real request silently fails" behaviour — without touching the network. Tests that
 * need specific responses override `fetch` with their own mock.
 */
function createFetchResponseStub(): Response {
  const stub = {
    ok: false,
    status: 503,
    statusText: 'Service Unavailable (test stub)',
    headers: new Headers(),
    redirected: false,
    type: 'default',
    url: '',
    body: null,
    bodyUsed: false,
    json: async () => ({}),
    text: async () => '',
    blob: async () => new Blob([]),
    arrayBuffer: async () => new ArrayBuffer(0),
    formData: async () => new FormData(),
    clone() { return createFetchResponseStub(); },
  };
  return stub as unknown as Response;
}

vi.stubGlobal('fetch', vi.fn(async () => createFetchResponseStub()));
