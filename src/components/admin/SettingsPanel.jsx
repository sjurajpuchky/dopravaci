import React, { useEffect, useState } from "react";
import { api } from "@/api/client";
import { Loader2, Upload, Save, Check, Plus, Trash2 } from "lucide-react";
import { DEFAULT_SETTINGS } from "@/hooks/useSiteSettings";

const BUILTINS = ["id", "created_date", "updated_date", "created_by_id"];

export default function SettingsPanel() {
  const [settings, setSettings] = useState(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingField, setUploadingField] = useState("");

  useEffect(() => {
    api.settings.get().then((row) => {
      if (row) {
        setSettings({ ...DEFAULT_SETTINGS, ...row });
      } else {
        setSettings({ ...DEFAULT_SETTINGS });
      }
    });
  }, []);

  const set = (k, v) => setSettings((s) => ({ ...s, [k]: v }));

  const setGalleryItem = (i, key, v) =>
    setSettings((s) => {
      const list = [...(s.gallery || [])];
      list[i] = { ...list[i], [key]: v };
      return { ...s, gallery: list };
    });
  const addGalleryItem = () =>
    setSettings((s) => ({ ...s, gallery: [...(s.gallery || []), { src: "", alt: "", tag: "" }] }));
  const removeGalleryItem = (i) =>
    setSettings((s) => ({ ...s, gallery: (s.gallery || []).filter((_, idx) => idx !== i) }));

  const save = async () => {
    setBusy(true);
    try {
      const payload = { ...settings };
      BUILTINS.forEach((k) => delete payload[k]);
      await api.settings.save(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setBusy(false);
    }
  };

  const onUpload = async (file, field) => {
    if (!file) return;
    setUploadingField(field);
    try {
      const { file_url } = await api.upload(file);
      set(field, file_url);
    } finally {
      setUploadingField("");
    }
  };

  if (!settings) return <Loading />;

  return (
    <div className="max-w-3xl space-y-10">
      {saved && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 font-mono text-xs uppercase tracking-wider">
          <Check className="w-4 h-4" /> Nastavení uloženo
        </div>
      )}

      <Section title="Značka & logo">
        <Field label="Logo (obrázek — volitelné, nahradí ikonu)">
          <Uploader
            value={settings.logo_url}
            field="logo_url"
            uploading={uploadingField === "logo_url"}
            onUpload={onUpload}
            set={set}
          />
        </Field>
        <div className="grid sm:grid-cols-3 gap-5">
          <Field label="Název značky">
            <input value={settings.brand_name} onChange={(e) => set("brand_name", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Přípona (zvýrazněná)">
            <input value={settings.brand_suffix} onChange={(e) => set("brand_suffix", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Slogan">
            <input value={settings.brand_tagline} onChange={(e) => set("brand_tagline", e.target.value)} className={inputCls} />
          </Field>
        </div>
      </Section>

      <Section title="Kontakt">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Telefon (zobrazený)">
            <input value={settings.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Telefon (odkaz tel:)">
            <input value={settings.phone_href} onChange={(e) => set("phone_href", e.target.value)} className={inputClsMono} />
          </Field>
          <Field label="E-mail">
            <input value={settings.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
          </Field>
          <Field label="IČO">
            <input value={settings.ic} onChange={(e) => set("ic", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Majitel / kontakt">
            <input value={settings.owner_name} onChange={(e) => set("owner_name", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Adresa">
            <input value={settings.address} onChange={(e) => set("address", e.target.value)} className={inputCls} />
          </Field>
        </div>
      </Section>

      <Section title="Hero — hlavní banner">
        <Field label="Obrázek pozadí">
          <Uploader
            value={settings.hero_image_url}
            field="hero_image_url"
            uploading={uploadingField === "hero_image_url"}
            onUpload={onUpload}
            set={set}
          />
        </Field>
        <Field label="Nadpis sekce (č. řádek)">
          <input value={settings.hero_eyebrow} onChange={(e) => set("hero_eyebrow", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Titulek">
          <textarea rows={2} value={settings.hero_title} onChange={(e) => set("hero_title", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Odstavec">
          <textarea rows={3} value={settings.hero_paragraph} onChange={(e) => set("hero_paragraph", e.target.value)} className={inputCls} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Tlačítko 1">
            <input value={settings.hero_cta_primary} onChange={(e) => set("hero_cta_primary", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Tlačítko 2">
            <input value={settings.hero_cta_secondary} onChange={(e) => set("hero_cta_secondary", e.target.value)} className={inputCls} />
          </Field>
        </div>
      </Section>

      <Section title="Statistiky (4 údaje v hero)">
        <div className="grid sm:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <Field label={`Hodnota ${i}`}>
                <input
                  value={settings[`stat${i}_value`]}
                  onChange={(e) => set(`stat${i}_value`, e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label={`Popisek ${i}`}>
                <input
                  value={settings[`stat${i}_label`]}
                  onChange={(e) => set(`stat${i}_label`, e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Sekce O nás">
        <Field label="Obrázek">
          <Uploader
            value={settings.about_image_url}
            field="about_image_url"
            uploading={uploadingField === "about_image_url"}
            onUpload={onUpload}
            set={set}
          />
        </Field>
        <Field label="Nadpis sekce">
          <input value={settings.about_eyebrow} onChange={(e) => set("about_eyebrow", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Titulek">
          <textarea rows={2} value={settings.about_title} onChange={(e) => set("about_title", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Odstavec 1">
          <textarea rows={3} value={settings.about_paragraph_1} onChange={(e) => set("about_paragraph_1", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Odstavec 2">
          <textarea rows={3} value={settings.about_paragraph_2} onChange={(e) => set("about_paragraph_2", e.target.value)} className={inputCls} />
        </Field>
      </Section>

      <Section title="Mapa (sídlo)">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Zeměpisná šířka">
            <input
              type="number"
              step="0.0001"
              value={settings.map_lat}
              onChange={(e) => set("map_lat", Number(e.target.value))}
              className={inputClsMono}
            />
          </Field>
          <Field label="Zeměpisná délka">
            <input
              type="number"
              step="0.0001"
              value={settings.map_lng}
              onChange={(e) => set("map_lng", Number(e.target.value))}
              className={inputClsMono}
            />
          </Field>
        </div>
      </Section>

      <Section title="Fotogalerie (úvodní stránka)">
        <p className="text-steel-dim text-sm mb-5">
          Určete, které fotografie se zobrazí v sekci Fotogalerie. Prázdné pole = použijí se výchozí fotky.
        </p>
        <div className="space-y-4">
          {(settings.gallery || []).map((g, i) => (
            <div key={i} className="grid sm:grid-cols-[1fr_180px_auto] gap-3 items-start border border-white/10 p-3 bg-asphalt-2">
              <div className="space-y-2">
                <Uploader
                  value={g.src}
                  field={`gallery-${i}-src`}
                  uploading={uploadingField === `gallery-${i}-src`}
                  onUpload={async (file, f) => {
                    setUploadingField(f);
                    try {
                      const { file_url } = await api.upload(file);
                      setGalleryItem(i, "src", file_url);
                    } finally {
                      setUploadingField("");
                    }
                  }}
                  set={(f, v) => setGalleryItem(i, "src", v)}
                />
                <input
                  value={g.alt || ""}
                  onChange={(e) => setGalleryItem(i, "alt", e.target.value)}
                  className={inputCls}
                  placeholder="Popisek (alt)"
                />
              </div>
              <input
                value={g.tag || ""}
                onChange={(e) => setGalleryItem(i, "tag", e.target.value)}
                className={`${inputCls} uppercase`}
                placeholder="Štítek"
              />
              <button
                onClick={() => removeGalleryItem(i)}
                className="border border-white/15 text-steel hover:text-red-400 hover:border-red-400/40 px-3 py-3 flex items-center justify-center"
                aria-label="Smazat fotku"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addGalleryItem}
            className="border border-dashed border-white/20 text-steel hover:text-amber hover:border-amber/40 px-4 py-3 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider w-full"
          >
            <Plus className="w-4 h-4" /> Přidat fotku
          </button>
        </div>
      </Section>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={save}
          disabled={busy}
          className="btn-industrial bg-amber text-asphalt font-display font-bold uppercase tracking-wider px-6 py-3 flex items-center gap-2 disabled:opacity-50"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Uložit nastavení
        </button>
      </div>
    </div>
  );
}

const inputCls = "w-full bg-asphalt-2 border border-white/15 px-4 py-3 text-brown";
const inputClsMono = "w-full bg-asphalt-2 border border-white/15 px-4 py-3 text-brown font-mono text-sm";

function Section({ title, children }) {
  return (
    <section className="bg-asphalt border border-white/10 p-6">
      <h3 className="font-display font-bold text-brown text-lg mb-5">{title}</h3>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="font-mono text-xs uppercase tracking-wider text-steel mb-2 block">{label}</label>
      {children}
    </div>
  );
}

function Uploader({ value, field, uploading, onUpload, set }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <input
          value={value || ""}
          onChange={(e) => set(field, e.target.value)}
          className="flex-1 bg-asphalt-2 border border-white/15 px-4 py-3 text-brown font-mono text-xs"
          placeholder="https://..."
        />
        <label className="btn-industrial border border-white/20 text-brown font-display font-bold text-xs uppercase tracking-wider px-4 py-3 flex items-center gap-1.5 cursor-pointer">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Nahrát
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onUpload(e.target.files?.[0], field)}
          />
        </label>
      </div>
      {value && (
        <div className="mt-3 aspect-[3/1] w-full max-w-xs overflow-hidden border border-white/10">
          <img src={value} alt="" className="w-full h-full object-contain bg-asphalt-2" />
        </div>
      )}
    </div>
  );
}

function Loading() {
  return (
    <div className="flex justify-center py-20">
      <Loader2 className="w-8 h-8 text-amber animate-spin" />
    </div>
  );
}
