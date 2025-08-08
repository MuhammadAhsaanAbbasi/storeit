import Header from '@/components/navigation/Header';
import MobileNav from '@/components/navigation/MobileNav';
import SideBar from '@/components/navigation/SideBar';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { parseStringify } from '@/lib/utils';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
  title: "StoreIt",
  description: "StoreIt - The only storage solution you need.",
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const currentUser = await getCurrentUser();
  
  if (!currentUser?.data) return null;

  const user = currentUser.data;

  return (
    <main className='flex h-screen font-poppins'>
      <SideBar {...parseStringify(user)}  />
      <section className='flex h-full flex-1 flex-col'>
        <Header ownerId={user.$id} accountId={user.accountId} />
        <MobileNav {...parseStringify(user)} />
        <div className='main-content'>
          {children}
        </div>
      </section>
    </main>
  )
}

export default RootLayout;