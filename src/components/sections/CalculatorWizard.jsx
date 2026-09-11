import React, { useState } from "react";
import {
  Utensils, Box, Music, Archive, Tv, MapPin, Building2, MoveVertical,
  Trash2, Wrench, Plus, Minus, ArrowLeft, ArrowRight, Check, Loader2, Send,
  Calendar, User, Phone, Mail, Home, Briefcase, Warehouse,
  WashingMachine, Refrigerator, Microwave, Coffee, Laptop, Flame,
  Bed, DoorClosed, DoorOpen, Table, Book, Sofa, Armchair, Monitor, RockingChair,
  Crown, Frame, Lamp, Layers, Bike, Flower,
} from "lucide-react";
import { api } from "@/api/client";
import { executeRecaptcha } from "@/lib/recaptcha";

const ELEVATORS = [
  { value: "none", label: "Není" },
  { value: "3", label: "3 osoby" },
  { value: "6", label: "6 osob" },
  { value: "9", label: "9 osob" },
  { value: "12", label: "12 osob" },
];

const PROPERTY_TYPES = [
  { id: "byt", label: "Byt", icon: Building2 },
  { id: "dum", label: "Rodinný dům", icon: Home },
  { id: "kancelar", label: "Kancelář", icon: Briefcase },
  { id: "garaz", label: "Garáž / sklad", icon: Warehouse },
  { id: "jine", label: "Jiné", icon: Box },
];

const ITEMS = [
  // Nábytek
  { id: "postel", label: "Postel / matrace", icon: Bed },
  { id: "satniskrin", label: "Šatní skříň", icon: DoorClosed },
  { id: "vestavana", label: "Vestavěná skříň", icon: DoorOpen },
  { id: "komodavelka", label: "Komoda velká", icon: Box },
  { id: "komodamala", label: "Komoda malá", icon: Box },
  { id: "konferencnistolek", label: "Konferenční stolek", icon: Table },
  { id: "jidelnistul", label: "Jídelní stůl", icon: Table },
  { id: "zidle", label: "Židle", icon: RockingChair },
  { id: "knihovna", label: "Knihovna / regál", icon: Book },
  { id: "sedacisouprava", label: "Sedací souprava / gauč", icon: Sofa },
  { id: "kreslo", label: "Křeslo", icon: Armchair },
  { id: "pracovnistul", label: "Pracovní stůl / PS", icon: Monitor },
  { id: "historicky", label: "Historický / antikvarní nábytek", icon: Crown },
  { id: "zrcadlo", label: "Zrcadlo / obrazy", icon: Frame },
  { id: "lamp", label: "Lampa / osvětlení", icon: Lamp },
  { id: "policky", label: "Poličky / skříňky", icon: Layers },
  // Elektrospotřebiče
  { id: "pracka", label: "Pračka", icon: WashingMachine },
  { id: "mycka", label: "Myčka nádobí", icon: Utensils },
  { id: "lednice", label: "Lednice / mrazák", icon: Refrigerator },
  { id: "sporak", label: "Sporák / trouba", icon: Flame },
  { id: "mikrovlnka", label: "Mikrovlnka", icon: Microwave },
  { id: "konvice", label: "Rychlovarná konvice", icon: Coffee },
  { id: "tv", label: "TV / elektronika", icon: Tv },
  { id: "pc", label: "PC / notebook", icon: Laptop },
  { id: "piano", label: "Piano / pianino", heavy: true, icon: Music },
  { id: "trezor", label: "Trezor / bojler", heavy: true, icon: Archive },
  // Ostatní vybavení
  { id: "bicykl", label: "Bicykl / sportovní vybavení", icon: Bike },
  { id: "rostliny", label: "Pokojové rostliny", icon: Flower },
];

const STEPS = [
  { label: "Co se stěhuje" },
  { label: "Vybavení domácnosti" },
  { label: "Trasa & služby" },
  { label: "Vyžádej si kalkulaci" },
];

function QtyStepper({ count, onAdd, onRemove }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onRemove}
        disabled={count === 0}
        className="w-7 h-7 rounded-[10px] bg-sand-light text-terracotta flex items-center justify-center transition-all hover:bg-[#E7B781] hover:-translate-y-px disabled:opacity-30 disabled:hover:translate-y-0 disabled:hover:bg-sand-light"
        aria-label="Odebrat"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="font-mono font-bold text-brown w-6 text-center tabular-nums">{count}</span>
      <button
        type="button"
        onClick={onAdd}
        className="w-7 h-7 rounded-[10px] bg-sand-light text-terracotta flex items-center justify-center transition-all hover:bg-[#E7B781] hover:-translate-y-px"
        aria-label="Přidat"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brown-soft mb-2">
        {Icon && <Icon className="w-4 h-4 text-terracotta" aria-hidden="true" />}
        {label}
      </label>
      {children}
    </div>
  );
}

