import type { Metadata } from "next";
import "../styles/index.css";
import "leaflet/dist/leaflet.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import { jsonLd, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Platohedro",
  description: "Arte, tecnología y educación para la transformación personal, social y ambiental.",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.ico" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: siteUrl,
    siteName: "Platohedro",
    title: "Platohedro | Arte, tecnología y educación",
    description: "Arte, tecnología y educación para la transformación personal, social y ambiental.",
    images: [{ url: "/logos/ph.png", alt: "Platohedro" }],
  },
  twitter: { card: "summary_large_image", title: "Platohedro | Arte, tecnología y educación", description: "Arte, tecnología y educación para la transformación personal, social y ambiental.", images: ["/logos/ph.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organization = { "@context": "https://schema.org", "@type": "Organization", name: "Platohedro", url: siteUrl, logo: `${siteUrl}/logos/ph.png`, description: "Arte, tecnología y educación para la transformación personal, social y ambiental." };
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(organization) }} />
        <Providers>{children}</Providers>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
