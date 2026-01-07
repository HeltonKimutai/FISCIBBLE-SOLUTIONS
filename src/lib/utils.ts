import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Open WhatsApp with a message. Prefer the native app deep link on mobile
 * (`whatsapp://send?...`) and fall back to the web API link if not available.
 */
export function openWhatsApp(phone: string, message: string) {
  const encoded = encodeURIComponent(message);
  const appUrl = `whatsapp://send?phone=${phone}&text=${encoded}`;
  const webUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`;

  // Try to open the native app on mobile by using location.href first.
  // If that fails (desktop or app not installed) the web url will open in a new tab.
  const isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);

  if (isMobile) {
    // On mobile, attempt deep link then fallback to web after a short delay.
    window.location.href = appUrl;
    // After a delay, open the web fallback in a new tab to ensure a usable link.
    setTimeout(() => {
      window.open(webUrl, "_blank");
    }, 1200);
    return;
  }

  // Desktop: open web url in new tab
  window.open(webUrl, "_blank");
}
