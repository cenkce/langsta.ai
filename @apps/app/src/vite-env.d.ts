/// <reference types="vite/client" />
/// <reference types="vitest" />

declare const __DEV__: boolean;
interface ReadableStream<R = any> {
  [Symbol.asyncIterator](): AsyncIterableIterator<R>;
}