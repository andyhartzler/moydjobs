import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Jobs - Missouri Young Democrats",
  description: "Job and volunteer opportunities for Missouri Young Democrats members",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Jobs - Missouri Young Democrats",
    description: "Job and volunteer opportunities for Missouri Young Democrats members",
    type: "website",
    siteName: "Missouri Young Democrats",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#273351" }}>
        {/* Background */}
        <div
          className="fixed inset-0 z-0"
          style={{
            backgroundColor: "#273351",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
        />

        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="min-h-screen relative z-10">{children}</main>

        {/* Footer */}
        <footer className="relative z-10" style={{ backgroundColor: "#273351" }}>
          <div className="container-custom py-12">
            <div className="text-center">
              <p className="text-gray-400">
                © {new Date().getFullYear()} Missouri Young Democrats. All rights reserved.
              </p>
              <div className="mt-4 flex justify-center space-x-6">
                <a href="https://moyoungdemocrats.org" className="text-gray-400 hover:text-white transition-colors">
                  Main Website
                </a>
                <a href="https://members.moyoungdemocrats.org" className="text-gray-400 hover:text-white transition-colors">
                  Member Portal
                </a>
                <a href="https://events.moyoungdemocrats.org" className="text-gray-400 hover:text-white transition-colors">
                  Events
                </a>
              </div>
            </div>
          </div>

          {/* Moving Donation Banner */}
          <a
            href="https://secure.actblue.com/donate/moyd"
            target="_blank"
            rel="noopener noreferrer"
            className="scrolling-banner block overflow-hidden py-4 relative"
            style={{ background: "linear-gradient(90deg, #5B9FBD 0%, #273351 100%)" }}
          >
            <div className="marquee-container">
              <div className="marquee-content">
                <span className="marquee-text">YOUR SUPPORT MAKES EVERYTHING POSSIBLE — DONATE TODAY — </span>
                <span className="marquee-text">YOUR SUPPORT MAKES EVERYTHING POSSIBLE — DONATE TODAY — </span>
                <span className="marquee-text">YOUR SUPPORT MAKES EVERYTHING POSSIBLE — DONATE TODAY — </span>
                <span className="marquee-text">YOUR SUPPORT MAKES EVERYTHING POSSIBLE — DONATE TODAY — </span>
              </div>
            </div>
          </a>
        </footer>
      </body>
    </html>
  );
}
