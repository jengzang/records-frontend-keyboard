import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
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

interface DailyComparison {
  date: string;
  total_keystrokes: number;
  screen_time_hours: number;
  keystrokes_per_hour: number;
}

interface HourlyComparison {
  hour: number;
  avg_keystrokes: number;
  avg_screen_time_min: number;
  keystrokes_per_min: number;
}

interface AppCorrelation {
  app_name: string;
  total_usage_hours: number;
  avg_keystrokes: number;
  correlation: number;
  category: string;
}

interface ProductivityAnalysis {
  high_productivity_hours: number[];
  low_productivity_hours: number[];
  productivity_score: number;
  work_app_usage_ratio: number;
  distraction_score: number;
}

interface TimePatternComparison {
  typing_peak_hours: number[];
  screentime_peak_hours: number[];
  overlap_hours: number[];
  overlap_percentage: number;
}

interface WorkEfficiencyScore {
  overall_score: number;
  typing_efficiency: number;
  focus_score: number;
  work_life_balance: number;
  digital_wellbeing: number;
}

interface CrossModuleData {
  typing_screentime_correlation: {
    correlation_coefficient: number;
    daily_comparison: DailyComparison[];
    hourly_comparison: HourlyComparison[];
    app_typing_correlation: AppCorrelation[];
  };
  productivity_analysis: ProductivityAnalysis;
  time_pattern_comparison: TimePatternComparison;
  work_efficiency_score: WorkEfficiencyScore;
  recommendations: string[];
}

