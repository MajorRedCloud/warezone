import Link from 'next/link'
import { Models } from 'node-appwrite'
import React from 'react'
import Thumbnail from './Thumbnail'
import { convertFileSize } from '@/lib/utils'
import FormattedDateAndTime from './FormattedDateAndTime'

const FileCard = ({file} : {
    file: Models.Document
}) => {
  return (
    <Link href={file.url} target='_blank' className='flex cursor-pointer flex-col gap-6 rounded-[18px] bg-white p-5 shadow-sm transition-all hover:shadow-drop-3'>
        <div className='flex justify-between'>
            <Thumbnail 
                type={file.type} 
                extension={file.entension} 
                url={file.url} 
                classname='!size-20' 
                imageClassName='!size-20'
            />

            <div className='flex flex-col items-end justify-between'>
                ...
                <p className='body-2'>
                    {convertFileSize(file.size)}
                </p>
            </div>
        </div>

        <div className='flex flex-col gap-2 text-light-100'>
            <p className='subtitle-2 line-clamp-1 font-semibold'>
                {file.name}
            </p>

            <FormattedDateAndTime date={file.$createdAt} className={'body-2 text-light-200'} />
        </div>
    </Link>
  )
}

export default FileCard