import React, { useState } from 'react';
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
} from 'antd';
import {
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  SyncOutlined,
  DownloadOutlined,
  AccountBookOutlined,
  PayCircleOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { Area, Column, Pie } from '@ant-design/charts';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

interface FinanceDataType {
  period: string;
  income: number;
  expense: number;
  profit: number;
  receivable: number;
  payable: number;
}

interface TransactionType {
  key: string;
  date: string;
  type: string;
  category: string;
  amount: number;
  relatedDoc: string;
  status: string;
}

const FinanceAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<[string, string]>(['2024-01-01', '2024-03-31']);

  // 模拟财务数据
  const financeData: FinanceDataType[] = [
    {
      period: '2024-01',
      income: 1200000,
      expense: 800000,
      profit: 400000,
      receivable: 300000,
      payable: 200000,
    },
    {
      period: '2024-02',
      income: 1500000,
      expense: 900000,
      profit: 600000,
      receivable: 400000,
      payable: 250000,
    },
    {
      period: '2024-03',
      income: 1800000,
      expense: 1100000,
      profit: 700000,
      receivable: 500000,
      payable: 300000,
    },
  ];

  // 收支趋势图配置
  const trendConfig = {
    data: financeData.map(item => [
      { period: item.period, type: '收入', value: item.income },
      { period: item.period, type: '支出', value: item.expense },
      { period: item.period, type: '利润', value: item.profit },
    ]).flat(),
    xField: 'period',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    legend: {
      position: 'top',
    },
  };

  // 收入构成配置
  const incomeStructureData = [
    { type: '产品销售', value: 1200000 },
    { type: '技术服务', value: 800000 },
    { type: '咨询服务', value: 500000 },
    { type: '维保服务', value: 300000 },
  ];

  const incomeStructureConfig = {
    data: incomeStructureData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: false,
    legend: {
      position: 'right',
    },
    interactions: [
      { type: 'element-active' },
    ],
  };

  // 支出构成配置
  const expenseStructureData = [
    { type: '人力成本', value: 600000 },
    { type: '运营费用', value: 400000 },
    { type: '市场费用', value: 300000 },
    { type: '研发投入', value: 200000 },
  ];

  const expenseStructureConfig = {
    data: expenseStructureData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: false,
    legend: {
      position: 'right',
    },
    interactions: [
      { type: 'element-active' },
    ],
  };

  // 交易记录表格列定义
  const transactionColumns: ColumnsType<TransactionType> = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 100,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={type === '收入' ? 'success' : 'error'}>
          {type}
        </Tag>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number, record) => (
        <Text type={record.type === '收入' ? 'success' : 'danger'}>
          ¥{amount.toLocaleString()}
        </Text>
      ),
    },
    {
      title: '关联单据',
      dataIndex: 'relatedDoc',
      key: 'relatedDoc',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          completed: { color: 'success', text: '已完成' },
          pending: { color: 'processing', text: '处理中' },
          failed: { color: 'error', text: '失败' },
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
  ];

  // 模拟交易记录数据
  const transactions: TransactionType[] = [
    {
      key: '1',
      date: '2024-03-20',
      type: '收入',
      category: '产品销售',
      amount: 100000,
      relatedDoc: 'CT202403001',
      status: 'completed',
    },
    {
      key: '2',
      date: '2024-03-19',
      type: '支出',
      category: '人力成本',
      amount: 50000,
      relatedDoc: 'EP202403001',
      status: 'completed',
    },
  ];

  return (
    <div>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={4}>财务统计</Title>
          </Col>
          <Col>
            <Space>
              <RangePicker />
              <Button icon={<SyncOutlined />}>刷新</Button>
              <Button icon={<DownloadOutlined />}>导出报表</Button>
            </Space>
          </Col>
        </Row>

        {/* 关键指标 */}
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="本月收入"
                value={1800000}
                precision={2}
                prefix={<DollarOutlined />}
                suffix="元"
                valueStyle={{ color: '#3f8600' }}
              />
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  较上月
                  <Text type="success" strong style={{ margin: '0 4px' }}>
                    +20%
                  </Text>
                  <RiseOutlined style={{ color: '#3f8600' }} />
                </Text>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="本月支出"
                value={1100000}
                precision={2}
                prefix={<PayCircleOutlined />}
                suffix="元"
                valueStyle={{ color: '#cf1322' }}
              />
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  较上月
                  <Text type="danger" strong style={{ margin: '0 4px' }}>
                    +22%
                  </Text>
                  <RiseOutlined style={{ color: '#cf1322' }} />
                </Text>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="应收账款"
                value={500000}
                precision={2}
                prefix={<AccountBookOutlined />}
                suffix="元"
              />
              <Progress percent={75} size="small" status="active" />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="资金余额"
                value={2500000}
                precision={2}
                prefix={<BankOutlined />}
                suffix="元"
              />
              <Progress percent={85} size="small" status="success" />
            </Card>
          </Col>
        </Row>

        {/* 图表分析 */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card title="收支趋势">
              <Area {...trendConfig} height={300} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="收入构成">
              <Pie {...incomeStructureConfig} height={300} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="支出构成">
              <Pie {...expenseStructureConfig} height={300} />
            </Card>
          </Col>
        </Row>

        {/* 交易记录 */}
        <Card title="最近交易记录" style={{ marginTop: 16 }}>
          <Table
            columns={transactionColumns}
            dataSource={transactions}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
          />
        </Card>
      </Card>
    </div>
  );
};

export default FinanceAnalytics; 