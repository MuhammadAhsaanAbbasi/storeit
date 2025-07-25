"use client"
import React, { useState, useTransition } from 'react'
import { CardWrapper } from './cardwrapper';
import { FormProvider, useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '../ui/form';
import { Button } from '../ui/button';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ToastAction } from '../ui/toast';
import { FormError } from '@/components/shared/FormError';
import { FormSuccess } from '@/components/shared/FormSucess';
// import { FcGoogle } from "react-icons/fc";
// import { FaGithub } from "react-icons/fa";
// import SocialAuth from './socialauth';
import { toast } from '@/hooks/use-toast';
import { RegisterSchema } from '@/schema/auth';
import { registerUser } from '@/lib/actions/user.actions';
import { LoaderCircle } from 'lucide-react';
import OTPModel from './OTPModel';
// import { register } from '@/global-actions/auth';


export const SignUpForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [accountId, setAccountId] = useState<string>("");
    const [isPending, startTransition] = useTransition()

    const router = useRouter();          // 1
    const pathname = usePathname();        // 1
    const searchParams = useSearchParams();    // 1


    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })

    async function onSubmit(values: z.infer<typeof RegisterSchema>) {
        setError('')
        setSuccess('')
        startTransition(() => {
            // console.log(values)
            registerUser(values)
                .then((data) => {
                    setError((data?.error as string));
                    setSuccess(data?.success);
                    if (data?.error) {
                        toast({
                            title: "Signup Failed",
                            description: (data?.error as string),
                            variant: "destructive",
                            duration: 2000,
                        })
                    }
                    if (data?.success) {
                        toast({
                            title: "Signup Success",
                            description: data.success,
                            duration: 2000,
                            action: (
                                <ToastAction altText="Verify Your Account!">Verify Account!</ToastAction>
                            ),
                        });
                        setAccountId(data.data.accountId);

                        const params = new URLSearchParams(searchParams.toString());
                        params.set('email', values.email);

                        // 3 ‑ update the URL without full page refresh
                        router.replace(`${pathname}?${params.toString()}`);
                    }
                }).catch((error) => {
                    console.log(error)
                })
                .finally(() => {
                    form.reset();
                });
        });
    }

    return (
        <>
            <Form
                {...form}
            >
                <CardWrapper
                    headerlabels='Create Account'
                    backButtonLabel="Already Have an Account?"
                    backButtonhref='/sign-in'
                    hrefText='Sign in'
                >
                    <form className="flex flex-col justify-center gap-4"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="shad-form-item">
                                        <FormLabel className="shad-form-label">
                                            UserName
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder='johndoe'
                                                type="text"
                                                className="shad-input"
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage className="shad-form-message" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="shad-form-item">
                                        <FormLabel className="shad-form-label">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder='johndoe@gmail.com'
                                                type="email"
                                                className="shad-input"
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage className="shad-form-message" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="shad-form-item">
                                        <FormLabel className="shad-form-label">
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder='*********'
                                                type='password'
                                                className="shad-input"
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage className="shad-form-message" />
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
                                    <LoaderCircle className='mr-2 h-4 w-4 animate-spin text-light-300' />
                                    : "Create an Account"
                            }
                            <BottomGradient />
                        </Button>

                    </form>
                </CardWrapper>
            </Form>
            {accountId && (
                <OTPModel accountId={accountId} />
            )}
        </>
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