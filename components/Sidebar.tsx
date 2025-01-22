'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { navItems } from '@/constants'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const Sidebar = ({fullName, email}: {
    fullName: string,
    email: string
}) => {

    const pathname = usePathname()

  return (
    <div className='remove-scrollbar hidden h-screen w-[90px] flex-col oPverflow-auto px-5 py-7 pb-4 sm:flex lg:w-[280px] xl:w-[325px]'>
        <div>
            <Image 
                src={'/assets/icons/logo-full-brand.svg'}
                alt='Logo'
                width={150}
                height={44}
                className='cursor-pointer hidden h-auto lg:block transition-all hover:scale-105 hover:-translate-y-1'
            />
            <Image 
                src={'/assets/icons/logo-brand.svg'}
                alt='Logo'
                height={52}
                width={52}
                className='lg:hidden'
            />

            <div className='h5 mt-9 flex flex-1 gap-1 text-brand'>
                <ul className='flex flex-col gap-4 flex-1'>
                    {navItems.map((item) => 
                        (
                            <Link href={item.href} key={item.name} className='lg:w-full '>
                                <li className={cn('flex text-light-100 gap-4 rounded-xl lg:w-full justify-center lg:justify-start items-center h5 lg:px-[30px] lg:h-[52px] h-12 lg:rounded-full', (pathname === item.href) && 'bg-brand text-white shadow-drop-2')}>
                                    <Image 
                                        src={item.icon}
                                        alt={item.name}
                                        width={24}
                                        height={24}
                                        className={cn('nav-icon', (pathname === item.href) && 'nav-icon-active')}
                                    />
                                    <p className='hidden lg:block'>{item.name}</p>
                                </li>
                            </Link>
                        )
                    )}
                </ul>
            </div>

            <Image 
                src={'/assets/images/files-2.png'}
                alt='Files'
                width={506}
                height={418}
                className='w-full'
            />
            <div className='sidebar-user-info'>
                <Image 
                    src={'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?semt=ais_hybrid'}
                    alt='User'
                    width={44}
                    height={44}
                    className='sidebar-user-avatar contain'
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

        </div>
    </div>
  )
}

export default Sidebar