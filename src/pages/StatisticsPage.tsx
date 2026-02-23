import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, Alert, Statistic, Progress, Tabs, DatePicker, Space, Button, Table } from 'antd';
import { Line, Column, Pie, Heatmap, Bar, Radar } from '@ant-design/charts';
import { ReloadOutlined, TrophyOutlined, FireOutlined, ThunderboltOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { keyboardApi } from '../services/api';
import type {
  TemporalAnalysis,
  WeekdayVsWeekend,
  CategoryDistribution,
  TypingBehaviorMetrics,
  ProductivityMetrics,
  HourlyPattern,
  TopKeysByCategory,
  ModifierUsage,
  SpecialKeyUsage,
  LetterFrequency,
  IntensityMetrics,
  PeakDayExtended,
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
  const [hourlyData, setHourlyData] = useState<HourlyPattern[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryDistribution[]>([]);
  const [topKeysByCategory, setTopKeysByCategory] = useState<TopKeysByCategory>({});
  const [modifierUsage, setModifierUsage] = useState<ModifierUsage | null>(null);
  const [typingMetrics, setTypingMetrics] = useState<TypingBehaviorMetrics | null>(null);
  const [specialKeys, setSpecialKeys] = useState<SpecialKeyUsage[]>([]);
  const [letterFrequency, setLetterFrequency] = useState<LetterFrequency[]>([]);
  const [productivityMetrics, setProductivityMetrics] = useState<ProductivityMetrics | null>(null);
  const [intensityMetrics, setIntensityMetrics] = useState<IntensityMetrics | null>(null);
  const [peakDays, setPeakDays] = useState<PeakDayExtended[]>([]);

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
        hourly,
        categories,
        topKeys,
        modifiers,
        typing,
        specialKeysData,
        letterFreq,
        productivity,
        intensity,
        peakDaysData,
      ] = await Promise.all([
        keyboardApi.getTemporalAnalysis({ type: 'daily', ...params }),
        keyboardApi.getTemporalAnalysis({ type: 'monthly', ...params }),
        keyboardApi.getTemporalAnalysis({ type: 'weekday_vs_weekend', ...params }),
        keyboardApi.getTemporalAnalysis({ type: 'hourly', ...params }),
        keyboardApi.getCategoryAnalysis({ type: 'distribution', ...params }),
        keyboardApi.getCategoryAnalysis({ type: 'top_keys', ...params }),
        keyboardApi.getCategoryAnalysis({ type: 'modifiers', ...params }),
        keyboardApi.getTypingBehavior({ type: 'metrics', ...params }),
        keyboardApi.getTypingBehavior({ type: 'special_keys', ...params }),
        keyboardApi.getTypingBehavior({ type: 'letter_frequency', ...params }),
        keyboardApi.getProductivityMetrics({ type: 'activity', ...params }),
        keyboardApi.getProductivityMetrics({ type: 'intensity', ...params }),
        keyboardApi.getProductivityMetrics({ type: 'peak_days', ...params }),
      ]);

      setDayOfWeekData(dayOfWeek as TemporalAnalysis[]);
      setMonthlyData(monthly as TemporalAnalysis[]);
      setWeekdayVsWeekend(weekdayWeekend as WeekdayVsWeekend);
      setHourlyData(hourly as HourlyPattern[]);
      setCategoryData(categories as CategoryDistribution[]);
      setTopKeysByCategory(topKeys as TopKeysByCategory);
      setModifierUsage(modifiers as ModifierUsage);
      setTypingMetrics(typing as TypingBehaviorMetrics);
      setSpecialKeys(specialKeysData as SpecialKeyUsage[]);
      setLetterFrequency(letterFreq as LetterFrequency[]);
      setProductivityMetrics(productivity as ProductivityMetrics);
      setIntensityMetrics(intensity as IntensityMetrics);
      setPeakDays(peakDaysData as PeakDayExtended[]);
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

            {hourlyData.length > 0 && (
              <Col span={24}>
                <Card title="Hourly Usage Pattern (24-Hour Heatmap)" bordered={false}>
                  <Heatmap
                    data={hourlyData}
                    xField="hour"
                    yField="dayOfWeek"
                    colorField="avgKeystrokes"
                    color={['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b']}
                    meta={{
                      hour: { alias: 'Hour of Day' },
                      dayOfWeek: {
                        alias: 'Day of Week',
                        formatter: (val: number) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][val]
                      },
                      avgKeystrokes: { alias: 'Avg Keystrokes' },
                    }}
                    tooltip={{
                      formatter: (datum: any) => ({
                        name: 'Avg Keystrokes',
                        value: datum.avgKeystrokes.toFixed(0),
                      }),
                    }}
                  />
                  <div style={{ marginTop: '16px', fontSize: '12px', color: '#8c8c8c' }}>
                    Darker colors indicate higher keyboard activity. Peak usage hours are typically during work hours (9-18).
                  </div>
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

            {Object.keys(topKeysByCategory).length > 0 && (
              <Col span={24}>
                <Card title="Top Keys by Category" bordered={false}>
                  <Row gutter={16}>
                    {Object.entries(topKeysByCategory).map(([category, keys]) => (
                      <Col span={8} key={category}>
                        <h4 style={{ textTransform: 'capitalize', marginBottom: '12px' }}>{category}</h4>
                        <Table
                          dataSource={keys}
                          columns={[
                            { title: 'Key', dataIndex: 'keyName', key: 'keyName' },
                            {
                              title: 'Count',
                              dataIndex: 'count',
                              key: 'count',
                              render: (val: number) => val.toLocaleString()
                            },
                          ]}
                          pagination={false}
                          size="small"
                          rowKey="scancode"
                        />
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>
            )}

            {modifierUsage && (
              <Col span={24}>
                <Card title="Modifier Keys Usage" bordered={false}>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Statistic
                        title="Ctrl"
                        value={modifierUsage.ctrl}
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Col>
                    <Col span={6}>
                      <Statistic
                        title="Shift"
                        value={modifierUsage.shift}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Col>
                    <Col span={6}>
                      <Statistic
                        title="Alt"
                        value={modifierUsage.alt}
                        valueStyle={{ color: '#faad14' }}
                      />
                    </Col>
                    <Col span={6}>
                      <Statistic
                        title="Win"
                        value={modifierUsage.win}
                        valueStyle={{ color: '#722ed1' }}
                      />
                    </Col>
                  </Row>
                  <div style={{ marginTop: '24px' }}>
                    <Radar
                      data={[
                        { modifier: 'Ctrl', value: modifierUsage.ctrl },
                        { modifier: 'Shift', value: modifierUsage.shift },
                        { modifier: 'Alt', value: modifierUsage.alt },
                        { modifier: 'Win', value: modifierUsage.win },
                      ]}
                      xField="modifier"
                      yField="value"
                      area={{}}
                      point={{ size: 2 }}
                    />
                  </div>
                </Card>
              </Col>
            )}
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

              {specialKeys.length > 0 && (
                <Col span={12}>
                  <Card title="Special Keys Usage (Top 10)" bordered={false}>
                    <Bar
                      data={specialKeys.slice(0, 10)}
                      xField="count"
                      yField="keyName"
                      seriesField="keyName"
                      legend={false}
                      label={{
                        position: 'right',
                        formatter: (datum: any) => datum.count.toLocaleString(),
                      }}
                    />
                  </Card>
                </Col>
              )}

              {letterFrequency.length > 0 && (
                <Col span={12}>
                  <Card title="Letter Frequency Distribution" bordered={false}>
                    <Column
                      data={letterFrequency}
                      xField="letter"
                      yField="percentage"
                      label={{
                        position: 'top',
                        formatter: (datum: any) => `${datum.percentage.toFixed(1)}%`,
                      }}
                      meta={{
                        letter: { alias: 'Letter' },
                        percentage: { alias: 'Percentage (%)' },
                      }}
                    />
                    <div style={{ marginTop: '16px', fontSize: '12px', color: '#8c8c8c' }}>
                      Most common letters: {letterFrequency.slice(0, 5).map(l => l.letter).join(', ')}
                    </div>
                  </Card>
                </Col>
              )}
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

              {intensityMetrics && (
                <Col span={24}>
                  <Card title="Typing Intensity Analysis" bordered={false}>
                    <Row gutter={16}>
                      <Col span={8}>
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ fontSize: '14px', color: '#8c8c8c' }}>Avg Keystrokes/Day</div>
                          <div style={{ fontSize: '24px', fontWeight: 500 }}>
                            {intensityMetrics.avgKeystrokes.toFixed(0)}
                          </div>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ fontSize: '14px', color: '#8c8c8c' }}>Peak Keystrokes</div>
                          <div style={{ fontSize: '24px', fontWeight: 500, color: '#cf1322' }}>
                            {intensityMetrics.peakKeystrokes.toLocaleString()}
                          </div>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ fontSize: '14px', color: '#8c8c8c' }}>P50 (Median)</div>
                          <div style={{ fontSize: '24px', fontWeight: 500 }}>
                            {intensityMetrics.p50Keystrokes.toFixed(0)}
                          </div>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ fontSize: '14px', color: '#8c8c8c' }}>P75</div>
                          <div style={{ fontSize: '24px', fontWeight: 500 }}>
                            {intensityMetrics.p75Keystrokes.toFixed(0)}
                          </div>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ fontSize: '14px', color: '#8c8c8c' }}>P95</div>
                          <div style={{ fontSize: '24px', fontWeight: 500 }}>
                            {intensityMetrics.p95Keystrokes.toFixed(0)}
                          </div>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ fontSize: '14px', color: '#8c8c8c' }}>Active Days</div>
                          <div style={{ fontSize: '24px', fontWeight: 500 }}>
                            {intensityMetrics.activeDays}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              )}

              {peakDays.length > 0 && (
                <Col span={24}>
                  <Card title="Peak Days (Top 10)" bordered={false}>
                    <Table
                      dataSource={peakDays.slice(0, 10)}
                      columns={[
                        {
                          title: 'Rank',
                          key: 'rank',
                          render: (_: any, __: any, index: number) => index + 1,
                        },
                        {
                          title: 'Date',
                          dataIndex: 'date',
                          key: 'date',
                          render: (val: string) => dayjs(val, 'YYYYMMDD').format('YYYY-MM-DD'),
                        },
                        {
                          title: 'Keystrokes',
                          dataIndex: 'keystrokes',
                          key: 'keystrokes',
                          render: (val: number) => val.toLocaleString(),
                          sorter: (a: any, b: any) => a.keystrokes - b.keystrokes,
                        },
                        {
                          title: 'Clicks',
                          dataIndex: 'clicks',
                          key: 'clicks',
                          render: (val: number) => val.toLocaleString(),
                        },
                        {
                          title: 'Distance (m)',
                          dataIndex: 'distance',
                          key: 'distance',
                          render: (val: number) => val ? val.toFixed(1) : '-',
                        },
                      ]}
                      pagination={false}
                      size="small"
                      rowKey="date"
                    />
                  </Card>
                </Col>
              )}
            </Row>
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default StatisticsPage;
