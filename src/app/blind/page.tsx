'use client'

import React from 'react'
import AppProvider from '@/components/AppProvider'
import BlindPage from '@/components/pages/BlindPage'

export default function Page() {
  return (
    <AppProvider>
      <BlindPage />
    </AppProvider>
  )
} 