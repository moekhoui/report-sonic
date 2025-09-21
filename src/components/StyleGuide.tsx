import React from 'react';
import Logo from './Logo';

const StyleGuide: React.FC = () => {
  const colorPalette = [
    {
      name: 'Primary Purple',
      colors: [
        { name: '50', value: '#faf5ff', text: '#000' },
        { name: '100', value: '#f3e8ff', text: '#000' },
        { name: '200', value: '#e9d5ff', text: '#000' },
        { name: '300', value: '#d8b4fe', text: '#000' },
        { name: '400', value: '#c084fc', text: '#000' },
        { name: '500', value: '#a855f7', text: '#fff' },
        { name: '600', value: '#9333ea', text: '#fff' },
        { name: '700', value: '#7c3aed', text: '#fff' },
        { name: '800', value: '#6b21a8', text: '#fff' },
        { name: '900', value: '#581c87', text: '#fff' },
      ]
    },
    {
      name: 'Accent Pink',
      colors: [
        { name: '50', value: '#fdf2f8', text: '#000' },
        { name: '100', value: '#fce7f3', text: '#000' },
        { name: '200', value: '#fbcfe8', text: '#000' },
        { name: '300', value: '#f9a8d4', text: '#000' },
        { name: '400', value: '#f472b6', text: '#000' },
        { name: '500', value: '#ec4899', text: '#fff' },
        { name: '600', value: '#db2777', text: '#fff' },
        { name: '700', value: '#be185d', text: '#fff' },
        { name: '800', value: '#9d174d', text: '#fff' },
        { name: '900', value: '#831843', text: '#fff' },
      ]
    }
  ];

  const typography = [
    {
      name: 'Heading 1',
      element: <h1 className="text-5xl font-bold text-purple-600 dark:text-purple-400">REPORT SONIC</h1>,
      description: 'Main brand title - bold, impactful'
    },
    {
      name: 'Heading 2',
      element: <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Section Headers</h2>,
      description: 'Section titles and important headings'
    },
    {
      name: 'Heading 3',
      element: <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Subsection Titles</h3>,
      description: 'Subsection and card titles'
    },
    {
      name: 'Body Text',
      element: <p className="text-base text-gray-600 dark:text-gray-300">Regular body text for content and descriptions.</p>,
      description: 'Main content text'
    },
    {
      name: 'Tagline',
      element: <span className="text-sm text-pink-500 dark:text-pink-400 font-medium">beautify your data</span>,
      description: 'Brand tagline styling'
    }
  ];

  const buttons = [
    {
      name: 'Primary Button',
      element: (
        <button className="btn btn-primary">
          Get Started
        </button>
      ),
      description: 'Main call-to-action buttons'
    },
    {
      name: 'Secondary Button',
      element: (
        <button className="btn btn-secondary">
          Learn More
        </button>
      ),
      description: 'Secondary actions'
    },
    {
      name: 'Outline Button',
      element: (
        <button className="btn btn-outline">
          View Details
        </button>
      ),
      description: 'Alternative actions with outline'
    },
    {
      name: 'Ghost Button',
      element: (
        <button className="btn btn-ghost">
          Cancel
        </button>
      ),
      description: 'Subtle actions'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Report Sonic Style Guide
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Complete design system and branding guidelines
        </p>
      </div>

      {/* Logo Variations */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Logo Variations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Full Logo</h3>
            <Logo size="lg" variant="full" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Complete logo with icon and text
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Icon Only</h3>
            <Logo size="lg" variant="icon" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Just the document icon
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Text Only</h3>
            <Logo size="lg" variant="text" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Typography-only version
            </p>
          </div>
        </div>
      </section>

      {/* Logo Sizes */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Logo Sizes
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <Logo size="sm" variant="full" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Small</p>
            </div>
            <div className="text-center">
              <Logo size="md" variant="full" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Medium</p>
            </div>
            <div className="text-center">
              <Logo size="lg" variant="full" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Large</p>
            </div>
            <div className="text-center">
              <Logo size="xl" variant="full" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Extra Large</p>
            </div>
          </div>
        </div>
      </section>

      {/* Color Palette */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Color Palette
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {colorPalette.map((palette, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">{palette.name}</h3>
              <div className="grid grid-cols-5 gap-2">
                {palette.colors.map((color, colorIndex) => (
                  <div key={colorIndex} className="text-center">
                    <div
                      className="w-16 h-16 rounded-lg border flex items-center justify-center text-xs font-medium"
                      style={{ backgroundColor: color.value, color: color.text }}
                    >
                      {color.name}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {color.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Typography
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <div className="space-y-6">
            {typography.map((type, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{type.name}</h4>
                  <span className="text-sm text-gray-500">{type.description}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded">
                  {type.element}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Buttons
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {buttons.map((button, index) => (
              <div key={index} className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-white">{button.name}</h4>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded">
                  {button.element}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{button.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gradients */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Gradients
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Primary Gradient</h4>
              <div className="gradient-primary h-20 rounded-lg flex items-center justify-center text-white font-medium">
                Purple to Pink
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Main brand gradient for buttons and highlights
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Background Gradient</h4>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 h-20 rounded-lg flex items-center justify-center text-gray-900 dark:text-white font-medium">
                Light Background
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Subtle background gradient for pages
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Card Gradient</h4>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 h-20 rounded-lg flex items-center justify-center text-purple-900 font-medium">
                Card Background
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Subtle gradient for cards and sections
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Guidelines */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Usage Guidelines
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">✅ Do</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Use purple as the primary brand color</li>
                <li>• Use pink as the accent color for highlights</li>
                <li>• Maintain consistent spacing and proportions</li>
                <li>• Ensure proper contrast in both light and dark modes</li>
                <li>• Use the full logo in headers and footers</li>
                <li>• Use icon-only logo in small spaces</li>
                <li>• Test color combinations for accessibility</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400">❌ Don't</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Mix with other brand colors outside the palette</li>
                <li>• Use low contrast combinations</li>
                <li>• Distort or modify the logo proportions</li>
                <li>• Use the logo on busy backgrounds</li>
                <li>• Overuse gradients in small text areas</li>
                <li>• Ignore accessibility guidelines</li>
                <li>• Use colors that don't match the brand identity</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StyleGuide;
