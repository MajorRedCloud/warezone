import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import Search from './Search'
import FileUploader from './FileUploader'
import { logout } from '@/lib/actions/user.actions'

const Header = () => {
  return (
    <div className='hidden sm:flex flex-row w-full justify-between gap-5 items-center p-5 lg:py-5 xl:gap-10'>
        <Search />
        <div className='flex-center min-w-fit gap-4'>
            <FileUploader />
                <Button type='submit' className='sign-out-button' onClick={logout}>
                    <Image 
                        src={'/assets/icons/logout.svg'}
                        alt='Logout'
                        width={24}
                        height={24}
                        className='w-6'
                    />
                </Button>
        </div>
    </div>
  )
}

export default Header