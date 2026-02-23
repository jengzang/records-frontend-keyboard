import React, { useState, useEffect } from 'react';
import { DatePicker, Space, Button, Spin, Alert } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import KeyboardHeatmap from '../components/KeyboardHeatmap';
import { keyboardApi } from '../services/api';
import type { DetailedKeyHeatmapData } from '../types';

const { RangePicker } = DatePicker;

const KeyboardHeatmapPage: React.FC = () => {
  const [data, setData] = useState<DetailedKeyHeatmapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: { start?: string; end?: string } = {};

      if (dateRange) {
        params.start = dateRange[0].format('YYYYMMDD');
        params.end = dateRange[1].format('YYYYMMDD');
      }

      const heatmapData = await keyboardApi.getDetailedKeyboardHeatmap(params);
      setData(heatmapData);
    } catch (err) {
      console.error('Error fetching keyboard heatmap data:', err);
      setError('Failed to load keyboard heatmap data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const handleReset = () => {
    setDateRange(null);
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
          Keyboard Heatmap
        </h1>
        <p style={{ color: '#8c8c8c', marginBottom: '16px' }}>
          Visual representation of key usage intensity with detailed statistics
        </p>

        <Space style={{ marginBottom: '16px' }}>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs] | null)}
            format="YYYY-MM-DD"
            placeholder={['Start Date', 'End Date']}
          />
          <Button onClick={handleReset} disabled={!dateRange}>
            Reset
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            Refresh
          </Button>
        </Space>

        {dateRange && (
          <div style={{ fontSize: '13px', color: '#595959' }}>
            Showing data from {dateRange[0].format('YYYY-MM-DD')} to {dateRange[1].format('YYYY-MM-DD')}
          </div>
        )}
      </div>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: '16px' }}
        />
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
          <p style={{ marginTop: '16px', color: '#8c8c8c' }}>
            Loading keyboard heatmap...
          </p>
        </div>
      ) : (
        <>
          <KeyboardHeatmap data={data} loading={loading} />

          <div style={{ marginTop: '24px', padding: '16px', background: '#fafafa', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
              How to Use
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#595959' }}>
              <li>Hover over any key to see detailed statistics</li>
              <li>Darker colors indicate higher usage frequency</li>
              <li>Use the date range picker to filter by time period</li>
              <li>The color scale uses logarithmic scaling to handle wide value ranges</li>
            </ul>
          </div>

          {data.length > 0 && (
            <div style={{ marginTop: '16px', padding: '16px', background: '#e6f7ff', borderRadius: '8px', border: '1px solid #91d5ff' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#0050b3' }}>
                Statistics Summary
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '13px', color: '#595959' }}>
                <div>
                  <strong>Total Keys Tracked:</strong> {data.length}
                </div>
                <div>
                  <strong>Most Used Key:</strong> {data[0]?.keyName} ({data[0]?.totalCount.toLocaleString()} times)
                </div>
                <div>
                  <strong>Total Keystrokes:</strong> {data.reduce((sum, d) => sum + d.totalCount, 0).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default KeyboardHeatmapPage;
