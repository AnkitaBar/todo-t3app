import type { AppProps } from "next/app";
import { trpc } from "../../utils/trpc";
import { SessionProvider } from "next-auth/react";
import Wrapper from "../../layout/wrapper/wrapper";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Wrapper>
        <Component {...pageProps} />
      </Wrapper>
          </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
