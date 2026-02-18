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

### 2026-02-19
- 初始化项目结构
- 配置 React + TypeScript + Tailwind CSS
- 创建基础项目框架
