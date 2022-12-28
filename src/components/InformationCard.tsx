import React, { Component } from "react";

interface CardProps {
  title: string;
  // tailwind css color
  titleColor?: string;
  IconComponent: React.ComponentType<any>;
  bodyText: string | undefined;
}

export const InformationCard: React.FC<CardProps> = ({
  title,
  titleColor = "text-black",
  bodyText,
  IconComponent: Icon = () => <></>,
}) => {
  return (
    <>
      <div className="rounded-2xl bg-white p-6 shadow-xl shadow-gray-300">
        <div className={`${titleColor} mb-3 min-w-[300px] text-xl font-bold`}>
          <div className="inline-flex items-center gap-2">
            <Icon className="" />
            <span>{title}</span>
          </div>
        </div>
        <div>

          <span className="text-lg font-normal text-black">
            {bodyText || <div className="flex flex-col gap-3">
              <div className="bg-slate-300 h-5 rounded-lg w-96 inline-block animate-pulse" />
              <div className="bg-slate-300 h-5 rounded-lg w-48 inline-block animate-pulse" />
            </div>}
          </span>
        </div>
      </div>
    </>
  );
};
