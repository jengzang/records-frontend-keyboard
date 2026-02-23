import React, { useEffect, useState } from 'react';
import { Card, Select, DatePicker, Space, Spin, Alert, Row, Col } from 'antd';
import { Line } from '@ant-design/charts';
import dayjs, { Dayjs } from 'dayjs';
import keyboardApi from '../services/api';
import type { TrendData } from '../types';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Trends: React.FC = () => {
  const [data, setData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [granularity, setGranularity] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  const fetchData = async (
    gran: 'daily' | 'weekly' | 'monthly',
    start?: string,
    end?: string
  ) => {
    try {
      setLoading(true);
      const trends = await keyboardApi.getTrends({
        granularity: gran,
        start,
        end,
      });
      setData(trends);
      setError(null);
    } catch (err) {
      setError('Failed to load trend data');
      console.error('Error fetching trends:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const start = dateRange?.[0]?.format('YYYYMMDD');
    const end = dateRange?.[1]?.format('YYYYMMDD');
    fetchData(granularity, start, end);
  }, [granularity, dateRange]);

  const formatDate = (dateStr: string): string => {
    if (dateStr.length === 8) {
      return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
    }
    return dateStr;
  };

  const keystrokesConfig = {
    data: data.map((d) => ({ date: formatDate(d.date), value: d.keystrokes })),
    xField: 'date',
    yField: 'value',
    point: {
      size: 3,
      shape: 'circle',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  const clicksConfig = {
    data: data.map((d) => ({ date: formatDate(d.date), value: d.clicks })),
    xField: 'date',
    yField: 'value',
    point: {
      size: 3,
      shape: 'circle',
    },
    smooth: true,
    color: '#1890ff',
  };

  const distanceConfig = {
    data: data.map((d) => ({ date: formatDate(d.date), value: d.distance })),
    xField: 'date',
    yField: 'value',
    point: {
      size: 3,
      shape: 'circle',
    },
    smooth: true,
    color: '#cf1322',
  };

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ margin: '24px' }}
      />
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Usage Trends</h1>

      <Space style={{ marginBottom: '16px' }}>
        <Select
          value={granularity}
          onChange={setGranularity}
          style={{ width: 120 }}
        >
          <Option value="daily">Daily</Option>
          <Option value="weekly">Weekly</Option>
          <Option value="monthly">Monthly</Option>
        </Select>

        <RangePicker
          value={dateRange}
          onChange={setDateRange}
          format="YYYY-MM-DD"
        />
      </Space>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="Keystrokes Trend" bordered={false}>
              <Line {...keystrokesConfig} />
            </Card>
          </Col>

          <Col span={24}>
            <Card title="Clicks Trend" bordered={false}>
              <Line {...clicksConfig} />
            </Card>
          </Col>

          <Col span={24}>
            <Card title="Mouse Distance Trend (meters)" bordered={false}>
              <Line {...distanceConfig} />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Trends;
