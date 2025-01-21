'use client'

import { Models } from 'node-appwrite'
import React, { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import Image from 'next/image'
import { actionsDropdownItems } from '@/constants'
import Link from 'next/link'
import { constructDownloadUrl } from '@/lib/utils'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { Input } from './ui/input'
import { Button } from './ui/button'
import { removeFileWithUsers, renameFile, shareFileWithUsers } from '@/lib/actions/file.action'
import { usePathname } from 'next/navigation'
import { FileDetails } from './ActionsModalContent'
import { ShareInput } from './ActionsModalContent'
  
  
const ActionDropdown = ({file} : {file: Models.Document}) => {

    const [isModelOpen, setIsModelOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [action, setAction] = useState<ActionType | null>(null)
    const [name, setName] = useState(file.name)
    const [loading, setLoading] = useState(false)
    const path = usePathname()
    const [emails, setEmails] = useState<string[]>([])

    const closeAllModals = () => {
        setIsModelOpen(false)
        setIsDropdownOpen(false)
        setAction(null)
        setName(file.name)
        setEmails([])
    }

    const handleAction = async () => {
        if(!action) return
        setLoading(true)
        let success = false

        const actions = {
            rename: () => renameFile({fileId: file.$id, name, extension: file.extension, path}),
            share: () => shareFileWithUsers({fileId: file.$id, emails, path}),
            delete: () => console.log('delete'),
        }

        success = await actions[action.value as keyof typeof actions]()

        if(success){
            closeAllModals()
        }
        setLoading(false)
    }

    const handleremoveuser = async (email: string) => {

        const success = await removeFileWithUsers({fileId: file.$id, email , path})

        if(success){
            closeAllModals()
        }
    }

  return (
    <Dialog open={isModelOpen} onOpenChange={setIsModelOpen}>
         <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen} >
            <DropdownMenuTrigger className='shad-no-focus'>
                <Image 
                    src={'/assets/icons/dots.svg'}
                    alt='Dots'
                    width={24}
                    height={24}
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='min-w-[200px] rounded-lg'>
                <DropdownMenuLabel className='max-w-[200px] truncate'>
                    {file.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {actionsDropdownItems.map((item) => (
                    <>
                    <DropdownMenuItem 
                        key={item.value} 
                        className='cursor-pointer'
                        onClick={() => {
                            setAction(item)

                            if(['rename', 'details', 'delete', 'share'].includes(item.value)){
                                setIsModelOpen(true)
                            }
                        }}
                    >
                        {item.value === 'download' ? <Link key={item.value} href={constructDownloadUrl(file.bucketField)} download={file.name} className='flex items-center gap-2'>
                            <Image 
                                src={item.icon}
                                alt={item.value}
                                width={28}
                                height={28}
                                
                            />
                            {item.label}
                        </Link>
                        : 
                        <div className='flex items-center gap-2'>
                            <Image 
                                src={item.icon}
                                alt={item.value}
                                width={28}
                                height={28}
                                
                            />
                            {item.label}
                        </div>}
                    </DropdownMenuItem>
                    </>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>

        {/* modal logic for rename, details, share and delete */}
        <DialogContent className='shad-dialog button'>
                <DialogHeader className='flex flex-col gap-3'>
                <DialogTitle className='text-center text-light-100'>
                    {action?.label}
                </DialogTitle>
                {action?.value === 'rename' && (
                    <Input 
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                )}
                {action?.value === 'details' && (
                    <FileDetails file={file} />
                )}
                {action?.value === 'share' && (
                    <ShareInput file={file} emails={emails} onInputChange={setEmails} onRemove={(email) => handleremoveuser(email)} />
                )}
                </DialogHeader>
                {action?.value && ['rename', 'delete', 'share'].includes(action.value) && (
                    <DialogFooter className='flex flex-col gap-3 md:flex-row'>
                        <Button onClick={closeAllModals} className='h-[52px] flex-1 rounded-full bg-white text-light-100 hover:bg-slate-100'>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleAction} 
                            disabled={loading}
                            className='primary-btn !mx-0 h-[52px] w-full flex-1'    
                        >
                            <p className='capitalize'>{action?.value}</p>
                            {loading && (
                                <Image 
                                    src={'/assets/icons/loader.svg'}
                                    alt='Loader'
                                    width={24}
                                    height={24}
                                    className='animate-spin'
                                />
                            )}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
    </Dialog>
   


  )
}

export default ActionDropdown