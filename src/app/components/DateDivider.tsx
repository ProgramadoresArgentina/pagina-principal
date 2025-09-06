'use client'

import React from 'react'

interface DateDividerProps {
  date: Date
}

export default function DateDivider({ date }: DateDividerProps) {
  const formatDate = (date: Date) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    if (messageDate.getTime() === today.getTime()) {
      return 'Hoy'
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return 'Ayer'
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
      })
    }
  }

  return (
    <div className="d-flex align-items-center my-3">
      <div className="flex-grow-1">
        <hr className="my-0" />
      </div>
      <div className="px-3">
        <span className="badge bg-secondary text-white px-3 py-2" style={{ fontSize: '11px' }}>
          {formatDate(date)}
        </span>
      </div>
      <div className="flex-grow-1">
        <hr className="my-0" />
      </div>
    </div>
  )
}
