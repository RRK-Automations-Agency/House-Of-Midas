import '@testing-library/jest-dom';

// Provide a default fetch implementation for tests if not available
if (!(globalThis as any).fetch) {
  // @ts-ignore
  globalThis.fetch = async () => ({ ok: true, json: async () => ({}) });
}
