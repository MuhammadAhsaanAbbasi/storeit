import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import BackButton from './backButton';
import { AuthHeader } from './Header';

interface CardwrapperProps {
    children: React.ReactNode;
    headerlabels: string;
    backButtonLabel: string;
    backButtonhref: string;
}


export const CardWrapper = (
    {
        children,
        headerlabels,
        backButtonLabel,
        backButtonhref
    }: CardwrapperProps
) => {
    return (
        <Card className='w-[400px] shadow-md bg-[#1C1F2E] backdrop-blur-md rounded-xl border border-[#0E78F9] text-[#fff] h-full font-'>
            <CardHeader>
                <AuthHeader label={headerlabels} />
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            <CardFooter>
                <BackButton label={backButtonLabel} href={backButtonhref} />
            </CardFooter>
        </Card>
    )
}