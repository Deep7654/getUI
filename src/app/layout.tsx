// import { dbConnects } from "@/lib/db";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Providers } from "./provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "My App",
  description: "Using MongoDB in Next.js",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // await dbConnects(); // ✅ Ensures DB is connected when app starts

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        >
          <Toaster/>
        <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
