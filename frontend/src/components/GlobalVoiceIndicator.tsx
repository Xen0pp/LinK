import React from 'react';
import { useVoiceControl } from '../contexts/VoiceControlContext';

const GlobalVoiceIndicator: React.FC = () => {
  const { voiceStatus, supportStatus } = useVoiceControl();

  if (!voiceStatus.isBlindMode || !supportStatus.fullSupport) {
    return null;
  }

  const getStatusText = () => {
    if (voiceStatus.isProcessing) return 'Processing...';
    if (voiceStatus.isOnBreak) return 'Taking Break';
    if (voiceStatus.isListening) return 'Listening';
    return 'Voice Ready';
  };

  const getStatusColor = () => {
    if (voiceStatus.isProcessing) return 'bg-yellow-500';
    if (voiceStatus.isOnBreak) return 'bg-orange-500';
    if (voiceStatus.isListening) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getIndicatorAnimation = () => {
    if (voiceStatus.isListening) return 'animate-pulse';
    if (voiceStatus.isProcessing) return 'animate-spin';
    return '';
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg border border-gray-600">
      <div className="flex items-center space-x-3">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()} ${getIndicatorAnimation()}`}></div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{getStatusText()}</span>
          {voiceStatus.isBlindMode && (
            <span className="text-xs text-gray-300">Global Voice Mode</span>
          )}
        </div>
        {voiceStatus.lastCommand && (
          <div className="text-xs text-gray-400 max-w-32 truncate">
            Last: "{voiceStatus.lastCommand}"
          </div>
        )}
      </div>
      
      {/* Command counter */}
      <div className="mt-2 text-xs text-gray-400 text-center">
        Commands: {voiceStatus.commandCount}
      </div>

      {/* Keyboard hint */}
      <div className="mt-1 text-xs text-gray-500 text-center">
        Say "help" or press F1
      </div>
    </div>
  );
};

export default GlobalVoiceIndicator; 