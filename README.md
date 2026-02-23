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

## 核心功能

1. ✅ 键盘使用统计
   - 总按键次数统计
   - Top 20按键排行榜
   - 按键分类分布（字母/数字/功能键/修饰键/特殊键）
   - 键盘热力图可视化
2. ✅ 鼠标使用统计
   - 总点击次数（左键/右键/中键/侧键）
   - 鼠标移动距离统计
   - 滚轮使用统计
3. ✅ 时间维度分析
   - 24小时使用模式热力图
   - 按星期/月份统计
   - 工作日vs周末对比
4. ✅ 使用习惯分析
   - 打字行为分析（退格率/空格频率/字母频率）
   - 生产力指标（活跃天数/连续天数/一致性评分）
   - 打字强度分析（P50/P75/P95百分位数）
5. ✅ 数据可视化展示
   - 首页概览（总计统计+Top 3按键）
   - 统计分析页（4个Tab：时间/分类/打字/生产力）
   - 每日统计表
   - 趋势图表
   - 键盘热力图
   - Top Keys排行榜

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

### 2026-02-24 (Frontend Integration - Phase 2-5)
- ✅ 创建TopKeysPage独立页面
  - Top 20按键排行榜展示
  - 奖牌图标标识前三名
  - 使用次数和百分比显示
  - 日期范围筛选功能
  - 总计统计卡片（总按键数/总使用次数/Top 3占比）
- ✅ 优化Home首页
  - 新增Top 3按键快速洞察卡片
  - 奖牌图标和百分比展示
  - 快速跳转按钮（Statistics/Heatmap/Trends）
  - 并行API调用优化性能
- ✅ 路由和导航更新
  - 添加TopKeysPage路由（/top-keys）
  - 导航菜单新增Top Keys入口
  - 使用TrophyOutlined图标
- ✅ 技术改进
  - 修复TypeScript类型错误
  - 优化图标导入（KeyOutlined/MouseOutlined）
  - 改进类型转换（hourly data as unknown as HourlyPattern[]）

### 2026-02-24 (Frontend Integration - Phase 1)
- ✅ 扩展StatisticsPage统计分析页面
  - 时间模式Tab: 新增24小时热力图分析
  - 按键分类Tab: 新增各类别Top Keys展示和修饰键雷达图
  - 打字行为Tab: 新增特殊键使用排行和字母频率分布
  - 生产力Tab: 新增打字强度分析和峰值日期排行榜
- ✅ 新增7个TypeScript类型定义
  - HourlyPattern - 小时级别使用模式
  - TopKeysByCategory - 各类别热门按键
  - ModifierUsage - 修饰键使用统计
  - SpecialKeyUsage - 特殊键使用统计
  - LetterFrequency - 字母频率分布
  - IntensityMetrics - 打字强度指标
  - PeakDayExtended - 扩展的峰值日期
- ✅ API集成完善
  - 所有11个API端点的所有类型全部使用
  - 13个并行API调用优化加载性能
  - 完整的错误处理和加载状态

### 2026-02-24 (Database Adaptation)
- ✅ 完成后端数据库架构适配
  - 适配分离的keyboard_data和mouse_data表结构
  - 实现内存中的scancode映射（111个按键）
  - 更新3个分析包（category, typing, temporal）
  - 更新4个handler方法使用内存映射
  - 所有11个API端点测试通过
- ✅ 数据完整性保障
  - 保留988天历史数据无需迁移
  - 使用JOIN查询合并键盘鼠标数据
  - 规范化数据库设计更易扩展
- ✅ 性能优化
  - 内存映射替代数据库JOIN提升查询速度
  - 支持111个标准键盘按键识别
  - 包含字母、数字、功能键、修饰键、特殊键、小键盘

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
