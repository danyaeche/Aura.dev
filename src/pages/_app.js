import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/Layout";
import { SessionProvider } from "next-auth/react";
import { AssetProvider } from "@/context/AssetContext";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <AssetProvider>
        <Layout>
          <Component {...pageProps} />
          <Toaster />
        </Layout>
      </AssetProvider>
    </SessionProvider>
  );
}