export default function CalculatorWizard() {
  const [step, setStep] = useState(0);
  const [propertyType, setPropertyType] = useState("");
  const [items, setItems] = useState({});
  const [otherText, setOtherText] = useState("");
  const [from, setFrom] = useState({ address: "", floor: 0, elevator: "none" });
  const [to, setTo] = useState({ address: "", floor: 0, elevator: "none" });
  const [distance] = useState(15);
  const [services, setServices] = useState({ assembly: false, clearance: false, extraHours: 0 });
  const [contact, setContact] = useState({ name: "", phone: "", email: "", date: "", note: "", consent: false });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const setItem = (id, delta) =>
    setItems((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }));

  const itemCount = Object.values(items).reduce((a, b) => a + b, 0);
  const heavyCount = Object.entries(items).reduce((acc, [id, n]) => {
    const it = ITEMS.find((x) => x.id === id);
    return acc + (it?.heavy ? n : 0);
  }, 0);

  const canNext =
    step === 0
      ? Boolean(propertyType)
      : step === 1
      ? itemCount > 0 || otherText.trim().length > 0
      : step === 2
      ? Boolean(from.address && to.address)
      : true;

  const submit = async () => {
    setError("");
    if (!contact.name || !contact.phone || !contact.consent) {
      setError("Vyplňte jméno, telefon a odsouhlaste podmínky.");
      return;
    }
    setSubmitting(true);
    try {
      const propLabel = PROPERTY_TYPES.find((p) => p.id === propertyType)?.label || "";
      const itemsSummary = Object.entries(items)
        .map(([id, n]) => `${ITEMS.find((x) => x.id === id)?.label} ×${n}`)
        .join(", ");
      const cargo = [propLabel, itemsSummary, otherText.trim() && `ostatní: ${otherText.trim()}`].filter(Boolean).join(" · ");
      const note = [
        services.assembly ? "montáž/demontáž" : "",
        services.clearance ? "vyklizení" : "",
        services.extraHours ? `extra ${services.extraHours} h` : "",
        contact.note,
      ].filter(Boolean).join(" · ");

      const captchaToken = await executeRecaptcha("inquiry_calculator");
      await api.inquiries.create({
        source: "calculator",
        captcha_token: captchaToken,
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        from_city: from.address,
        to_city: to.address,
        distance_km: distance,
        floors: from.floor + to.floor,
        heavy_items: heavyCount,
        cargo,
        note,
      });
      setDone(true);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Odeslání selhalo");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="softcard text-center">
        <div className="w-16 h-16 bg-terracotta inline-flex items-center justify-center mb-5 rounded-2xl">
          <Check className="w-8 h-8 text-white" strokeWidth={3} />
        </div>
        <h3 className="font-display font-extrabold text-brown text-3xl mb-3">Děkujeme! Poptávka odeslána.</h3>
        <p className="text-brown-soft max-w-md mx-auto">
          Cenu spočítáme ručně podle vašich údajů a ozveme se vám s nezávaznou nabídkou.
        </p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-4">
      {/* Stepper */}
      <aside className="softcard flex flex-col gap-2 h-full">
        {STEPS.map((s, i) => {
          const isDone = i < step;
          const active = i === step;
          return (
            <button
              key={s.label}
              type="button"
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-3 px-4 py-3 rounded-[15px] font-bold text-sm transition-colors text-left ${
                active ? "bg-terracotta text-white" : "text-brown-soft hover:bg-sand-light"
              }`}
            >
              <span
                className={`w-7 h-7 flex items-center justify-center font-mono text-xs font-bold rounded-full shrink-0 ${
                  active ? "bg-white/20 text-white" : isDone ? "bg-terracotta/15 text-terracotta" : "bg-sand-light text-brown-soft"
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : i + 1}
              </span>
              {s.label}
            </button>
          );
        })}
        <div className="mt-auto pt-8">
          <div className="font-mono text-[11px] text-brown-soft uppercase tracking-wider mb-2">Jak to funguje</div>
          <p className="text-brown-soft text-sm leading-relaxed">
            Kalkulaci spočítáme ručně podle vašich údajů a ozveme se vám s nezávaznou nabídkou.
          </p>
        </div>
      </aside>

      {/* Step content */}
      <div className="softcard">
        {/* Mobile progress */}
        <div className="flex items-center gap-2 mb-6 lg:hidden">
          {STEPS.map((s, i) => (
            <div key={s.label} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-terracotta" : "bg-sand-light"}`} />
          ))}
        </div>

        {step === 0 && (
          <div>
            <h3 className="font-display font-bold text-brown text-2xl mb-1">Co se stěhuje?</h3>
            <p className="text-brown-soft text-sm mb-6">Vyberte typ nemovitosti, ze které se stěhuje.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PROPERTY_TYPES.map((p) => {
                const selected = propertyType === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPropertyType(p.id)}
                    className={`flex flex-col items-center gap-3 p-5 rounded-[17px] border transition-colors ${
                      selected ? "border-terracotta bg-terracotta/5" : "border-[rgba(107,79,58,0.16)] bg-cream hover:border-terracotta/40"
                    }`}
                  >
                    <p.icon className={`w-8 h-8 ${selected ? "text-terracotta" : "text-brown-soft"}`} strokeWidth={1.75} />
                    <span className={`font-bold text-sm ${selected ? "text-terracotta" : "text-brown"}`}>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 className="font-display font-bold text-brown text-2xl mb-1">Vybavení domácnosti</h3>
            <p className="text-brown-soft text-sm mb-6">Vyberte počet kusů vybavení domácnosti.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {ITEMS.map((it) => {
                const count = items[it.id] || 0;
                return (
                  <div
                    key={it.id}
                    className={`flex items-center justify-between gap-3 p-4 rounded-[17px] border transition-colors ${
                      count > 0 ? "border-terracotta/50 bg-terracotta/5" : "border-[rgba(107,79,58,0.16)] bg-cream"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <it.icon className="w-5 h-5 text-terracotta shrink-0" aria-hidden="true" />
                      <div className="min-w-0">
                        <div className="text-brown text-sm font-medium truncate">{it.label}</div>
                        {it.heavy && (
                          <div className="font-mono text-[10px] text-terracotta uppercase tracking-wider">těžký předmět</div>
                        )}
                      </div>
                    </div>
                    <QtyStepper count={count} onAdd={() => setItem(it.id, 1)} onRemove={() => setItem(it.id, -1)} />
                  </div>
                );
              })}
            </div>

            <div className="mt-5">
              <Field label="Ostatní — napište, co stěhujete" icon={Plus}>
                <input
                  className="warm-input"
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  placeholder="Např. akvárium, socha, kolo…"
                />
              </Field>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="font-display font-bold text-brown text-2xl mb-1">Trasa & služby</h3>
            <p className="text-brown-soft text-sm mb-6">Adresy a doplňkové služby.</p>

            <div className="space-y-6">
              <div className="border border-[rgba(107,79,58,0.15)] rounded-[20px] p-5 bg-cream">
                <div className="font-mono text-xs text-terracotta uppercase tracking-wider mb-4">Nakládka</div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Adresa nakládky" icon={MapPin}>
                    <input className="warm-input" value={from.address} onChange={(e) => setFrom({ ...from, address: e.target.value })} placeholder="Ulice, město" />
                  </Field>
                  <Field label="Patro" icon={Building2}>
                    <select className="warm-input" value={from.floor} onChange={(e) => setFrom({ ...from, floor: Number(e.target.value) })}>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((f) => (
                        <option key={f} value={f}>{f === 0 ? "Přízemí" : `${f}. patro`}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div className="mt-4">
                  <Field label="Výtah" icon={MoveVertical}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {ELEVATORS.map((e) => (
                        <button
                          key={e.value}
                          type="button"
                          onClick={() => setFrom({ ...from, elevator: e.value })}
                          className={`py-2.5 rounded-[12px] font-mono text-[11px] uppercase tracking-wider transition-colors ${
                            from.elevator === e.value ? "bg-terracotta text-white" : "bg-sand-light text-brown-soft hover:bg-[#E7B781] hover:text-brown"
                          }`}
                        >
                          {e.label}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              </div>

              <div className="border border-[rgba(107,79,58,0.15)] rounded-[20px] p-5 bg-cream">
                <div className="font-mono text-xs text-terracotta uppercase tracking-wider mb-4">Vykládka</div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Adresa vykládky" icon={MapPin}>
                    <input className="warm-input" value={to.address} onChange={(e) => setTo({ ...to, address: e.target.value })} placeholder="Ulice, město" />
                  </Field>
                  <Field label="Patro" icon={Building2}>
                    <select className="warm-input" value={to.floor} onChange={(e) => setTo({ ...to, floor: Number(e.target.value) })}>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((f) => (
                        <option key={f} value={f}>{f === 0 ? "Přízemí" : `${f}. patro`}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div className="mt-4">
                  <Field label="Výtah" icon={MoveVertical}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {ELEVATORS.map((e) => (
                        <button
                          key={e.value}
                          type="button"
                          onClick={() => setTo({ ...to, elevator: e.value })}
                          className={`py-2.5 rounded-[12px] font-mono text-[11px] uppercase tracking-wider transition-colors ${
                            to.elevator === e.value ? "bg-terracotta text-white" : "bg-sand-light text-brown-soft hover:bg-[#E7B781] hover:text-brown"
                          }`}
                        >
                          {e.label}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setServices({ ...services, assembly: !services.assembly })}
                  className={`w-full flex items-center justify-between p-4 rounded-[17px] border transition-colors ${
                    services.assembly ? "border-terracotta/50 bg-terracotta/5" : "border-[rgba(107,79,58,0.16)] bg-cream"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Wrench className="w-5 h-5 text-terracotta" />
                    <span className="text-brown text-sm font-medium">Montáž / demontáž nábytku</span>
                  </span>
                  <span className={`w-10 h-5 rounded-full relative transition-colors ${services.assembly ? "bg-terracotta" : "bg-sand-light"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-cream transition-all ${services.assembly ? "left-5" : "left-0.5"}`} />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setServices({ ...services, clearance: !services.clearance })}
                  className={`w-full flex items-center justify-between p-4 rounded-[17px] border transition-colors ${
                    services.clearance ? "border-terracotta/50 bg-terracotta/5" : "border-[rgba(107,79,58,0.16)] bg-cream"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Trash2 className="w-5 h-5 text-terracotta" />
                    <span className="text-brown text-sm font-medium">Vyklizení</span>
                  </span>
                  <span className={`w-10 h-5 rounded-full relative transition-colors ${services.clearance ? "bg-terracotta" : "bg-sand-light"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-cream transition-all ${services.clearance ? "left-5" : "left-0.5"}`} />
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="font-display font-bold text-brown text-2xl mb-1">Vyžádej si kalkulaci</h3>
            <p className="text-brown-soft text-sm mb-6">Vyplňte kontakt a my vám pošleme nezávaznou nabídku.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Jméno a příjmení" icon={User}>
                <input className="warm-input" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Jan Novák" />
              </Field>
              <Field label="Telefon" icon={Phone}>
                <input className="warm-input" type="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="+420 123 456 789" />
              </Field>
              <Field label="E-mail" icon={Mail}>
                <input className="warm-input" type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="jan@email.cz" />
              </Field>
              <Field label="Preferovaný termín" icon={Calendar}>
                <input className="warm-input" type="date" value={contact.date} onChange={(e) => setContact({ ...contact, date: e.target.value })} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Poznámka" icon={Send}>
                  <textarea className="warm-input resize-none" rows={3} value={contact.note} onChange={(e) => setContact({ ...contact, note: e.target.value })} placeholder="Specifické požadavky, termín…" />
                </Field>
              </div>
            </div>
            <label className="flex items-start gap-3 mt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={contact.consent}
                onChange={(e) => setContact({ ...contact, consent: e.target.checked })}
                className="mt-1 w-4 h-4 accent-[#C75B39]"
              />
              <span className="text-brown-soft text-sm">
                Souhlasím se zpracováním osobních údajů a potvrzuji, že jde o nezávaznou poptávku kalkulace.
              </span>
            </label>
            {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 text-red-700 text-sm rounded-[13px]">{error}</div>}
          </div>
        )}

        {/* Nav */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[rgba(107,79,58,0.12)]">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brown-soft hover:text-terracotta disabled:opacity-30 disabled:hover:text-brown-soft transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Předchozí
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => canNext && setStep((s) => s + 1)}
              disabled={!canNext}
              className="btn-warm text-sm uppercase tracking-wider disabled:opacity-40"
            >
              Pokračovat <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="btn-warm text-sm uppercase tracking-wider disabled:opacity-60"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {submitting ? "Odesílám…" : "Vyžádat kalkulaci"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
