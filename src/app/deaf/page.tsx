'use client'

import React from 'react'
import AppProvider from '@/components/AppProvider'
import DeafPage from '@/components/pages/DeafPage'

export default function Page() {
  return (
    <AppProvider>
      <DeafPage />
    </AppProvider>
  )
} 