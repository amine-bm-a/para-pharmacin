/**
 * Shared helper functions and text formatters
 */

/**
 * Safely escape HTML characters and format **bold text** to <strong>bold text</strong>.
 */
export function formatBold(text) {
  if (!text) return '';
  const escaped = String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  return escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

/**
 * Format relative time string (e.g. "À l'instant", "Il y a 5 min", "Il y a 2h", "Il y a 3 jour(s)").
 */
export function timeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
  return `Il y a ${Math.floor(diff / 86400)} jour(s)`;
}

/**
 * Derived root URL for backend storage/images (stripping trailing /api)
 */
export const BACKEND_BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/api$/, '');
