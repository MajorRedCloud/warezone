'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getFiles } from '@/lib/actions/file.action'
import { Models } from 'node-appwrite'
import Thumbnail from './Thumbnail'
import FormattedDateAndTime from './FormattedDateAndTime'
import { useDebounce } from 'use-debounce';

const Search = () => {

  const [query, setQuery] = useState('')
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q') || ''
  const [results, setResults] = useState<Models.Document[]>([])
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const path = usePathname()
  const [debouncedQuery] = useDebounce(query, 400)

  useEffect(() => {
    const fetchFiles = async () => {

      if(debouncedQuery.length == 0){
        setResults([])
        setOpen(false)
        return router.push(path.replace(searchParams.toString(), ''))
      }

      const files = await getFiles({searchText: debouncedQuery})
      setResults(files)
      setOpen(true)
    }
    fetchFiles()
  }, [debouncedQuery])

  useEffect(() => {
    if(!searchQuery){
      setQuery('')
    }
  }, [searchQuery])

  const handleClickItem = (file : Models.Document) => {
    setOpen(false)
    setResults([])
    router.push(`${file.type === 'video' || file.type === 'audio' ? 'media' : file.type + 's'}?q=${query}`)
  }

  return (
    <div className='relative w-full md:max-w-[480px]'>
      <div className='flex h-[52px] flex-1 items-center gap-3 rounded-full px-4 shadow-drop-3 '>
        <Image 
          src='/assets/icons/search.svg'
          alt='search'
          width={24}
          height={24}
        />
        <Input 
          value={query}
          placeholder='Search...'
          className='body-2 shad-no-focus  placeholder:body-1 w-full border-none p-0 shadow-none placeholder:text-light-200'
          onChange={(e) => setQuery(e.target.value)}
        />

        {open && (
          <ul className='absolute left-0 top-16 z-50 flex w-full flex-col gap-3 rounded-[20px] bg-white p-4'>
            {results?.length > 0 ? (
              results?.map((file) => (
                <li key={file.$id} className='flex items-center justify-between' onClick={() => handleClickItem(file)}>
                  <div className='flex cursor-pointer items-center gap-4'>
                    <Thumbnail type={file.type} extension={file.extension} url={file.url}
                    classname='size-9 min-w-9' />
                    <p className='subtitle-2 line-clamp-1 text-light-100'>{file.name}</p>
                  </div>
                  <FormattedDateAndTime date={file.$createdAt} className='caption line-clamp-1 text-light-200'/>
                </li>
              ))
            )   : (
              <p className='empty-result'>
                No Files found
              </p>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Search