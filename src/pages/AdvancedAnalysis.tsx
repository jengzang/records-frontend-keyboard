import { useEffect, useState } from 'react';
import { keyboardApi } from '../services/api';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface HandBalanceStats {
  leftHand: {
    totalPresses: number;
    percentage: number;
    topKeys: Array<{ keyName: string; count: number }>;
  };
  rightHand: {
    totalPresses: number;
    percentage: number;
    topKeys: Array<{ keyName: string; count: number }>;
  };
  bothHands: {
    totalPresses: number;
    percentage: number;
    keys: string[];
  };
  neutral: {
    totalPresses: number;
    percentage: number;
    keys: string[];
  };
  balanceScore: number;
  insights: string[];
}

interface WeekdayWeekendComparison {
  weekday: {
    totalKeystrokes: number;
    avgDailyKeystrokes: number;
    categoryDistribution: Record<string, number>;
    handDistribution: Record<string, number>;
    hourlyDistribution: Array<{ hour: number; count: number }>;
    topKeys: Array<{ keyName: string; count: number }>;
    dayCount: number;
  };
  weekend: {
    totalKeystrokes: number;
    avgDailyKeystrokes: number;
    categoryDistribution: Record<string, number>;
    handDistribution: Record<string, number>;
    hourlyDistribution: Array<{ hour: number; count: number }>;
    topKeys: Array<{ keyName: string; count: number }>;
    dayCount: number;
  };
  insights: string[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AdvancedAnalysis = () => {
  const [handBalance, setHandBalance] = useState<HandBalanceStats | null>(null);
  const [weekdayWeekend, setWeekdayWeekend] = useState<WeekdayWeekendComparison | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [handData, comparisonData] = await Promise.all([
          keyboardApi.getHandBalance(),
          keyboardApi.getWeekdayWeekendComparison(),
        ]);

        setHandBalance(handData);
        setWeekdayWeekend(comparisonData);
      } catch (error) {
        console.error('Failed to fetch advanced analysis data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">加载中...</div>
      </div>
    );
  }

  const handBalancePieData = handBalance
    ? [
        { name: '左手', value: handBalance.leftHand.totalPresses },
        { name: '右手', value: handBalance.rightHand.totalPresses },
        { name: '双手', value: handBalance.bothHands.totalPresses },
        { name: '中性', value: handBalance.neutral.totalPresses },
      ]
    : [];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">高级分析</h1>

      {/* Hand Balance Analysis */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">左右手使用平衡分析</h2>
        {handBalance && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Balance Score */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">平衡评分</div>
                <div className={`text-4xl font-bold ${
                  handBalance.balanceScore >= 90 ? 'text-green-600' :
                  handBalance.balanceScore >= 70 ? 'text-blue-600' :
                  handBalance.balanceScore >= 50 ? 'text-orange-600' :
                  'text-red-600'
                }`}>
                  {handBalance.balanceScore.toFixed(1)}
                </div>
                <div className="text-xs text-gray-500 mt-1">满分100分</div>
              </div>

              {/* Pie Chart */}
              <div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={handBalancePieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {handBalancePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Hand Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded p-4">
                <h3 className="font-semibold mb-3 text-blue-600">左手</h3>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-600">总按键数</div>
                    <div className="text-xl font-bold">{handBalance.leftHand.totalPresses.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">使用比例</div>
                    <div className="text-xl font-bold">{handBalance.leftHand.percentage.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Top 5按键</div>
                    <div className="text-sm space-y-1">
                      {handBalance.leftHand.topKeys.slice(0, 5).map((key, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{key.keyName}</span>
                          <span className="text-gray-500">{key.count.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded p-4">
                <h3 className="font-semibold mb-3 text-green-600">右手</h3>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-600">总按键数</div>
                    <div className="text-xl font-bold">{handBalance.rightHand.totalPresses.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">使用比例</div>
                    <div className="text-xl font-bold">{handBalance.rightHand.percentage.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Top 5按键</div>
                    <div className="text-sm space-y-1">
                      {handBalance.rightHand.topKeys.slice(0, 5).map((key, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{key.keyName}</span>
                          <span className="text-gray-500">{key.count.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="font-semibold mb-2">洞察</h3>
              <ul className="list-disc list-inside space-y-1">
                {handBalance.insights.map((insight, index) => (
                  <li key={index} className="text-sm">{insight}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* Weekday vs Weekend Comparison */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">工作日 vs 周末对比</h2>
        {weekdayWeekend && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-6">
              <div className="border rounded p-4 bg-blue-50">
                <h3 className="font-semibold mb-3">工作日</h3>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-600">总按键数</div>
                    <div className="text-2xl font-bold">{weekdayWeekend.weekday.totalKeystrokes.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">平均每日按键</div>
                    <div className="text-xl font-bold">{Math.round(weekdayWeekend.weekday.avgDailyKeystrokes).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">数据天数</div>
                    <div className="text-lg">{weekdayWeekend.weekday.dayCount}天</div>
                  </div>
                </div>
              </div>

              <div className="border rounded p-4 bg-green-50">
                <h3 className="font-semibold mb-3">周末</h3>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-600">总按键数</div>
                    <div className="text-2xl font-bold">{weekdayWeekend.weekend.totalKeystrokes.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">平均每日按键</div>
                    <div className="text-xl font-bold">{Math.round(weekdayWeekend.weekend.avgDailyKeystrokes).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">数据天数</div>
                    <div className="text-lg">{weekdayWeekend.weekend.dayCount}天</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Distribution Comparison */}
            <div>
              <h3 className="font-semibold mb-3">按键类别分布对比</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={Object.keys(weekdayWeekend.weekday.categoryDistribution).map(category => ({
                    category,
                    weekday: weekdayWeekend.weekday.categoryDistribution[category],
                    weekend: weekdayWeekend.weekend.categoryDistribution[category],
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="weekday" fill="#3b82f6" name="工作日" />
                  <Bar dataKey="weekend" fill="#10b981" name="周末" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Hand Distribution Comparison */}
            <div>
              <h3 className="font-semibold mb-3">手部使用分布对比</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={Object.keys(weekdayWeekend.weekday.handDistribution).map(hand => ({
                    hand,
                    weekday: weekdayWeekend.weekday.handDistribution[hand],
                    weekend: weekdayWeekend.weekend.handDistribution[hand],
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hand" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="weekday" fill="#3b82f6" name="工作日" />
                  <Bar dataKey="weekend" fill="#10b981" name="周末" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top Keys Comparison */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded p-4">
                <h3 className="font-semibold mb-2">工作日 Top 10按键</h3>
                <div className="text-sm space-y-1">
                  {weekdayWeekend.weekday.topKeys.slice(0, 10).map((key, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{idx + 1}. {key.keyName}</span>
                      <span className="text-gray-500">{key.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border rounded p-4">
                <h3 className="font-semibold mb-2">周末 Top 10按键</h3>
                <div className="text-sm space-y-1">
                  {weekdayWeekend.weekend.topKeys.slice(0, 10).map((key, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{idx + 1}. {key.keyName}</span>
                      <span className="text-gray-500">{key.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-green-50 p-4 rounded">
              <h3 className="font-semibold mb-2">洞察</h3>
              <ul className="list-disc list-inside space-y-1">
                {weekdayWeekend.insights.map((insight, index) => (
                  <li key={index} className="text-sm">{insight}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdvancedAnalysis;
