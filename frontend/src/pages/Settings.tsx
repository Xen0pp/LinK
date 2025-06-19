import React from 'react';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
}

interface SettingsProps {
  accessibilitySettings: AccessibilitySettings;
  onUpdateSettings: (settings: Partial<AccessibilitySettings>) => void;
}

const Settings: React.FC<SettingsProps> = ({ accessibilitySettings, onUpdateSettings }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Accessibility Settings</h1>
      
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Visual Preferences</h2>
        
        <div className="space-y-6">
          <div className="flex items-center">
            <input
              id="high-contrast"
              type="checkbox"
              checked={accessibilitySettings.highContrast}
              onChange={(e) => onUpdateSettings({ highContrast: e.target.checked })}
              className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="high-contrast" className="ml-3">
              <span className="text-lg font-medium text-gray-700">High Contrast Mode</span>
              <p className="text-gray-600">Increases contrast for better visibility</p>
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="large-text"
              type="checkbox"
              checked={accessibilitySettings.largeText}
              onChange={(e) => onUpdateSettings({ largeText: e.target.checked })}
              className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="large-text" className="ml-3">
              <span className="text-lg font-medium text-gray-700">Large Text</span>
              <p className="text-gray-600">Increases font size for better readability</p>
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="reduced-motion"
              type="checkbox"
              checked={accessibilitySettings.reducedMotion}
              onChange={(e) => onUpdateSettings({ reducedMotion: e.target.checked })}
              className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="reduced-motion" className="ml-3">
              <span className="text-lg font-medium text-gray-700">Reduce Motion</span>
              <p className="text-gray-600">Minimizes animations and transitions</p>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 