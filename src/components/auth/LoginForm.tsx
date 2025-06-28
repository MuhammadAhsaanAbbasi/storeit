"use client"
import React, { useState, useTransition } from 'react'
import { CardWrapper } from '@/components/auth/cardwrapper';
import { Form, FormProvider, useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { LoginSchema } from '@/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { ToastAction } from '../ui/toast';
import { FormError } from '../shared/FormError';
import { FormSuccess } from '../shared/FormSucess';
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import SocialAuth from './socialauth';
import { toast } from '@/hooks/use-toast';
// import { login } from '@/global-actions/auth';

export const LoginForm = () => {
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setError("")
        setSuccess("")
        // startTransition(() => {
        //     login(values)
        //         .then((data) => {
        //             setError(data.error);
        //             setSuccess(data.success);
        //             if (data?.error) {
        //                 toast({
        //                     title: "Login Failed",
        //                     description: data.error,
        //                     duration: 2000,
        //                     action: (
        //                         <ToastAction altText="Dismiss" >Dismiss</ToastAction>
        //                     )
        //                 })
        //                 form.reset();
        //             }

        //             if (data?.success) {
        //                 form.reset();
        //                 toast({
        //                     title: "Login Success",
        //                     description: data.message,
        //                     duration: 2000,
        //                     action: (
        //                         <ToastAction altText="Close">Close</ToastAction>
        //                     ),
        //                 })
        //                 router.push("/user/profile/edit");
        //             }
        //         })
        // });
    }

    return (
        <FormProvider
            {...form}
        >
            <CardWrapper
                headerlabels='Welcome Back in LOOM'
                backButtonLabel="Don't Have an Account?"
                backButtonhref='/register'
            >
                <form className="flex flex-col justify-center gap-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        placeholder='john.doe@gmail.com'
                                        type="email"
                                        className='auth_input'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm font-extralight'>
                                    Password
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        placeholder='*********'
                                        type='password'
                                        className='auth_input'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormError message={error} />
                    <FormSuccess message={success} />

                    <Button
                        // disabled={isPending}
                        type="submit" className='w-full bg-blue-1'>
                        Login
                        {/* <BottomGradient /> */}
                    </Button>

                </form>
                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
                <div className="flex items-center justify-center gap-4">
                    <SocialAuth text='Google' icon={FcGoogle} />
                    <SocialAuth text='Github' icon={FaGithub} />
                </div>
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