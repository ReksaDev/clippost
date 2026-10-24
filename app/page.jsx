

'use client';

import React, { useState } from 'react';

import {

  Sparkles,

  Copy,

  Check,

  ShieldCheck,

  Zap,

  Crown,

  LoaderCircle,

  X,

} from 'lucide-react';

export default function App() {

  const [inputText, setInputText] = useState('');

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const [error, setError] = useState('');

  const [copied, setCopied] = useState('');

  const [showPaywall, setShowPaywall] = useState(false);

  const [generationsLeft, setGenerationsLeft] = useState(3);

  async function copyText(text, type) {

    try {

      await navigator.clipboard.writeText(text);

      setCopied(type);

      setTimeout(() => setCopied(''), 2000);

    } catch {

      setError('Gagal menyalin. Silakan salin teks secara manual.');

    }

  }

  async function handleGenerate() {

    if (!inputText.trim() || loading) return;

    if (generationsLeft <= 0) {

      setShowPaywall(true);

      return;

    }

    setLoading(true);

    setResult(null);

    setError('');

    try {

      const response = await fetch('/api/generate', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ text: inputText }),

      });

      if (!response.ok) {

        throw new Error(

          'Layanan AI belum tersedia. Periksa endpoint /api/generate.'

        );

      }

      const data = await response.json();

      if (!data.twitter || !data.linkedin) {

        throw new Error('Respons AI tidak lengkap.');

      }

      setResult(data);

      setGenerationsLeft((count) => count - 1);

    } catch (err) {

      setError(

        err.message ||

          'Terjadi kesalahan. Silakan coba lagi.'

      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">

      <nav className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">

        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">

          <div className="flex items-center gap-2">

            <div className="rounded-xl bg-indigo-600 p-2">

              <Zap size={20} />

            </div>

            <span className="text-xl font-black tracking-tight">

              ClipPost<span className="text-indigo-400">.io</span>

            </span>

          </div>

          <button

            onClick={() => setShowPaywall(true)}

            className="flex items-center gap-2 rounded-xl bg-amber-500 px-3 py-2 text-sm font-bold text-slate-950 hover:bg-amber-400"

          >

            <Crown size={16} />

            Upgrade

          </button>

        </div>

      </nav>

      <main className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">

        <header className="space-y-4 text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-300">

            <Sparkles size={14} />

            AI Content Repurposing

          </div>

          <h1 className="text-4xl font-black leading-tight sm:text-6xl">

            Satu Teks,

            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">

              Banyak Konten

            </span>

          </h1>

          <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-400 sm:text-lg">

            Ubah artikel, catatan, atau transkrip menjadi

            Twitter/X thread dan postingan LinkedIn dengan lebih cepat.

          </p>

        </header>

        <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl sm:p-8">

          <div className="flex flex-wrap items-center justify-between gap-2">

            <label

              htmlFor="source-text"

              className="text-sm font-semibold text-slate-200"

            >

              Masukkan teks kamu

            </label>

            <span className="text-xs text-indigo-300">

              Sisa kuota demo: {generationsLeft}

            </span>

          </div>

          <textarea

            id="source-text"

            rows={7}

            value={inputText}

            onChange={(event) => setInputText(event.target.value)}

            placeholder="Tempel artikel, ide, catatan, atau transkrip di sini..."

            className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"

          />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-2 text-xs text-slate-400">

              <ShieldCheck size={17} className="text-emerald-400" />

              Siap untuk berbagai platform

            </div>

            <button

              onClick={handleGenerate}

              disabled={loading || !inputText.trim()}

              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 font-bold transition hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"

            >

              {loading ? (

                <>

                  <LoaderCircle size={18} className="animate-spin" />

                  Memproses...

                </>

              ) : (

                <>

                  <Sparkles size={18} />

                  Generate Konten

                </>

              )}

            </button>

          </div>

          {error && (

            <div

              role="alert"

              className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm leading-6 text-red-300"

            >

              {error}

            </div>

          )}

        </section>

        {result && (

          <section className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {[

              {

                key: 'twitter',

                title: 'Twitter / X Thread',

                color: 'bg-sky-400',

              },

              {

                key: 'linkedin',

                title: 'LinkedIn Post',

                color: 'bg-blue-500',

              },

            ].map((item) => (

              <article

                key={item.key}

                className="flex min-w-0 flex-col rounded-2xl border border-slate-800 bg-slate-900 p-5"

              >

                <div className="mb-4 flex items-center justify-between gap-2 border-b border-slate-800 pb-4">

                  <div className="flex items-center gap-2">

                    <span className={`h-3 w-3 rounded-full ${item.color}`} />

                    <h2 className="font-bold">{item.title}</h2>

                  </div>

                  <button

                    onClick={() =>

                      copyText(result[item.key], item.key)

                    }

                    className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-xs hover:bg-slate-700"

                  >

                    {copied === item.key ? (

                      <Check size={14} className="text-emerald-400" />

                    ) : (

                      <Copy size={14} />

                    )}

                    {copied === item.key ? 'Disalin!' : 'Salin'}

                  </button>

                </div>

                <div className="whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-4 text-sm leading-7 text-slate-300">

                  {result[item.key]}

                </div>

              </article>

            ))}

          </section>

        )}

      </main>

      <footer className="mt-16 border-t border-slate-900 px-4 py-8 text-center text-xs text-slate-500">

        © 2026 ClipPost.io · AI Content Assistant

      </footer>

      {showPaywall && (

        <div

          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"

          onClick={() => setShowPaywall(false)}

        >

          <div

            role="dialog"

            aria-modal="true"

            aria-labelledby="upgrade-title"

            className="w-full max-w-md space-y-4 rounded-2xl border border-slate-700 bg-slate-900 p-6"

            onClick={(event) => event.stopPropagation()}

          >

            <div className="flex items-center justify-between">

              <h2 id="upgrade-title" className="text-xl font-black">

                ClipPost Pro

              </h2>

              <button

                onClick={() => setShowPaywall(false)}

                aria-label="Tutup"

                className="rounded-lg p-2 hover:bg-slate-800"

              >

                <X size={20} />

              </button>

            </div>

            <p className="text-sm leading-6 text-slate-400">

              Fitur upgrade dan pembayaran belum dikonfigurasi.

              Jangan melakukan pembayaran sebelum gateway resmi

              terhubung.

            </p>

            <button

              onClick={() => setShowPaywall(false)}

              className="w-full rounded-xl bg-indigo-600 py-3 font-semibold hover:bg-indigo-500"

            >

              Mengerti

            </button>

          </div>

        </div>

      )}

    </div>

  );

}