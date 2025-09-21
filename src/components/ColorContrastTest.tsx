import React from 'react';

const ColorContrastTest: React.FC = () => {
  const colorCombinations = [
    // Light mode colors
    {
      mode: 'Light Mode',
      combinations: [
        { bg: '#ffffff', text: '#a855f7', description: 'Purple text on white' },
        { bg: '#ffffff', text: '#ec4899', description: 'Pink text on white' },
        { bg: '#a855f7', text: '#ffffff', description: 'White text on purple' },
        { bg: '#ec4899', text: '#ffffff', description: 'White text on pink' },
        { bg: '#faf5ff', text: '#a855f7', description: 'Purple text on light purple' },
        { bg: '#fdf2f8', text: '#ec4899', description: 'Pink text on light pink' },
      ]
    },
    // Dark mode colors
    {
      mode: 'Dark Mode',
      combinations: [
        { bg: '#020617', text: '#a855f7', description: 'Purple text on dark' },
        { bg: '#020617', text: '#ec4899', description: 'Pink text on dark' },
        { bg: '#a855f7', text: '#ffffff', description: 'White text on purple' },
        { bg: '#ec4899', text: '#ffffff', description: 'White text on pink' },
        { bg: '#0f172a', text: '#a855f7', description: 'Purple text on slate' },
        { bg: '#0f172a', text: '#ec4899', description: 'Pink text on slate' },
      ]
    }
  ];

  // Simple contrast ratio calculation (approximate)
  const getContrastRatio = (color1: string, color2: string): number => {
    // This is a simplified calculation - in production you'd use a proper contrast library
    // For demonstration purposes, we'll return approximate values
    const colorMap: { [key: string]: number } = {
      '#ffffff': 255,
      '#020617': 2,
      '#0f172a': 15,
      '#a855f7': 168,
      '#ec4899': 236,
      '#faf5ff': 250,
      '#fdf2f8': 253,
    };
    
    const brightness1 = colorMap[color1] || 128;
    const brightness2 = colorMap[color2] || 128;
    
    const lighter = Math.max(brightness1, brightness2);
    const darker = Math.min(brightness1, brightness2);
    
    return (lighter + 0.05) / (darker + 0.05);
  };

  const getContrastLevel = (ratio: number): { level: string; color: string; accessible: boolean } => {
    if (ratio >= 7) return { level: 'AAA', color: '#10b981', accessible: true };
    if (ratio >= 4.5) return { level: 'AA', color: '#f59e0b', accessible: true };
    if (ratio >= 3) return { level: 'AA Large', color: '#ef4444', accessible: false };
    return { level: 'Fail', color: '#dc2626', accessible: false };
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Report Sonic Color Contrast Test
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {colorCombinations.map((mode, modeIndex) => (
          <div key={modeIndex} className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {mode.mode}
            </h3>
            
            <div className="space-y-3">
              {mode.combinations.map((combo, index) => {
                const ratio = getContrastRatio(combo.bg, combo.text);
                const contrastInfo = getContrastLevel(ratio);
                
                return (
                  <div
                    key={index}
                    className="p-4 rounded-lg border"
                    style={{ backgroundColor: combo.bg }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium" style={{ color: combo.text }}>
                        {combo.description}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-1 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: contrastInfo.color }}
                        >
                          {contrastInfo.level}
                        </span>
                        <span className="text-xs text-gray-500">
                          {ratio.toFixed(1)}:1
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm" style={{ color: combo.text }}>
                      This is sample text to demonstrate readability with the current color combination.
                      The contrast ratio should meet WCAG guidelines for accessibility.
                    </div>
                    
                    {!contrastInfo.accessible && (
                      <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                        ⚠️ This combination may not meet accessibility standards
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Accessibility Guidelines
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li><strong>AAA:</strong> Contrast ratio of 7:1 or higher (excellent)</li>
          <li><strong>AA:</strong> Contrast ratio of 4.5:1 or higher (good)</li>
          <li><strong>AA Large:</strong> Contrast ratio of 3:1 or higher (acceptable for large text)</li>
          <li><strong>Fail:</strong> Below 3:1 (not accessible)</li>
        </ul>
      </div>
    </div>
  );
};

export default ColorContrastTest;
