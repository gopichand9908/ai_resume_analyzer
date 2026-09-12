import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vanta | AI Interview Coach",
  description: "A focused interview studio for becoming unmistakably ready.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}