'use client'

import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { Button } from './ui/button'
import { cn, convertFileToUrl, getFileType } from '@/lib/utils'
import Image from 'next/image'
import Thumbnail from './Thumbnail'
import { useToast } from "@/hooks/use-toast"
import { uploadFile } from '@/lib/actions/file.action'
import { usePathname } from 'next/navigation'

const MAX_FILE_SIZE = 50 * 1024 * 1024

declare type FileUploaderProps = {
  ownerId: string
  accountId: string
  classname?: string
}

const FileUploader = ({ownerId, accountId, classname} : FileUploaderProps) => {

  const [files, setFiles] = useState<File[]>([])
  const { toast } = useToast()
  const pathname = usePathname()

  const removeFileHandler = (e: React.MouseEvent<HTMLImageElement>, filename: string) => {
    e.stopPropagation()
    setFiles((prevFile) => prevFile.filter((file) => file.name != filename))
  }
  
  const onDrop = useCallback( async (acceptedFiles: File[]) => {
    // Do something with the files
    setFiles(acceptedFiles)

    const uploadePromises = acceptedFiles.map(async (file) => {
      if(file.size > MAX_FILE_SIZE){
        setFiles((prevFile) => prevFile.filter((f) => f.name != file.name))
        console.log("here")
        
        return toast({
          description: (
            <p className='body-2 text-white'>
            <span className='font-semibold'>{file.name}</span> is too large. Max file size is 50MB 
          </p>
        ), className: 'error-toast'
      })
    }

      return uploadFile({file, ownerId, accountId, path: pathname}).then((uploadedFile) => {
        if(uploadedFile){
          setFiles((prevFiles) => prevFiles.filter((f) => f.name != file.name))
          toast({
            description: (
              <p className='body-2 text-black'>
                <span className='font-semibold'>{file.name}</span> uploaded successfully
              </p>
            ), className: 'px-4 py-2'
          })
        }
      })
    })

    await Promise.all(uploadePromises)

  }, [ownerId, accountId, pathname])

  
  const {getRootProps, getInputProps} = useDropzone({onDrop})

  return (
    <div {...getRootProps()} className='cursor-pointer '>
      <input {...getInputProps()} />
      <Button type='button' className={cn('primary-btn h-[52px] gap-2 px-10 shadow-drop-1 items-center', classname)} >
        <Image 
          src={'/assets/icons/upload.svg'}
          alt='Upload'
          width={24}
          height={24}
        />
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className='fixed bottom-10 right-10 z-50 flex size-full h-fit max-w-[480px] flex-col gap-3 rounded-[20px] bg-white p-7 shadow-drop-3'>
          <h4 className='h4 text-light-100'>
            Uploading...
          </h4>
          {files.map((file, index) => {
            const { type, extension} = getFileType(file.name)
            return (
              <li key={`${file.name}-${index}`} className='flex items-center justify-between  gap-3 rounded-xl p-3 shadow-drop-3'>
                <div className='flex items-center gap-3'>
                  <Thumbnail 
                    type={type} 
                    extension={extension} 
                    url={convertFileToUrl(file)} 
                   />
                   <div className='subtitle-2 mb-2 line-clamp-1 max-w-[300px]'>
                      {file.name}
                      <Image 
                        src={'/assets/icons/file-loader.gif'}
                        alt='loader'
                        width={80}
                        height={26}                  
                      />
                    </div>
                </div>

                <Image 
                  src={'/assets/icons/remove.svg'}
                  alt='close'
                  width={24}
                  height={24}
                  onClick={(e) => removeFileHandler(e, file.name)}
                />

                
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default FileUploader