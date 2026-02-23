import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, Alert, Statistic, Progress, Tabs, DatePicker, Space, Button } from 'antd';
import { Line, Column, Pie } from '@ant-design/charts';
import { ReloadOutlined, TrophyOutlined, FireOutlined, ThunderboltOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { keyboardApi } from '../services/api';
import type {
  TemporalAnalysis,
  WeekdayVsWeekend,
  CategoryDistribution,
  TypingBehaviorMetrics,
  ProductivityMetrics,
} from '../types';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const StatisticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  // Data states
  const [dayOfWeekData, setDayOfWeekData] = useState<TemporalAnalysis[]>([]);
  const [monthlyData, setMonthlyData] = useState<TemporalAnalysis[]>([]);
  const [weekdayVsWeekend, setWeekdayVsWeekend] = useState<WeekdayVsWeekend | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryDistribution[]>([]);
  const [typingMetrics, setTypingMetrics] = useState<TypingBehaviorMetrics | null>(null);
  const [productivityMetrics, setProductivityMetrics] = useState<ProductivityMetrics | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = dateRange
        ? { start: dateRange[0].format('YYYYMMDD'), end: dateRange[1].format('YYYYMMDD') }
        : {};

      // Fetch all analysis data in parallel
      const [
        dayOfWeek,
        monthly,
        weekdayWeekend,
        categories,
        typing,
        productivity,
      ] = await Promise.all([
        keyboardApi.getTemporalAnalysis({ type: 'daily', ...params }),
        keyboardApi.getTemporalAnalysis({ type: 'monthly', ...params }),
        keyboardApi.getTemporalAnalysis({ type: 'weekday_vs_weekend', ...params }),
        keyboardApi.getCategoryAnalysis({ type: 'distribution', ...params }),
        keyboardApi.getTypingBehavior({ type: 'metrics', ...params }),
        keyboardApi.getProductivityMetrics({ type: 'activity', ...params }),
      ]);

      setDayOfWeekData(dayOfWeek as TemporalAnalysis[]);
      setMonthlyData(monthly as TemporalAnalysis[]);
      setWeekdayVsWeekend(weekdayWeekend as WeekdayVsWeekend);
      setCategoryData(categories as CategoryDistribution[]);
      setTypingMetrics(typing as TypingBehaviorMetrics);
      setProductivityMetrics(productivity as ProductivityMetrics);
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError('Failed to load statistics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [dateRange]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <Spin size="large" />
        <p style={{ marginTop: '16px', color: '#8c8c8c' }}>Loading statistics...</p>
      </div>
    );
  }

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

  // Chart configurations
  const dayOfWeekChartConfig = {
    data: dayOfWeekData,
    xField: 'dayName',
    yField: 'avgKeystrokes',
    label: {
      position: 'top' as const,
      style: { fill: '#000', opacity: 0.6 },
    },
    xAxis: { label: { autoRotate: false } },
    meta: {
      dayName: { alias: 'Day of Week' },
      avgKeystrokes: { alias: 'Avg Keystrokes' },
    },
  };

  const monthlyChartConfig = {
    data: monthlyData.slice(-12), // Last 12 months
    xField: 'monthName',
    yField: 'totalKeystrokes',
    smooth: true,
    label: {},
    point: { size: 5, shape: 'diamond' },
  };

  const categoryPieConfig = {
    data: categoryData,
    angleField: 'percentage',
    colorField: 'category',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}%',
    },
    interactions: [{ type: 'element-active' }],
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
          Statistics Analysis
        </h1>
        <p style={{ color: '#8c8c8c', marginBottom: '16px' }}>
          Comprehensive analysis of keyboard and mouse usage patterns
        </p>

        <Space style={{ marginBottom: '16px' }}>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs] | null)}
            format="YYYY-MM-DD"
            placeholder={['Start Date', 'End Date']}
          />
          <Button onClick={() => setDateRange(null)}>Reset</Button>
          <Button icon={<ReloadOutlined />} onClick={fetchAllData}>
            Refresh
          </Button>
        </Space>
      </div>

      <Tabs defaultActiveKey="temporal">
        <TabPane tab="Temporal Patterns" key="temporal">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="Day of Week Analysis" bordered={false}>
                <Column {...dayOfWeekChartConfig} />
              </Card>
            </Col>

            <Col span={24}>
              <Card title="Monthly Trends" bordered={false}>
                <Line {...monthlyChartConfig} />
              </Card>
            </Col>

            {weekdayVsWeekend && (
              <Col span={24}>
                <Card title="Weekday vs Weekend Comparison" bordered={false}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Statistic
                        title="Weekday Avg"
                        value={weekdayVsWeekend.weekday.avgKeystrokes}
                        precision={0}
                        suffix="keystrokes/day"
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Weekend Avg"
                        value={weekdayVsWeekend.weekend.avgKeystrokes}
                        precision={0}
                        suffix="keystrokes/day"
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Weekday/Weekend Ratio"
                        value={weekdayVsWeekend.weekdayToWeekendRatio}
                        precision={2}
                        suffix="x"
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            )}
          </Row>
        </TabPane>

        <TabPane tab="Key Categories" key="categories">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card title="Category Distribution" bordered={false}>
                <Pie {...categoryPieConfig} />
              </Card>
            </Col>

            <Col span={12}>
              <Card title="Category Statistics" bordered={false}>
                {categoryData.map((cat) => (
                  <div key={cat.category} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>
                        {cat.category}
                      </span>
                      <span>{cat.percentage.toFixed(1)}%</span>
                    </div>
                    <Progress percent={cat.percentage} showInfo={false} />
                    <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
                      {cat.count.toLocaleString()} keystrokes • {cat.uniqueKeys} unique keys
                    </div>
                  </div>
                ))}
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Typing Behavior" key="typing">
          {typingMetrics && (
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Card bordered={false}>
                  <Statistic
                    title="Total Keystrokes"
                    value={typingMetrics.totalKeystrokes}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card bordered={false}>
                  <Statistic
                    title="Backspace Ratio"
                    value={typingMetrics.backspaceRatio * 100}
                    precision={2}
                    suffix="%"
                    valueStyle={{ color: '#cf1322' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card bordered={false}>
                  <Statistic
                    title="Estimated Words"
                    value={typingMetrics.estimatedWords}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card bordered={false}>
                  <Statistic
                    title="Avg Word Length"
                    value={typingMetrics.avgWordLength}
                    precision={1}
                    suffix="chars"
                  />
                </Card>
              </Col>

              <Col span={24}>
                <Card title="Typing Metrics Details" bordered={false}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '14px', color: '#8c8c8c' }}>Backspace Count</div>
                        <div style={{ fontSize: '24px', fontWeight: 500 }}>
                          {typingMetrics.backspaceCount.toLocaleString()}
                        </div>
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '14px', color: '#8c8c8c' }}>Enter Count</div>
                        <div style={{ fontSize: '24px', fontWeight: 500 }}>
                          {typingMetrics.enterCount.toLocaleString()}
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '14px', color: '#8c8c8c' }}>Space Count</div>
                        <div style={{ fontSize: '24px', fontWeight: 500 }}>
                          {typingMetrics.spaceCount.toLocaleString()}
                        </div>
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '14px', color: '#8c8c8c' }}>Delete Count</div>
                        <div style={{ fontSize: '24px', fontWeight: 500 }}>
                          {typingMetrics.deleteCount.toLocaleString()}
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '14px', color: '#8c8c8c' }}>Correction Ratio</div>
                        <div style={{ fontSize: '24px', fontWeight: 500 }}>
                          {(typingMetrics.correctionRatio * 100).toFixed(2)}%
                        </div>
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '14px', color: '#8c8c8c' }}>Estimated Lines</div>
                        <div style={{ fontSize: '24px', fontWeight: 500 }}>
                          {typingMetrics.estimatedLines.toLocaleString()}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          )}
        </TabPane>

        <TabPane tab="Productivity" key="productivity">
          {productivityMetrics && (
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Card bordered={false}>
                  <Statistic
                    title="Active Days"
                    value={productivityMetrics.activeDays}
                    suffix={`/ ${productivityMetrics.totalDays}`}
                    prefix={<FireOutlined />}
                    valueStyle={{ color: '#cf1322' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card bordered={false}>
                  <Statistic
                    title="Current Streak"
                    value={productivityMetrics.currentStreak}
                    suffix="days"
                    prefix={<TrophyOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card bordered={false}>
                  <Statistic
                    title="Longest Streak"
                    value={productivityMetrics.longestStreak}
                    suffix="days"
                    prefix={<ThunderboltOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card bordered={false}>
                  <Statistic
                    title="Activity Rate"
                    value={productivityMetrics.activityRate * 100}
                    precision={1}
                    suffix="%"
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>
              </Col>

              <Col span={24}>
                <Card title="Productivity Metrics" bordered={false}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '14px', color: '#8c8c8c' }}>Avg Keystrokes/Day</div>
                        <div style={{ fontSize: '24px', fontWeight: 500 }}>
                          {productivityMetrics.avgKeystrokesPerDay.toFixed(0)}
                        </div>
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '14px', color: '#8c8c8c' }}>Standard Deviation</div>
                        <div style={{ fontSize: '24px', fontWeight: 500 }}>
                          {productivityMetrics.stdDevKeystrokes.toFixed(0)}
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '14px', color: '#8c8c8c' }}>Consistency Score</div>
                        <div style={{ fontSize: '24px', fontWeight: 500 }}>
                          {productivityMetrics.consistencyScore.toFixed(3)}
                        </div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                          Lower is more consistent
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '14px', color: '#8c8c8c' }}>Inactive Days</div>
                        <div style={{ fontSize: '24px', fontWeight: 500 }}>
                          {productivityMetrics.inactiveDays}
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <div style={{ marginTop: '24px', padding: '16px', background: '#f5f5f5', borderRadius: '4px' }}>
                    <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>
                      Activity Threshold: {productivityMetrics.thresholdUsed} keystrokes/day
                    </div>
                    <Progress
                      percent={(productivityMetrics.activeDays / productivityMetrics.totalDays) * 100}
                      status="active"
                      strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                      }}
                    />
                  </div>
                </Card>
              </Col>
            </Row>
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default StatisticsPage;
