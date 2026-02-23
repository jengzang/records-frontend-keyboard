import React from 'react';
import { ArrowUpOutlined, ArrowDownOutlined, MinusOutlined } from '@ant-design/icons';
import './KeyTooltip.css';

export interface KeyHeatmapData {
  scancode: number;
  keyName: string;
  keyCategory: string;
  totalCount: number;
  peakCount: number;
  peakDate: string;
  avgCountPerDay: number;
  percentage: number;
  dayCount: number;
}

interface KeyTooltipProps {
  data: KeyHeatmapData;
  position: { x: number; y: number };
}

const KeyTooltip: React.FC<KeyTooltipProps> = ({ data, position }) => {
  // Format date from YYYYMMDD to YYYY-MM-DD
  const formatDate = (dateStr: string): string => {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
  };

  // Determine trend (simplified - could be enhanced with actual trend calculation)
  const getTrendIcon = () => {
    // For now, just show neutral
    // In a real implementation, you'd compare recent usage to historical average
    return <MinusOutlined style={{ color: '#999' }} />;
  };

  return (
    <div
      className="key-tooltip"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="tooltip-header">
        <strong className="tooltip-key-name">{data.keyName}</strong>
        <span className="tooltip-category">{data.keyCategory}</span>
      </div>

      <div className="tooltip-stats">
        <div className="tooltip-stat-row">
          <span className="tooltip-stat-label">Total Count:</span>
          <strong className="tooltip-stat-value">{data.totalCount.toLocaleString()}</strong>
        </div>

        <div className="tooltip-stat-row">
          <span className="tooltip-stat-label">Peak Count:</span>
          <strong className="tooltip-stat-value">{data.peakCount.toLocaleString()}</strong>
        </div>

        <div className="tooltip-stat-row">
          <span className="tooltip-stat-label">Peak Date:</span>
          <strong className="tooltip-stat-value">{formatDate(data.peakDate)}</strong>
        </div>

        <div className="tooltip-stat-row">
          <span className="tooltip-stat-label">Avg/Day:</span>
          <strong className="tooltip-stat-value">{data.avgCountPerDay.toFixed(1)}</strong>
        </div>

        <div className="tooltip-stat-row">
          <span className="tooltip-stat-label">Percentage:</span>
          <strong className="tooltip-stat-value">{data.percentage.toFixed(2)}%</strong>
        </div>

        <div className="tooltip-stat-row">
          <span className="tooltip-stat-label">Days Active:</span>
          <strong className="tooltip-stat-value">{data.dayCount}</strong>
        </div>
      </div>
    </div>
  );
};

export default KeyTooltip;
