import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  DatePicker,
  Space,
  Table,
  Tag,
  Progress,
  Typography,
  Button,
  List,
  Avatar,
} from 'antd';
import {
  UserOutlined,
  RiseOutlined,
  FallOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SmileOutlined,
  TeamOutlined,
  DownloadOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Column } from '@ant-design/charts';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const ServiceReport: React.FC = () => {
  const [dateRange, setDateRange] = useState<[string, string]>(['2024-01-01', '2024-03-31']);

  // 简化的柱状图配置
  const columnConfig = {
    data: [
      { rating: '5星', count: 850 },
      { rating: '4星', count: 250 },
      { rating: '3星', count: 100 },
      { rating: '2星', count: 30 },
      { rating: '1星', count: 20 },
    ],
    xField: 'rating',
    yField: 'count',
    label: false,  // 禁用标签
    color: '#1890ff',
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
  };

  return (
    <div>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={4}>服务质量报表</Title>
          </Col>
          <Col>
            <Space>
              <RangePicker 
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    setDateRange([
                      dates[0].format('YYYY-MM-DD'),
                      dates[1].format('YYYY-MM-DD'),
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
          <Col span={6}>
            <Card>
              <Statistic
                title="工单总量"
                value={1250}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="平均响应时间"
                value={15}
                suffix="分钟"
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="客户满意度"
                value={95}
                suffix="%"
                prefix={<SmileOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="解决率"
                value={98}
                suffix="%"
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* 评分分布图 */}
        <Card title="客户评分分布" style={{ marginTop: 16 }}>
          <Column {...columnConfig} />
        </Card>
      </Card>
    </div>
  );
};

export default ServiceReport; 