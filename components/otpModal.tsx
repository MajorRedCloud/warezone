'use client'

import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import Image from 'next/image'
import { sendEmailOTP, verifyOTP } from '@/lib/actions/user.actions'
import { useRouter } from 'next/navigation'

const OtpModal = ({accountId, email}: {
  accountId: string
  email: string
}) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)
  const [pass, setPass] = useState('')
  const [isloading, setIsloading] = useState(false)

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsloading(true)

    try {
      const sessionId = await verifyOTP({accountId, password: pass})
      
      console.log(sessionId)
      if(sessionId) {
        router.push('/')
      }

    } catch (error) {
      console.log(error)
    }

    setIsloading(false)
  }

  const handleResendOtp = async () => {
    try {
      // todo - call api to resend otp
      await sendEmailOTP(email)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className='space-y-4 max-w-[95%] sm:w-fit rounded-xl md:rounded-[30px] px-4 md:px-8 py-10 bg-white outline-none '>
        <AlertDialogHeader className='flex justify-center relative flex-col gap-2'>
          <AlertDialogTitle className='h2 text-center'>Enter your OTP
            <Image src={'/assets/icons/close-dark.svg'} alt='close' width={20} height={20} onClick={() => setIsOpen(false)} className='absolute -right-1 -top-7 cursor-pointer sm:-right-2 sm:-top-4'/>
          </AlertDialogTitle>
          <AlertDialogDescription className='subtitle-2 text-center text-light-100'>
            We have sent a 6-digit OTP to<span className='pl-1 text-brand'>{email || 'testing123@gmail.com'}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP maxLength={6} value={pass} onChange={setPass} >
          <InputOTPGroup className='w-full gap-1 flex sm:gap-2 justify-between'>
            <InputOTPSlot index={0} className='shad-otp-slot'/>
            <InputOTPSlot index={1} className='shad-otp-slot'/>
            <InputOTPSlot index={2} className='shad-otp-slot'/>
            <InputOTPSlot index={3} className='shad-otp-slot'/>
            <InputOTPSlot index={4} className='shad-otp-slot'/>
            <InputOTPSlot index={5} className='shad-otp-slot'/>
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className='flex w-full flex-col gap-4'>
            <AlertDialogAction onClick={handleSubmit} className='shad-submit-btn h-12' type='button'>
              Submit
              {isloading && (
                <Image 
                  src={'/assets/icons/loader.svg'}
                  alt='loader'
                  width={24}
                  height={24}
                  className='ml-2 animate-spin'
                />
              )}
            </AlertDialogAction>
            <div className='flex justify-center item-center'>
              <p className='text-light-100 body-2'>
                Didn&apos;t receive the OTP? 
                <button onClick={handleResendOtp} className='text-brand cursor-pointer pl-1 '>Resend OTP</button>
              </p>

            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
</AlertDialog>

  )
}

export default OtpModal