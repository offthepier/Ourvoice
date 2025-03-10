/* eslint-disable @next/next/no-css-tags */
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme } from "@/themes/index";
import { AuthProvider } from "@/context/AuthContext";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "react-query";
import { useEffect, useState } from "react";
import Head from "next/head";
import CommunityContextProvider from "@/context/CommunityContext";
import { isNewUser } from "src/util/setNewUserFlag";
import { useRouter } from "next/router";
import { MARKETING_PAGE_URL } from "@/constants/MarketingPageData";
import { OurVoiceLoadingAnimation } from "../components";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true

      retry: true,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const [domLoaded, setDomLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setDomLoaded(true);
    //if user is new then redirect to marketing page
    if (router.pathname == "/" && !isNewUser()) {
      setIsLoading(true);
      window.location.href = MARKETING_PAGE_URL;
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //show loading screen while redirection take place
  if (isLoading) {
    return <OurVoiceLoadingAnimation />;
  }

  return (
    <>
      {domLoaded && (
        <CommunityContextProvider>
          <ThemeProvider theme={lightTheme}>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <Head>
                  <link rel="stylesheet" href="/fonts/Inter.css" />
                </Head>
                <CssBaseline />
                <Component {...pageProps} />
              </AuthProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </CommunityContextProvider>
      )}
    </>
  );
}

export default MyApp;
