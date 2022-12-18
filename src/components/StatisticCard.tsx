import React, { Component } from "react";

interface CardProps {
  title: string;
  // tailwind css color
  titleColor?: string;
  IconComponent: React.ComponentType<any>;
  statistic: {
    value: string;
    unit: string;
    description?: string;
  };
}

export const StatisticCard: React.FC<CardProps> = ({
  title,
  titleColor = "text-black",
  statistic = {
    value: "0",
    unit: "",
    description: " ",
  },
  IconComponent: Icon = () => <></>,
}) => {
  return (
    <>
      <div className="rounded-2xl bg-white p-6 shadow-xl shadow-gray-300">
        <div className={`${titleColor} mb-3 text-xl font-bold`}>
          <div className="inline-flex items-center gap-2">
            <Icon className="" />
            <span>{title}</span>
          </div>
        </div>
        <div>
          <h1>
            <span className="text-5xl font-bold text-black">
              {statistic.value}
            </span>
            <span className="ml-2 text-3xl font-bold text-gray-600">
              {statistic.unit}
            </span>
          </h1>
          <div className="font-semibold text-gray-600">
            <span>{statistic.description} </span>
          </div>
        </div>
      </div>
    </>
  );
};
