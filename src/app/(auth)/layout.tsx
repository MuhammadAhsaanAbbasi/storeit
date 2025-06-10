import { Metadata } from 'next';
import Image from 'next/image';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
  title: "StoreIt",
  description: "StoreIt - The only storage solution you need.",
};

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className='flex min-h-screen'>
      <section className='hidden w-1/2 items-center justify-center bg-brand p-10 lg:flex xl:w-2/5'>
        <div className='flex flex-col justify-center space-y-12'>
          {/* Application Logo */}
          <Image
            src={"/icons/logo-full.svg"}
            alt='logo'
            width={224}
            height={85}
          />

          {/* text */}
          <div className='space-y-5 text-white text-left font-poppins'>
            <h1 className='h1 !text-5xl !leading-[56px]'>
              Manage your files the best way
            </h1>
            <p className='body-1'>
              Awesome, we've created the perfect place for you to store all your documents.
            </p>
          </div>

          {/* Files SVG */}
          <Image
            src="/images/files.png"
            alt="Files"
            width={342}
            height={342}
            className="transition-all hover:rotate-2 hover:scale-105 duration-300"
          />
        </div>
      </section>
      <section className='flex flex-1 flex-col items-center bg-white p-4 py-10 lg:p-10 lg:py-0 lg:justify-center'>
        <div className='mb-16 lg:hidden'>
          <Image
            src={"/icons/logo-full-brand.svg"}
            alt='logo'
            width={224}
            height={85}
            className='h-auto w-[200px] md:w-[250px]'
          />
        </div>
        {children}
      </section>
    </main>
  )
}

export default AuthLayout;