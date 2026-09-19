"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Building2, CalendarDays, Loader2, Mail, MapPin, Package, Phone, Truck, UserRound } from "lucide-react";
import { api } from "@/api/client";

const STATUS = {
  new: "Nová",
  taken: "Přidělená",
  completed: "Dokončená",
};

const sourceLabel = (source) => source === "calculator" ? "Kalkulačka" : source === "contact" ? "Kontaktní formulář" : "Neuvedeno";
const elevatorLabel = (value) => value === "none" ? "Není" : value ? `${value} osob` : "Neuvedeno";
const yesNo = (value) => value ? "Ano" : "Ne";

function Field({ label, children }) {
  if (children === null || children === undefined || children === "") return null;
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-wider text-steel-dim mb-1">{label}</div>
      <div className="text-sm text-brown break-words">{children}</div>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="bg-asphalt border border-white/10 p-5 md:p-6">
      <h2 className="font-display font-bold text-brown text-lg mb-5 flex items-center gap-2">
        <Icon className="w-5 h-5 text-amber" /> {title}
      </h2>
      {children}
    </section>
  );
}

export default function InquiryDetail() {
  const { id } = useParams();
  const [inquiry, setInquiry] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.inquiries.get(id).then(setInquiry).catch((err) => setError(err.message || "Poptávku se nepodařilo načíst"));
  }, [id]);

  if (error) return <StateMessage text={error} />;
  if (!inquiry) return <StateMessage loading text="Načítám poptávku…" />;

  const details = inquiry.details || {};
  const items = Array.isArray(details.items) ? details.items : [];
  const heavyItemCount = items.reduce((total, item) => total + (item.heavy ? Number(item.quantity) || 0 : 0), 0);

  return (
    <div className="min-h-screen bg-asphalt-2 text-brown">
      <header className="bg-asphalt border-b border-white/10">
        <div className="max-w-6xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
          <Link href="/admin" className="font-display font-extrabold tracking-tight">DOPRAVACI<span className="text-amber">.CZ</span></Link>
          <Link href="/admin" className="flex items-center gap-2 text-sm text-steel hover:text-amber"><ArrowLeft className="w-4 h-4" /> Zpět na poptávky</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 md:px-10 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-amber mb-2">{sourceLabel(inquiry.source)}</div>
            <h1 className="font-display font-extrabold text-3xl text-brown">Poptávka od {inquiry.name}</h1>
            <div className="text-sm text-steel-dim mt-2">Vytvořeno {new Date(inquiry.created_date).toLocaleString("cs-CZ")}</div>
          </div>
          <span className="px-3 py-1 bg-amber/20 text-amber font-mono text-xs uppercase tracking-wider">{STATUS[inquiry.status] || inquiry.status}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <Section title="Kontakt" icon={UserRound}>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Jméno">{inquiry.name}</Field>
              <Field label="Telefon"><a className="hover:text-amber" href={`tel:${inquiry.phone}`}><Phone className="inline w-4 h-4 mr-1" />{inquiry.phone}</a></Field>
              <Field label="E-mail">{inquiry.email && <a className="hover:text-amber" href={`mailto:${inquiry.email}`}><Mail className="inline w-4 h-4 mr-1" />{inquiry.email}</a>}</Field>
              <Field label="Zdroj">{sourceLabel(inquiry.source)}</Field>
            </div>
          </Section>

          <Section title="Stav a přidělení" icon={Truck}>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Stav">{STATUS[inquiry.status] || inquiry.status}</Field>
              <Field label="Přiděleno">{inquiry.taken_by_name || "Nepřiděleno"}</Field>
              <Field label="Provize">{inquiry.commission != null ? `${inquiry.commission} Kč` : "Neuvedena"}</Field>
              <Field label="ID poptávky">{inquiry.id}</Field>
            </div>
          </Section>

          {inquiry.source === "calculator" && (
            <>
              <Section title="Trasa a termín" icon={MapPin}>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Adresa nakládky">{details.origin?.address || inquiry.from_city}</Field>
                  <Field label="Adresa vykládky">{details.destination?.address || inquiry.to_city}</Field>
                  <Field label="Patro nakládky">{details.origin?.floor ?? "Neuvedeno"}</Field>
                  <Field label="Výtah nakládky">{elevatorLabel(details.origin?.elevator)}</Field>
                  <Field label="Patro vykládky">{details.destination?.floor ?? "Neuvedeno"}</Field>
                  <Field label="Výtah vykládky">{elevatorLabel(details.destination?.elevator)}</Field>
                  <Field label="Vzdálenost">{inquiry.distance_km != null ? `${inquiry.distance_km} km` : "Neuvedena"}</Field>
                  <Field label="Požadovaný termín"><span><CalendarDays className="inline w-4 h-4 mr-1" />{details.move_date || "Neuveden"}</span></Field>
                </div>
              </Section>

              <Section title="Vybavení" icon={Package}>
                <div className="grid sm:grid-cols-2 gap-5 mb-5">
                  <Field label="Typ objektu"><span><Building2 className="inline w-4 h-4 mr-1" />{details.property_type_label || details.property_type || "Neuvedeno"}</span></Field>
                  <Field label="Těžké kusy">{heavyItemCount}</Field>
                  <Field label="Ostatní vybavení">{details.other_items || "Neuvedeno"}</Field>
                </div>
                {items.length > 0 ? (
                  <div className="border border-white/10 divide-y divide-white/10">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between gap-4 px-4 py-3 text-sm">
                        <span>{item.label}{item.heavy ? " · těžké" : ""}</span>
                        <strong>×{item.quantity}</strong>
                      </div>
                    ))}
                  </div>
                ) : <div className="text-sm text-steel-dim">Podrobný seznam vybavení není uložen.</div>}
              </Section>

              <Section title="Doplňkové služby" icon={Truck}>
                <div className="grid sm:grid-cols-3 gap-5">
                  <Field label="Montáž / demontáž">{yesNo(details.services?.assembly)}</Field>
                  <Field label="Vyklizení">{yesNo(details.services?.clearance)}</Field>
                  <Field label="Práce navíc">{details.services?.extra_hours ? `${details.services.extra_hours} h` : "Ne"}</Field>
                </div>
              </Section>
            </>
          )}

          <Section title={inquiry.source === "contact" ? "Obsah kontaktního formuláře" : "Poznámky"} icon={Package}>
            <div className="space-y-5">
              <Field label={inquiry.source === "contact" ? "Co potřebuje přepravit" : "Souhrn nákladu"}>{inquiry.cargo || "Neuvedeno"}</Field>
              <Field label="Poznámka">{inquiry.note || "Neuvedena"}</Field>
            </div>
          </Section>
        </div>
      </main>
    </div>
  );
}

function StateMessage({ text, loading = false }) {
  return (
    <div className="min-h-screen bg-asphalt-2 flex items-center justify-center text-brown">
      <div className="flex items-center gap-3">{loading && <Loader2 className="w-5 h-5 animate-spin text-amber" />}{text}</div>
    </div>
  );
}
