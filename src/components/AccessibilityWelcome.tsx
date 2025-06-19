'use client'

import React from 'react'

interface AccessibilityWelcomeProps {
  onModeSelect: (mode: 'deaf' | 'blind' | null) => void
}

export default function AccessibilityWelcome({ onModeSelect }: AccessibilityWelcomeProps) {
  return (
    <div className="sr-only">
      Accessibility Welcome Placeholder
    </div>
  )
} 