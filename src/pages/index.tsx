import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { StatisticCard } from "../components/StatisticCard";
import { InformationCard } from "../components/InformationCard";
import { FaFire, FaHeart, FaRunning } from "react-icons/fa";
import { BsHeartFill, BsPerson, BsPersonFill } from "react-icons/bs";
import { HiInformationCircle } from "react-icons/hi";

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Rommel's Weight Summary</title>
        <meta
          name="description"
          content="Take a peek at Rommel's weight loss progress."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center  bg-gray-200">
        <div className="container flex max-w-4xl flex-col justify-center gap-4 px-4 py-6">
          <div>
            <h1 className=" text-5xl font-bold text-black">Summary</h1>
            <h2>Last updated 12:25 pm</h2>
          </div>
          <InformationCard
            IconComponent={HiInformationCircle}
            title="Information"
            titleColor="text-blue-600"
            bodyText="This page automatically updates whenever I weigh myself or exercises. The plan is to reach a healthy weight."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
            <StatisticCard
              IconComponent={BsPersonFill}
              title="Weight"
              titleColor="text-purple-600"
              statistic={{
                value: "220.90",
                unit: "lbs",
                description: "(-78.23 lbs)",
              }}
            />
            <StatisticCard
              IconComponent={FaRunning}
              title="Running"
              titleColor="text-green-600"
              statistic={{
                value: "3.12",
                unit: "MI",
                description: "Yesterday",
              }}
            />
            <StatisticCard
              IconComponent={BsPersonFill}
              title="Body Mass Index"
              titleColor="text-purple-600"
              statistic={{
                value: "30.93",
                unit: "BMI",
                description: "Obese",
              }}
            />
            <StatisticCard
              IconComponent={BsHeartFill}
              title="Cardio Fitness"
              titleColor="text-red-600"
              statistic={{
                value: "33.6",
                unit: "VO2 max",
                description: "Low",
              }}
            />
            <StatisticCard
              IconComponent={FaFire}
              title="Cardio Fitness"
              titleColor="text-orange-600"
              statistic={{
                value: "13,196",
                unit: "Steps",
                description: "Yesterday",
              }}
            />
            <StatisticCard
              IconComponent={FaFire}
              title="Workouts"
              titleColor="text-orange-600"
              statistic={{
                value: "56",
                unit: "Min",
                description: "Yesterday",
              }}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
