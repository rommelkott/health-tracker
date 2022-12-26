import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from 'next/router'
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import { StatisticCard } from "../../components/StatisticCard";
import { InformationCard } from "../../components/InformationCard";
import { FaFire, FaHeart, FaRunning, FaDiscord } from "react-icons/fa";
import { BsHeartFill, BsPerson, BsPersonFill } from "react-icons/bs";
import { HiInformationCircle } from "react-icons/hi";
import { SiZeromq } from "react-icons/si";
import { ProfileButton } from "../../components/ProfileButton";

const Home: NextPage = () => {
  const session = useSession();

  // Get the user id from the URL
  const router = useRouter()
  const { userId } = router.query

  // Fetch the user data from the database
  const { status, data: profile, error } = trpc.profile.getProfile.useQuery({ userId: userId as string },
    {
      enabled: !!userId,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      retry: false,
    });

  if (status === 'loading') {
    return <div>
      <div className="flex justify-center items-center h-screen bg-gray-200">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  }

  if (status === 'error') {
    return <div>
      <div className="flex flex-col justify-center items-center h-screen bg-gray-200">
        <h1 className="text-6xl font-bold text-red-600 mb-2">Error</h1>
        <h3 className="text-2xl">
          {error.message}
        </h3>
      </div>
    </div>
  }

  return (
    <>
      <Head>
        <title>Health Summary</title>
        <meta name="description" content="Take a look at my health summary" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center  bg-gray-200">
        <div className="container flex max-w-4xl flex-col justify-center gap-4 px-4 py-6">
          <div className="inline-flex items-center justify-between">
            <div>
              <h1 className=" text-5xl font-bold text-black">Summary</h1>
              <h2>Last updated 12:25 pm</h2>
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
            title="Information"
            titleColor="text-blue-600"
            bodyText={profile?.description || "No information provided."}
          />
          {
            !profile?.weight && !profile?.bmi && !profile?.runningDistance && !profile?.steps && !profile?.cardioFitness && !profile?.runningDistance && !profile?.steps && !profile?.workoutMinutes && (
              <InformationCard
                IconComponent={SiZeromq}
                title="No Available Statistics"
                titleColor="text-red-600"
                bodyText="This user has not provided any statistics."
              />
            )
          }

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {profile?.weight && profile?.startWeight && (
              <StatisticCard
                IconComponent={BsPersonFill}
                title="Weight"
                titleColor="text-purple-600"
                statistic={{
                  value: profile.weight.toString(),
                  unit: "lbs",
                  description: "(" + (profile.weight - profile.startWeight).toFixed(2).toString() + " lbs)",
                }}
              />
            )}
            {profile?.runningDistance && profile.runningTimestamp && (
              <StatisticCard
                IconComponent={FaRunning}
                title="Running"
                titleColor="text-green-600"
                statistic={{
                  value: profile.runningDistance.toString(),
                  unit: "MI",
                  description: formatDate(profile.runningTimestamp),
                }}
              />
            )}
            {profile?.bmi && (
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
            )}
            {
              profile?.cardioFitness && profile?.age && (
                <StatisticCard
                  IconComponent={BsHeartFill}
                  title="Cardio Fitness"
                  titleColor="text-red-600"
                  statistic={{
                    value: profile.cardioFitness.toString(),
                    unit: "VO2 max",
                    description: getVO2MaxCategory(profile.cardioFitness, profile.age)
                  }}
                />
              )}
            {
              profile?.steps && profile?.stepsTimestamp && (
                <StatisticCard
                  IconComponent={FaFire}
                  title="Daily Steps"
                  titleColor="text-orange-600"
                  statistic={{
                    value: profile.steps.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    unit: "Steps",
                    description: formatDate(profile.stepsTimestamp),
                  }}
                />
              )
            }
            {
              profile?.workoutMinutes && profile?.workoutTimestamp && (
                <StatisticCard
                  IconComponent={FaFire}
                  title="Workouts"
                  titleColor="text-orange-600"
                  statistic={{
                    value: profile.workoutMinutes.toString(),
                    unit: "Min",
                    description: formatDate(profile.workoutTimestamp),
                  }}
                />
              )}
          </div>
        </div>
      </main>
    </>
  );
};

function getVO2MaxCategory(vo2Max: number, age: number): string {
  // Reference values for VO2 max by age from the American Council on Exercise
  // https://www.acefitness.org/education-and-resources/lifestyle/blog/5986/the-complete-guide-to-vo2-max/function getCardioFitnessDescription(cardioFitness: number, age: number): string {

  const referenceValues = [
    { age: 20, low: 31, belowAverage: 35, aboveAverage: 41, high: 50 },
    { age: 30, low: 27, belowAverage: 31, aboveAverage: 36, high: 45 },
    { age: 40, low: 23, belowAverage: 27, aboveAverage: 32, high: 41 },
    { age: 50, low: 20, belowAverage: 24, aboveAverage: 29, high: 37 },
    { age: 60, low: 17, belowAverage: 21, aboveAverage: 26, high: 34 },
    { age: 70, low: 15, belowAverage: 18, aboveAverage: 23, high: 31 },
  ];

  if (age < 20) {
    return "Not applicable for ages under 20";
  }

  // get the correct reference values for the age
  const referenceValue = referenceValues.find((value) => age - value.age < 10) || referenceValues[referenceValues.length - 1];

  if (!referenceValue) {
    return "Unable to determine VO2 max category"
  }

  if (vo2Max < referenceValue.low) {
    return "Low";
  }
  if (vo2Max < referenceValue.belowAverage) {
    return "Below Average";
  }
  if (vo2Max < referenceValue.aboveAverage) {
    return "Above Average";
  }

  return "High";
}

function formatDate(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);

  if (date.getDate() === today.getDate()) {
    return "Today at " + date.toLocaleTimeString();
  } else if (date.getDate() === yesterday.getDate()) {
    return "Yesterday at " + date.toLocaleTimeString();
  } else {
    const daysAgo = Math.round((today.getTime() - date.getTime()) / 86400000);
    return daysAgo + " days ago at " + date.toLocaleTimeString();
  }
}

export default Home;