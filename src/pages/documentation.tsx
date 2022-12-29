import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { InformationCard } from "../components/InformationCard";
import { HiInformationCircle } from "react-icons/hi";
import { Card, CardHeader } from "../components/Card";
import { AiFillApi } from "react-icons/ai";
import Header from "../components/Header";

const Home: NextPage = () => {
  const session = useSession();
  return (
    <>
      <Head>
        <title>Documentation</title>
        <meta name="description" content="Take a look at my health summary" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header
          session={session.data}
          status={session.status}
          handleSignIn={() => signIn("discord")}
          handleSignOut={() => signOut()}
        />
        <div className="flex min-h-screen flex-col items-center  bg-gray-200">
          <div className="container flex max-w-4xl flex-col justify-center gap-4 px-4 py-6">
            <div className="inline-flex items-center justify-between">
              <h1 className="mb-2 text-5xl font-bold text-black">Documentation</h1>
            </div>
            <InformationCard
              IconComponent={HiInformationCircle}
              title="This page is under development"
              titleColor="text-orange-600"
              bodyText="Note that this page is still under development. Some features may not work as intended."
            />

            <Card>
              <CardHeader title="API Documentation" IconComponent={AiFillApi} titleColor={'text-blue-600'} />
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">What does this API accomplish?</h3>
                  <p className="text-gray-500">
                    Use this API to modify your profile information, such as your description, weight, height, and more. For instance, you may want to use this API to automatically update your weight via a smart scale or to update the number of workout minutes after exercising
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">API secret</h3>
                  <p className="text-gray-500">
                    To generate a new API secret, go to the <a href="/settings" className="text-blue-600">settings page</a> and click the 'generate api' button. Please note that this will invalidate any previously generated API secret.
                  </p>
                </div>
                <p className="text-gray-500">
                  Make sure to include your API secret in the Authorization header of your request.
                </p>
                <p className="text-gray-500 bg-gray-100 rounded-lg px-4 mb-2">
                  <code className="break-words">
                    Authorization: m06sasd-not-a-real-key-j8heqlei8
                  </code>
                </p>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">Update Health Summary</h3>
                  <h4 className="text-md font-mono">POST /api/profile</h4>
                  <p className="text-gray-500">
                    To update your profile information, pass a request body in the following format to the endpoint. You can omit any fields that you don't want to modify.
                  </p>
                  <p className="text-gray-500 bg-gray-100 rounded-lg px-4">

                    <code style={{ whiteSpace: 'pre' }}>
                      {`{
  "profile": {
    "description": "string",
    "weight": 0,
    "weightStart": 0,
    "age": 0,
    "bmi": 0,
    "cardioFitness" : 0,
    "runningFitness" : 0,
    "steps" : 0,
    "workoutMinutes" : 0,
  }
}
`}
                    </code>
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main >
    </>
  );
};

export default Home;