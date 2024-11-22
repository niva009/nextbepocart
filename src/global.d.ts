interface Window {
    fbq: (...args: any[]) => void;
  }

  export {};

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}
