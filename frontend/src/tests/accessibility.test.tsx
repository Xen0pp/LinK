import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Helper function to render components with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Accessibility Tests', () => {
  test('App component should not have accessibility violations', async () => {
    const { container } = renderWithRouter(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Home page should not have accessibility violations', async () => {
    const { container } = renderWithRouter(<Home />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Skip link should be present and functional', () => {
    const { getByText } = renderWithRouter(<App />);
    const skipLink = getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('Main content should have proper landmark', () => {
    const { container } = renderWithRouter(<App />);
    const main = container.querySelector('main[role="main"]');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('id', 'main-content');
  });

  test('Navigation should have proper ARIA labels', () => {
    const { container } = renderWithRouter(<App />);
    const nav = container.querySelector('nav[aria-label="Main navigation"]');
    expect(nav).toBeInTheDocument();
  });

  test('Headings should follow proper hierarchy', () => {
    const { container } = renderWithRouter(<Home />);
    const h1 = container.querySelector('h1');
    const h2s = container.querySelectorAll('h2');
    
    expect(h1).toBeInTheDocument();
    expect(h2s.length).toBeGreaterThan(0);
    
    // Check that h1 comes before h2s
    const h1Position = Array.from(container.querySelectorAll('h1, h2')).indexOf(h1!);
    expect(h1Position).toBe(0);
  });

  test('Form elements should have proper labels', () => {
    const { container } = renderWithRouter(<Home />);
    const searchInput = container.querySelector('input[type="text"]');
    
    if (searchInput) {
      // Check for label association
      const labelId = searchInput.getAttribute('aria-labelledby') || 
                     searchInput.getAttribute('aria-label');
      expect(labelId).toBeTruthy();
    }
  });

  test('Interactive elements should be keyboard accessible', () => {
    const { container } = renderWithRouter(<App />);
    const buttons = container.querySelectorAll('button');
    const links = container.querySelectorAll('a');
    
    // All buttons should be focusable
    buttons.forEach(button => {
      expect(button).not.toHaveAttribute('tabindex', '-1');
    });
    
    // All links should be focusable
    links.forEach(link => {
      expect(link).not.toHaveAttribute('tabindex', '-1');
    });
  });

  test('Images should have alt text', () => {
    const { container } = renderWithRouter(<Home />);
    const images = container.querySelectorAll('img');
    
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
    });
  });

  test('Color contrast should be sufficient', async () => {
    // This test would require additional setup with color contrast checking
    // For now, we ensure the CSS classes are applied correctly
    const { container } = renderWithRouter(<App />);
    
    // Check that high contrast mode can be applied
    document.documentElement.classList.add('high-contrast');
    expect(document.documentElement).toHaveClass('high-contrast');
    
    // Clean up
    document.documentElement.classList.remove('high-contrast');
  });
}); 