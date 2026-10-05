import React, { useEffect, useState } from "react";
import { api } from "@/api/client";
import { Check, Loader2, Plus, Save, Trash2, Upload } from "lucide-react";
import { DEFAULT_SETTINGS, mergeHomepageContent } from "@/lib/site-settings-defaults";

const BUILTINS = ["id", "created_date", "updated_date", "created_by_id"];

export default function SettingsPanel() {
  const [settings, setSettings] = useState(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploadingField, setUploadingField] = useState("");

  useEffect(() => {
    api.settings.get().then((row) => {
      const merged = { ...DEFAULT_SETTINGS, ...(row || {}) };
      merged.homepage_content = mergeHomepageContent(merged.homepage_content);
      setSettings(merged);
    }).catch((requestError) => setError(requestError.message));
  }, []);

  const set = (key, value) => setSettings((current) => ({ ...current, [key]: value }));
  const updateHomepage = (update) =>
    setSettings((current) => ({
      ...current,
      homepage_content: update(mergeHomepageContent(current.homepage_content)),
    }));
  const setSectionField = (section, key, value) =>
    updateHomepage((content) => ({ ...content, [section]: { ...content[section], [key]: value } }));
  const setListItem = (section, listKey, index, key, value) =>
    updateHomepage((content) => {
      const owner = section ? content[section] : content;
      const list = [...owner[listKey]];
      list[index] = { ...list[index], [key]: value };
      return section
        ? { ...content, [section]: { ...owner, [listKey]: list } }
        : { ...content, [listKey]: list };
    });
  const addListItem = (section, listKey) =>
    updateHomepage((content) => {
      const owner = section ? content[section] : content;
      const list = [...owner[listKey], { title: "", text: "" }];
      return section
        ? { ...content, [section]: { ...owner, [listKey]: list } }
        : { ...content, [listKey]: list };
    });
  const removeListItem = (section, listKey, index) =>
    updateHomepage((content) => {
      const owner = section ? content[section] : content;
      const list = owner[listKey].filter((_, itemIndex) => itemIndex !== index);
      return section
        ? { ...content, [section]: { ...owner, [listKey]: list } }
        : { ...content, [listKey]: list };
    });

  const save = async () => {
    setBusy(true);
    setError("");
    try {
      const payload = { ...settings };
      BUILTINS.forEach((key) => delete payload[key]);
      const row = await api.settings.save(payload);
      setSettings({ ...DEFAULT_SETTINGS, ...row, homepage_content: mergeHomepageContent(row.homepage_content) });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const onUpload = async (file, field) => {
    if (!file) return;
    setUploadingField(field);
    setError("");
    try {
      const { file_url: fileUrl } = await api.upload(file);
      set(field, fileUrl);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUploadingField("");
    }
  };

  if (!settings) return error ? <Notice tone="error">{error}</Notice> : <Loading />;

  const content = mergeHomepageContent(settings.homepage_content);

  return (
    <div className="max-w-4xl space-y-8">
      {saved ? <Notice><Check className="h-4 w-4" /> Obsah homepage byl uložen</Notice> : null}
      {error ? <Notice tone="error">{error}</Notice> : null}

      <div className="border border-amber/25 bg-amber/5 px-5 py-4 text-sm leading-relaxed text-steel">
        Změny se po uložení projeví přímo v serverově renderované homepage. Jednotlivé bloky upravujte v pořadí, v jakém se zobrazují na webu.
      </div>

      <Section title="Značka a navigace" description="Logo, název firmy a texty hlavního menu.">
        <Field label="Logo (volitelné)">
          <Uploader value={settings.logo_url} field="logo_url" uploading={uploadingField === "logo_url"} onUpload={onUpload} set={set} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-3">
          <TextField label="Název značky" value={settings.brand_name} onChange={(value) => set("brand_name", value)} />
          <TextField label="Přípona" value={settings.brand_suffix} onChange={(value) => set("brand_suffix", value)} />
          <TextField label="Slogan pod logem" value={settings.brand_tagline} onChange={(value) => set("brand_tagline", value)} />
          <TextField label="Menu: služby" value={content.navigation.services} onChange={(value) => setSectionField("navigation", "services", value)} />
          <TextField label="Menu: postup" value={content.navigation.process} onChange={(value) => setSectionField("navigation", "process", value)} />
          <TextField label="Menu: kontakt" value={content.navigation.contact} onChange={(value) => setSectionField("navigation", "contact", value)} />
        </div>
      </Section>

      <Section title="Hero – hlavní banner" description="První obrazovka webu včetně hlavních tlačítek.">
        <Field label="Obrázek pozadí">
          <Uploader value={settings.hero_image_url} field="hero_image_url" uploading={uploadingField === "hero_image_url"} onUpload={onUpload} set={set} />
        </Field>
        <TextField label="Štítek nad nadpisem" value={settings.hero_eyebrow} onChange={(value) => set("hero_eyebrow", value)} />
        <TextArea label="Hlavní nadpis" rows={2} value={settings.hero_title} onChange={(value) => set("hero_title", value)} />
        <TextArea label="Úvodní text" rows={4} value={settings.hero_paragraph} onChange={(value) => set("hero_paragraph", value)} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Hlavní tlačítko" value={settings.hero_cta_primary} onChange={(value) => set("hero_cta_primary", value)} />
          <TextField label="E-mailové tlačítko" value={settings.hero_cta_secondary} onChange={(value) => set("hero_cta_secondary", value)} />
        </div>
      </Section>

      <Section title="Výhody v hero" description="Tři stručné argumenty pod úvodním textem.">
        <EditableList
          items={content.highlights}
          limit={3}
          itemLabel="Výhoda"
          onChange={(index, key, value) => setListItem(null, "highlights", index, key, value)}
          onAdd={() => addListItem(null, "highlights")}
          onRemove={(index) => removeListItem(null, "highlights", index)}
        />
      </Section>

      <Section title="Služby" description="Nadpis sekce a karty specializací. Lze přidat až osm položek.">
        <TextField label="Malý nadpis" value={content.services.eyebrow} onChange={(value) => setSectionField("services", "eyebrow", value)} />
        <TextArea label="Hlavní nadpis" rows={2} value={content.services.title} onChange={(value) => setSectionField("services", "title", value)} />
        <TextArea label="Úvodní odstavec" rows={3} value={content.services.intro} onChange={(value) => setSectionField("services", "intro", value)} />
        <EditableList
          items={content.services.items}
          limit={8}
          itemLabel="Služba"
          onChange={(index, key, value) => setListItem("services", "items", index, key, value)}
          onAdd={() => addListItem("services", "items")}
          onRemove={(index) => removeListItem("services", "items", index)}
        />
      </Section>

      <Section title="Postup realizace" description="Kroky od prvního zadání až po dokončení přepravy.">
        <TextField label="Malý nadpis" value={content.process.eyebrow} onChange={(value) => setSectionField("process", "eyebrow", value)} />
        <TextArea label="Hlavní nadpis" rows={2} value={content.process.title} onChange={(value) => setSectionField("process", "title", value)} />
        <EditableList
          items={content.process.steps}
          limit={8}
          itemLabel="Krok"
          onChange={(index, key, value) => setListItem("process", "steps", index, key, value)}
          onAdd={() => addListItem("process", "steps")}
          onRemove={(index) => removeListItem("process", "steps", index)}
        />
      </Section>

      <Section title="Kontaktní výzva" description="Závěrečný blok homepage a firemní údaje.">
        <TextField label="Malý nadpis" value={content.contact.eyebrow} onChange={(value) => setSectionField("contact", "eyebrow", value)} />
        <TextArea label="Hlavní nadpis" rows={2} value={content.contact.title} onChange={(value) => setSectionField("contact", "title", value)} />
        <TextField label="Popisek kontaktu" value={content.contact.directLabel} onChange={(value) => setSectionField("contact", "directLabel", value)} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Telefon" value={settings.phone} onChange={(value) => set("phone", value)} />
          <TextField label="Telefonní odkaz" value={settings.phone_href} mono onChange={(value) => set("phone_href", value)} />
          <TextField label="E-mail" type="email" value={settings.email} onChange={(value) => set("email", value)} />
          <TextField label="Majitel / kontakt" value={settings.owner_name} onChange={(value) => set("owner_name", value)} />
          <TextField label="Adresa" value={settings.address} onChange={(value) => set("address", value)} />
          <TextField label="IČO" value={settings.ic} onChange={(value) => set("ic", value)} />
        </div>
      </Section>

      <Section title="Doporučení Stehuj.eu" description="Samostatný blok před patičkou pro stěhování domácností a firem.">
        <TextField label="Malý nadpis" value={content.recommendation.eyebrow} onChange={(value) => setSectionField("recommendation", "eyebrow", value)} />
        <TextArea label="Hlavní nadpis" rows={2} value={content.recommendation.title} onChange={(value) => setSectionField("recommendation", "title", value)} />
        <TextArea label="Doporučující text" rows={3} value={content.recommendation.text} onChange={(value) => setSectionField("recommendation", "text", value)} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Text tlačítka" value={content.recommendation.cta} onChange={(value) => setSectionField("recommendation", "cta", value)} />
          <TextField label="Adresa webu" value={content.recommendation.url} mono onChange={(value) => setSectionField("recommendation", "url", value)} />
        </div>
      </Section>

      <Section title="Patička">
        <TextField label="Text uprostřed patičky" value={content.footer.text} onChange={(value) => setSectionField("footer", "text", value)} />
      </Section>

      <div className="sticky bottom-4 z-20 flex justify-end border border-white/10 bg-asphalt/95 p-4 shadow-2xl backdrop-blur">
        <button type="button" onClick={save} disabled={busy} className="btn-industrial flex items-center gap-2 bg-amber px-6 py-3 font-display font-bold uppercase tracking-wider text-asphalt disabled:opacity-50">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Uložit homepage
        </button>
      </div>
    </div>
  );
}

const inputCls = "w-full border border-white/15 bg-asphalt-2 px-4 py-3 text-brown outline-none transition-colors focus:border-amber/70";
const inputClsMono = `${inputCls} font-mono text-sm`;

function Section({ title, description, children }) {
  return (
    <section className="border border-white/10 bg-asphalt p-6">
      <div className="mb-5 border-b border-white/10 pb-4">
        <h3 className="font-display text-lg font-bold text-brown">{title}</h3>
        {description ? <p className="mt-1 text-sm text-steel-dim">{description}</p> : null}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-steel">{label}</label>
      {children}
    </div>
  );
}

function TextField({ label, value, onChange, mono = false, type = "text" }) {
  return (
    <Field label={label}>
      <input type={type} value={value || ""} onChange={(event) => onChange(event.target.value)} className={mono ? inputClsMono : inputCls} />
    </Field>
  );
}

function TextArea({ label, value, onChange, rows }) {
  return (
    <Field label={label}>
      <textarea rows={rows} value={value || ""} onChange={(event) => onChange(event.target.value)} className={inputCls} />
    </Field>
  );
}

function EditableList({ items, limit, itemLabel, onChange, onAdd, onRemove }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="grid gap-3 border border-white/10 bg-asphalt-2 p-4 sm:grid-cols-[1fr_1.5fr_auto] sm:items-start">
          <TextField label={`${itemLabel} ${index + 1} – název`} value={item.title} onChange={(value) => onChange(index, "title", value)} />
          <TextArea label="Popis" rows={2} value={item.text} onChange={(value) => onChange(index, "text", value)} />
          <button type="button" onClick={() => onRemove(index)} className="mt-6 flex h-11 w-11 items-center justify-center border border-white/15 text-steel transition-colors hover:border-red-400/40 hover:text-red-400" aria-label={`Smazat položku ${index + 1}`}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      {items.length < limit ? (
        <button type="button" onClick={onAdd} className="flex w-full items-center justify-center gap-2 border border-dashed border-white/20 px-4 py-3 font-mono text-xs uppercase tracking-wider text-steel transition-colors hover:border-amber/40 hover:text-amber">
          <Plus className="h-4 w-4" /> Přidat položku
        </button>
      ) : null}
    </div>
  );
}

function Uploader({ value, field, uploading, onUpload, set }) {
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input value={value || ""} onChange={(event) => set(field, event.target.value)} className={`${inputClsMono} flex-1`} placeholder="/images/... nebo https://..." />
        <label className="btn-industrial flex cursor-pointer items-center justify-center gap-1.5 border border-white/20 px-4 py-3 font-display text-xs font-bold uppercase tracking-wider text-brown">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Nahrát
          <input type="file" accept="image/*" className="hidden" onChange={(event) => onUpload(event.target.files?.[0], field)} />
        </label>
      </div>
      {value ? <div className="mt-3 aspect-[3/1] w-full max-w-md overflow-hidden border border-white/10"><img src={value} alt="" className="h-full w-full bg-asphalt-2 object-cover" /></div> : null}
    </div>
  );
}

function Notice({ children, tone = "success" }) {
  const classes = tone === "error" ? "border-red-500/30 bg-red-500/10 text-red-300" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  return <div className={`flex items-center gap-2 border px-4 py-3 font-mono text-xs uppercase tracking-wider ${classes}`}>{children}</div>;
}

function Loading() {
  return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-amber" /></div>;
}
