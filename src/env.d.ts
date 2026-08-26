/// <reference types="astro/client" />

interface Window {
  turnstile?: {
    render: (element: HTMLElement, options: { sitekey: string; callback?: (token: string) => void }) => void;
    reset: (element: HTMLElement) => void;
  };
}
