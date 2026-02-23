import React, { useEffect, useState } from 'react';
import { Card, Select, DatePicker, Space, Spin, Alert, Row, Col, Tabs } from 'antd';
import { Line, Column } from '@ant-design/charts';
import { keyboardApi } from '../services/api';
import type { DailyStat } from '../types';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const Trends: React.FC = () => {
  const [data, setData] = useState<DailyStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<any>(null);

  const fetchData = async (start?: string, end?: string) => {
    try {
      setLoading(true);
      const dailyStats = await keyboardApi.getDailyStats({
        start,
        end,
        limit: 365, // Get up to 1 year of data
      });
      setData(dailyStats);
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
    fetchData(start, end);
  }, [dateRange]);

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
    smooth: true,
    color: '#52c41a',
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  const totalClicksConfig = {
    data: data.map((d) => ({
      date: formatDate(d.date),
      value: d.leftClicks + d.rightClicks + d.middleClicks + d.extraClicks,
    })),
    xField: 'date',
    yField: 'value',
    point: {
      size: 3,
      shape: 'circle',
    },
    smooth: true,
    color: '#1890ff',
  };

  const clickTypeConfig = {
    data: data.flatMap((d) => [
      { date: formatDate(d.date), type: 'Left Click', value: d.leftClicks },
      { date: formatDate(d.date), type: 'Right Click', value: d.rightClicks },
      { date: formatDate(d.date), type: 'Middle Click', value: d.middleClicks },
    ]),
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    legend: {
      position: 'top' as const,
    },
    color: ['#1890ff', '#52c41a', '#faad14'],
  };

  const wheelScrollsConfig = {
    data: data.map((d) => ({
      date: formatDate(d.date),
      'Vertical Scroll': d.wheelScrolls,
      'Horizontal Scroll': d.hWheelScrolls,
    })),
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    color: ['#722ed1', '#eb2f96'],
  };

  const distanceConfig = {
    data: data.map((d) => ({ date: formatDate(d.date), value: d.mouseDistanceM })),
    xField: 'date',
    yField: 'value',
    point: {
      size: 3,
      shape: 'circle',
    },
    smooth: true,
    color: '#cf1322',
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1>Usage Trends</h1>
      <p style={{ color: '#666', marginBottom: 16 }}>
        Detailed analysis of keyboard and mouse usage patterns over time
      </p>

      <Space style={{ marginBottom: '16px' }}>
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
        <Tabs defaultActiveKey="keyboard" type="card">
          <TabPane tab="Keyboard Trends" key="keyboard">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="Keystrokes Trend" bordered={false}>
                  <Line {...keystrokesConfig} />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Mouse Clicks" key="clicks">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="Total Clicks Trend" bordered={false}>
                  <Line {...totalClicksConfig} />
                </Card>
              </Col>
              <Col span={24}>
                <Card title="Click Type Distribution" bordered={false}>
                  <Line {...clickTypeConfig} />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Mouse Scrolling" key="scrolling">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="Scroll Wheel Usage" bordered={false}>
                  <Column
                    {...wheelScrollsConfig}
                    data={data.flatMap((d) => [
                      { date: formatDate(d.date), type: 'Vertical Scroll', value: d.wheelScrolls },
                      { date: formatDate(d.date), type: 'Horizontal Scroll', value: d.hWheelScrolls },
                    ])}
                    xField="date"
                    yField="value"
                    seriesField="type"
                    isGroup={true}
                    columnStyle={{
                      radius: [4, 4, 0, 0],
                    }}
                    color={['#722ed1', '#eb2f96']}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Mouse Movement" key="movement">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="Mouse Distance Trend (meters)" bordered={false}>
                  <Line {...distanceConfig} />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Multi-Metric Comparison" key="comparison">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="Keystrokes vs Clicks" bordered={false} size="small">
                  <Line
                    data={data.flatMap((d) => [
                      { date: formatDate(d.date), type: 'Keystrokes', value: d.keystrokes },
                      {
                        date: formatDate(d.date),
                        type: 'Total Clicks',
                        value: d.leftClicks + d.rightClicks + d.middleClicks + d.extraClicks,
                      },
                    ])}
                    xField="date"
                    yField="value"
                    seriesField="type"
                    smooth={true}
                    color={['#52c41a', '#1890ff']}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Activity Intensity" bordered={false} size="small">
                  <Line
                    data={data.map((d) => ({
                      date: formatDate(d.date),
                      value:
                        d.keystrokes +
                        d.leftClicks +
                        d.rightClicks +
                        d.middleClicks +
                        d.extraClicks,
                    }))}
                    xField="date"
                    yField="value"
                    smooth={true}
                    color="#fa8c16"
                    point={{
                      size: 3,
                      shape: 'circle',
                    }}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      )}
    </div>
  );
};

export default Trends;
