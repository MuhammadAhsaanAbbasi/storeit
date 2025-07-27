"use client";
import React, { useTransition } from 'react'
import { Button } from '../ui/button';
import Image from 'next/image';
import { signOut } from '@/lib/actions/user.actions';
import { toast } from '@/hooks/use-toast';
import { redirect } from 'next/navigation';

const SignOutButton = () => {

    const [isPending, startTransition] = useTransition();
    const handleSignOut = async () => {
        startTransition(() => {
            signOut().then((data) => {
                if (data?.success) {
                    toast({
                        title: "SignOut",
                        description: data.success,
                        variant: "default"
                    });
                }
            })
            .catch((error) => {
                toast({
                    title: "SignOut Failed!!",
                    description: error.message,
                    variant: "destructive"
                })
            })
            .finally(() => {
                redirect("/sign-in");
            });
        });
    }
    return (
        <Button className='sign-out-button'
            onClick={handleSignOut}
            disabled={isPending}
        >
            <Image
                src={"/icons/logout.svg"}
                alt="Logout"
                width={24}
                height={24}
                className='w-6'
            />
        </Button>
    )
}

export default SignOutButton;