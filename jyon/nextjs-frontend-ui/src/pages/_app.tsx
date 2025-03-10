/* eslint-disable @next/next/no-css-tags */
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme } from "@/themes/index";
import { darkTheme } from "@/themes/index"
import { AuthProvider } from "@/context/AuthContext";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "react-query";
import { useEffect, useState } from "react";
import Head from "next/head";
import CommunityContextProvider from "@/context/CommunityContext";
import { isNewUser, setIsNewUser } from "src/util/setNewUserFlag";
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
  console.log(router.pathname);

  useEffect(() => {
    setDomLoaded(true);
    //if user is new then redirect to marketing page

	/* 
	Ikjun: The new user boolean variable is always set to false,
	so you will always be redirected to the marketing page, even if you are not a new user.
	Marketing page: 
	"https://about.itsourvoice.com";
	Which gives the illusion that you are always being redirected to the main home page.
	So if you set yourself to a new user using setIsNewUser(), you will be able to bypass it.
	*/
	setIsNewUser();
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

  //Changing the theme={darkTheme} will change it to dark (in development)
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
