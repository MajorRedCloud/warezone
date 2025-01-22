'use client'

import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePathname, useRouter } from 'next/navigation'
import { sortTypes } from '@/constants'


const Sort = () => {

  const path = usePathname()
  const router = useRouter()

  const handleSort = (value: string) => {
    router.push(`${path}?s=${value}`)
  }

  return (
    <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
      <SelectTrigger className="shad-no-focus h-10 w-full rounded-[8px] border-transparent bg-white !shadow-sm sm:w-[200px]">
        <SelectValue placeholder={sortTypes[0].value} />
      </SelectTrigger>
      <SelectContent className='shadow-drop-3'>
        {sortTypes.map((item) => (
          <SelectItem key={item.label} className='cursor-pointer' value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
  </Select>

  )
}

export default Sort