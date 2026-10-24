export const metadata = {
  title: 'ClipPost.io - AI Content Repurposer',
  description: 'Transform any article into high-engagement Twitter threads and LinkedIn posts instantly.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  )
}
