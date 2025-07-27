"use client";
import Image from 'next/image';
import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import Link from 'next/link';
import { navItems } from '@/constants';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import FileUploader from '@/components/file/FileUploader';
import SignOutButton from '@/components/auth/SignOutButton';

const MobileNav = ({ fullName, email, avatar }: UserProfileProps) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
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
        <SheetContent className='shad-sheet px-3'>
          <SheetHeader>
            <SheetTitle>
              <Link href={"/"}
                className='flex items-center gap-1'
              >
                <Image
                  src={"/icons/logo-full-brand.svg"}
                  alt="logo"
                  width={120}
                  height={52}
                  className='h-auto'
                />
              </Link>
            </SheetTitle>
          </SheetHeader>

          {/* Navigation Menu */}
          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              {navItems.map(({ url, name, icon }, index) => (
                <Link key={index} href={url} className="lg:w-full">
                  <li
                    className={cn(
                      "mobile-nav-item",
                      pathname === url && "shad-active",
                    )}
                  >
                    <Image
                      src={icon}
                      alt={name}
                      width={24}
                      height={24}
                      className={cn(
                        "nav-icon",
                        pathname === url && "nav-icon-active",
                      )}
                    />
                    <p>{name}</p>
                  </li>
                </Link>
              ))}
            </ul>
          <div className="flex flex-col justify-between gap-5 pb-5">
            <FileUploader />
            <SignOutButton />
          </div>
          </nav>


          <SheetFooter>
            <div className="header-user">
              <div className="flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={avatar}
                  alt={fullName}
                  height={44}
                  width={44}
                  className="aspect-square h-full w-full"
                />
              </div>

              <div className="sm:hidden lg:block">
                <h5 className='h6 capitalize text-light-100'>
                  {fullName}
                </h5>
                <p className='caption-2 text-light-200'>
                  {email}
                </p>
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </header>
  )
}

export default MobileNav;