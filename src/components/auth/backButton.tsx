import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'


interface BackButtonProps {
    label: string,
    href: string,
    text: string
}


const BackButton = (
    {
        label,
        href,
        text
    }: BackButtonProps
) => {
    return (
        <Button
        className='w-full font-normal text-base hover:bg-transparent'
        variant={"ghost"}
        size={"sm"}
        >
            <span>
                {label}
            </span>
            <Link href={href} className='text-red hover:underline'>
                {text}
            </Link>
        </Button>
    )
}

export default BackButton