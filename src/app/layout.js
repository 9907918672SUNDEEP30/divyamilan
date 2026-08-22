import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DivyaMilan - Find Your Perfect Match",
  description:
    "DivyaMilan - The premier matrimonial platform. Find your perfect life partner.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DivyaMilan",
  },
};

export const viewport = {
  themeColor: "#e11d48",
};


export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="apple-touch-icon" href="/icon/icon-192x192.png" />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-rose-50/30">
        <ServiceWorkerRegister />
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="bg-white border-t border-rose-100 py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
              <p>© {new Date().getFullYear()} DivyaMilan. All rights reserved.</p>
              <p className="mt-1">A platform to find your perfect life partner.</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
