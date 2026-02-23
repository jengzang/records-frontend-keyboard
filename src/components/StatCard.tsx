import React from 'react';
import { Card, Statistic } from 'antd';
import type { StatisticProps } from 'antd';

interface StatCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  prefix?: React.ReactNode;
  precision?: number;
  valueStyle?: React.CSSProperties;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  suffix,
  prefix,
  precision,
  valueStyle,
  loading = false,
}) => {
  return (
    <Card bordered={false} loading={loading}>
      <Statistic
        title={title}
        value={value}
        suffix={suffix}
        prefix={prefix}
        precision={precision}
        valueStyle={valueStyle}
      />
    </Card>
  );
};

export default StatCard;
