import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { HiInformationCircle } from "react-icons/hi";
import { Card, CardHeader } from "../components/card/Card";
import { AiFillApi } from "react-icons/ai";
import Header from "../components/header/Header";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
              <div>
                <h1 className="mb-1 text-5xl font-bold text-black">Settings</h1>
              </div>
            </div>
            {/* <InformationCard
              IconComponent={HiInformationCircle}
              title="Page is under development"
              titleColor="text-orange-600"
              bodyText="We are currently working on this page. In the meantime, you can use our API to update your profile."
            /> */}
            <EditBasicSummary />
            <Card>
              <CardHeader titleColor="text-blue-600" title="Development API key" IconComponent={AiFillApi} />
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg">This is your unique API key, which will only be shown to you once after it is generated. Keep it private and secure to protect your account</h3>
                  <div className=" gap-3 items-center mt-3">
                    <span className="text-lg font-semibold">Key</span>
                    <p className="select-all bg-gray-100 text-black font-mono font-bold py-2 px-2 rounded break-all"> {APIKey.data || 'my-example-key'} </p>
                  </div>
                  <div className="flex flex-row flex-wrap gap-3">
                    <button onClick={() => APIKey.mutate()} className="bg-blue-600 text-white font-bold py-2 px-4 rounded max-w-md:">Generate API Key</button>
                    <a href="/documentation" className=" border border-blue-600 text-blue-600 font-bold py-2 px-4 rounded max-w-md:">Documentation</a>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const EditBasicSummary = () => {
  const schema = z.object({
    height: z.number().min(0).max(300).optional(),
    birthday: z.date().optional(),
    description: z.string().max(1000).optional(),
  });

  let profile = trpc.profile.updateProfile.useMutation({
    onError: (error) => {
      alert("Unable to update profile: " + error.message);
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  function mutate(data: z.infer<typeof schema>) {
    // remove undefined keys from data
    data = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined)) as z.infer<typeof schema>;
    console.log(data)
    profile.mutate(data);
  }

  return (
    <Card>
      <CardHeader titleColor="text-blue-600" title="About you" IconComponent={HiInformationCircle} />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 mt-2">
          <form onSubmit={handleSubmit(d => mutate(d))}>
            <div className="grid gap-4">
              <div className="">
                <span className="text-lg block font-semibold">Bio</span>
                <span className="text-sm text-gray-500">A short description about yourself to display to others.</span>
                <textarea className="bg-gray-100 w-full text-black font-mono font-bold py-2 px-2 rounded"
                  {...register("description", { required: false, setValueAs: (value) => value === "" ? undefined : value })}
                />
              </div>
              <div>
                <span className="text-lg block font-semibold">Height</span>
                <span className="text-sm text-gray-500">This is private and won't be shown to others.</span>
                <select className="bg-gray-100 w-full text-black font-mono font-bold py-2 px-2 rounded"
                  defaultValue={0}
                  {...register("height", { required: false, setValueAs: (value) => value === "0" ? undefined : parseInt(value) })}
                >
                  <option value="0">Select a measurement</option>
                  {
                    [...Array(48).keys()].map((i) => {
                      if (i + 48 >= 48 && i + 48 <= 84) return <option key={i + 48} value={i + 48}>{Math.floor((i + 48) / 12)} ft {(i + 48) % 12} in</option>
                    })
                  }
                </select>
                {errors.height?.message && <p className="text-red-600">{errors.height?.message as string}</p>}
              </div>
              <div>
                <span className="text-lg block font-semibold">Date of birth</span>
                <span className="text-sm text-gray-500">This is private and won't be shown to others.</span>
                <input className="bg-gray-100 w-full text-black font-mono font-bold py-2 px-2 rounded"
                  type="date"
                  {...register("birthday", { required: false, setValueAs: (value) => value === "" ? undefined : new Date(value) })}
                  placeholder="Enter your date of birth" />
                {errors.birthday?.message && <p className="text-red-600">{errors.birthday?.message as string}</p>}
              </div>
            </div>
            <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4" type="submit">Update profile</button>
          </form>
        </div>
      </div >
    </Card >
  )
}