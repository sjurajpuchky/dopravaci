"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { Check, Loader2, MapPin } from "lucide-react";

const MIN_QUERY_LENGTH = 3;

export default function AddressAutocomplete({ value, selected, onInput, onSelect, placeholder }) {
  const listId = useId();
  const requestSequence = useRef(0);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const query = value.trim();
    if (selected || query.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setActiveIndex(-1);
      setStatus("idle");
      setMessage("");
      return undefined;
    }

    const sequence = ++requestSequence.current;
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setStatus("loading");
      setMessage("");
      setOpen(true);
      try {
        const response = await fetch(`/api/address-suggestions?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.error || "Vyhledání adresy selhalo");
        if (sequence !== requestSequence.current) return;

        setSuggestions(Array.isArray(payload?.items) ? payload.items : []);
        setActiveIndex(-1);
        setStatus("ready");
        setMessage("");
      } catch (error) {
        if (error.name === "AbortError" || sequence !== requestSequence.current) return;
        setSuggestions([]);
        setActiveIndex(-1);
        setStatus("error");
        setMessage(error.message || "Adresy se teď nepodařilo načíst. Zkuste to znovu.");
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [selected, value]);

  const choose = (suggestion) => {
    onSelect(suggestion);
    setSuggestions([]);
    setActiveIndex(-1);
    setOpen(false);
    setStatus("idle");
    setMessage("");
  };

  const onKeyDown = (event) => {
    if (!open || suggestions.length === 0) {
      if (event.key === "ArrowDown" && suggestions.length > 0) setOpen(true);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      choose(suggestions[activeIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const queryLength = value.trim().length;
  const showPanel = open && !selected;

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <div className="relative">
        <input
          className="warm-input pr-10"
          value={value}
          onChange={(event) => {
            onInput(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showPanel}
          aria-controls={`${listId}-panel`}
          aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin text-terracotta" aria-label="Vyhledávám adresu" />
          ) : selected ? (
            <Check className="h-5 w-5 text-green-700" aria-label="Adresa byla ověřena" />
          ) : null}
        </span>
      </div>

      {showPanel && (
        <div id={`${listId}-panel`} className="absolute z-30 mt-2 w-full overflow-hidden rounded-[15px] border border-[rgba(107,79,58,0.18)] bg-white shadow-xl">
          {queryLength < MIN_QUERY_LENGTH ? (
            <p className="px-4 py-3 text-sm text-brown-soft">Začněte psát ulici, číslo domu a město.</p>
          ) : status === "loading" ? (
            <p className="flex items-center gap-2 px-4 py-3 text-sm text-brown-soft">
              <Loader2 className="h-4 w-4 animate-spin text-terracotta" aria-hidden="true" />
              Vyhledávám adresu…
            </p>
          ) : status === "error" ? (
            <p className="px-4 py-3 text-sm text-red-700">{message}</p>
          ) : status === "ready" && suggestions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-brown-soft">Adresa nebyla nalezena. Zkontrolujte ulici a číslo domu.</p>
          ) : (
            <ul id={listId} role="listbox" className="max-h-72 overflow-y-auto py-1">
              {suggestions.map((suggestion, index) => (
                <li key={suggestion.id} id={`${listId}-${index}`} role="option" aria-selected={activeIndex === index}>
                  <button
                    type="button"
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                      activeIndex === index ? "bg-sand-light" : "hover:bg-sand-light"
                    }`}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => choose(suggestion)}
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-brown">{suggestion.title}</span>
                      {suggestion.detail && (
                        <span className="block truncate text-xs text-brown-soft">{suggestion.detail}</span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-[rgba(107,79,58,0.1)] px-3 py-1.5 text-right text-[10px] text-brown-soft">
            Našeptává Mapy.com
          </div>
        </div>
      )}

      {!selected && value.trim().length > 0 && (
        <p className="mt-1.5 text-xs text-brown-soft">Vyberte přesnou adresu z nabídky.</p>
      )}
    </div>
  );
}
