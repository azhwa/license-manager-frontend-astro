export interface ApiError extends Error { status: number; details?: unknown; }

const baseUrl = (import.meta.env.PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('lm-admin-token') : null;
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${baseUrl}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
      sessionStorage.removeItem('lm-admin-token');
      window.location.href = '/login';
    }
    const error = new Error(payload.error || `Request failed (${response.status})`) as ApiError;
    error.status = response.status;
    error.details = payload.details;
    throw error;
  }
  return payload as T;
}

export function json(method: string, body: unknown): RequestInit {
  return { method, body: JSON.stringify(body) };
}

export function apiError(error: unknown): string {
  return error instanceof Error ? error.message : 'Terjadi kesalahan. Silakan coba lagi.';
}
