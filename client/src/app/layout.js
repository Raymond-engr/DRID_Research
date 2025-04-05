import "./globals.css";

export const metadata = {
  title: "DRID Research Management",
  description: "A research management API for DRID",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
