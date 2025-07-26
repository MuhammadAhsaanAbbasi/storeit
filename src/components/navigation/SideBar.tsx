"use client";
import { navItems } from '@/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

const SideBar = ({fullName, email, avatar}: UserProfileProps) => {
  const pathname = usePathname();
  return (
    <aside className='sidebar'>
      <Link href={"/"}>
        <Image
          src={"/icons/logo-full-brand.svg"}
          alt="logo"
          width={160}
          height={60}
          className='hidden h-auto lg:block'
        />

        <Image
          src={"/icons/logo-brand.svg"}
          alt="logo"
          width={60}
          height={60}
          className='lg:hidden'
        />
      </Link>

      {/* Navigation Links */}
      <nav className='sidebar-nav'>
        <ul className='flex flex-1 flex-col gap-6'>
          {
            navItems.map(({ url, icon, name }, index) => {
              const path = url === pathname;
              return (
                <Link key={index} href={url}
                  className='lg:w-full'>
                  <li
                    className={cn(
                      "sidebar-nav-item",
                      path && "shad-active",
                    )}
                  >
                    <Image
                      src={icon}
                      alt={name}
                      width={24}
                      height={24}
                      className={cn(
                        "nav-icon",
                        path && "nav-icon-active",
                      )}
                    />
                    <p className='hidden lg:block'>
                      {name}
                    </p>
                  </li>
                </Link>
              )
            })
          }
        </ul>
      </nav>

      {/* File Image */}
      <Image
        src={"/images/files-2.png"}
        alt="files"
        width={506}
        height={418}
        className='w-full h-auto'
      />

      {/* Account */}
      <div className='sidebar-user-info'>
        <Image 
        src={avatar}
        alt="avatar"
        width={44}
        height={44}
        className='w-full h-auto'
        />

        <div className='hidden lg:block'>
          <p className='subtitle-2 capitalize'>
            {fullName}
          </p>
          <p className='caption'>
            {email}
          </p>
        </div>
      </div>
    </aside>
  )
}

export default SideBar;