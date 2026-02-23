// API client for keyboard/mouse data

import axios from 'axios';
import type {
  DailyStat,
  ScancodeStat,
  SummaryStats,
  TopKey,
  TrendData,
  KeyHeatmapData,
  DetailedKeyHeatmapData,
  TemporalAnalysis,
  WeekdayVsWeekend,
  CategoryDistribution,
  TypingBehaviorMetrics,
  ProductivityMetrics,
  ApiResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const keyboardApi = {
  // Get daily statistics
  getDailyStats: async (params?: {
    start?: string;
    end?: string;
    limit?: number;
  }): Promise<DailyStat[]> => {
    const response = await api.get<ApiResponse<DailyStat[]>>('/keyboard/daily', { params });
    return response.data.data;
  },

  // Get scancode statistics for a specific date
  getScancodeStats: async (date: string): Promise<ScancodeStat[]> => {
    const response = await api.get<ApiResponse<ScancodeStat[]>>('/keyboard/scancodes', {
      params: { date },
    });
    return response.data.data;
  },

  // Get top keys
  getTopKeys: async (limit: number = 20): Promise<TopKey[]> => {
    const response = await api.get<ApiResponse<TopKey[]>>('/keyboard/top-keys', {
      params: { limit },
    });
    return response.data.data;
  },

  // Get summary statistics
  getSummaryStats: async (): Promise<SummaryStats> => {
    const response = await api.get<SummaryStats>('/keyboard/statistics/summary');
    return response.data;
  },

  // Get trends
  getTrends: async (params?: {
    start?: string;
    end?: string;
    granularity?: 'daily' | 'weekly' | 'monthly';
  }): Promise<TrendData[]> => {
    const response = await api.get<ApiResponse<TrendData[]>>('/keyboard/statistics/trends', {
      params,
    });
    return response.data.data;
  },

  // Get keyboard heatmap data
  getKeyboardHeatmap: async (params?: {
    start?: string;
    end?: string;
  }): Promise<KeyHeatmapData[]> => {
    const response = await api.get<ApiResponse<KeyHeatmapData[]>>('/keyboard/heatmap/keyboard', {
      params,
    });
    return response.data.data;
  },

  // Get detailed keyboard heatmap data (with statistics)
  getDetailedKeyboardHeatmap: async (params?: {
    start?: string;
    end?: string;
  }): Promise<DetailedKeyHeatmapData[]> => {
    const response = await api.get<ApiResponse<DetailedKeyHeatmapData[]>>('/keyboard/heatmap/detailed', {
      params,
    });
    return response.data.data;
  },

  // Get temporal analysis
  getTemporalAnalysis: async (params: {
    type: 'hourly' | 'daily' | 'monthly' | 'weekday_vs_weekend';
    start?: string;
    end?: string;
  }): Promise<TemporalAnalysis[] | WeekdayVsWeekend> => {
    const response = await api.get('/keyboard/statistics/temporal', { params });
    return response.data;
  },

  // Get category analysis
  getCategoryAnalysis: async (params: {
    type: 'distribution' | 'top_keys' | 'modifiers';
    start?: string;
    end?: string;
  }): Promise<CategoryDistribution[] | any> => {
    const response = await api.get('/keyboard/statistics/categories', { params });
    return response.data;
  },

  // Get typing behavior metrics
  getTypingBehavior: async (params: {
    type: 'metrics' | 'special_keys' | 'letter_frequency';
    start?: string;
    end?: string;
  }): Promise<TypingBehaviorMetrics | any> => {
    const response = await api.get('/keyboard/statistics/typing_behavior', { params });
    return response.data;
  },

  // Get productivity metrics
  getProductivityMetrics: async (params: {
    type: 'activity' | 'intensity' | 'peak_days';
    start?: string;
    end?: string;
  }): Promise<ProductivityMetrics | any> => {
    const response = await api.get('/keyboard/statistics/productivity', { params });
    return response.data;
  },
};

export default keyboardApi;
