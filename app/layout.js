import "./globals.css";

export const metadata = {
  title: "Dentiguide — MDR Documentation System",
  description: "EU MDR Annex XIII custom-made dental device documentation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">{children}</body>
    </html>
  );
}
