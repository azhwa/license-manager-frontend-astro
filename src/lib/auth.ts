export function getToken() { return typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('lm-admin-token') : null; }
export function setSession(token: string, username: string) {
  sessionStorage.setItem('lm-admin-token', token);
  sessionStorage.setItem('lm-admin-user', username);
}
export function clearSession() {
  sessionStorage.removeItem('lm-admin-token');
  sessionStorage.removeItem('lm-admin-user');
}
export function requireSession() {
  if (!getToken()) window.location.href = '/login';
}
