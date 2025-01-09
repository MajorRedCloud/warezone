import Image from 'next/image'
import React from 'react'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='flex min-h-screen'>
        <section className='bg-brand p-12 h-screen w-1/2 hidden lg:flex xl:w-2/5 justify-center'>
            <div className='flex flex-col justify-between h-full max-h-[800px] max-w-[430px]'>
                <div className='w-full flex-row flex items-center text-center gap-5 pl-10'>
                    <Image src={'/Logo.png'} alt="Logo" height={60} width={60}
                    />
                    <h2 className='text-white font-semibold text-2xl transition-all hover:scale-110 hover:-translate-y-1 duration-300 ease-in-out'>
                        Warezone
                    </h2>

                </div>
                <div className='space-y-5 text-white'>
                    <h1 className='h1'>
                     Manage your files the best way you can
                    </h1>
                    <p className='body-1'>
                        This is a place where you can store all your documents and share it easily with your peers.
                    </p>
                </div>
                <div className='flex items-center justify-center '>
                    <Image 
                        src={'/assets/images/files.png'}
                        alt="files"
                        height={280}
                        width={280}
                        className='transition-all hover:rotate-3 hover:scale-110'
                    />
                </div>
            </div>
        </section>

        <section className='flex flex-col flex-1 items-center bg-white p-4 py-10 justify-center lg:p-10 lg:py-0'>

        {children}
        </section>
    </div>
  )
}

export default layout