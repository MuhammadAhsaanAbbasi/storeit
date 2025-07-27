"use client";
import Image from 'next/image';
import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className='mobile-header'>
      <Image
        src={"/icons/logo-full-brand.svg"}
        alt="logo"
        width={120}
        height={52}
        className='h-auto'
      />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            src={"/icons/menu.svg"}
            alt="logo"
            width={30}
            height={30}
          />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </header>
  )
}

export default MobileNav;