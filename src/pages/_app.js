import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/Layout";
import { SessionProvider } from "next-auth/react";
import { AssetProvider } from "@/context/AssetContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <AssetProvider>
          <Layout>
            <Component {...pageProps} />
            <Toaster />
          </Layout>
        </AssetProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}