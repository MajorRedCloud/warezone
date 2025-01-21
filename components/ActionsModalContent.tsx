import { Models } from 'node-appwrite'
import React from 'react'
import Thumbnail from './Thumbnail'
import FormattedDateAndTime from './FormattedDateAndTime'
import { convertFileSize, formatDateTime } from '@/lib/utils'
import { Input } from './ui/input'
import { Button } from './ui/button'
import Image from 'next/image'

const ImageThumbnail = ({file} : {file: Models.Document}) => (
  <div className='!mb-1 flex items-center gap-3 rounded-xl border border-light-200/40 bg-light-400/50 p-3'>
    <Thumbnail type={file.type} extension={file.extension} url={file.url} />
    <div className='flex flex-col gap-1 '>
      <p className='subtitle-2'>
        {file.name}
      </p>
      <FormattedDateAndTime date={file.$createdAt} className=' caption text-light-100' />
    </div>
  </div>
)

const DetailsRow = ({label, value} : {label:string, value:string}) => (
  <div className='flex'>
    <p className='body-2 w-[30%] text-light-100'>{label}</p>
    <p className={`subtitle-2 flex-1 ${label === 'Owner:' ? 'capitalize' : ''}`}>{value}</p>
  </div>
)

export const FileDetails  = ({file} : {file: Models.Document}) => {
  return (
    <>
      <ImageThumbnail file={file}/>
      <DetailsRow label={'Format:'} value={file.extension} />
      <DetailsRow label={'Size:'} value={convertFileSize(file.size)} />
      <DetailsRow label={'Owner:'} value={file.owner.fullName} />
      <DetailsRow label={'Last Edit:'} value={formatDateTime(file.$updatedAt)} />
    </>
  )
}

export const ShareInput = ({file, emails, onInputChange, onRemove} : {
    file: Models.Document
    emails: string[]
    onInputChange: React.Dispatch<React.SetStateAction<string[]>>
    onRemove: (email: string) => void
}) => {
  console.log('emails', emails)
  return (
    <>
      <ImageThumbnail file={file}/> 
      <div className='mt-2 space-y-2'>
        <p className='subtitle-2 pl-1 text-light-100'>Share file with other users:</p>
        <Input 
          type='email'
          placeholder='Enter email address'
          onChange={(e) => (onInputChange(e.target.value.trim().split(',')))}
          className='body-2 shad-no-focus h-[52px] w-full rounded-full border px-4 shadow-drop-1'
        />
        <div className='pt-4 px-1'>
            <div className='flex justify-between'>
              <p className='subtitle-2 text-light-100'>Shared With</p>
              <p className='subtitle-2 text-light-200'>{file.users.length} users</p>
            </div>

            <ul className='pt-2 '>
              {file.users.map((email: string) => (
                <li key={email} className='flex items-center justify-between gap-2'>
                  <p className='subtitle-2'>{email}</p>
                  <Button onClick={() => onRemove(email)} className='bg-transparent shadow-none border-none hover:bg-transparent'>
                    <Image 
                      src={'/assets/icons/remove.svg'}
                      alt='remove'
                      width={24}
                      height={24}
                      className='aspect-square rounded-full bg-white'
                    />  
                  </Button>
                </li>
              ))}
            </ul>
        </div>
      </div>
    </>
  )
}

export const DeleteFile = ({file} : {file: Models.Document}) => {
  return (
    <p className='body-2 ml-2 text-light-100'>
      Are you sure you want to permanently delete <span className='font-semibold'>{file.name}</span>?
    </p>
  )
}
