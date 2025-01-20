import Header from '@/components/Header'
import MobileNav from '@/components/MobileNav'
import Sidebar from '@/components/Sidebar'
import { getCurrentUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'

const RootLayout = async ({children} : {children: ReactNode}) => {

    const currentUser = await getCurrentUser()
    

    if(!currentUser) {
        return redirect('/signin')
    }

  return (
    <main className='h-screen flex '>
        <Sidebar fullName={currentUser.fullName} email={currentUser.email} />

        <section className='flex flex-1 flex-col h-screen'>
            <MobileNav fullName={currentUser.fullName} email={currentUser.email} ownerId={currentUser.$id} accountId={currentUser.$id} />
            <Header userId={currentUser.$id} accountId={currentUser.$id} />

            <div className='remove-scrollbar h-full flex-1 overflow-auto bg-light-400 px-5 py-7 sm:mr-7 sm:rounded-[30px] md:mb-7 md:px-9 md:py-10'>
                {children}
            </div>
        </section>
    </main>
  )
}

export default RootLayout