const RECAPTCHA_SITE_KEY = (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "").trim();
const LOAD_TIMEOUT_MS = 10_000;

function waitForRecaptcha() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Ověření CAPTCHA lze spustit pouze v prohlížeči."));
  }
  if (window.grecaptcha?.execute) return Promise.resolve(window.grecaptcha);

  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      if (window.grecaptcha?.execute) {
        window.clearInterval(interval);
        resolve(window.grecaptcha);
      } else if (Date.now() - startedAt >= LOAD_TIMEOUT_MS) {
        window.clearInterval(interval);
        reject(new Error("Ověření proti spamu se nepodařilo načíst. Zkuste to prosím znovu."));
      }
    }, 100);
  });
}

export async function executeRecaptcha(action) {
  if (!RECAPTCHA_SITE_KEY) {
    throw new Error("Odeslání formuláře není momentálně dostupné.");
  }

  const recaptcha = await waitForRecaptcha();
  return new Promise((resolve, reject) => {
    recaptcha.ready(async () => {
      try {
        const token = await recaptcha.execute(RECAPTCHA_SITE_KEY, { action });
        if (!token) throw new Error("Google reCAPTCHA nevrátila ověřovací token.");
        resolve(token);
      } catch {
        reject(new Error("Ověření proti spamu se nezdařilo. Zkuste to prosím znovu."));
      }
    });
  });
}
