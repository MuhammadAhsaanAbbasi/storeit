import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useTransition } from 'react'
import { Button } from '../ui/button';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { sendEmailOTP, verifyEmailOTP } from '@/lib/actions/user.actions';
import { toast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

const OTPModel = ({ accountId }: { accountId: string }) => {
    const [open, setOpen] = useState(true);
    const [password, setPassword] = useState("");
    const [isPending, startTransition] = useTransition();

    const searchParams = useSearchParams();
    const router = useRouter();

    const email = searchParams.get("email") as string;

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        startTransition(() => {
            verifyEmailOTP(accountId, password)
                .then((data) => {
                    if (data?.data) {
                        toast({
                            title: "OTP Verified",
                            description: data.success,
                            duration: 2000,
                        });
                        setOpen(false);
                        router.push("/")
                    }
                }).catch((error) => {
                    toast({
                        title: "OTP Failed",
                        description: "Failed to verify OTP",
                        duration: 2000,
                        variant: "destructive",
                    });
                });
        })
    }

    const resendOTP = async () => {
        await sendEmailOTP(accountId, email).then((data) => {
            if (data) {
                toast({
                    title: "Resend OTP",
                    description: "OTP has been sent to your email",
                    duration: 2000,
                })
            }
        }).catch((error) => {
            toast({
                title: "OTP Failed",
                description: "Failed to send OTP",
                duration: 2000,
                variant: "destructive",
            });
        });
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button
                onClick={() => setOpen(true)}
                className='primary-btn'
            >
                Verify OTP
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='h2 text-center text-light-100'>
                        Enter OTP
                    </DialogTitle>
                    <DialogDescription className="subtitle-2 !font-normal text-center text-light-100">
                        We&apos;ve sent a code to{" "}
                        <span className="pl-1 text-brand">{email}</span>
                    </DialogDescription>
                </DialogHeader>
                <InputOTP maxLength={6} value={password} onChange={setPassword}>
                    <InputOTPGroup className="shad-otp">
                        <InputOTPSlot index={0} className="shad-otp-slot" aria-disabled={isPending} />
                        <InputOTPSlot index={1} className="shad-otp-slot" aria-disabled={isPending} />
                        <InputOTPSlot index={2} className="shad-otp-slot" aria-disabled={isPending} />
                        <InputOTPSlot index={3} className="shad-otp-slot" aria-disabled={isPending} />
                        <InputOTPSlot index={4} className="shad-otp-slot" aria-disabled={isPending} />
                        <InputOTPSlot index={5} className="shad-otp-slot" aria-disabled={isPending} />
                    </InputOTPGroup>
                </InputOTP>
                <DialogFooter>
                    <div className='w-full flex flex-col gap-4'>
                        <Button
                            onClick={handleSubmit}
                            className='shad-submit-btn h-12'
                        >
                            {
                                isPending ? (
                                    <Image
                                        src="/icons/loader.svg"
                                        alt="loader"
                                        width={24}
                                        height={24}
                                        className="ml-2 animate-spin"
                                    />
                                ) : (
                                    "Verify OTP"
                                )
                            }
                        </Button>
                        <div className='subtitle-2 text-center text-light-100'>
                            <span>
                                Didn&apos;t get a code?
                            </span>
                            <Button
                                type="button"
                                variant="link"
                                className="pl-1 text-brand"
                                onClick={resendOTP}
                                disabled={isPending}
                            >
                                Click to resend
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default OTPModel;