import { formatDateTime } from '@/lib/utils'
import React from 'react'

const FormattedDateAndTime = ({date, className} : {
    date: string,
    className?: string
}) => {
  return (
    <p className={className}>{formatDateTime(date)}</p>
  )
}

export default FormattedDateAndTime