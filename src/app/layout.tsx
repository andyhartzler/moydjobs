import type { Metadata } from "next";
import Image from "next/image";
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
    images: [
      {
        url: "/social-share-image.png",
        width: 1200,
        height: 630,
        alt: "Missouri Young Democrats Jobs",
      },
    ],
    type: "website",
    siteName: "Missouri Young Democrats",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jobs - Missouri Young Democrats",
    description: "Job and volunteer opportunities for Missouri Young Democrats members",
    images: ["/social-share-image.png"],
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
            backgroundImage: "url(/Blue-Gradient-Background.png)",
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
            {/* Social Media Icons */}
            <div className="flex justify-center items-center space-x-3 md:space-x-6 mb-8">
              <a href="https://www.instagram.com/moyoungdemocrats/#" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Image src="/icons/icons8-instagram-100.png" alt="Instagram" width={32} height={32} />
              </a>
              <a href="https://www.facebook.com/MOyoungdemocrats" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Image src="/icons/icons8-facebook-100.png" alt="Facebook" width={32} height={32} />
              </a>
              <a href="https://www.threads.com/@moyoungdemocrats" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Image src="/icons/new-Threads-app-icon-white-png-small-size.png" alt="Threads" width={32} height={32} />
              </a>
              <a href="https://x.com/moyoungdems" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Image src="/icons/icons8-x-100.png" alt="X (Twitter)" width={32} height={32} />
              </a>
              <a href="https://bsky.app/profile/moyoungdemocrats.bsky.social" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Image src="/icons/icons8-bluesky-100.png" alt="Bluesky" width={32} height={32} />
              </a>
              <a href="https://www.tiktok.com/@moyoungdemocrats" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Image src="/icons/tiktok-100.png" alt="TikTok" width={32} height={32} />
              </a>
              <a href="https://www.reddit.com/user/moyoungdemocrats/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Image src="/icons/icons8-reddit-240.png" alt="Reddit" width={32} height={32} />
              </a>
              <a href="https://www.youtube.com/@MOYoungDemocrats" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Image src="/icons/icons8-youtube-250.png" alt="YouTube" width={32} height={32} />
              </a>
              <a href="mailto:info@moyoungdemocrats.org" className="hover:opacity-80 transition-opacity">
                <Image src="/icons/icons8-email-100 copy.png" alt="Email" width={32} height={32} />
              </a>
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

          {/* Paid For Banner */}
          <a
            href="https://secure.actblue.com/donate/moyd"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center py-8"
          >
            <Image
              src="/paid-for-banner.png"
              alt="Paid for by Missouri Young Democrats"
              width={400}
              height={100}
              className="max-w-full h-auto hover:opacity-80 transition-opacity cursor-pointer"
            />
          </a>
        </footer>
      </body>
    </html>
  );
}
