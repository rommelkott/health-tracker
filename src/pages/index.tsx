import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { Header } from "../components/header/Header";
import { Summary } from "../components/profile/Summary";
import { clientEnv } from "../env/schema.mjs";
import { BsDiscord } from "react-icons/bs";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  return (
    <>
      <Head>
        <title>Health Summary</title>
        <meta name="description" content="Take a look at my health summary" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header
          session={session}
          status={status}
          handleSignIn={() => signIn('discord')}
          handleSignOut={() => signOut()}
        />
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 items-center place-items-center bg-gray-200 min-h-screen">
          <div className="bg-gray-100 w-full h-full items-center grid">
            <div about="Main title" className="text-center 2xl:text-left p-0 2xl:p-12 my-24">
              <h1 className="text-5xl md:text-7xl mb-3 font-extrabold">
                Health Tracker
              </h1>
              <button className="border-y bg-indigo-600 text-white px-4 py-2 rounded-lg mt-4 font-semibold">
                <a onClick={() => signIn('discord')}>
                  <BsDiscord className="inline-block mr-2" />
                  <span>Sign in with Discord</span>
                </a>
              </button>
            </div>
          </div>
          <Summary
            uid={clientEnv.NEXT_PUBLIC_SHOWCASE_USER_ID || ''}
            demoMode={true}
          />
        </div>
        <div about="footer" className="bg-gray-900 p-6">
          <h2 className="text-gray-200">Just a fun project to get back into coding ~ <a className="font-bold" href="https://github.com/rommelkott">@rommelkott</a></h2>
        </div>
      </main>
    </>
  );
};

export default Home;