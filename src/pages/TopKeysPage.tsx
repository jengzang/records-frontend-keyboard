import React, { useState, useEffect } from 'react';
import { Card, Table, Spin, Alert, DatePicker, Space, Button, Statistic, Row, Col } from 'antd';
import { ReloadOutlined, TrophyOutlined, KeyOutlined } from '@ant-design/icons';
import { keyboardApi } from '../services/api';
import type { TopKey } from '../types';

const { RangePicker } = DatePicker;

const TopKeysPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topKeys, setTopKeys] = useState<TopKey[]>([]);
  const [dateRange, setDateRange] = useState<any>(null);

  const fetchTopKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await keyboardApi.getTopKeys(20);
      setTopKeys(data);
    } catch (err) {
      console.error('Error fetching top keys:', err);
      setError('Failed to load top keys data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopKeys();
  }, [dateRange]);

  const handleRefresh = () => {
    fetchTopKeys();
  };

  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates);
  };

  const columns = [
    {
      title: 'Rank',
      key: 'rank',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
          {index === 0 && <TrophyOutlined style={{ color: '#FFD700', marginRight: 8 }} />}
          {index === 1 && <TrophyOutlined style={{ color: '#C0C0C0', marginRight: 8 }} />}
          {index === 2 && <TrophyOutlined style={{ color: '#CD7F32', marginRight: 8 }} />}
          #{index + 1}
        </span>
      ),
    },
    {
      title: 'Key Name',
      dataIndex: 'keyName',
      key: 'keyName',
      render: (text: string) => (
        <span style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: 'monospace' }}>
          <KeyOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      ),
    },
    {
      title: 'Usage Count',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: TopKey, b: TopKey) => a.count - b.count,
      render: (count: number) => count.toLocaleString(),
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      sorter: (a: TopKey, b: TopKey) => a.percentage - b.percentage,
      render: (percentage: number) => `${percentage.toFixed(2)}%`,
    },
  ];

  const totalCount = topKeys.reduce((sum, key) => sum + key.count, 0);
  const top3Count = topKeys.slice(0, 3).reduce((sum, key) => sum + key.count, 0);
  const top3Percentage = totalCount > 0 ? (top3Count / totalCount) * 100 : 0;

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" danger onClick={handleRefresh}>
            Try Again
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <Card
        title={
          <span style={{ fontSize: '20px' }}>
            <TrophyOutlined style={{ marginRight: 8 }} />
            Top Keys Leaderboard
          </span>
        }
        extra={
          <Space>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              format="YYYY-MM-DD"
            />
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              Refresh
            </Button>
          </Space>
        }
      >
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Keys Tracked"
                value={topKeys.length}
                suffix="keys"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Usage Count"
                value={totalCount}
                formatter={(value) => value.toLocaleString()}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Top 3 Keys Share"
                value={top3Percentage}
                precision={2}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={topKeys}
            rowKey="scancode"
            pagination={{ pageSize: 20, showSizeChanger: false }}
            size="middle"
          />
        </Spin>
      </Card>
    </div>
  );
};

export default TopKeysPage;
