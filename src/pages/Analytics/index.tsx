import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Tabs,
  Statistic,
  Select,
  DatePicker,
  Space,
  Button,
  Table,
  Tag,
  Progress,
  List,
  Avatar,
  Typography,
} from 'antd';
import {
  FunnelPlotOutlined,
  UserOutlined,
  ShoppingOutlined,
  TeamOutlined,
  WarningOutlined,
  SyncOutlined,
  DownloadOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import { Area, Column, Pie, Funnel } from '@ant-design/charts';
import { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

// 销售漏斗数据
const funnelData = [
  { stage: '线索', value: 1000 },
  { stage: '商机', value: 800 },
  { stage: '报价', value: 600 },
  { stage: '谈判', value: 400 },
  { stage: '成交', value: 200 },
];

// 客户画像数据
const customerPortraitData = {
  industry: [
    { type: '互联网', value: 40 },
    { type: '金融', value: 25 },
    { type: '制造业', value: 20 },
    { type: '教育', value: 15 },
  ],
  scale: [
    { type: '大型企业', value: 30 },
    { type: '中型企业', value: 40 },
    { type: '小型企业', value: 30 },
  ],
  area: [
    { type: '华东', value: 35 },
    { type: '华北', value: 25 },
    { type: '华南', value: 20 },
    { type: '西部', value: 20 },
  ],
};

// 产品销售数据
const productSalesData = [
  { month: '1月', product: 'ERP系统', sales: 320 },
  { month: '2月', product: 'ERP系统', sales: 350 },
  { month: '3月', product: 'ERP系统', sales: 400 },
  { month: '1月', product: 'CRM系统', sales: 250 },
  { month: '2月', product: 'CRM系统', sales: 280 },
  { month: '3月', product: 'CRM系统', sales: 300 },
];

// 团队业绩数据
const teamPerformanceData = [
  {
    key: '1',
    name: '销售一组',
    target: 1000000,
    achieved: 850000,
    deals: 25,
    conversion: 35,
  },
  {
    key: '2',
    name: '销售二组',
    target: 800000,
    achieved: 720000,
    deals: 20,
    conversion: 30,
  },
];

// 客户流失预警数据
const churnWarningData = [
  {
    key: '1',
    customer: '阿里巴巴',
    lastContact: '2024-01-20',
    lastOrder: '2023-12-15',
    riskLevel: 'high',
    signals: ['超过60天未联系', '最近订单金额下降50%'],
  },
  {
    key: '2',
    customer: '腾讯',
    lastContact: '2024-02-15',
    lastOrder: '2024-01-20',
    riskLevel: 'medium',
    signals: ['超过30天未联系', '客户反馈减少'],
  },
];

// 修改团队业绩类型定义
interface TeamPerformanceType {
  key: string;
  name: string;
  target: number;
  achieved: number;
  deals: number;
  conversion: number;
}

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<[string, string]>(['2024-01-01', '2024-03-31']);

  // 销售漏斗配置
  const funnelConfig = {
    data: funnelData,
    xField: 'stage',
    yField: 'value',
    legend: false,
    conversionTag: false,
    label: {
      formatter: (datum: any) => {
        const rate = ((datum.value / funnelData[0].value) * 100).toFixed(1);
        return `${datum.stage}\n${rate}%`;
      },
    },
  };

  // 修改客户画像配置
  const pieConfig = {
    data: customerPortraitData.industry,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: false,  // 禁用标签
    legend: {
      position: 'right',
    },
    interactions: [
      { type: 'element-active' },
    ],
  };

  // 修改产品销售趋势配置
  const columnConfig = {
    data: productSalesData,
    isGroup: true,
    xField: 'month',
    yField: 'sales',
    seriesField: 'product',
    label: false,  // 禁用标签
    legend: {
      position: 'top',
    },
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
  };

  // 修改团队业绩表格列定义
  const teamColumns: ColumnsType<TeamPerformanceType> = [
    { title: '团队', dataIndex: 'name', key: 'name' },
    {
      title: '目标完成度',
      key: 'progress',
      render: (_: unknown, record: TeamPerformanceType) => {
        const percent = Math.round((record.achieved / record.target) * 100);
        return <Progress percent={percent} />;
      },
    },
    {
      title: '成交额',
      dataIndex: 'achieved',
      key: 'achieved',
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
    { title: '成交数', dataIndex: 'deals', key: 'deals' },
    {
      title: '转化率',
      dataIndex: 'conversion',
      key: 'conversion',
      render: (value: number) => `${value}%`,
    },
  ];

  // 客户流失预警表格列配置
  const churnColumns = [
    { title: '客户名称', dataIndex: 'customer', key: 'customer' },
    { title: '最后联系', dataIndex: 'lastContact', key: 'lastContact' },
    { title: '最后订单', dataIndex: 'lastOrder', key: 'lastOrder' },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (level: string) => {
        const colors = {
          high: 'error',
          medium: 'warning',
          low: 'success',
        };
        return <Tag color={colors[level as keyof typeof colors]}>{level.toUpperCase()}</Tag>;
      },
    },
    {
      title: '预警信号',
      dataIndex: 'signals',
      key: 'signals',
      render: (signals: string[]) => (
        <>
          {signals.map(signal => (
            <Tag key={signal} color="orange">{signal}</Tag>
          ))}
        </>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Tabs
          items={[
            {
              key: 'funnel',
              label: (
                <span>
                  <FunnelPlotOutlined />
                  销售漏斗分析
                </span>
              ),
              children: (
                <div>
                  <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                    <Space>
                      <RangePicker />
                      <Select defaultValue="all" style={{ width: 120 }}>
                        <Select.Option value="all">所有团队</Select.Option>
                        <Select.Option value="team1">销售一组</Select.Option>
                        <Select.Option value="team2">销售二组</Select.Option>
                      </Select>
                    </Space>
                    <Space>
                      <Button icon={<SyncOutlined />}>刷新</Button>
                      <Button icon={<DownloadOutlined />}>导出</Button>
                    </Space>
                  </Row>
                  <Row gutter={16}>
                    <Col span={16}>
                      <Card>
                        <Funnel {...funnelConfig} />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card title="转化率分析">
                        <List
                          dataSource={funnelData.slice(0, -1)}
                          renderItem={(item, index) => {
                            const nextValue = funnelData[index + 1].value;
                            const rate = (nextValue / item.value) * 100;
                            return (
                              <List.Item>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                  <Space>
                                    <Text>{item.stage} → {funnelData[index + 1].stage}</Text>
                                    <Text type={rate >= 50 ? 'success' : 'danger'}>
                                      {rate.toFixed(1)}%
                                    </Text>
                                  </Space>
                                  <Progress percent={rate} size="small" />
                                </Space>
                              </List.Item>
                            );
                          }}
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>
              ),
            },
            {
              key: 'portrait',
              label: (
                <span>
                  <UserOutlined />
                  客户画像分析
                </span>
              ),
              children: (
                <div>
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Card title="行业分布">
                        <Pie {...pieConfig} />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card title="企业规模">
                        <Pie {...{ ...pieConfig, data: customerPortraitData.scale }} />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card title="地区分布">
                        <Pie {...{ ...pieConfig, data: customerPortraitData.area }} />
                      </Card>
                    </Col>
                  </Row>
                </div>
              ),
            },
            {
              key: 'product',
              label: (
                <span>
                  <ShoppingOutlined />
                  产品销售分析
                </span>
              ),
              children: (
                <div>
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Card title="销售趋势">
                        <Column {...columnConfig} />
                      </Card>
                    </Col>
                  </Row>
                </div>
              ),
            },
            {
              key: 'team',
              label: (
                <span>
                  <TeamOutlined />
                  团队业绩分析
                </span>
              ),
              children: (
                <div>
                  <Table columns={teamColumns} dataSource={teamPerformanceData} />
                </div>
              ),
            },
            {
              key: 'churn',
              label: (
                <span>
                  <WarningOutlined />
                  客户流失预警
                </span>
              ),
              children: (
                <div>
                  <Table columns={churnColumns} dataSource={churnWarningData} />
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default Analytics; 