export default function CrossModuleAnalysis() {
  const [data, setData] = useState<CrossModuleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/keyboard/cross_module');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to load cross-module analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className=\"flex items-center justify-center min-h-screen\">
        <div className=\"text-gray-600\">加载中...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className=\"flex items-center justify-center min-h-screen\">
        <div className=\"text-gray-600\">暂无数据</div>
      </div>
    );
  }

  const efficiencyRadarData = [
    { subject: '总体评分', value: data.work_efficiency_score.overall_score },
    { subject: '打字效率', value: data.work_efficiency_score.typing_efficiency },
    { subject: '专注度', value: data.work_efficiency_score.focus_score },
    { subject: '工作生活平衡', value: data.work_efficiency_score.work_life_balance },
    { subject: '数字健康', value: data.work_efficiency_score.digital_wellbeing },
  ];

  return (
    <div className=\"container mx-auto px-4 py-8\">
      <h1 className=\"text-3xl font-bold text-gray-800 mb-8\">键盘×屏幕时间 跨模块分析</h1>

      {/* 相关性总览 */}
      <div className=\"bg-white rounded-lg shadow-md p-6 mb-8\">
        <h2 className=\"text-xl font-bold text-gray-800 mb-4\">相关性总览</h2>
        <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">
          <div className=\"text-center\">
            <div className=\"text-sm text-gray-600 mb-2\">相关系数</div>
            <div className=\"text-4xl font-bold\" style={{
              color: data.typing_screentime_correlation.correlation_coefficient > 0.5 ? '#10b981' :
                     data.typing_screentime_correlation.correlation_coefficient > 0.3 ? '#f59e0b' : '#ef4444'
            }}>
              {data.typing_screentime_correlation.correlation_coefficient.toFixed(3)}
            </div>
            <div className=\"text-xs text-gray-500 mt-1\">
              {data.typing_screentime_correlation.correlation_coefficient > 0.5 ? '强相关' :
               data.typing_screentime_correlation.correlation_coefficient > 0.3 ? '中等相关' : '弱相关'}
            </div>
          </div>
          <div className=\"text-center\">
            <div className=\"text-sm text-gray-600 mb-2\">生产力评分</div>
            <div className=\"text-4xl font-bold text-blue-600\">
              {data.productivity_analysis.productivity_score.toFixed(0)}
            </div>
            <div className=\"text-xs text-gray-500 mt-1\">满分100</div>
          </div>
          <div className=\"text-center\">
            <div className=\"text-sm text-gray-600 mb-2\">工作效率评分</div>
            <div className=\"text-4xl font-bold text-purple-600\">
              {data.work_efficiency_score.overall_score.toFixed(0)}
            </div>
            <div className=\"text-xs text-gray-500 mt-1\">满分100</div>
          </div>
        </div>
      </div>

      {/* 每日对比趋势 */}
      <div className=\"bg-white rounded-lg shadow-md p-6 mb-8\">
        <h2 className=\"text-xl font-bold text-gray-800 mb-4\">每日打字量 vs 屏幕时间</h2>
        <ResponsiveContainer width=\"100%\" height={300}>
          <LineChart data={data.typing_screentime_correlation.daily_comparison.slice(0, 30).reverse()}>
            <CartesianGrid strokeDasharray=\"3 3\" />
            <XAxis dataKey=\"date\" tick={{ fontSize: 12 }} />
            <YAxis yAxisId=\"left\" />
            <YAxis yAxisId=\"right\" orientation=\"right\" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId=\"left\"
              type=\"monotone\"
              dataKey=\"total_keystrokes\"
              stroke=\"#3b82f6\"
              name=\"打字量\"
            />
            <Line
              yAxisId=\"right\"
              type=\"monotone\"
              dataKey=\"screen_time_hours\"
              stroke=\"#10b981\"
              name=\"屏幕时间(小时)\"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 每小时对比 */}
      <div className=\"bg-white rounded-lg shadow-md p-6 mb-8\">
        <h2 className=\"text-xl font-bold text-gray-800 mb-4\">每小时平均打字量 vs 屏幕时间</h2>
        <ResponsiveContainer width=\"100%\" height={300}>
          <BarChart data={data.typing_screentime_correlation.hourly_comparison}>
            <CartesianGrid strokeDasharray=\"3 3\" />
            <XAxis dataKey=\"hour\" />
            <YAxis yAxisId=\"left\" />
            <YAxis yAxisId=\"right\" orientation=\"right\" />
            <Tooltip />
            <Legend />
            <Bar yAxisId=\"left\" dataKey=\"avg_keystrokes\" fill=\"#3b82f6\" name=\"平均打字量\" />
            <Bar yAxisId=\"right\" dataKey=\"avg_screen_time_min\" fill=\"#10b981\" name=\"平均屏幕时间(分钟)\" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 应用打字相关性 */}
      <div className=\"bg-white rounded-lg shadow-md p-6 mb-8\">
        <h2 className=\"text-xl font-bold text-gray-800 mb-4\">应用使用与打字相关性</h2>
        <div className=\"space-y-3\">
          {data.typing_screentime_correlation.app_typing_correlation
            .sort((a, b) => b.total_usage_hours - a.total_usage_hours)
            .slice(0, 10)
            .map((app) => (
              <div key={app.app_name} className=\"flex items-center\">
                <div className=\"w-32 truncate text-sm font-medium text-gray-700\">
                  {app.app_name}
                </div>
                <div className=\"flex-1 mx-4\">
                  <div className=\"flex justify-between text-xs text-gray-600 mb-1\">
                    <span>{app.total_usage_hours.toFixed(1)}h</span>
                    <span className=\"px-2 py-0.5 rounded text-white\" style={{
                      backgroundColor: app.category === 'work' ? '#3b82f6' :
                                     app.category === 'social' ? '#10b981' : '#f59e0b'
                    }}>
                      {app.category}
                    </span>
                  </div>
                  <div className=\"w-full bg-gray-200 rounded-full h-2\">
                    <div
                      className=\"bg-blue-500 h-2 rounded-full\"
                      style={{ width: `${(app.avg_keystrokes / 1000) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className=\"w-20 text-right text-sm text-gray-600\">
                  {app.avg_keystrokes.toFixed(0)} 键
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 生产力分析 */}
      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6 mb-8\">
        <div className=\"bg-white rounded-lg shadow-md p-6\">
          <h2 className=\"text-xl font-bold text-gray-800 mb-4\">生产力分析</h2>
          <div className=\"space-y-4\">
            <div>
              <div className=\"text-sm text-gray-600 mb-2\">高生产力时段</div>
              <div className=\"flex flex-wrap gap-2\">
                {data.productivity_analysis.high_productivity_hours.map((hour) => (
                  <span key={hour} className=\"px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm\">
                    {hour}:00
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className=\"text-sm text-gray-600 mb-2\">低生产力时段</div>
              <div className=\"flex flex-wrap gap-2\">
                {data.productivity_analysis.low_productivity_hours.map((hour) => (
                  <span key={hour} className=\"px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm\">
                    {hour}:00
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className=\"text-sm text-gray-600 mb-2\">工作应用使用比例</div>
              <div className=\"w-full bg-gray-200 rounded-full h-4\">
                <div
                  className=\"bg-blue-500 h-4 rounded-full flex items-center justify-center text-xs text-white\"
                  style={{ width: `${data.productivity_analysis.work_app_usage_ratio * 100}%` }}
                >
                  {(data.productivity_analysis.work_app_usage_ratio * 100).toFixed(0)}%
                </div>
              </div>
            </div>
            <div>
              <div className=\"text-sm text-gray-600 mb-2\">分心评分</div>
              <div className=\"w-full bg-gray-200 rounded-full h-4\">
                <div
                  className=\"bg-orange-500 h-4 rounded-full flex items-center justify-center text-xs text-white\"
                  style={{ width: `${data.productivity_analysis.distraction_score}%` }}
                >
                  {data.productivity_analysis.distraction_score.toFixed(0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=\"bg-white rounded-lg shadow-md p-6\">
          <h2 className=\"text-xl font-bold text-gray-800 mb-4\">工作效率雷达图</h2>
          <ResponsiveContainer width=\"100%\" height={250}>
            <RadarChart data={efficiencyRadarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey=\"subject\" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar name=\"效率评分\" dataKey=\"value\" stroke=\"#3b82f6\" fill=\"#3b82f6\" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 时间模式对比 */}
      <div className=\"bg-white rounded-lg shadow-md p-6 mb-8\">
        <h2 className=\"text-xl font-bold text-gray-800 mb-4\">时间模式对比</h2>
        <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">
          <div>
            <div className=\"text-sm text-gray-600 mb-2\">打字峰值时段</div>
            <div className=\"flex flex-wrap gap-2\">
              {data.time_pattern_comparison.typing_peak_hours.map((hour) => (
                <span key={hour} className=\"px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm\">
                  {hour}:00
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className=\"text-sm text-gray-600 mb-2\">屏幕时间峰值时段</div>
            <div className=\"flex flex-wrap gap-2\">
              {data.time_pattern_comparison.screentime_peak_hours.map((hour) => (
                <span key={hour} className=\"px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm\">
                  {hour}:00
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className=\"text-sm text-gray-600 mb-2\">重叠时段 ({data.time_pattern_comparison.overlap_percentage.toFixed(0)}%)</div>
            <div className=\"flex flex-wrap gap-2\">
              {data.time_pattern_comparison.overlap_hours.map((hour) => (
                <span key={hour} className=\"px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm\">
                  {hour}:00
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 建议 */}
      <div className=\"bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-md p-6\">
        <h2 className=\"text-xl font-bold text-gray-800 mb-4\">💡 优化建议</h2>
        <div className=\"space-y-3\">
          {data.recommendations.map((rec, index) => (
            <div key={index} className=\"flex items-start\">
              <div className=\"w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold mr-3 mt-0.5\">
                {index + 1}
              </div>
              <div className=\"flex-1 text-gray-700\">{rec}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}