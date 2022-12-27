import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from 'next/router'
import { signIn, signOut, useSession } from "next-auth/react";
import Header from "../../components/Header";
import { Summary } from "../../components/Summary";

const Home: NextPage = () => {
  const session = useSession();
  const router = useRouter()
  const { userId } = router.query

  return (
    <>
      <Head>
        <title>Health Summary</title>
        <meta name="description" content="Take a look at my health summary" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header
          status={session.status}
          session={session.data}
          handleSignIn={() => signIn("discord")}
          handleSignOut={() => signOut()}
        />
        <div className="flex min-h-screen flex-col items-center bg-gray-200">
          {
            userId && <Summary
              uid={userId as string}
            />
          }
        </div>
      </main>
    </>
  );
};

export default Home;