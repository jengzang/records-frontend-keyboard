import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, Alert, Card, Button } from 'antd';
import {
  KeyOutlined,
  MouseOutlined,
  DragOutlined,
  CalendarOutlined,
  TrophyOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import keyboardApi from '../services/api';
import type { SummaryStats, TopKey } from '../types';

const Home: React.FC = () => {
  const [stats, setStats] = useState<SummaryStats | null>(null);
  const [topKeys, setTopKeys] = useState<TopKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [summaryData, topKeysData] = await Promise.all([
          keyboardApi.getSummaryStats(),
          keyboardApi.getTopKeys(3),
        ]);
        setStats(summaryData);
        setTopKeys(topKeysData);
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
            prefix={<KeyOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Total Clicks"
            value={stats.totalClicks}
            prefix={<MouseOutlined />}
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

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24}>
          <Card
            title={
              <span>
                <TrophyOutlined style={{ marginRight: 8 }} />
                Top 3 Most Used Keys
              </span>
            }
            extra={
              <Button type="link" onClick={() => navigate('/top-keys')}>
                View All <RightOutlined />
              </Button>
            }
          >
            {topKeys.length > 0 ? (
              <Row gutter={[16, 16]}>
                {topKeys.map((key, index) => (
                  <Col xs={24} sm={8} key={key.scancode}>
                    <Card
                      style={{
                        background: index === 0 ? '#fff7e6' : index === 1 ? '#f0f0f0' : '#fafafa',
                        border: index === 0 ? '2px solid #faad14' : '1px solid #d9d9d9',
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', marginBottom: 8 }}>
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace' }}>
                          {key.keyName}
                        </div>
                        <div style={{ fontSize: '18px', color: '#666', marginTop: 8 }}>
                          {formatNumber(key.count)} times
                        </div>
                        <div style={{ fontSize: '14px', color: '#999' }}>
                          {key.percentage.toFixed(2)}% of total
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                No data available
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Button
              type="primary"
              block
              size="large"
              onClick={() => navigate('/statistics')}
            >
              View Detailed Statistics
            </Button>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Button
              type="default"
              block
              size="large"
              onClick={() => navigate('/heatmap')}
            >
              View Keyboard Heatmap
            </Button>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Button
              type="default"
              block
              size="large"
              onClick={() => navigate('/trends')}
            >
              View Usage Trends
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
