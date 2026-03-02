import React, { useEffect, useState } from 'react';
import { Card, Spin, Alert, Row, Col, Statistic, Progress, Table, Tabs } from 'antd';
import { HeartOutlined, ThunderboltOutlined, TrophyOutlined } from '@ant-design/icons';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface KeyboardHealthCorrelation {
  correlationScore: number;
  typingActivityCorr: TypingActivityCorrelation;
  typingIntensityCorr: TypingIntensityCorr;
  sedentaryAnalysis: SedentaryAnalysis;
  workdayHealth: WorkdayHealthPattern;
  recommendations: string[];
}

interface TypingActivityCorrelation {
  correlationCoefficient: number;
  correlationType: string;
  avgKeystrokesPerDay: number;
  avgStepsPerDay: number;
  dataPoints: ActivityDataPoint[];
}

interface ActivityDataPoint {
  date: string;
  keystrokes: number;
  steps: number;
}

interface TypingIntensityCorr {
  correlationCoefficient: number;
  avgKeystrokesPerHour: number;
  avgHeartRate: number;
  intensityLevels: IntensityLevel[];
}

interface IntensityLevel {
  level: string;
  keystrokeRange: string;
  avgHeartRate: number;
  dayCount: number;
}

interface SedentaryAnalysis {
  sedentaryDays: number;
  totalDays: number;
  sedentaryRate: number;
  avgStepsOnSedentary: number;
  avgStepsOnActive: number;
  healthImpact: string;
  sedentaryDayDetails: SedentaryDayDetail[];
}

interface SedentaryDayDetail {
  date: string;
  keystrokes: number;
  steps: number;
  heartRate: number;
}

interface WorkdayHealthPattern {
  workdayAvgKeystrokes: number;
  weekendAvgKeystrokes: number;
  workdayAvgSteps: number;
  weekendAvgSteps: number;
  workdayAvgHeartRate: number;
  weekendAvgHeartRate: number;
  healthBalance: string;
}

const KeyboardHealthCorrelation: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<KeyboardHealthCorrelation | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:9000/api/v1/keyboard/analysis/keyboard-health-correlation');
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !data) {
    return <Alert message="错误" description={error || '无数据'} type="error" showIcon />;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    return '#f5222d';
  };

  const sedentaryColumns = [
    { title: '日期', dataIndex: 'date', key: 'date' },
    { title: '打字量', dataIndex: 'keystrokes', key: 'keystrokes', render: (val: number) => val.toLocaleString() },
    { title: '步数', dataIndex: 'steps', key: 'steps', render: (val: number) => val.toLocaleString() },
    { title: '心率', dataIndex: 'heartRate', key: 'heartRate', render: (val: number) => val > 0 ? `${val} bpm` : 'N/A' },
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '24px' }}>键盘×健康关联分析</h1>

      {/* 总体评分 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="circle"
                percent={Math.round(data.correlationScore)}
                strokeColor={getScoreColor(data.correlationScore)}
                format={(percent) => `${percent}分`}
                width={150}
              />
              <h3 style={{ marginTop: '16px' }}>健康关联评分</h3>
            </div>
          </Col>
          <Col span={16}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="日均打字量"
                  value={Math.round(data.typingActivityCorr.avgKeystrokesPerDay)}
                  suffix="次"
                  prefix={<ThunderboltOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="日均步数"
                  value={Math.round(data.typingActivityCorr.avgStepsPerDay)}
                  suffix="步"
                  prefix={<HeartOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="相关性类型"
                  value={data.typingActivityCorr.correlationType}
                  valueStyle={{ fontSize: '20px' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="工作生活平衡"
                  value={data.workdayHealth.healthBalance}
                  valueStyle={{ fontSize: '20px', color: data.workdayHealth.healthBalance === '良好' ? '#52c41a' : '#faad14' }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* 久坐分析 */}
      <Card title={<span><TrophyOutlined style={{ marginRight: '8px' }} />久坐行为分析</span>} style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="久坐天数"
              value={data.sedentaryAnalysis.sedentaryDays}
              suffix={`/ ${data.sedentaryAnalysis.totalDays}天`}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="久坐率"
              value={data.sedentaryAnalysis.sedentaryRate.toFixed(1)}
              suffix="%"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="久坐日平均步数"
              value={Math.round(data.sedentaryAnalysis.avgStepsOnSedentary)}
              suffix="步"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="健康影响"
              value={data.sedentaryAnalysis.healthImpact}
              valueStyle={{ color: data.sedentaryAnalysis.healthImpact === '高风险' ? '#f5222d' : '#52c41a' }}
            />
          </Col>
        </Row>
      </Card>

      {/* 工作日vs周末 */}
      <Card title="工作日vs周末对比" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="工作日平均打字量" value={Math.round(data.workdayHealth.workdayAvgKeystrokes)} suffix="次" />
            <Statistic title="周末平均打字量" value={Math.round(data.workdayHealth.weekendAvgKeystrokes)} suffix="次" style={{ marginTop: '16px' }} />
          </Col>
          <Col span={8}>
            <Statistic title="工作日平均步数" value={Math.round(data.workdayHealth.workdayAvgSteps)} suffix="步" />
            <Statistic title="周末平均步数" value={Math.round(data.workdayHealth.weekendAvgSteps)} suffix="步" style={{ marginTop: '16px' }} />
          </Col>
          <Col span={8}>
            <Statistic title="工作日平均心率" value={data.workdayHealth.workdayAvgHeartRate.toFixed(1)} suffix="bpm" />
            <Statistic title="周末平均心率" value={data.workdayHealth.weekendAvgHeartRate.toFixed(1)} suffix="bpm" style={{ marginTop: '16px' }} />
          </Col>
        </Row>
      </Card>

      {/* 健康建议 */}
      <Card title="健康建议" style={{ marginBottom: '24px' }}>
        <ul>
          {data.recommendations.map((rec, idx) => (
            <li key={idx} style={{ marginBottom: '8px', fontSize: '14px' }}>{rec}</li>
          ))}
        </ul>
      </Card>

      {/* 详细数据 */}
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="久坐日详情" key="1">
          <Table
            columns={sedentaryColumns}
            dataSource={data.sedentaryAnalysis.sedentaryDayDetails}
            rowKey="date"
            pagination={{ pageSize: 10 }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="活动散点图" key="2">
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="keystrokes" name="打字量" unit="次" />
              <YAxis dataKey="steps" name="步数" unit="步" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name="每日数据" data={data.typingActivityCorr.dataPoints} fill="#1890ff" />
            </ScatterChart>
          </ResponsiveContainer>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default KeyboardHealthCorrelation;
