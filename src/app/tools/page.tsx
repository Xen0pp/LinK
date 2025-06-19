'use client'

import React from 'react'
import AppProvider from '@/components/AppProvider'
import ToolsPage from '@/components/pages/ToolsPage'

export default function Page() {
  return (
    <AppProvider>
      <ToolsPage />
    </AppProvider>
  )
} 