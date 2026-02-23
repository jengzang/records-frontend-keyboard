import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, Alert } from 'antd';
import {
  KeyboardOutlined,
  ClickOutlined,
  DragOutlined,
  CalendarOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import StatCard from '../components/StatCard';
import keyboardApi from '../services/api';
import type { SummaryStats } from '../types';

const Home: React.FC = () => {
  const [stats, setStats] = useState<SummaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await keyboardApi.getSummaryStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError('Failed to load statistics');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Alert
        message="Error"
        description={error || 'Failed to load data'}
        type="error"
        showIcon
      />
    );
  }

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const formatDistance = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${meters.toFixed(0)} m`;
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1>Keyboard & Mouse Usage Dashboard</h1>
      <p style={{ marginBottom: '24px', color: '#666' }}>
        Data range: {stats.dataRange.start} - {stats.dataRange.end}
      </p>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Total Keystrokes"
            value={stats.totalKeystrokes}
            prefix={<KeyboardOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Total Clicks"
            value={stats.totalClicks}
            prefix={<ClickOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Mouse Distance"
            value={formatDistance(stats.totalMouseDistance)}
            prefix={<DragOutlined />}
            valueStyle={{ color: '#cf1322' }}
          />
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Active Days"
            value={stats.activeDays}
            prefix={<CalendarOutlined />}
            suffix="days"
          />
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Avg Keystrokes/Day"
            value={stats.avgKeystrokesPerDay}
            precision={0}
          />
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Avg Clicks/Day"
            value={stats.avgClicksPerDay}
            precision={0}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <StatCard
            title="Peak Day"
            value={`${stats.peakDay.date}: ${formatNumber(stats.peakDay.keystrokes)} keystrokes`}
            prefix={<TrophyOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
        </Col>

        <Col xs={24} lg={12}>
          <StatCard
            title="Avg Mouse Distance/Day"
            value={formatDistance(stats.avgMouseDistancePerDay)}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Home;
