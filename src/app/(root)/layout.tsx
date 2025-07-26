import Header from '@/components/navigation/Header';
import MobileNav from '@/components/navigation/MobileNav';
import SideBar from '@/components/navigation/SideBar';
import { getCurrentUser, registerUser } from '@/lib/actions/user.actions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
  title: "StoreIt",
  description: "StoreIt - The only storage solution you need.",
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) return redirect("/sign-in");

  return (
    <main className='flex h-screen font-poppins'>
      <SideBar {...currentUser}  />
      <section className='flex h-full flex-1 flex-col'>
        <Header />
        <MobileNav />
        <div className='main-content'>
          {children}
        </div>
      </section>
    </main>
  )
}

export default RootLayout;