import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { InformationCard } from "../components/card/InformationCard";
import { HiInformationCircle } from "react-icons/hi";
import { Card, CardHeader } from "../components/card/Card";
import { AiFillApi, AiFillInfoCircle } from "react-icons/ai";
import Header from "../components/header/Header";

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
            <Card>
              <CardHeader title="API Documentation" IconComponent={AiFillInfoCircle} titleColor={'text-blue-600'} />
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">What does this API accomplish?</h3>
                  <p className="text-gray-500">
                    Use this API to modify your profile information, such as your weight, workouts, and more. For instance, you may want to use this API to automatically update your weight via a smart scale or to update the number of workout minutes after exercising
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
                    Authorization: abcde-fghijklmno-pqrstuvwxyz
                  </code>
                </p>
              </div>
            </Card>
            <Card>
              <CardHeader title="Update Weight" IconComponent={AiFillApi} titleColor={'text-blue-600'} />
              <h4 className="text-lg font-semibold">POST /api/profile/weight</h4>
              <p className="text-gray-500 mb-2">
                This endpoint allows you to add a weight entry to the user's profile. The endpoint requires a valid Authorization header with a valid API key.
              </p>
              <div>
                <h2 className="text-md font-semibold">Request</h2>
                <p className="text-gray-500 bg-gray-100 rounded-lg px-4 mb-2">
                  <code style={{ whiteSpace: 'pre' }}>
                    {`
POST /api/profile/weight
Authorization: <key>
Content-Type: application/json

{
    "weight": NUMBER,
    "date": TIMESTAMP
}
`}
                  </code>
                </p>
              </div>
              <div className="mb-2">
                <h2 className="text-md font-semibold">Parameters</h2>
                <p className="text-gray-500">
                  <code>weight</code> - The weight in pounds <br />
                  <code>date</code> - The date of the weight entry. This is optional and defaults to the current date.
                </p>
              </div>
              <div>
                <h2 className="text-md font-semibold">Note</h2>
                <p className="text-gray-500">
                  If the user has already provided the height information, adding weight will also update the user's BMI accordingly. If height information is not present, the weight will still be added to the profile but BMI will not be updated.
                </p>
              </div>
            </Card>
            <Card>
              <CardHeader title="Update Step Count" IconComponent={AiFillApi} titleColor={'text-blue-600'} />
              <h4 className="text-lg font-semibold">POST /api/profile/stepCount</h4>
              <p className="text-gray-500 mb-2">
                This endpoint allows you to add a step count entry to the user's profile. The endpoint requires a valid Authorization header with a valid API key.
              </p>
              <div>
                <h2 className="text-md font-semibold">Request</h2>
                <p className="text-gray-500 bg-gray-100 rounded-lg px-4 mb-2">
                  <code style={{ whiteSpace: 'pre' }}>
                    {`
POST /api/profile/stepCount
Authorization: <key>
Content-Type: application/json

{
    "steps": NUMBER,
    "date": TIMESTAMP
}

`}
                  </code>
                </p>
              </div>
              <div>
                <h2 className="text-md font-semibold">Parameters</h2>
                <p className="text-gray-500">
                  <code>steps</code> - The number of steps taken <br />
                  <code>date</code> - The date of the step count entry. This is optional and defaults to the current date.
                </p>
              </div>
            </Card>
            <Card>
              <CardHeader title="Add Workout Minutes" IconComponent={AiFillApi} titleColor={'text-blue-600'} />
              <h4 className="text-lg font-semibold">POST /api/profile/workoutMinutes</h4>
              <p className="text-gray-500 mb-2">
                This endpoint allows you to add a workout minutes entry to the user's profile. The endpoint requires a valid Authorization header with a valid API key.
              </p>
              <div>
                <h2 className="text-md font-semibold">Request</h2>
                <p className="text-gray-500 bg-gray-100 rounded-lg px-4 mb-2">
                  <code style={{ whiteSpace: 'pre' }}>
                    {`
POST /api/profile/workoutMinutes
Authorization: <key>
Content-Type: application/json

{
    "minutes": NUMBER,
    "date": TIMESTAMP
}
`}
                  </code>
                </p>
              </div>
              <div>
                <h2 className="text-md font-semibold">Parameters</h2>
                <p className="text-gray-500">
                  <code>minutes</code> - The number of minutes for workout <br />
                  <code>date</code> - The date of the workout minutes entry. This is optional and defaults to the current date.
                </p>
              </div>
            </Card>
            <Card>
              <CardHeader title="Update Running Session" IconComponent={AiFillApi} titleColor={'text-blue-600'} />
              <h4 className="text-lg font-semibold">POST /api/profile/runningSession</h4>
              <p className="text-gray-500 mb-2">
                This endpoint allows you to add a running session entry to the user's profile. The endpoint requires a valid Authorization header with a valid API key.
              </p>
              <div>
                <h2 className="text-md font-semibold">Request</h2>
                <p className="text-gray-500 bg-gray-100 rounded-lg px-4 mb-2">
                  <code style={{ whiteSpace: 'pre' }}>
                    {`
POST /api/profile/runningSession
Authorization: <key>
Content-Type: application/json

{
    "distance": NUMBER,
    "duration": NUMBER,
    "date": TIMESTAMP
}
`}
                  </code>
                </p>
              </div>
              <div>
                <h2 className="text-md font-semibold">Parameters</h2>
                <p className="text-gray-500">
                  <code>distance</code> - The distance in kilometers <br />
                  <code>duration</code> - The duration of the running session in minutes <br />
                  <code>date</code> - The date of the running session. This is optional and defaults to the current date.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main >
    </>
  );
};

export default Home;