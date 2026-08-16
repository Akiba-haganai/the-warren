// src/lib/pushNotifications.ts
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const LISTEN_COUNT_KEY = "weave-episodes-listened-count";
const PROMPT_DISMISSED_KEY = "weave-push-prompt-dismissed";

export function incrementListenCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const current = parseInt(localStorage.getItem(LISTEN_COUNT_KEY) || "0", 10);
    const next = current + 1;
    localStorage.setItem(LISTEN_COUNT_KEY, next.toString());
    return next;
  } catch {
    return 0;
  }
}

export function shouldShowPushPrompt(): boolean {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission !== "default") return false;

  try {
    if (localStorage.getItem(PROMPT_DISMISSED_KEY)) return false;
    const count = parseInt(localStorage.getItem(LISTEN_COUNT_KEY) || "0", 10);
    return count >= 2;
  } catch {
    return false;
  }
}

export async function subscribeToEpisodePushNotifications(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
    toast.error("Push notifications are not supported in this browser");
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      toast("Push notifications permission was not granted");
      return false;
    }

    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();

    if (!sub) {
      const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || "BH1234567890abcdefghijklmnopqrstuvwxyz";
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicVapidKey,
      });
    }

    // Store subscription in Supabase
    if (!supabase) return true;
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user?.id || null;

    await supabase.from("push_subscriptions").upsert({
      user_id: userId,
      subscription_json: JSON.stringify(sub),
      created_at: new Date().toISOString(),
    });

    toast.success("Subscribed to new podcast episode alerts!");
    return true;
  } catch (err) {
    toast.error("Could not register push notifications");
    return false;
  }
}

export function dismissPushPrompt() {
  try {
    localStorage.setItem(PROMPT_DISMISSED_KEY, "true");
  } catch {}
}
