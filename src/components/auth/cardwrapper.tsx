import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import BackButton from './backButton';
import { AuthHeader } from './Header';

interface CardwrapperProps {
    children: React.ReactNode;
    headerlabels: string;
    backButtonLabel: string;
    backButtonhref: string;
    hrefText: string;
}


export const CardWrapper = (
    {
        headerlabels,
        backButtonLabel,
        backButtonhref,
        hrefText,
        children
    }: CardwrapperProps
) => {
    return (
        <Card className='w-full border-none shadow-none'>
            <CardHeader>
                <AuthHeader label={headerlabels} />
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            <CardFooter>
                <BackButton label={backButtonLabel} href={backButtonhref} text={hrefText} />
            </CardFooter>
        </Card>
    )
}