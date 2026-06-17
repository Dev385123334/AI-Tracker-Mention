import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "next-themes"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: { default: "AI Visibility Tracker", template: "%s | AI Visibility Tracker" },
  description: "Track your brand visibility across AI search engines — monitor how ChatGPT, Gemini, and Perplexity mention your brand",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "AI Visibility Tracker",
    description: "Track your brand visibility across AI search engines",
    type: "website",
    siteName: "AI Visibility Tracker",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Visibility Tracker",
    description: "Track your brand visibility across AI search engines",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
