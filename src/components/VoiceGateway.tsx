'use client'

import React from 'react'

interface VoiceGatewayProps {
  onPreferenceSet: (preference: 'deaf' | 'blind' | 'skip') => void
}

export default function VoiceGateway({ onPreferenceSet }: VoiceGatewayProps) {
  return (
    <div className="sr-only">
      Voice Gateway Placeholder
    </div>
  )
} 