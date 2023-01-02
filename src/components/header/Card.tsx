import React, { Component } from "react";

interface CardProps {
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = (props) => {
    return (
        <>
            <div className="rounded-2xl bg-white p-6 shadow-xl shadow-gray-300">
                {props.children}
            </div>
        </>
    );
};

interface CardHeaderProps {
    IconComponent: React.ComponentType<any>;
    title: string;
    titleColor?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
    IconComponent: Icon = () => <></>,
    title,
    titleColor = "text-black",
}) => {
    return (
        <>
            <div className={`${titleColor} mb-3 text-xl font-bold`}>
                <div className="inline-flex items-center gap-2">
                    <Icon className="" />
                    <span>{title}</span>
                </div>
            </div>
        </>
    );
};
