import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  TableOutlined,
  LineChartOutlined,
  HeatMapOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import Home from './pages/Home';
import DailyStats from './pages/DailyStats';
import Trends from './pages/Trends';
import KeyboardHeatmapPage from './pages/KeyboardHeatmapPage';
import StatisticsPage from './pages/StatisticsPage';
import './App.css';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <div style={{ float: 'left', color: 'white', fontSize: '18px', marginRight: '50px' }}>
            Keyboard & Mouse Analytics
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['home']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="home" icon={<HomeOutlined />}>
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="statistics" icon={<BarChartOutlined />}>
              <Link to="/statistics">Statistics</Link>
            </Menu.Item>
            <Menu.Item key="daily" icon={<TableOutlined />}>
              <Link to="/daily">Daily Stats</Link>
            </Menu.Item>
            <Menu.Item key="trends" icon={<LineChartOutlined />}>
              <Link to="/trends">Trends</Link>
            </Menu.Item>
            <Menu.Item key="heatmap" icon={<HeatMapOutlined />}>
              <Link to="/heatmap">Heatmap</Link>
            </Menu.Item>
          </Menu>
        </Header>

        <Content style={{ padding: '0 50px', marginTop: 64 }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="/daily" element={<DailyStats />} />
              <Route path="/trends" element={<Trends />} />
              <Route path="/heatmap" element={<KeyboardHeatmapPage />} />
            </Routes>
          </div>
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          Keyboard & Mouse Analytics ©2026
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;
