'use client'

import React from 'react'
import AppProvider from '@/components/AppProvider'
import HomePage from '@/components/pages/HomePage'

export default function Page() {
  return (
    <AppProvider>
      <HomePage />
    </AppProvider>
  )
} 