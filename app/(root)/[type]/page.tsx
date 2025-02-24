import FileCard from '@/components/FileCard'
import Sort from '@/components/Sort'
import { getFiles } from '@/lib/actions/file.action'
import { getFileTypesParams } from '@/lib/utils'
import { Models } from 'node-appwrite'
import React from 'react'

const page = async ({params, searchParams}: SearchParamProps) => {

    const type = (await params)?.type as string || ""
    console.log(type)
    const totalSize = '12GB'

    const searchText = (await searchParams)?.q as string || ''
    const sort = ((await searchParams)?.s) as string || ''

    const types = getFileTypesParams(type) as FileType[]

    const files = await getFiles({types, searchText, sort});

  return (
    <div className='mx-auto flex w-full max-w-7xl flex-col items-center gap-8'>
        <section className='w-full'>
            <h1 className='h1 capitalize'>
                {type}
            </h1>

            <div className='flex mt-2 flex-col justify-between sm:flex-row sm:items-center'>
                <p className='body-1'>
                    Total: <span className='h5'>{totalSize}</span> 
                </p>

                <div className='mt-5 flex items-center sm:mt-0 sm:gap-3'>
                    <p className='body-1 hidden sm:block text-light-200'>
                        Sort by: 
                    </p>
                    <Sort />
                </div>
            </div>
        </section>

        {/* render files */}
        {files.length > 0 ? (
            <section className='grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {files.map((file: Models.Document) => (
                    <FileCard key={file.$id} file={file} />
                    
                ))}
            </section>
        ) : (
            <p className='body-1 mt-10 text-center text-light-200'>No Files Found</p>
        )}
    </div>
  )
}

export default page