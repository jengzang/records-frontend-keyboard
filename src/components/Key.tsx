import React from 'react';
import { KeyConfig } from '../config/keyboardLayout';
import { getKeyColor, getTextColor } from '../utils/colorMapping';
import './Key.css';

interface KeyProps {
  config: KeyConfig;
  count: number;
  maxCount: number;
  onHover: (keyId: string | null) => void;
}

const Key: React.FC<KeyProps> = ({ config, count, maxCount, onHover }) => {
  const backgroundColor = getKeyColor(count, maxCount);
  const textColor = getTextColor(backgroundColor);

  return (
    <div
      className={`key key-${config.width}`}
      style={{
        backgroundColor,
        color: textColor,
      }}
      onMouseEnter={() => onHover(config.id)}
      onMouseLeave={() => onHover(null)}
      data-scancode={config.scancode}
      data-count={count}
    >
      <span className="key-label">{config.label}</span>
      {count > 0 && (
        <span className="key-count">{count.toLocaleString()}</span>
      )}
    </div>
  );
};

export default Key;
