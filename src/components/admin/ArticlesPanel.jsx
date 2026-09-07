import React, { useEffect, useState } from "react";
import { api } from "@/api/client";
import { Loader2, Trash2, Plus, Pencil, Eye, EyeOff, X, Upload } from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const slugify = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const empty = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image_url: "",
  gallery: [],
  videos: [],
  tag: "",
  meta: "",
  published: false,
  author_name: "",
};

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "blockquote"],
    ["clean"],
  ],
};

export default function ArticlesPanel() {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const list = await api.articles.list();
    setItems(list);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing.title || !editing.slug) return;
    setBusy(true);
    try {
      const payload = {
        title: editing.title.trim(),
        slug: (editing.slug || slugify(editing.title)).trim(),
        excerpt: editing.excerpt,
        content: editing.content,
        image_url: editing.image_url,
        gallery: Array.isArray(editing.gallery) ? editing.gallery : [],
        videos: Array.isArray(editing.videos) ? editing.videos : [],
        tag: editing.tag,
        meta: editing.meta,
        published: !!editing.published,
        author_name: editing.author_name,
      };
      if (editing.id) {
        await api.articles.update(editing.id, payload);
      } else {
        await api.articles.create(payload);
      }
      setEditing(null);
      load();
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (window.confirm("Smazat článek?")) {
      await api.articles.delete(id);
      load();
    }
  };

  const togglePublished = async (a) => {
    await api.articles.update(a.id, { published: !a.published });
    load();
  };

  const onUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await api.upload(file);
      setEditing((e) => ({ ...e, image_url: file_url }));
    } finally {
      setUploading(false);
    }
  };

  const onUploadGallery = async (files) => {
    if (!files || !files.length) return;
    setUploading(true);
    try {
      const urls = [];
      for (const file of Array.from(files)) {
        const { file_url } = await api.upload(file);
        urls.push(file_url);
      }
      setEditing((e) => ({ ...e, gallery: [...(e.gallery || []), ...urls] }));
    } finally {
      setUploading(false);
    }
  };

  const onUploadVideo = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await api.upload(file);
      setEditing((e) => ({ ...e, videos: [...(e.videos || []), file_url] }));
    } finally {
      setUploading(false);
    }
  };

  if (!items) return <Loading />;
  if (editing) {
    return (
      <Editor
        editing={editing}
        setEditing={setEditing}
        save={save}
        busy={busy}
        uploading={uploading}
        onUpload={onUpload}
        onUploadGallery={onUploadGallery}
        onUploadVideo={onUploadVideo}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="font-mono text-xs text-steel-dim uppercase tracking-wider">
          {items.length} článků
        </p>
        <button
          onClick={() => setEditing({ ...empty })}
          className="btn-industrial bg-amber text-asphalt font-display font-bold text-xs uppercase tracking-wider px-4 py-2 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Nový článek
        </button>
      </div>

      {items.length === 0 ? (
        <Empty text="Zatím žádné články" />
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <div key={a.id} className="bg-asphalt border border-white/10 p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                        a.published ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-steel-dim"
                      }`}
                    >
                      {a.published ? "Publikováno" : "Koncept"}
                    </span>
                    {a.tag && (
                      <span className="font-mono text-[10px] text-amber uppercase tracking-wider">
                        {a.tag}
                      </span>
                    )}
                    <span className="font-mono text-[10px] text-steel-dim uppercase">
                      {new Date(a.created_date).toLocaleDateString("cs-CZ")}
                    </span>
                  </div>
                  <div className="font-display font-bold text-brown">{a.title}</div>
                  <div className="font-mono text-[11px] text-steel-dim mt-1">/clanky/{a.slug}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => togglePublished(a)}
                    title={a.published ? "Skrýt" : "Publikovat"}
                    className="border border-white/15 text-steel hover:text-amber hover:border-amber/40 px-3 py-2"
                  >
                    {a.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setEditing({ ...a })}
                    className="border border-white/15 text-steel hover:text-amber hover:border-amber/40 px-3 py-2"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => remove(a.id)}
                    className="border border-white/15 text-steel hover:text-red-400 hover:border-red-400/40 px-3 py-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Editor({ editing, setEditing, save, busy, uploading, onUpload, onUploadGallery, onUploadVideo }) {
  const set = (k, v) => setEditing((e) => ({ ...e, [k]: v }));
  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-bold text-brown text-xl">
          {editing.id ? "Upravit článek" : "Nový článek"}
        </h3>
        <button onClick={() => setEditing(null)} className="text-steel hover:text-brown text-2xl leading-none">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-5">
        <Field label="Titulek">
          <input
            value={editing.title}
            onChange={(e) => {
              const v = e.target.value;
              set("title", v);
              if (!editing.id) set("slug", slugify(v));
            }}
            className="w-full bg-asphalt-2 border border-white/15 px-4 py-3 text-brown"
            placeholder="Např. Přeprava těžkého bojleru po Praze"
          />
        </Field>

        <Field label="URL slug">
          <input
            value={editing.slug}
            onChange={(e) => set("slug", e.target.value)}
            className="w-full bg-asphalt-2 border border-white/15 px-4 py-3 text-brown font-mono text-sm"
            placeholder="preprava-bojleru-praha"
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Štítek">
            <input
              value={editing.tag}
              onChange={(e) => set("tag", e.target.value)}
              className="w-full bg-asphalt-2 border border-white/15 px-4 py-3 text-brown"
              placeholder="PŘEPRAVA"
            />
          </Field>
          <Field label="Meta (krátký popis pod kartou)">
            <input
              value={editing.meta}
              onChange={(e) => set("meta", e.target.value)}
              className="w-full bg-asphalt-2 border border-white/15 px-4 py-3 text-brown"
              placeholder="PRAHA & OKOLÍ"
            />
          </Field>
        </div>

        <Field label="Perex (ukázka na kartě a v SEO)">
          <textarea
            value={editing.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            rows={2}
            className="w-full bg-asphalt-2 border border-white/15 px-4 py-3 text-brown"
            placeholder="Krátký úvod, který se zobrazí v seznamu článků."
          />
        </Field>

        <Field label="Obrázek (titulní)">
          <div className="flex items-center gap-3">
            <input
              value={editing.image_url}
              onChange={(e) => set("image_url", e.target.value)}
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
                onChange={(e) => onUpload(e.target.files?.[0])}
              />
            </label>
          </div>
          {editing.image_url && (
            <div className="mt-3 aspect-[3/2] w-full max-w-xs overflow-hidden border border-white/10">
              <img src={editing.image_url} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </Field>

        <Field label="Galerie obrázků (více)">
          <div className="flex flex-wrap gap-3">
            {(editing.gallery || []).map((url, i) => (
              <div key={i} className="relative w-28 h-20 overflow-hidden border border-white/15 group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setEditing((e) => ({ ...e, gallery: (e.gallery || []).filter((_, idx) => idx !== i) }))}
                  className="absolute top-1 right-1 bg-red-500/80 text-brown p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Odstranit"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            <label className="w-28 h-20 border border-dashed border-white/25 flex items-center justify-center text-steel hover:text-amber hover:border-amber/40 cursor-pointer transition-colors">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-5 h-5" />}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onUploadGallery(e.target.files)}
              />
            </label>
          </div>
          <p className="font-mono text-[10px] text-steel-dim mt-2 uppercase tracking-wider">
            Můžete nahrát více obrázků najednou.
          </p>
        </Field>

        <Field label="Videa (mp4)">
          <div className="space-y-3">
            {(editing.videos || []).map((url, i) => (
              <div key={i} className="flex items-center gap-3">
                <video src={url} className="w-32 h-20 object-cover border border-white/15 bg-black" muted />
                <input
                  value={url}
                  onChange={(e) => setEditing((prev) => ({ ...prev, videos: (prev.videos || []).map((v, idx) => idx === i ? e.target.value : v) }))}
                  className="flex-1 bg-asphalt-2 border border-white/15 px-3 py-2 text-brown font-mono text-xs"
                  placeholder="https://..."
                />
                <button
                  type="button"
                  onClick={() => setEditing((e) => ({ ...e, videos: (e.videos || []).filter((_, idx) => idx !== i) }))}
                  className="border border-white/15 text-steel hover:text-red-400 hover:border-red-400/40 px-3 py-2"
                  title="Odstranit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <label className="btn-industrial border border-white/20 text-brown font-display font-bold text-xs uppercase tracking-wider px-4 py-3 flex items-center gap-1.5 cursor-pointer w-fit">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Nahrát video
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => onUploadVideo(e.target.files?.[0])}
              />
            </label>
          </div>
          <p className="font-mono text-[10px] text-steel-dim mt-2 uppercase tracking-wider">
            Nahraná videa se zobrazí pod obsahem článku.
          </p>
        </Field>

        <Field label="Obsah článku">
          <div className="bg-white">
            <ReactQuill
              theme="snow"
              value={editing.content}
              onChange={(v) => set("content", v)}
              modules={quillModules}
            />
          </div>
        </Field>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Autor">
            <input
              value={editing.author_name}
              onChange={(e) => set("author_name", e.target.value)}
              className="w-full bg-asphalt-2 border border-white/15 px-4 py-3 text-brown"
              placeholder="Milan Rousek"
            />
          </Field>
          <label className="flex items-center gap-3 pt-7 cursor-pointer">
            <input
              type="checkbox"
              checked={!!editing.published}
              onChange={(e) => set("published", e.target.checked)}
              className="w-5 h-5 accent-amber-300"
            />
            <span className="font-mono text-xs uppercase tracking-wider text-steel">
              Publikovat na frontend
            </span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={save}
            disabled={busy || !editing.title || !editing.slug}
            className="btn-industrial bg-amber text-asphalt font-display font-bold uppercase tracking-wider px-6 py-3 flex items-center gap-2 disabled:opacity-50"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            {editing.id ? "Uložit změny" : "Vytvořit článek"}
          </button>
          <button
            onClick={() => setEditing(null)}
            className="border border-white/20 text-steel hover:text-brown font-display font-bold uppercase tracking-wider px-6 py-3"
          >
            Zrušit
          </button>
        </div>
      </div>
    </div>
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

function Loading() {
  return (
    <div className="flex justify-center py-20">
      <Loader2 className="w-8 h-8 text-amber animate-spin" />
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="text-center py-20 text-steel-dim font-mono text-sm uppercase tracking-wider">{text}</div>
  );
}
