// TypeScript interfaces for keyboard/mouse data

export interface DailyStat {
  id?: number; // Optional - not returned by backend after schema adaptation
  date: string;
  keystrokes: number;
  leftClicks: number;
  rightClicks: number;
  middleClicks: number;
  extraClicks: number;
  wheelScrolls: number;
  hWheelScrolls: number;
  mouseDistanceM: number;
  createdAt?: string; // Optional - not returned by backend after schema adaptation
  updatedAt?: string; // Optional - not returned by backend after schema adaptation
}

export interface ScancodeStat {
  id?: number; // Optional - not always returned
  date: string;
  scancode: number;
  count: number;
  createdAt?: string; // Optional - not always returned
  keyName?: string;
}

export interface ScancodeMapping {
  scancode: number;
  keyName: string;
  keyCategory: string;
  description: string;
}

export interface SummaryStats {
  totalKeystrokes: number;
  totalClicks: number;
  totalMouseDistance: number;
  avgKeystrokesPerDay: number;
  avgClicksPerDay: number;
  avgMouseDistancePerDay: number;
  activeDays: number;
  peakDay: PeakDay;
  dataRange: DateRange;
}

export interface PeakDay {
  date: string;
  keystrokes: number;
  clicks: number;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface TopKey {
  scancode: number;
  keyName: string;
  count: number;
  percentage: number;
}

export interface TrendData {
  date: string;
  keystrokes: number;
  clicks: number;
  distance: number;
}

export interface KeyHeatmapData {
  scancode: number;
  keyName: string;
  keyCategory: string;
  count: number;
}

export interface DetailedKeyHeatmapData {
  scancode: number;
  keyName: string;
  keyCategory: string;
  totalCount: number;
  peakCount: number;
  peakDate: string;
  avgCountPerDay: number;
  percentage: number;
  dayCount: number;
}

export interface TemporalAnalysis {
  day?: number;
  dayName?: string;
  isWeekend?: boolean;
  hour?: number;
  month?: number;
  monthName?: string;
  year?: number;
  totalKeystrokes: number;
  totalClicks: number;
  totalDistance: number;
  avgKeystrokes: number;
  avgClicks: number;
  avgDistance?: number;
  dayCount: number;
}

export interface WeekdayVsWeekend {
  weekday: {
    totalKeystrokes: number;
    totalClicks: number;
    totalDistance: number;
    avgKeystrokes: number;
    avgClicks: number;
    dayCount: number;
  };
  weekend: {
    totalKeystrokes: number;
    totalClicks: number;
    totalDistance: number;
    avgKeystrokes: number;
    avgClicks: number;
    dayCount: number;
  };
  weekdayToWeekendRatio: number;
}

export interface CategoryDistribution {
  category: string;
  count: number;
  percentage: number;
  uniqueKeys: number;
}

export interface TypingBehaviorMetrics {
  totalKeystrokes: number;
  backspaceCount: number;
  enterCount: number;
  spaceCount: number;
  deleteCount: number;
  backspaceRatio: number;
  deleteRatio: number;
  correctionRatio: number;
  estimatedWords: number;
  estimatedLines: number;
  avgWordLength: number;
}

export interface ProductivityMetrics {
  totalDays: number;
  activeDays: number;
  inactiveDays: number;
  activityRate: number;
  currentStreak: number;
  longestStreak: number;
  avgKeystrokesPerDay: number;
  stdDevKeystrokes: number;
  consistencyScore: number;
  thresholdUsed: number;
}

export interface UsagePattern {
  type: 'work_hours' | 'weekend_vs_weekday' | 'outlier' | 'streak';
  description: string;
  data: any;
}

// Hourly analysis
export interface HourlyPattern {
  hour: number;
  dayOfWeek: number;
  avgKeystrokes: number;
  avgClicks: number;
}

// Top keys by category
export interface TopKeysByCategory {
  [category: string]: TopKey[];
}

// Modifier usage
export interface ModifierUsage {
  ctrl: number;
  shift: number;
  alt: number;
  win: number;
}

// Special key usage
export interface SpecialKeyUsage {
  keyName: string;
  count: number;
}

// Letter frequency
export interface LetterFrequency {
  letter: string;
  count: number;
  percentage: number;
}

// Intensity metrics
export interface IntensityMetrics {
  avgKeystrokes: number;
  avgClicks: number;
  avgDistance: number;
  peakKeystrokes: number;
  peakClicks: number;
  peakDistance: number;
  p50Keystrokes: number;
  p75Keystrokes: number;
  p95Keystrokes: number;
  activeDays: number;
}

// Extended PeakDay with distance
export interface PeakDayExtended extends PeakDay {
  distance?: number;
}

export interface ApiResponse<T> {
  data: T;
  count?: number;
  granularity?: string;
  message?: string;
}
