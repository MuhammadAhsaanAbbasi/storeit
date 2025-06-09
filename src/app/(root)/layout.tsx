import { Metadata } from 'next';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
  title: "StoreIt",
  description: "StoreIt - The only storage solution you need.",
};

const RootLayout = ({children}:{children: ReactNode}) => {
  return (
    <main>
        {children}
    </main>
  )
}

export default RootLayout;