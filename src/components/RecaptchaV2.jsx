"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

const SITE_KEY = (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "").trim();

const RecaptchaV2 = forwardRef(function RecaptchaV2({ onChange }, ref) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const [error, setError] = useState("");

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useImperativeHandle(ref, () => ({
    reset() {
      if (widgetIdRef.current !== null && window.grecaptcha?.reset) {
        window.grecaptcha.reset(widgetIdRef.current);
      }
      onChangeRef.current?.("");
    },
  }), []);

  useEffect(() => {
    if (!SITE_KEY) {
      setError("Google reCAPTCHA není správně nakonfigurovaná.");
      return undefined;
    }

    let disposed = false;
    let attempts = 0;
    const renderWidget = () => {
      if (disposed || widgetIdRef.current !== null || !containerRef.current) return;
      if (!window.grecaptcha?.render) {
        attempts += 1;
        if (attempts >= 50) {
          setError("Google reCAPTCHA se nepodařila načíst. Obnovte stránku a zkuste to znovu.");
        }
        return;
      }

      try {
        widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
          sitekey: SITE_KEY,
          size: window.matchMedia("(max-width: 360px)").matches ? "compact" : "normal",
          callback: (token) => {
            setError("");
            onChangeRef.current?.(token);
          },
          "expired-callback": () => {
            onChangeRef.current?.("");
            setError("Ověření Google reCAPTCHA vypršelo. Potvrďte jej prosím znovu.");
          },
          "error-callback": () => {
            onChangeRef.current?.("");
            setError("Google reCAPTCHA je dočasně nedostupná. Zkuste to prosím znovu.");
          },
        });
      } catch {
        setError("Google reCAPTCHA se nepodařila načíst. Obnovte stránku a zkuste to znovu.");
      }
    };

    renderWidget();
    const interval = window.setInterval(() => {
      renderWidget();
      if (widgetIdRef.current !== null || attempts >= 50) window.clearInterval(interval);
    }, 200);

    return () => {
      disposed = true;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div className="mt-4">
      <div ref={containerRef} />
      {error ? <div role="alert" className="mt-2 text-sm text-red-700">{error}</div> : null}
    </div>
  );
});

export default RecaptchaV2;
