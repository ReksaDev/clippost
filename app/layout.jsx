import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "Global Consult | Clarity for Your Next Move",
  description: "Independent consulting for business strategy, digital transformation, and growth.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}<SpeedInsights /></body>
    </html>
  );
}
