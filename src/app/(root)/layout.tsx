import Header from '@/components/navigation/Header';
import MobileNav from '@/components/navigation/MobileNav';
import SideBar from '@/components/navigation/SideBar';
import { Metadata } from 'next';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
  title: "StoreIt",
  description: "StoreIt - The only storage solution you need.",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className='flex h-screen font-poppins'>
      <SideBar />
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