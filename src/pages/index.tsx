import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { StatisticCard } from "../components/StatisticCard";
import { InformationCard } from "../components/InformationCard";
import { FaFire, FaHeart, FaRunning, FaDiscord } from "react-icons/fa";
import { BsHeartFill, BsPerson, BsPersonFill } from "react-icons/bs";
import { HiInformationCircle } from "react-icons/hi";
import { ProfileButton } from "../components/ProfileButton";
import { Header } from "../components/Header";

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
              <h2 className="text-2xl mb-6 px-12 2xl:px-0">
                A simple way to share your health and fitness goals with your friends.
              </h2>
              <button className="border-y bg-indigo-600 text-white px-4 py-2 rounded-lg mt-4 font-semibold">
                <a onClick={() => signIn('discord')}>
                  Sign in with Discord
                </a>
              </button>
            </div>
          </div>
          <SampleProfile />
        </div>
        <div about="footer" className="bg-gray-900 p-6">
          <h2 className="text-gray-200">Just a fun project to get back into coding ~ <a className="font-bold" href="https://github.com/rommelkott">@rommelkott</a></h2>
        </div>
      </main>
    </>
  );
};

const SampleProfile = () => {
  return (
    <div about="My summary illustration">
      <div className="flex max-w-4xl flex-col justify-center gap-4 px-4 py-8">
        <div className="inline-flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold text-black mb-2">My Summary</h1>
            <h2>Last updated 12:25 pm</h2>
          </div>
          <div className="justify-items-end">
            <ProfileButton
              session={null}
              status={"authenticated"}
              handleSignIn={() => { }}
              handleSignOut={() => { }}
            />
          </div>
        </div>
        <InformationCard
          IconComponent={HiInformationCircle}
          title="Information"
          titleColor="text-blue-600"
          bodyText="I am currently working towards achieving a healthy weight through regular exercise and workouts. My goal is to reach a healthy weight through these efforts."
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
            title="Daily Steps"
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
    </div>
  );
}
export default Home;