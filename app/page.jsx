'use client';
import React, { useState } from 'react';
import { Sparkles, Copy, Check, ShieldCheck, Zap, ArrowRight, Lock, Crown, User, CreditCard, ExternalLink } from 'lucide-react';
export default function App() {
const [inputText, setInputText] = useState('');
const [loading, setLoading] = useState(false);
const [result, setResult] = useState(null);
const [copiedTwitter, setCopiedTwitter] = useState(false);
const [copiedLinkedin, setCopiedLinkedin] = useState(false);
const [activeTab, setActiveTab] = useState('tool');
// Auth & Usage States
const [user, setUser] = useState({ name: 'Demo User', email: 'user@clippost.io', plan: 'free', generationsLeft: 3 });
const [showPaywall, setShowPaywall] = useState(false);
const [isLoggedIn, setIsLoggedIn] = useState(true);
const [paymentLoading, setPaymentLoading] = useState(false);
// Real Gemini API Integration using gemini-3-flash-preview
const handleGenerate = async () => {
if (!inputText.trim()) return;
if (user.plan === 'free' && user.generationsLeft <= 0) {
setShowPaywall(true);
return;
}
setLoading(true);
setResult(null);
const systemPrompt = "Act as an expert Content Marketer and Solopreneur. Analyze the provided text and output a JSON object containing exactly two keys: 'twitter' (a high-engagement Twitter thread formatted as 5 numbered tweets with strong hooks and short line breaks) and 'linkedin' (a professional, insightful LinkedIn post with spacing, emojis, and professional hashtags). Match the language of the input text (Indonesian or English). Return ONLY valid JSON.";
const userQuery = ⁠Process this text into Twitter and LinkedIn formats:\n\n${inputText}⁠;
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const apiUrl = ⁠https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}⁠;
const payload = {
contents: [{ parts: [{ text: userQuery }] }],
systemInstruction: {
parts: [{ text: systemPrompt }]
},
generationConfig: {
responseMimeType: "application/json",
responseSchema: {
type: "OBJECT",
properties: {
twitter: { type: "STRING" },
linkedin: { type: "STRING" }
},
propertyOrdering: ["twitter", "linkedin"]
}
}
};
const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
try {
const response = await fetch(url, options);
if (!response.ok) throw new Error(⁠HTTP error! status: ${response.status}⁠);
return await response.json();
} catch (error) {
if (retries > 0) {
await new Promise(resolve => setTimeout(resolve, delay));
return fetchWithRetry(url, options, retries - 1, delay * 2);
}
throw error;
}
};
try {
const data = await fetchWithRetry(apiUrl, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload)
});
const candidate = data.candidates?.[0];
if (candidate && candidate.content?.parts?.[0]?.text) {
const jsonText = candidate.content.parts[0].text;
const parsed = JSON.parse(jsonText);
setResult(parsed);
if (user.plan === 'free') {
setUser(prev => ({ ...prev, generationsLeft: prev.generationsLeft - 1 }));
}
} else {
throw new Error("Unexpected response structure from Gemini API.");
}
} catch (err) {
console.error("API Error:", err);
setResult({
twitter: ⁠1/3 Gagal terhubung ke AI secara live, namun ini contoh cadangan struktur thread.\n\n2/3 Periksa kembali koneksi atau API key Anda.\n\n3/3 Coba lagi dalam beberapa saat! 👇⁠,
linkedin: ⁠Terjadi kendala saat memproses API Gemini secara otomatis.\n\nSilakan coba masukkan teks Anda kembali.\n\n#ClipPost #AI⁠
});
} finally {
setLoading(false);
}
};
const copyText = (text, type) => {
navigator.clipboard.writeText(text);
if (type === 'twitter') {
setCopiedTwitter(true);
setTimeout(() => setCopiedTwitter(false), 2000);
} else {
setCopiedLinkedin(true);
setTimeout(() => setCopiedLinkedin(false), 2000);
}
};
const handleRealCheckout = async (planType) => {
setPaymentLoading(true);
try {
await new Promise(resolve => setTimeout(resolve, 1500));
setUser(prev => ({
...prev,
plan: planType === 'pro' ? 'pro' : 'lifetime',
generationsLeft: 9999
}));
setShowPaywall(false);
alert(⁠Berhasil membuat sesi pembayaran via ${planType === 'pro' ? 'Lemon Squeezy (Global Stripe)' : 'Midtrans (Local QRIS/VA)'}! Status akun Anda telah ditingkatkan.⁠);
} catch (error) {
console.error("Checkout Error:", error);
alert("Gagal memproses pembayaran. Silakan coba beberapa saat lagi.");
} finally {
setPaymentLoading(false);
}
};
return (
<div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white relative">
<nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
<div className="flex items-center space-x-2">
<div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
<Zap size={18} />
</div>
<span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
ClipPost<span className="text-xs text-indigo-400 font-normal ml-1">.io</span>
</span>
</div>
<div className="flex items-center space-x-4">
<div className="hidden sm:flex space-x-1">
<button
onClick={() => setActiveTab('tool')}
className={⁠px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === 'tool' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}⁠}
>
Aplikasi
</button>
<button
onClick={() => setActiveTab('strategy')}
className={⁠px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === 'strategy' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}⁠}
>
Strategi
</button>
</div>
{isLoggedIn ? (
<div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 py-1.5 px-3 rounded-xl">
<div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
{user.name.charAt(0)}
</div>
<div className="text-left hidden md:block">
<p className="text-xs font-semibold text-slate-200">{user.name}</p>
<p className="text-[10px] text-indigo-400 capitalize font-medium">{user.plan} Plan ({user.plan === 'free' ? ⁠${user.generationsLeft} kuota sisa⁠ : 'Unlimited'})</p>
</div>
{user.plan === 'free' && (
<button
onClick={() => setShowPaywall(true)}
className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-[10px] px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow"
>
<Crown size={12} />
<span>Upgrade</span>
</button>
)}
</div>
) : (
<button
onClick={() => setIsLoggedIn(true)}
className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
>
Masuk / Login
</button>
)}
</div>
</nav>
<main className="max-w-4xl mx-auto px-6 py-12">
{activeTab === 'tool' ? (
<div className="space-y-10 animate-fade-in">
<div className="text-center space-y-4">
<div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
<Sparkles size={14} />
<span>Powered by Gemini 3 Flash AI</span>
</div>
<h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
Ubah 1 Teks Jadi <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Multi Konten</span> Instan
</h1>
<p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
Hemat waktu riset berjam-jam dengan ClipPost. Paste artikel atau transkrip Anda, biarkan AI meraciknya menjadi Thread Twitter & Postingan LinkedIn profesional dalam hitungan detik.
</p>
</div>
<div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
<div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
<div className="flex items-center justify-between mb-2">
<label className="block text-sm font-semibold text-slate-300">
Masukkan Artikel / Catatan / Transkrip Anda:
</label>
<span className="text-xs text-indigo-400 font-medium">
{user.plan === 'free' ? ⁠Sisa Kuota: ${user.generationsLeft}x⁠ : 'Status: Unlimited Pro'}
</span>
</div>
<textarea
rows={6}
className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition"
placeholder="Contoh: Hari ini saya belajar bahwa konsistensi dalam membangun produk digital didasarkan pada penyelesaian masalah nyata..."
value={inputText}
onChange={(e) => setInputText(e.target.value)}
/>
<div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
<div className="flex items-center space-x-2 text-xs text-slate-400">
<ShieldCheck size={16} className="text-emerald-400" />
<span>Optimized for high engagement</span>
</div>
<button
onClick={handleGenerate}
disabled={loading || !inputText.trim()}
className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white font-semibold py-3 px-8 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2"
>
{loading ? (
<>
<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
<span>Meracik Konten AI...</span>
</>
) : (
<>
<Sparkles size={18} />
<span>Generate Konten</span>
</>
)}
</button>
</div>
</div>
{result && (
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
<div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
<div>
<div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
<div className="flex items-center space-x-2">
<div className="w-3 h-3 rounded-full bg-sky-400"></div>
<h3 className="font-bold text-slate-200">Twitter (X) Thread</h3>
</div>
<button
onClick={() => copyText(result.twitter, 'twitter')}
className="flex items-center space-x-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition"
>
{copiedTwitter ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
<span>{copiedTwitter ? 'Disalin!' : 'Copy'}</span>
</button>
</div>
<div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
{result.twitter}
</div>
</div>
<div className="mt-4 pt-3 border-t border-slate-800/50 flex justify-between items-center text-xs text-slate-500">
<span>Format: AI Thread</span>
<span className="text-indigo-400 font-medium">Ready to post</span>
</div>
</div>
<div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
<div>
<div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
<div className="flex items-center space-x-2">
<div className="w-3 h-3 rounded-full bg-blue-500"></div>
<h3 className="font-bold text-slate-200">LinkedIn Post</h3>
</div>
<button
onClick={() => copyText(result.linkedin, 'linkedin')}
className="flex items-center space-x-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition"
>
{copiedLinkedin ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
<span>{copiedLinkedin ? 'Disalin!' : 'Copy'}</span>
</button>
</div>
<div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
{result.linkedin}
</div>
</div>
<div className="mt-4 pt-3 border-t border-slate-800/50 flex justify-between items-center text-xs text-slate-500">
<span>Format: Professional Story</span>
<span className="text-indigo-400 font-medium">Ready to post</span>
</div>
</div>
</div>
)}
</div>
) : (
<div className="space-y-8 animate-fade-in">
<div className="space-y-3">
<h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
Roadmap Eksekusi & Integrasi Pembayaran
</h2>
<p className="text-slate-400 text-sm sm:text-base">
Cetak biru langkah demi langkah untuk menghubungkan gateway pembayaran asli (Lemon Squeezy & Midtrans) ke aplikasi ClipPost.
</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
<div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">1</div>
<h3 className="font-bold text-lg text-slate-200">Global (Lemon Squeezy)</h3>
<p className="text-xs text-slate-400 leading-relaxed">
Menangani pembayaran internasional, pajak otomatis, dan mata uang USD ($15/bulan) tanpa repot setup pajak negara lain.
</p>
</div>
<div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
<div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">2</div>
<h3 className="font-bold text-lg text-slate-200">Lokal (Midtrans/Xendit)</h3>
<p className="text-xs text-slate-400 leading-relaxed">
Menyediakan metode pembayaran QRIS, Virtual Account, dan E-Wallet untuk pasar Indonesia (Rp149rb sekali bayar).
</p>
</div>
<div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
<div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">3</div>
<h3 className="font-bold text-lg text-slate-200">Webhook Automation</h3>
<p className="text-xs text-slate-400 leading-relaxed">
Backend otomatis menerima notifikasi saat pembayaran sukses dan memperbarui status database pengguna menjadi Pro.
</p>
</div>
</div>
<div className="bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/20 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
<div className="space-y-1 text-center sm:text-left">
<h4 className="font-bold text-indigo-300">Siap luncurkan produk dengan sistem pembayaran aktif?</h4>
<p className="text-xs text-slate-400">Tekan tombol di sebelah untuk kembali menguji coba aplikasinya.</p>
</div>
<button
onClick={() => setActiveTab('tool')}
className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition shadow-md shadow-indigo-600/30 flex items-center space-x-2"
>
<span>Buka Aplikasi</span>
<ArrowRight size={16} />
</button>
</div>
</div>
)}
</main>
{showPaywall && (
<div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
<div className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6">
<div className="text-center space-y-2">
<div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl mx-auto flex items-center justify-center font-bold">
<Crown size={24} />
</div>
<h3 className="text-xl font-black text-slate-100">Kuota Gratis Habis!</h3>
<p className="text-xs text-slate-400">
Pilih metode pembayaran global atau lokal di bawah untuk mengaktifkan akses generate tanpa batas.
</p>
</div>
<div className="space-y-3">
<div
onClick={() => handleRealCheckout('pro')}
className="bg-slate-950 border-2 border-indigo-500/50 hover:border-indigo-500 p-4 rounded-2xl cursor-pointer transition flex items-center justify-between group"
>
<div className="space-y-0.5">
<div className="flex items-center space-x-2">
<span className="font-bold text-sm text-slate-200">ClipPost Pro (Global)</span>
<span className="bg-indigo-500/20 text-indigo-400 text-[10px] px-2 py-0.5 rounded-full font-semibold">Lemon Squeezy</span>
</div>
<p className="text-xs text-slate-400">Unlimited generate bulanan</p>
</div>
<div className="text-right flex items-center space-x-2">
<div>
<span className="font-black text-indigo-400 text-base">$15</span>
<span className="text-xs text-slate-500">/bln</span>
</div>
<ExternalLink size={14} className="text-slate-500 group-hover:text-indigo-400" />
</div>
</div>
<div
onClick={() => handleRealCheckout('lifetime')}
className="bg-slate-950 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl cursor-pointer transition flex items-center justify-between group"
>
<div className="space-y-0.5">
<div className="flex items-center space-x-2">
<span className="font-bold text-sm text-slate-200">Lifetime Deal (IDR)</span>
<span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-semibold">Midtrans QRIS</span>
</div>
<p className="text-xs text-slate-400">Bayar sekali untuk selamanya</p>
</div>
<div className="text-right flex items-center space-x-2">
<span className="font-black text-emerald-400 text-sm">Rp149rb</span>
<ExternalLink size={14} className="text-slate-500 group-hover:text-emerald-400" />
</div>
</div>
</div>
{paymentLoading && (
<div className="text-center text-xs text-indigo-400 animate-pulse font-medium">
Menghubungkan ke Secure Gateway...
</div>
)}
<div className="flex space-x-3">
<button
onClick={() => setShowPaywall(false)}
disabled={paymentLoading}
className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-3 rounded-xl transition"
>
Nanti Saja
</button>
</div>
</div>
</div>
)}
<footer className="border-t border-slate-900 mt-20 py-8 text-center text-xs text-slate-600">
<p>© 2026 ClipPost.io. Built with Next.js & React for High-Revenue Micro-SaaS.</p>
</footer>
</div>
);
}
