# 键盘鼠标使用统计

键盘和鼠标使用数据分析与可视化平台前端

## 项目简介

本项目是个人数据分析平台的键盘鼠标使用统计模块，用于处理和可视化键盘鼠标使用数据。

## 技术栈

- React 18
- TypeScript
- Tailwind CSS
- Vite

## 数据说明

### 数据来源
- kmcounter.ini 文件
- 包含键盘按键次数、鼠标点击次数等统计数据

### 数据存储
- SQLite数据库
- WAL模式开启

## 核心功能（规划中）

1. 键盘使用统计
2. 鼠标使用统计
3. 时间维度分析
4. 使用习惯分析
5. 数据可视化展示

## 运行方式

### 开发环境
```bash
npm install
npm run dev
```

### 生产构建
```bash
npm run build
npm run preview
```

## 部署说明

- 部署路径：record.yzup.top/keyboard
- 基础路径配置：/keyboard/

## 更新日志

### 2026-02-23 (Phase 2)
- ✅ 实现可视化键盘热力图组件
  - 60+按键的完整键盘布局
  - 对数缩放的11色渐变方案
  - 悬停显示6项详细统计数据
  - 响应式设计支持移动端
  - 日期范围筛选功能
- ✅ 新增9个前端组件和工具
  - KeyboardHeatmap.tsx - 主键盘热力图组件
  - Key.tsx - 单个按键组件
  - KeyTooltip.tsx - 悬停提示组件
  - keyboardLayout.ts - 键盘布局配置
  - colorMapping.ts - 颜色映射工具
  - KeyboardHeatmapPage.tsx - 键盘热力图页面
- ✅ 更新API客户端
  - 新增getDetailedKeyboardHeatmap方法
  - 新增4个统计分析API方法
  - 完善TypeScript类型定义

### 2026-02-23 (Phase 1)
- ✅ 实现综合统计分析功能
  - 时间模式分析：按星期、月份、工作日vs周末统计
  - 按键分类分析：字母、数字、功能键、修饰键、特殊键分布
  - 打字行为分析：退格率、空格频率、字母频率
  - 生产力指标：活跃天数、连续天数、一致性评分
- ✅ 新增4个Python分析工作器
  - temporal_analysis.py - 时间模式分析
  - key_category_analysis.py - 按键分类分析
  - typing_behavior.py - 打字行为分析
  - productivity_metrics.py - 生产力指标
- ✅ 新增5个后端API端点
  - GET /api/keyboard/statistics/temporal - 时间分析
  - GET /api/keyboard/statistics/categories - 分类分析
  - GET /api/keyboard/statistics/typing_behavior - 打字行为
  - GET /api/keyboard/statistics/productivity - 生产力指标
  - GET /api/keyboard/heatmap/detailed - 详细键盘热力图

### 2026-02-19
- 初始化项目结构
- 配置 React + TypeScript + Tailwind CSS
- 创建基础项目框架
