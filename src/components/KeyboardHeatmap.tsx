import React, { useState, useEffect, useRef } from 'react';
import Key from './Key';
import KeyTooltip, { KeyHeatmapData } from './KeyTooltip';
import { keyboardLayout, KeyConfig } from '../config/keyboardLayout';
import { getColorScaleLegend } from '../utils/colorMapping';
import './KeyboardHeatmap.css';

interface KeyboardHeatmapProps {
  data: KeyHeatmapData[];
  loading?: boolean;
  onKeyClick?: (keyData: KeyHeatmapData) => void;
}

const KeyboardHeatmap: React.FC<KeyboardHeatmapProps> = ({ data, loading = false, onKeyClick }) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [maxCount, setMaxCount] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate max count for color scaling
  useEffect(() => {
    if (data && data.length > 0) {
      const max = Math.max(...data.map(d => d.totalCount));
      setMaxCount(max);
    }
  }, [data]);

  // Get count for a specific key
  const getKeyCount = (scancode: number): number => {
    const keyData = data.find(d => d.scancode === scancode);
    return keyData ? keyData.totalCount : 0;
  };

  // Get full data for a specific key
  const getKeyData = (keyId: string): KeyHeatmapData | undefined => {
    const keyConfig = [...keyboardLayout.functionRow, ...keyboardLayout.numberRow,
      ...keyboardLayout.qwertyRow, ...keyboardLayout.asdfRow,
      ...keyboardLayout.zxcvRow, ...keyboardLayout.bottomRow]
      .find(k => k.id === keyId);

    if (!keyConfig) return undefined;

    return data.find(d => d.scancode === keyConfig.scancode);
  };

  // Handle key hover
  const handleKeyHover = (keyId: string | null, event?: React.MouseEvent) => {
    setHoveredKey(keyId);

    if (keyId && event) {
      // Position tooltip near the cursor
      const x = event.clientX + 15;
      const y = event.clientY + 15;

      // Adjust if tooltip would go off screen
      const tooltipWidth = 220;
      const tooltipHeight = 200;
      const adjustedX = x + tooltipWidth > window.innerWidth ? x - tooltipWidth - 30 : x;
      const adjustedY = y + tooltipHeight > window.innerHeight ? y - tooltipHeight - 30 : y;

      setTooltipPosition({ x: adjustedX, y: adjustedY });
    }
  };

  // Handle key click
  const handleKeyClick = (keyId: string) => {
    const keyData = getKeyData(keyId);
    if (keyData && onKeyClick) {
      onKeyClick(keyData);
    }
  };

  // Render a row of keys
  const renderKeyRow = (keys: KeyConfig[]) => {
    return (
      <div className="keyboard-row">
        {keys.map(keyConfig => (
          <div
            key={keyConfig.id}
            onMouseMove={(e) => handleKeyHover(keyConfig.id, e)}
            onClick={() => handleKeyClick(keyConfig.id)}
            style={{ cursor: onKeyClick ? 'pointer' : 'default' }}
          >
            <Key
              config={keyConfig}
              count={getKeyCount(keyConfig.scancode)}
              maxCount={maxCount}
              onHover={handleKeyHover}
            />
          </div>
        ))}
      </div>
    );
  };

  // Get color scale legend
  const colorLegend = maxCount > 0 ? getColorScaleLegend(maxCount) : [];

  if (loading) {
    return (
      <div className="keyboard-heatmap-loading">
        <div className="loading-spinner"></div>
        <p>Loading keyboard heatmap...</p>
      </div>
    );
  }

  return (
    <div className="keyboard-heatmap-container" ref={containerRef}>
      <div className="keyboard-heatmap">
        {renderKeyRow(keyboardLayout.functionRow)}
        {renderKeyRow(keyboardLayout.numberRow)}
        {renderKeyRow(keyboardLayout.qwertyRow)}
        {renderKeyRow(keyboardLayout.asdfRow)}
        {renderKeyRow(keyboardLayout.zxcvRow)}
        {renderKeyRow(keyboardLayout.bottomRow)}
      </div>

      {/* Color scale legend */}
      {maxCount > 0 && (
        <div className="color-scale-legend">
          <div className="legend-title">Usage Intensity</div>
          <div className="legend-scale">
            {colorLegend.map((item, index) => (
              <div key={index} className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: item.color }}
                ></div>
                {index % 2 === 0 && (
                  <span className="legend-label">{item.label}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tooltip */}
      {hoveredKey && getKeyData(hoveredKey) && (
        <KeyTooltip
          data={getKeyData(hoveredKey)!}
          position={tooltipPosition}
        />
      )}
    </div>
  );
};

export default KeyboardHeatmap;
