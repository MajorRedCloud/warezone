"use client"
import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import Link from 'next/link'
import { createAccount } from '@/lib/actions/user.actions'

declare type AuthFormProps = {
  type: 'signin' | 'signup'
}

const authFormSchema = ({ type }: AuthFormProps) => z.object({
    email: z.string().email(),
    fullName: type === 'signup' ? z.string().min(2) : z.string().optional(),
  })

const AuthForm = ({type} : AuthFormProps) => {

  const [loading, setLoading] = useState(false)
  const formSchema = authFormSchema({type})
  const [accountId, setAccountId] = useState('')

    // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
   
    try {
      const user = await createAccount({
        fullName: values?.fullName || '',
        email: values.email
      })
  
      setAccountId(user.accountId)
    } catch (error) {
      console.log("failed to create acc", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex max-h-[800px] w-full max-w-[580px] flex-col justify-center space-y-6 transition-all lg:h-full lg:space-y-8">
        <h1 className='form-title'>
          {type =='signin' ? 'Login' : 'Sign Up'}
        </h1>
        {type == 'signup' && (
          <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <div className='flex h-[78px] flex-col justify-center rounded-xl border border-light-300 px-4 shadow-drop-1'> 
                <FormLabel className='text-light-100 pt-2 body-2 w-full '>Full Name</FormLabel>

                <FormControl>
                  <Input placeholder="Enter your full name" className=' border-none shadow-none p-0 shad-no-focus placeholder:text-light-200 body-2 ' {...field} />
                </FormControl>
              </div>
              <FormMessage className='text-red body-2 ml-4'/>
            </FormItem>
          )}
        />
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className='flex h-[78px] flex-col justify-center rounded-xl border border-light-300 px-4 shadow-drop-1'> 
                <FormLabel className='text-light-100 pt-2 body-2 w-full '>Email</FormLabel>

                <FormControl>
                  <Input placeholder="Enter your email address" className=' border-none shadow-none p-0 shad-no-focus placeholder:text-light-200 body-2 ' {...field} />
                </FormControl>
              </div>
              <FormMessage className='text-red body-2 ml-4'/>
            </FormItem>
          )}
        />
        
        <Button type="submit" className='w-full bg-brand-100 rounded-full hover:bg-brand h-[48px] transition-all' disabled={loading}>
          {type === 'signup' ? 'Sign Up' : 'Login'}
          {loading ? (
            <Image 
              src={'/assets/icons/loader.svg'}
              width={24}
              height={24}
              alt='loader'
              />
          ) : <></>}
        </Button>

        <div className='body-2 flex flex-row justify-center text-light-100'>
          <p>
            {type === 'signin' ? 'Don’t have an account yet?' : 'Already have an account?'}
          </p>
          <Link href={type === 'signin' ? '/signup' : '/signin'} className='ml-1 font-medium text-brand'>
            {type === 'signin' ? 'Sign Up' : 'Login'} 
          </Link>

        </div>
      </form>
    </Form>
  )
}

export default AuthForm