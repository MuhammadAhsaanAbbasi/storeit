// "use client";
import React, { ElementType } from 'react'
import { FcGoogle } from 'react-icons/fc';
import { Button } from '../ui/button';


interface IProps {
    text: string;
    icon: ElementType;
    onClick: () => void;
}

const SocialAuth = ({ text, icon, onClick }: IProps) => {
    return (
        <form action={onClick} method="POST">
            <Button
                className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-dark-100 rounded-md h-10 font-medium shadow-input bg-light-200 hover:bg-light-100 hover:text-light-300 transition-all duration-500"
            >
                {icon ? React.createElement(icon, { size: 20, className: "text-dark-200" }) : <FcGoogle size={20} />}
                <span className="text-lg">
                    {text}
                </span>
                <BottomGradient />
            </Button>

        </form>
    )
}

export default SocialAuth;

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-brand to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-red to-transparent" />
        </>
    );
};