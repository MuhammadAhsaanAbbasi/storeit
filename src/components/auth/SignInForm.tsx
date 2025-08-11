"use client"
import React, { useState, useTransition } from 'react'
import { CardWrapper } from '@/components/auth/cardwrapper';
import { Form, FormProvider, useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { redirect, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ToastAction } from '../ui/toast';
import { FormError } from '@/components/shared/FormError';
import { FormSuccess } from '@/components/shared/FormSucess';
import { toast } from '@/hooks/use-toast';
import { LoginSchema } from '@/schema/auth';
import { signInUser } from '@/lib/actions/user.actions';
import { handleError } from '@/lib/utils';
import { LoaderCircle } from 'lucide-react';
// import { FcGoogle } from "react-icons/fc";
// import { FaGithub } from "react-icons/fa";
// import SocialAuth from './socialauth';

export const SignInForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const path = usePathname();
    const params = useSearchParams();
    const router = useRouter();

    const callbackUrl = params.get("callbackUrl") as string;
    console.log(`callbackUrl: ${callbackUrl}`);

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");
        startTransition(() => {
            signInUser(values, path, callbackUrl)
                .then((data) => {
                    setError(data?.error as string);
                    setSuccess(data?.success);
                    if (data?.error) {
                        toast({
                            title: "Login Failed",
                            description: data.message,
                            variant: "destructive",
                            duration: 2000,
                            action: (
                                <ToastAction altText="Dismiss" >Dismiss</ToastAction>
                            )
                        })
                    }

                    if (data?.success) {
                        router.push(callbackUrl);
                        toast({
                            title: "Login Success",
                            description: data.success,
                            duration: 1000,
                            action: (
                                <ToastAction altText="Close">Close</ToastAction>
                            ),
                        });
                    }
                })
                .catch((err) => {
                    const { error, message } = handleError(err, "Failed to sign in user");
                    toast({
                        title: (error as string),
                        description: (message as string),
                        variant: "destructive",
                        duration: 1000,
                        action: (
                            <ToastAction altText="Dismiss" >Dismiss</ToastAction>
                        )
                    })
                })
                .finally(() => {
                    form.reset();
                });
        });
    }

    return (
        <FormProvider
            {...form}
        >
            <CardWrapper
                headerlabels='Login'
                hrefText='Create Account'
                backButtonLabel="Don't Have an Account?"
                backButtonhref='/sign-up'
            >
                <form className="flex flex-col justify-center gap-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <div className='shad-form-item'>
                                    <FormLabel className='shad-form-label'>
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder='john.doe@gmail.com'
                                            type="email"
                                            className="shad-input"
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage className='shad-form-message' />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className='shad-form-item'>
                                    <FormLabel className='shad-form-label'>
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder='*********'
                                            type='password'
                                            className='shad-input'
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage className='shad-form-message' />
                            </FormItem>
                        )}
                    />

                    <FormError message={error} />
                    <FormSuccess message={success} />

                    <Button
                        disabled={isPending}
                        type="submit" className='primary-btn'>
                        {
                            isPending ?
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                : "SignIn"
                        }
                        <BottomGradient />
                    </Button>

                </form>
            </CardWrapper>
        </FormProvider>
    );

}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};