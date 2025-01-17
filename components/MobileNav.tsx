'use client'

import React, { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { navItems } from '@/constants'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { logout } from '@/lib/actions/user.actions'


const MobileNav = ({fullName, email}: {
  fullName: string,
  email: string
}) => {

  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className='flex sm:hidden px-5 justify-between items-center h-[60px]'>

      <Image 
        src={'/assets/icons/logo-brand.svg'}
        alt='logo'
        width={52}
        height={52}
        className='h-auto'
      />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image 
            src={'/assets/icons/menu.svg'}
            alt='search'
            width={30}
            height={30}
          />
        </SheetTrigger>
        <SheetContent className='shad-sheet h-screen px-3'>
            <SheetTitle>
              <div className='my-3 flex items-center gap-2 rounded-full p-1 text-light-100 sm:justify-center sm:bg-brand/10 lg:justify-start lg:p-3'>
                <Image 
                  src={'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?semt=ais_hybrid'}
                  alt='avatar'
                  width={44}
                  height={44}
                  className='header-user-avatar'
                />
                <div className='sm:hidden lg:block'>
                  <p className='subtitle-2 capitalize'>
                    {fullName}
                  </p>
                  <p className='caption'>
                    {email}
                  </p>
                </div>
              </div>
              <Separator className='mb-4 bg-light-200/20' />
            </SheetTitle>
            
            <nav className='h5 flex-1 gap-1 text-brand'>
              <ul className='flex flex-1 flex-col gap-4'>
              {navItems.map((item) => 
                        (
                            <Link href={item.href} key={item.name} className='lg:w-full '>
                                <li className={cn('flex text-light-100 gap-4 rounded-xl w-full justify-start items-center h5 px-[30px] h-12 lg:rounded-full', (pathname === item.href) && 'bg-brand text-white shadow-drop-2')}>
                                    <Image 
                                        src={item.icon}
                                        alt={item.name}
                                        width={24}
                                        height={24}
                                        className={cn('nav-icon', (pathname === item.href) && 'nav-icon-active')}
                                    />
                                    <p className=''>{item.name}</p>
                                </li>
                            </Link>
                        )
                    )}
              </ul>
              <Separator className='bg-light-200/20 my-5'/>
              <div className='flex flex-col justify-between pb-5 gap-5'>
                    FileUploader
                    <Button type='submit' className='sign-out-button' onClick={logout}>
                      <Image 
                          src={'/assets/icons/logout.svg'}
                          alt='Logout'
                          width={24}
                          height={24}
                          className='w-6'
                      /> <p>
                        logout
                      </p>
                   </Button>
              </div>
            </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}

export default MobileNav