import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { InformationCard } from "../components/InformationCard";
import { HiInformationCircle } from "react-icons/hi";
import { ProfileButton } from "../components/ProfileButton";
import { Card, CardHeader } from "../components/Card";
import { AiFillApi } from "react-icons/ai";
const Home: NextPage = () => {
  const session = useSession();

  const APIKey = trpc.user.generateAPIKey.useMutation({
    onError: (error) => {
      alert("Unable to generate API key: " + error.message);
    }
  });

  if (session.status === 'loading') {
    return <div>
      <div className="flex justify-center items-center h-screen bg-gray-200">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  }

  if (session.status === 'unauthenticated') {
    return <div>
      <div className="flex flex-col justify-center items-center h-screen bg-gray-200">
        <h1 className="text-6xl font-bold text-red-600 mb-2">Error</h1>
        <h3 className="text-2xl">
          You are not logged in.
        </h3>
      </div>
    </div>
  }

  return (
    <>
      <Head>
        <title>Settings</title>
        <meta name="description" content="Take a look at my health summary" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center  bg-gray-200">
        <div className="container flex max-w-4xl flex-col justify-center gap-4 px-4 py-6">
          <div className="inline-flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-5xl font-bold text-black">Account Settings</h1>
              <h2>Adjust your account and profile</h2>
            </div>
            <div className="justify-items-end">
              <ProfileButton
                session={session.data}
                status={session.status}
                handleSignIn={() => signIn("discord")}
                handleSignOut={() => signOut()}
              />
            </div>
          </div>
          <InformationCard
            IconComponent={HiInformationCircle}
            title="This page is under development"
            titleColor="text-orange-600"
            bodyText="We are currently working on this page. In the meantime, you can use our API to update your profile. To obtain an API key, click the button below."
          />

          <Card>
            <CardHeader title="Development API key" IconComponent={AiFillApi} />
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <h3 className="text-lg">This is your unique API key, which will only be shown to you once after it is generated. Keep it private and secure to protect your account</h3>
                <div className="flex flex-row gap-3 items-center mt-3">
                  <span className="text-lg font-semibold">Key</span>
                  <span className="select-all bg-gray-100 text-black font-mono font-bold py-2 px-2 rounded w-96"> {APIKey.data || 'my-example-key'} </span>
                </div>
                <div className="flex flex-row gap-3">
                  <button onClick={() => APIKey.mutate()} className="bg-blue-600 text-white font-bold py-2 px-4 rounded max-w-md:">Generate API Key</button>
                  <a href="/documentation" className=" border border-blue-600 text-blue-600 font-bold py-2 px-4 rounded max-w-md:">Developer Documentation</a>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
};

export default Home;