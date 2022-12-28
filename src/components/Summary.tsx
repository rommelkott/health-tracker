import React from "react";
import { InformationCard } from "./InformationCard";
import { StatisticCard } from "./StatisticCard";
import { HiInformationCircle } from "react-icons/hi";
import { BsHeartFill, BsPerson, BsPersonFill } from "react-icons/bs";
import { FaFire, FaHeart, FaRunning, FaDiscord } from "react-icons/fa";
import { SiZeromq } from "react-icons/si";
import { trpc } from "../utils/trpc";
import { Profile } from "@prisma/client";

interface SummaryProps {
    uid: string;
    // will show all cards while loading, skip spinner and error message
    demoMode?: boolean;
}

export const Summary: React.FC<SummaryProps> = ({ uid, demoMode = false }) => {
    const { status, data: profile, error } = trpc.profile.getProfile.useQuery({ userId: uid as string },
        {
            enabled: uid !== undefined,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchInterval: false,
            retry: false,
            initialData: () => {
                return undefined;
            }
        });

    if (status === 'loading' && !demoMode) {
        return <div>
            <div className="flex justify-center items-center h-screen bg-gray-200">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        </div>
    }

    if (status === 'error' && !demoMode) {
        return <div>
            <div className="flex flex-col gap-2 justify-center items-center h-screen bg-gray-200">
                <div className="text-5xl font-bold text-red-600">Error</div>
                <div className="text-2xl "> {error.message} </div>
            </div>
        </div>
    }

    return <>
        <div className="container flex max-w-4xl flex-col justify-center gap-4 px-4 py-6">
            <div className="inline-flex items-center justify-between">
                <div>
                    <h1 className=" text-5xl font-bold text-black">Summary</h1>
                    {/* <h2>{formatDate(profile.lastUpdated)}</h2> */}
                </div>
            </div>
            <InformationCard
                IconComponent={HiInformationCircle}
                title="Information"
                titleColor="text-blue-600"
                bodyText={profile?.description || undefined}
            />
            {
                !demoMode && !profile?.weight && !profile?.bmi && !profile?.runningDistance && !profile?.steps && !profile?.cardioFitness && !profile?.runningDistance && !profile?.steps && !profile?.workoutMinutes && (
                    <InformationCard
                        IconComponent={SiZeromq}
                        title="No Available Statistics"
                        titleColor="text-red-600"
                        bodyText="This user has not provided any statistics."
                    />
                )
            }

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <StatisticCard
                    hide={!demoMode && !profile?.weight && !profile?.startWeight}
                    IconComponent={BsPersonFill}
                    title="Weight"
                    titleColor="text-purple-600"
                    statistic={profile?.weight && profile?.startWeight ? {
                        value: profile.weight.toString(),
                        unit: "lbs",
                        description: "(" + (profile.weight - profile.startWeight).toFixed(2).toString() + " lbs)",
                    } : undefined}
                />
                <StatisticCard
                    hide={!demoMode && !profile?.runningDistance}
                    IconComponent={FaRunning}
                    title="Running"
                    titleColor="text-green-600"
                    statistic={profile?.runningDistance && profile?.runningTimestamp ? {
                        value: profile.runningDistance.toString(),
                        unit: "MI",
                        description: formatDate(profile.runningTimestamp),
                    } : undefined}
                />
                <StatisticCard
                    hide={!demoMode && !profile?.cardioFitness}
                    IconComponent={BsPersonFill}
                    title="Body Mass Index"
                    titleColor="text-purple-600"
                    statistic={profile?.bmi ? {
                        value: profile.bmi.toString(),
                        unit: "BMI",
                        description: getBMICategory(profile.bmi),
                    } : undefined}
                />
                <StatisticCard
                    hide={!demoMode && !profile?.cardioFitness && !profile?.age}
                    IconComponent={BsHeartFill}
                    title="Cardio Fitness"
                    titleColor="text-red-600"
                    statistic={profile?.cardioFitness && profile?.age ? {
                        value: profile.cardioFitness.toString(),
                        unit: "VO2 max",
                        description: getVO2MaxCategory(profile.cardioFitness, profile.age)
                    } : undefined}
                />
                <StatisticCard
                    hide={!demoMode && !profile?.steps && !profile?.stepsTimestamp}
                    IconComponent={FaFire}
                    title="Daily Steps"
                    titleColor="text-orange-600"
                    statistic={profile?.steps && profile?.stepsTimestamp ? {
                        value: profile.steps.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        unit: "Steps",
                        description: formatDate(profile.stepsTimestamp),
                    } : undefined}
                />
                <StatisticCard
                    hide={!demoMode && !profile?.workoutMinutes && !profile?.workoutTimestamp}
                    IconComponent={FaFire}
                    title="Workouts"
                    titleColor="text-orange-600"
                    statistic={profile?.workoutMinutes && profile?.workoutTimestamp ? {
                        value: profile.workoutMinutes.toString(),
                        unit: "Min",
                        description: formatDate(profile.workoutTimestamp),
                    } : undefined}
                />
            </div>
        </div>
    </>
}

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

function getBMICategory(bmi: number): string {
    if (bmi < 18.5) {
        return "Underweight";
    }
    if (bmi < 25) {
        return "Normal";
    }
    if (bmi < 30) {
        return "Overweight";
    }
    if (bmi < 35) {
        return "Obese";
    }

    return "Extremely Obese";
}


function formatDate(date: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 86400000);

    if (date.getDate() === today.getDate()) {
        return "Today at " + date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    } else if (date.getDate() === yesterday.getDate()) {
        return "Yesterday at " + date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    } else {
        const daysAgo = Math.round((today.getTime() - date.getTime()) / 86400000);
        return daysAgo + " days ago at " + date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    }
}
