import React, { useEffect, useState } from 'react';
import { Table, DatePicker, Space, Button, Spin, Alert } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import keyboardApi from '../services/api';
import type { DailyStat } from '../types';

const { RangePicker } = DatePicker;

const DailyStats: React.FC = () => {
  const [data, setData] = useState<DailyStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  const fetchData = async (start?: string, end?: string) => {
    try {
      setLoading(true);
      const stats = await keyboardApi.getDailyStats({
        start,
        end,
        limit: 1000,
      });
      setData(stats);
      setError(null);
    } catch (err) {
      setError('Failed to load daily statistics');
      console.error('Error fetching daily stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDateRangeChange = (dates: [Dayjs, Dayjs] | null) => {
    setDateRange(dates);
  };

  const handleFilter = () => {
    if (dateRange) {
      const [start, end] = dateRange;
      fetchData(start.format('YYYYMMDD'), end.format('YYYYMMDD'));
    } else {
      fetchData();
    }
  };

  const handleReset = () => {
    setDateRange(null);
    fetchData();
  };

  const formatDate = (dateStr: string): string => {
    if (dateStr.length === 8) {
      return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
    }
    return dateStr;
  };

  const columns: ColumnsType<DailyStat> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => formatDate(date),
      sorter: (a, b) => a.date.localeCompare(b.date),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Keystrokes',
      dataIndex: 'keystrokes',
      key: 'keystrokes',
      render: (value: number) => value.toLocaleString(),
      sorter: (a, b) => a.keystrokes - b.keystrokes,
    },
    {
      title: 'Left Clicks',
      dataIndex: 'leftClicks',
      key: 'leftClicks',
      render: (value: number) => value.toLocaleString(),
      sorter: (a, b) => a.leftClicks - b.leftClicks,
    },
    {
      title: 'Right Clicks',
      dataIndex: 'rightClicks',
      key: 'rightClicks',
      render: (value: number) => value.toLocaleString(),
      sorter: (a, b) => a.rightClicks - b.rightClicks,
    },
    {
      title: 'Total Clicks',
      key: 'totalClicks',
      render: (_, record) =>
        (
          record.leftClicks +
          record.rightClicks +
          record.middleClicks +
          record.extraClicks
        ).toLocaleString(),
      sorter: (a, b) => {
        const totalA = a.leftClicks + a.rightClicks + a.middleClicks + a.extraClicks;
        const totalB = b.leftClicks + b.rightClicks + b.middleClicks + b.extraClicks;
        return totalA - totalB;
      },
    },
    {
      title: 'Wheel Scrolls',
      dataIndex: 'wheelScrolls',
      key: 'wheelScrolls',
      render: (value: number) => value.toLocaleString(),
      sorter: (a, b) => a.wheelScrolls - b.wheelScrolls,
    },
    {
      title: 'Mouse Distance (m)',
      dataIndex: 'mouseDistanceM',
      key: 'mouseDistanceM',
      render: (value: number) => value.toFixed(2),
      sorter: (a, b) => a.mouseDistanceM - b.mouseDistanceM,
    },
  ];

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
      <h1>Daily Statistics</h1>

      <Space style={{ marginBottom: '16px' }}>
        <RangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
          format="YYYY-MM-DD"
        />
        <Button type="primary" onClick={handleFilter}>
          Filter
        </Button>
        <Button onClick={handleReset}>Reset</Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 50,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} days`,
        }}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default DailyStats;
