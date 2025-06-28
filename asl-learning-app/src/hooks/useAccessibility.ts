import { useEffect, useCallback } from 'react';
import { UserPreferences } from '../types';

/**
 * Custom hook for managing accessibility features
 * @param preferences - User preferences for accessibility
 */
export function useAccessibility(preferences: UserPreferences) {
  
  // Apply font size changes
  const applyFontSize = useCallback((fontSize: 'small' | 'medium' | 'large') => {
    const root = document.documentElement;
    switch (fontSize) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'medium':
        root.style.fontSize = '16px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
    }
  }, []);

  // Apply high contrast mode
  const applyHighContrast = useCallback((enabled: boolean) => {
    const root = document.documentElement;
    if (enabled) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, []);

  // Apply reduced motion
  const applyReducedMotion = useCallback((enabled: boolean) => {
    const root = document.documentElement;
    if (enabled) {
      root.classList.add('motion-reduce');
      // Set CSS custom property for animations
      root.style.setProperty('--animation-duration', '0ms');
      root.style.setProperty('--transition-duration', '0ms');
    } else {
      root.classList.remove('motion-reduce');
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }
  }, []);

  // Apply theme
  const applyTheme = useCallback((theme: 'light' | 'dark' | 'auto') => {
    const root = document.documentElement;
    
    if (theme === 'auto') {
      // Remove explicit theme classes and let CSS media queries handle it
      root.classList.remove('light', 'dark');
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
  }, []);

  // Set up keyboard navigation enhancements
  const setupKeyboardNavigation = useCallback(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Enhanced focus management
      if (event.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
      
      // Skip to main content with Alt+M
      if (event.altKey && event.key === 'm') {
        event.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      }
      
      // Skip to navigation with Alt+N
      if (event.altKey && event.key === 'n') {
        event.preventDefault();
        const navigation = document.querySelector('nav');
        if (navigation) {
          const firstLink = navigation.querySelector('a, button');
          if (firstLink instanceof HTMLElement) {
            firstLink.focus();
          }
        }
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-navigation');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Enhance focus indicators
  const setupFocusIndicators = useCallback(() => {
    const style = document.createElement('style');
    style.textContent = `
      .keyboard-navigation *:focus {
        outline: 3px solid #3b82f6 !important;
        outline-offset: 2px !important;
        border-radius: 4px;
      }
      
      .keyboard-navigation button:focus,
      .keyboard-navigation input:focus,
      .keyboard-navigation select:focus,
      .keyboard-navigation textarea:focus {
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5) !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Set up screen reader announcements
  const setupScreenReaderAnnouncements = useCallback(() => {
    // Create a live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.id = 'live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    
    document.body.appendChild(liveRegion);

    // Global function to announce to screen readers
    (window as any).announceToScreenReader = (message: string) => {
      liveRegion.textContent = message;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    };

    return () => {
      if (document.body.contains(liveRegion)) {
        document.body.removeChild(liveRegion);
      }
      delete (window as any).announceToScreenReader;
    };
  }, []);

  // Apply all accessibility preferences
  useEffect(() => {
    applyFontSize(preferences.fontSize);
    applyHighContrast(preferences.highContrast);
    applyReducedMotion(preferences.reduceMotion);
    applyTheme(preferences.theme);

    // Set up keyboard navigation and screen reader support
    const keyboardCleanup = setupKeyboardNavigation();
    const focusCleanup = setupFocusIndicators();
    const screenReaderCleanup = setupScreenReaderAnnouncements();

    // Set up prefers-reduced-motion media query listener
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches && !preferences.reduceMotion) {
        // User prefers reduced motion but hasn't explicitly set it
        applyReducedMotion(true);
      }
    };
    
    mediaQuery.addEventListener('change', handleMediaChange);

    // Cleanup function
    return () => {
      keyboardCleanup();
      focusCleanup();
      screenReaderCleanup();
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, [
    preferences.fontSize,
    preferences.highContrast,
    preferences.reduceMotion,
    preferences.theme,
    applyFontSize,
    applyHighContrast,
    applyReducedMotion,
    applyTheme,
    setupKeyboardNavigation,
    setupFocusIndicators,
    setupScreenReaderAnnouncements
  ]);

  // Return utility functions that components can use
  return {
    announceToScreenReader: (message: string) => {
      if ((window as any).announceToScreenReader) {
        (window as any).announceToScreenReader(message);
      }
    },
    
    focusElement: (selector: string) => {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
    
    skipToMain: () => {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
} 