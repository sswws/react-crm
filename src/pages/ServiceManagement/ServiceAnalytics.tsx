import React, { useState } from 'react';
import dayjs from 'dayjs';
import {
  Card,
  Row,
  Col,
  Statistic,
  DatePicker,
  Select,
  Space,
  Table,
  Tag,
  Progress,
  Typography,
  Button,
  Tooltip,
  Avatar,
} from 'antd';
import {
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  MessageOutlined,
  SmileOutlined,
  TeamOutlined,
  SyncOutlined,
  DownloadOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { Area, Column, Pie } from '@ant-design/charts';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

interface ServiceMetrics {
  totalTickets: number;
  resolvedTickets: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  satisfactionRate: number;
  firstContactResolution: number;
}

interface AgentPerformance {
  key: string;
  name: string;
  avatar: string;
  ticketsHandled: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  satisfactionRate: number;
  firstContactResolution: number;
  onlineRate: number;
}

const ServiceAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[string, string]>(['2024-03-01', '2024-03-31']);
  const [metrics, setMetrics] = useState<ServiceMetrics>({
    totalTickets: 1250,
    resolvedTickets: 1180,
    avgResponseTime: 15,
    avgResolutionTime: 120,
    satisfactionRate: 92,
    firstContactResolution: 85,
  });

  // 模拟客服人员绩效数据
  const agentPerformance: AgentPerformance[] = [
    {
      key: '1',
      name: '张三',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=1',
      ticketsHandled: 320,
      avgResponseTime: 12,
      avgResolutionTime: 95,
      satisfactionRate: 95,
      firstContactResolution: 88,
      onlineRate: 98,
    },
    {
      key: '2',
      name: '李四',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=2',
      ticketsHandled: 280,
      avgResponseTime: 18,
      avgResolutionTime: 110,
      satisfactionRate: 90,
      firstContactResolution: 82,
      onlineRate: 95,
    },
  ];

  // 工单类型分布数据
  const ticketTypeData = [
    { type: '产品咨询', value: 450 },
    { type: '技术支持', value: 350 },
    { type: '账户问题', value: 200 },
    { type: '建议反馈', value: 150 },
    { type: '投诉处理', value: 100 },
  ];

  // 每日工单趋势数据
  const dailyTrendData = Array.from({ length: 30 }, (_, i) => ({
    date: `2024-03-${String(i + 1).padStart(2, '0')}`,
    tickets: Math.floor(Math.random() * 30) + 30,
    resolved: Math.floor(Math.random() * 25) + 25,
  }));

  // 客服绩效表格列定义
  const columns: ColumnsType<AgentPerformance> = [
    {
      title: '客服人员',
      key: 'agent',
      fixed: 'left',
      width: 200,
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} />
          <Text>{record.name}</Text>
        </Space>
      ),
    },
    {
      title: '处理工单数',
      dataIndex: 'ticketsHandled',
      key: 'ticketsHandled',
      sorter: (a, b) => a.ticketsHandled - b.ticketsHandled,
    },
    {
      title: '平均响应时间',
      key: 'avgResponseTime',
      render: (_, record) => `${record.avgResponseTime} 分钟`,
      sorter: (a, b) => a.avgResponseTime - b.avgResponseTime,
    },
    {
      title: '平均解决时间',
      key: 'avgResolutionTime',
      render: (_, record) => `${record.avgResolutionTime} 分钟`,
      sorter: (a, b) => a.avgResolutionTime - b.avgResolutionTime,
    },
    {
      title: '满意度',
      key: 'satisfactionRate',
      render: (_, record) => (
        <Progress 
          percent={record.satisfactionRate} 
          size="small"
          status={record.satisfactionRate >= 90 ? 'success' : 'normal'}
        />
      ),
      sorter: (a, b) => a.satisfactionRate - b.satisfactionRate,
    },
    {
      title: '首次解决率',
      key: 'firstContactResolution',
      render: (_, record) => (
        <Progress 
          percent={record.firstContactResolution} 
          size="small"
          status={record.firstContactResolution >= 85 ? 'success' : 'normal'}
        />
      ),
      sorter: (a, b) => a.firstContactResolution - b.firstContactResolution,
    },
    {
      title: '在线率',
      key: 'onlineRate',
      render: (_, record) => (
        <Progress 
          percent={record.onlineRate} 
          size="small"
          status={record.onlineRate >= 95 ? 'success' : 'normal'}
        />
      ),
      sorter: (a, b) => a.onlineRate - b.onlineRate,
    },
  ];

  // 工单趋势图配置
  const trendConfig = {
    data: dailyTrendData,
    xField: 'date',
    yField: 'tickets',
    seriesField: 'type',
    smooth: true,
    areaStyle: {
      fillOpacity: 0.7,
    },
  };

  // 工单类型分布图配置
  const typeDistributionConfig = {
    data: ticketTypeData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
  };

  // 客服评分分布图配置
  const ratingDistributionConfig = {
    data: [
      { rating: '5星', count: 850 },
      { rating: '4星', count: 250 },
      { rating: '3星', count: 100 },
      { rating: '2星', count: 30 },
      { rating: '1星', count: 20 },
    ],
    xField: 'rating',
    yField: 'count',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
  };

  return (
    <div>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={4}>服务质量分析</Title>
          </Col>
          <Col>
            <Space>
              <RangePicker 
                defaultValue={[dayjs(dateRange[0]), dayjs(dateRange[1])]}
                onChange={(dates) => {
                  if (dates) {
                    setDateRange([
                      dates[0]!.format('YYYY-MM-DD'),
                      dates[1]!.format('YYYY-MM-DD'),
                    ]);
                  }
                }}
              />
              <Button icon={<SyncOutlined />}>刷新</Button>
              <Button icon={<DownloadOutlined />}>导出报告</Button>
            </Space>
          </Col>
        </Row>

        {/* 关键指标概览 */}
        <Row gutter={16}>
          <Col span={4}>
            <Card>
              <Statistic
                title="工单总量"
                value={metrics.totalTickets}
                prefix={<MessageOutlined />}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="已解决工单"
                value={metrics.resolvedTickets}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="平均响应时间"
                value={metrics.avgResponseTime}
                prefix={<ClockCircleOutlined />}
                suffix="分钟"
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="平均解决时间"
                value={metrics.avgResolutionTime}
                prefix={<ClockCircleOutlined />}
                suffix="分钟"
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="客户满意度"
                value={metrics.satisfactionRate}
                prefix={<SmileOutlined />}
                suffix="%"
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="首次解决率"
                value={metrics.firstContactResolution}
                prefix={<CheckCircleOutlined />}
                suffix="%"
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: 16 }}>
          {/* 工单趋势图 */}
          <Col span={16}>
            <Card title="工单趋势">
              <Area {...trendConfig} height={300} />
            </Card>
          </Col>
          {/* 工单类型分布 */}
          <Col span={8}>
            <Card title="工单类型分布">
              <Pie {...typeDistributionConfig} height={300} />
            </Card>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: 16 }}>
          {/* 客服评分分布 */}
          <Col span={12}>
            <Card title="客服评分分布">
              <Column {...ratingDistributionConfig} height={300} />
            </Card>
          </Col>
          {/* 响应时间分布 */}
          <Col span={12}>
            <Card title="响应时间分布">
              <Column 
                data={[
                  { time: '0-15分钟', count: 750 },
                  { time: '15-30分钟', count: 250 },
                  { time: '30-60分钟', count: 150 },
                  { time: '1-2小时', count: 80 },
                  { time: '2小时以上', count: 20 },
                ]}
                xField="time"
                yField="count"
                height={300}
              />
            </Card>
          </Col>
        </Row>

        {/* 客服绩效表格 */}
        <Card title="客服绩效" style={{ marginTop: 16 }}>
          <Table
            columns={columns}
            dataSource={agentPerformance}
            pagination={false}
            scroll={{ x: 1200 }}
          />
        </Card>
      </Card>
    </div>
  );
};

export default ServiceAnalytics; 