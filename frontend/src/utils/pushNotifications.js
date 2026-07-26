/**
 * Push Notification Utility — Para Ben Moussa
 * Handles VAPID-based Web Push subscriptions.
 * Mirrors the same event types used in Phase 3 (order status, prescription,
 * stock alerts, promotions, etc.)
 */

// ─── VAPID public key (replace with your real key from backend) ────────────
// Generate with: npx web-push generate-vapid-keys
// Set VITE_VAPID_PUBLIC_KEY in frontend/.env
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

/** Convert VAPID base64 string → Uint8Array */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

/** True when the browser supports push + service workers */
export function isPushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

/** Ask for notification permission; returns the permission string */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';

  try {
    const result = await Notification.requestPermission();
    return result; // 'granted' | 'denied' | 'default'
  } catch {
    return 'denied';
  }
}

/**
 * Subscribe to push notifications via the SW PushManager.
 * Sends the subscription object to the backend for storage.
 * Returns the PushSubscription or null on failure.
 */
export async function subscribeToPush(axiosInstance) {
  if (!isPushSupported()) return null;
  if (!VAPID_PUBLIC_KEY) {
    console.warn('[PWA] VITE_VAPID_PUBLIC_KEY not set — push subscription skipped.');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const existing = await registration.pushManager.getSubscription();
    if (existing) return existing; // already subscribed

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    // Send to backend
    if (axiosInstance) {
      await axiosInstance.post('/push-subscriptions', { subscription }).catch(() => {});
    }

    return subscription;
  } catch (err) {
    console.error('[PWA] Push subscription failed:', err);
    return null;
  }
}

/**
 * Unsubscribe from push notifications.
 * Also removes the subscription from the backend.
 */
export async function unsubscribeFromPush(axiosInstance) {
  if (!isPushSupported()) return;
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      if (axiosInstance) {
        await axiosInstance.delete('/push-subscriptions', {
          data: { subscription },
        }).catch(() => {});
      }
    }
  } catch (err) {
    console.error('[PWA] Unsubscribe failed:', err);
  }
}

/**
 * Show a local notification (useful for in-app events even without push).
 * @param {string} title
 * @param {object} options — body, icon, badge, tag, data, actions, etc.
 */
export async function showLocalNotification(title, options = {}) {
  if (Notification.permission !== 'granted') return;
  const defaults = {
    icon: '/logo-192.png',
    badge: '/logo-192.png',
    vibrate: [200, 100, 200],
    requireInteraction: false,
    ...options,
  };

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, defaults);
  } catch {
    // Fallback to basic Notification API
    new Notification(title, defaults);
  }
}

/**
 * Predefined notification helpers — mirrors Phase 3 event types.
 */
export const Notify = {
  orderConfirmed: (orderNum) =>
    showLocalNotification('Commande confirmée ✅', {
      body: `Votre commande #${orderNum} a bien été reçue. Merci !`,
      tag: `order-${orderNum}`,
      data: { url: '/mes-commandes' },
    }),

  orderShipped: (orderNum) =>
    showLocalNotification('Commande expédiée 🚚', {
      body: `Votre commande #${orderNum} est en route !`,
      tag: `order-${orderNum}`,
      data: { url: `/suivi-commande/${orderNum}` },
    }),

  prescriptionValidated: () =>
    showLocalNotification('Ordonnance validée ✅', {
      body: 'Votre ordonnance a été validée par le pharmacien. Passez votre commande !',
      tag: 'prescription',
      data: { url: '/mon-compte' },
    }),

  prescriptionRejected: (reason) =>
    showLocalNotification('Ordonnance rejetée ❌', {
      body: reason || 'Votre ordonnance n\'a pas été acceptée. Contactez-nous.',
      tag: 'prescription',
      data: { url: '/mon-compte' },
    }),

  stockAlert: (productName) =>
    showLocalNotification('Produit disponible 🟢', {
      body: `${productName} est de nouveau en stock !`,
      tag: 'stock',
      data: { url: '/products' },
    }),

  promoAlert: (message) =>
    showLocalNotification('Nouvelle promotion 🎁', {
      body: message,
      tag: 'promo',
      data: { url: '/promotions' },
    }),

  loyaltyPoints: (points) =>
    showLocalNotification(`+${points} points fidélité 🌟`, {
      body: 'Des points viennent d\'être crédités sur votre compte fidélité.',
      tag: 'loyalty',
      data: { url: '/mon-compte/fidelite' },
    }),
};
