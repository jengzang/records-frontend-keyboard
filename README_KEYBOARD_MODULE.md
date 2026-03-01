# Keyboard/Mouse Analysis Module

## 概述

键盘鼠标使用分析模块,用于追踪和分析键盘按键、鼠标点击、滚轮滚动和鼠标移动距离等使用数据。

## 数据说明

- **数据源**: KMCounter.ini (UTF-16编码)
- **数据范围**: 2022-12-16 至 2025-10-08 (894天)
- **总按键数**: 5,599,672次
- **总点击数**: 2,475,909次
- **总鼠标移动距离**: 1,989.47公里

## 数据库结构

### 表结构

1. **daily_stats** - 每日统计数据
   - 按键次数、左/右/中键点击、滚轮滚动、鼠标移动距离

2. **scancode_stats** - 扫描码统计
   - 每个按键的每日按压次数

3. **scancode_mapping** - 扫描码映射
   - 扫描码到按键名称的映射(112个按键)

4. **hourly_stats** - 小时统计(待实现)
   - 按小时聚合的使用数据

## 后端API

### 数据查询接口

- `GET /api/keyboard/daily` - 获取每日统计数据
  - 参数: `start`, `end`, `limit`
  - 返回: 每日按键、点击、鼠标移动数据

- `GET /api/keyboard/scancodes` - 获取指定日期的扫描码统计
  - 参数: `date` (必需, YYYYMMDD格式)
  - 返回: 该日期所有按键的使用次数

- `GET /api/keyboard/top-keys` - 获取最常用按键
  - 参数: `limit` (默认20)
  - 返回: 按使用次数排序的按键列表

### 统计分析接口

- `GET /api/keyboard/statistics/summary` - 获取总体统计摘要
  - 返回: 总按键数、总点击数、平均值、活跃天数、峰值日期等

- `GET /api/keyboard/statistics/trends` - 获取趋势数据
  - 参数: `start`, `end`, `granularity` (daily/weekly/monthly)
  - 返回: 时间序列趋势数据

### 可视化数据接口

- `GET /api/keyboard/heatmap/keyboard` - 获取键盘热力图数据
  - 参数: `start`, `end`
  - 返回: 每个按键的使用次数和分类

- `GET /api/keyboard/heatmap/time` - 获取时间热力图数据(待实现)
  - 返回: 小时×星期的使用热力图

## 核心统计指标

### 使用统计

- **总按键数**: 5,599,672次
- **总点击数**: 2,475,909次
- **总鼠标移动**: 1,989.47公里
- **活跃天数**: 817天 (>100按键)
- **平均每日按键**: 6,414次
- **平均每日点击**: 2,834次

### 最常用按键 (Top 10)

1. Space (空格): 607,255次 (10.8%)
2. Backspace (退格): 362,520次 (6.5%)
3. I: 354,132次 (6.3%)
4. N: 284,921次 (5.1%)
5. A: 277,355次 (5.0%)
6. Left Ctrl: 244,812次 (4.4%)
7. U: 220,312次 (3.9%)
8. H: 172,250次 (3.1%)
9. Enter: 164,738次 (2.9%)
10. G: 162,017次 (2.9%)

### 峰值使用日

- **日期**: 2025-09-26
- **按键数**: 46,906次
- **点击数**: 2,893次

## 运行方式

### 数据导入

```bash
# 初始化数据库
python go-backend/scripts/keyboard/init_db.py keyboard/kmcounter.db go-backend/migrations/keyboard/001_initial_schema.sql

# 导入数据
python go-backend/scripts/keyboard/import_kmcounter.py keyboard/reference/data/KMCounter.ini keyboard/kmcounter.db

# 验证数据
python go-backend/scripts/keyboard/verify_data.py keyboard/kmcounter.db
```

### 启动后端服务

```bash
cd go-backend
go build -o bin/keyboard-server.exe ./cmd/keyboard-server
./bin/keyboard-server.exe
```

服务将在 http://localhost:8080 启动

### 测试API

```bash
python go-backend/scripts/keyboard/test_api.py
```

## 前端界面 (待实现)

### 页面结构

1. **首页仪表板** (`/`) - 关键指标概览
2. **每日统计** (`/daily`) - 每日使用数据表格和图表
3. **键盘热力图** (`/heatmap/keyboard`) - 可视化键盘按键使用频率
4. **时间热力图** (`/heatmap/time`) - 小时×星期使用模式
5. **趋势分析** (`/trends`) - 时间序列图表和趋势分析
6. **模式检测** (`/patterns`) - 使用模式识别结果

### 可视化组件

- **StatCard** - 单指标展示卡片
- **KeyboardHeatmap** - 键盘热力图
- **TimeHeatmap** - 时间热力图 (24×7网格)
- **TrendChart** - 趋势折线图/柱状图
- **UsageTable** - 可排序的使用数据表格

## 技术栈

### 后端
- **语言**: Go 1.24
- **框架**: Gin
- **数据库**: SQLite (modernc.org/sqlite)
- **数据导入**: Python 3

### 前端 (待实现)
- **框架**: React + TypeScript
- **UI库**: Ant Design
- **图表库**: Ant Design Charts, Recharts
- **构建工具**: Vite

## 文件结构

```
keyboard/
├── kmcounter.db                    # SQLite数据库
├── reference/
│   └── data/
│       └── KMCounter.ini          # 原始数据文件
└── src/                           # React前端源码 (待实现)

go-backend/
├── migrations/keyboard/
│   └── 001_initial_schema.sql     # 数据库架构
├── scripts/keyboard/
│   ├── init_db.py                 # 数据库初始化
│   ├── import_kmcounter.py        # 数据导入脚本
│   ├── verify_data.py             # 数据验证脚本
│   └── test_api.py                # API测试脚本
├── internal/keyboard/
│   ├── models.go                  # 数据模型
│   └── handlers.go                # API处理器
└── cmd/keyboard-server/
    └── main.go                    # 服务器入口
```

## 实现状态

### ✅ 已完成

- [x] 数据库架构设计
- [x] 数据导入脚本 (Python)
- [x] 数据验证脚本
- [x] Go后端API (9个端点)
- [x] API测试脚本
- [x] 基础统计分析

### ⏸️ 待实现

- [ ] 小时级数据聚合
- [ ] 时间热力图数据
- [ ] React前端界面
- [ ] 键盘热力图可视化
- [ ] 趋势图表组件
- [ ] 模式检测算法
- [ ] 生产力指标计算

## 更新日志

### 2026-02-23

- ✅ 创建数据库架构 (4个表, 112个扫描码映射)
- ✅ 实现数据导入脚本 (894天数据导入成功)
- ✅ 实现Go后端API (9个REST端点)
- ✅ 数据验证: 5,599,672按键, 2,475,909点击, 1,989.47公里鼠标移动
- ✅ 编译测试通过
- 📝 文档: 完成README和API文档

## 下一步计划

1. **Phase 4: React前端** - 实现6个页面和5个可视化组件
2. **Phase 2: 高级分析** - 实现生产力指标和模式检测
3. **Phase 5: 集成测试** - 端到端测试和性能优化
4. **部署** - 集成到主应用并部署到生产环境
